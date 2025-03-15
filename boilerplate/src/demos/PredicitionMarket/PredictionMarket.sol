// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {UD60x18, ud} from "lib/prb-math/src/UD60x18.sol";
import "./LMSRLibrary.sol";
import '../../../lib/reactive-lib/src/abstract-base/AbstractCallback.sol';
import "./Token/MockUSDC.sol";
contract PredictionMarketV2 is Ownable, ReentrancyGuard , AbstractCallback{
    using SafeERC20 for IERC20;

    MockUSDC public priceToken;

    struct Market {
        uint256 id; // unique identifier for the market
        string question; // the question being asked
        uint256 endTime; // timestamp when the market ends
        uint256 totalStaked; // total amount of tokens staked
        uint256 totalYes; // total amount of tokens staked on YES
        uint256 totalNo; // total amount of tokens staked on NO
        bool resolved; // true if the market has been resolved
        bool won; // true if YES won, false if NO won
        uint256 totalPriceToken; // total amount of price token in the market (value of the entire market)
        UD60x18 qYes; // YES token quantity for this market
        UD60x18 qNo; // NO token quantity for this market
        bool liquidityInitialized; // tracks if liquidity is initialized
        address creator; // creator of the market
        uint256 priceTokenFromDestination; // price token from destination
    }

    // Track user balances internally
    mapping(uint256 => mapping(address => uint256)) public yesBalances;
    mapping(uint256 => mapping(address => uint256)) public noBalances;
    
    mapping(uint256 => Market) public markets;
    uint256 public marketCount;

    // Constants for liquidity calculations
    uint256 private constant INITIAL_LIQUIDITY = 1000e18; // 1000 tokens of each type
    UD60x18 private immutable DECIMALS;
    UD60x18 private immutable LIQUIDITY_PARAMETER;

    event LiquidityAdded(
        address indexed provider,
        uint256 indexed marketId,
        uint256 amount
    );

    event MarketResolved(
        uint256 indexed marketId,
        bool result, // true for YES, false for NO
        uint256 totalPriceToken
    );
    
    event RewardClaimed(
        address indexed user,
        uint256 indexed marketId,
        uint256 rewardAmount
    );

    event TokenOperation(
        address indexed user,
        uint256 indexed marketId,
        uint8 opType, // 1: buy, 2: sell
        uint8 tokenType, // 1: yes, 2: no
        uint256 amount,
        uint256 cost
    );

    event EmergencyLiquidityAdded(
        address indexed owner,
        uint256 indexed marketId,
        uint256 amount
    );

    event MarketCreated(
        uint256 indexed marketId,
        string question,
        uint256 endTime,
        address creator
    );

    event MarketUpdated(
        uint256 indexed marketId,
        bool isYesToken,
        uint256 amount,
        address account,
        uint256 cost
    );

    constructor(
        address _callback_sender, // callback sender address from reactive ( sepolia )
        address _priceToken
    ) Ownable(msg.sender) AbstractCallback(_callback_sender) payable {
        require(_priceToken != address(0), "Invalid price token");
        
        DECIMALS = ud(1e18);
        LIQUIDITY_PARAMETER = ud(10e18);
        priceToken = MockUSDC(_priceToken);
    }

    modifier onlyResolver(uint256 marketId) {
        require(msg.sender == markets[marketId].creator, "Only creator can call this function");
        _;
    }

    modifier marketExists(uint256 marketId) {
        require(markets[marketId].id == marketId, "Market does not exist");
        _;
    }

    modifier marketActive(uint256 marketId) {
        require(markets[marketId].id == marketId, "Market does not exist");
        require(!markets[marketId].resolved, "Market is resolved");
        require(block.timestamp < markets[marketId].endTime, "Market has ended");
        _;
    }

    function initializeLiquidity(uint256 marketId) public marketActive(marketId) nonReentrant {
        require(
            markets[marketId].qYes.unwrap() == 0 && markets[marketId].qNo.unwrap() == 0,
            "Liquidity already initialized"
        );
        
        // Just update the internal state instead of minting tokens
        markets[marketId].qYes = ud(INITIAL_LIQUIDITY);
        markets[marketId].qNo = ud(INITIAL_LIQUIDITY);
        markets[marketId].liquidityInitialized = true;
    }

    function resolve(uint256 marketId, bool isYesWon, bytes calldata proof) public onlyResolver(marketId) {
        // DISABLED TO SHOW DEMO. ENABLE FOR PRODUCTION
        // require(block.timestamp >= markets[marketId].endTime, "Market has not ended");

        // TODO: Verify proof here 
        // verifier.verifyProof(markets[marketId].id, isYesWon, proof);

        require(!markets[marketId].resolved, "Market already resolved");

        markets[marketId].resolved = true;
        markets[marketId].won = isYesWon;
        priceToken.mint(address(this), markets[marketId].priceTokenFromDestination);

        emit MarketResolved(marketId, markets[marketId].won, markets[marketId].totalPriceToken);
    }

    /**
     * @notice Calculates the cost of purchasing a given amount of YES or NO tokens.
     * @param isYesToken Indicates if the token being purchased is YES (true) or NO (false).
     * @param amount The amount of tokens to purchase.
     * @return price The cost of the specified amount of tokens.
     */
    function getCost(
        uint256 marketId,
        bool isYesToken,
        UD60x18 amount
    ) public view returns (UD60x18 price) {
        require(amount.unwrap() > 0, "Amount must be greater than zero");

        return MarketMath.getCost(
            markets[marketId].qYes,
            markets[marketId].qNo,
            isYesToken,
            amount,
            LIQUIDITY_PARAMETER
        );
    }

    /**
     * @notice Buys YES or NO tokens by paying the required price in the price token.
     * @param isYesToken Indicates if the token being purchased is YES (true) or NO (false).
     * @param amount The amount of tokens to purchase.
     */
    function buy(uint256 marketId, bool isYesToken, UD60x18 amount) public marketActive(marketId) nonReentrant {
        require(amount.unwrap() > 0, "Amount must be greater than zero");
        require(amount.unwrap() <= type(uint128).max, "Amount too large"); // Prevent overflow

        // Calculate cost using LMSR
        UD60x18 cost = getCost(marketId, isYesToken, amount);

        // Transfer price token from user using SafeERC20
        priceToken.safeTransferFrom(msg.sender, address(this), cost.unwrap());

        // Update state
        if (isYesToken) {
            markets[marketId].qYes = markets[marketId].qYes.add(amount);
            markets[marketId].totalYes = markets[marketId].totalYes + amount.unwrap();
            // Update user's balance
            yesBalances[marketId][msg.sender] += amount.unwrap();
        } else {
            markets[marketId].qNo = markets[marketId].qNo.add(amount);
            markets[marketId].totalNo = markets[marketId].totalNo + amount.unwrap();
            // Update user's balance
            noBalances[marketId][msg.sender] += amount.unwrap();
        }
        
        markets[marketId].totalStaked = markets[marketId].totalStaked + amount.unwrap();
        markets[marketId].totalPriceToken += cost.unwrap();

        emit TokenOperation(msg.sender, marketId, 1, isYesToken ? 1 : 2, amount.unwrap(), cost.unwrap());
    }

    function claimReward(uint256 marketId) public nonReentrant {
        require(markets[marketId].resolved, "Market not resolved");

        uint256 reward = 0;
        uint256 userBalance;
        uint256 totalWinningStake = markets[marketId].won ? markets[marketId].totalYes : markets[marketId].totalNo;

        require(totalWinningStake > 0, "No winning stake");

        if (markets[marketId].won) {
            userBalance = yesBalances[marketId][msg.sender];
        } else {
            userBalance = noBalances[marketId][msg.sender];
        }

        require(userBalance > 0, "No tokens held to claim rewards");

        // Calculate user's share of the reward pool
        uint256 rewardPool = markets[marketId].totalPriceToken;
        reward = (userBalance * rewardPool) / totalWinningStake;

        // Transfer reward to user using SafeERC20
        priceToken.safeTransfer(msg.sender, reward);

        // Clear user's balance instead of burning tokens
        if (markets[marketId].won) {
            yesBalances[marketId][msg.sender] = 0;
        } else {
            noBalances[marketId][msg.sender] = 0;
        }

        emit RewardClaimed(msg.sender, marketId, reward);
    }

    // Emergency functions
    function emergencyWithdraw(uint256 marketId, address token, uint256 amount) external onlyOwner {
        require(markets[marketId].resolved, "Market not resolved");
        IERC20(token).safeTransfer(owner(), amount);
    }

    // Emergency function to add liquidity if needed
    function addLiquidity(uint256 marketId, uint256 amount) external onlyOwner marketActive(marketId) {
        // Just update the internal state instead of minting tokens
        markets[marketId].qYes = markets[marketId].qYes.add(ud(amount));
        markets[marketId].qNo = markets[marketId].qNo.add(ud(amount));

        emit EmergencyLiquidityAdded(msg.sender, marketId, amount);
    }

    /**
     * @notice Gets the price of a given token (YES or NO) based on the market state.
     * @param isYesToken The type of token (true for YES, false for NO).
     * @return price The price of the token in fixed-point format.
     */
    function getTokenPrice(
        uint256 marketId,
        bool isYesToken
    ) public view returns (UD60x18 price) {
        return MarketMath.getTokenPrice(
            markets[marketId].qYes,
            markets[marketId].qNo,
            isYesToken,
            LIQUIDITY_PARAMETER
        );
    }

    /**
     * @notice Returns the current state of the market.
     * @return marketState The current state of the market.
     */
    function getMarketState(uint256 marketId) public view returns (Market memory marketState) {
        return markets[marketId];
    }

    /**
     * @notice Returns the current quantities of YES and NO tokens.
     * @param marketId The ID of the market to query the quantities for.
     * @return yesQuantity The current quantity of YES tokens.
     * @return noQuantity The current quantity of NO tokens.
     */
    function getTokenQuantities(uint256 marketId)
        public
        view
        returns (UD60x18 yesQuantity, UD60x18 noQuantity)
    {
        return (markets[marketId].qYes, markets[marketId].qNo);
    }

    /**
     * @notice Returns the current balances of the price token, YES token, and NO token for a given address.
     * @param marketId The ID of the market to query the balances for.
     * @param account The address to query the balances for.
     * @return priceTokenBalance The balance of the price token.
     * @return yesTokenBalance The balance of the YES token.
     * @return noTokenBalance The balance of the NO token.
     */
    function getBalances(
        uint256 marketId,
        address account
    )
        public
        view
        returns (
            uint256 priceTokenBalance,
            uint256 yesTokenBalance,
            uint256 noTokenBalance
        )
    {
        priceTokenBalance = priceToken.balanceOf(account);
        yesTokenBalance = yesBalances[marketId][account];
        noTokenBalance = noBalances[marketId][account];
    }

    function createMarket(
        string memory _question,
        uint256 _endTime
    ) external returns (uint256 marketId) {
        // Creates new market with a unique ID
        // Stores it in the mapping
        // Returns the market ID
        marketId = marketCount++;
        markets[marketId] = Market({
            id: marketId,
            question: _question,
            endTime: _endTime,
            totalStaked: 0,
            totalYes: 0,
            totalNo: 0,
            resolved: false,
            won: false,
            totalPriceToken: 0,
            qYes: ud(0),
            qNo: ud(0),
            liquidityInitialized: false,
            creator: msg.sender,
            priceTokenFromDestination: 0
        });
        initializeLiquidity(marketId);
        emit MarketCreated(marketId, _question, _endTime, msg.sender);
        return marketId;
    }

    function getMarketCount() public view returns (uint256) {
        return marketCount;
    }

    function updateMarket(address , uint256 marketId , bool isYesToken , uint256 _amount , address account , uint256 cost) external authorizedSenderOnly {
        UD60x18 amount = ud(_amount);
        if (isYesToken) {
            markets[marketId].qYes = markets[marketId].qYes.add(amount);
            yesBalances[marketId][account] += amount.unwrap();
            markets[marketId].totalYes += amount.unwrap();
        } else {
            markets[marketId].qNo = markets[marketId].qNo.add(amount);
            noBalances[marketId][account] += amount.unwrap();
            markets[marketId].totalNo += amount.unwrap();
        }
        markets[marketId].totalPriceToken += cost;
        markets[marketId].priceTokenFromDestination += cost;
        emit MarketUpdated(marketId, isYesToken, amount.unwrap(), account, cost);
    }

}