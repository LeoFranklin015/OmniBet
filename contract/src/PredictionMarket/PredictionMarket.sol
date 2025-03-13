// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {UD60x18, ud} from "@prb/math/src/UD60x18.sol";
import "./NoToken.sol";
import "./YesToken.sol";

contract PredictionMarket is Ownable, IERC1155Receiver, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    IERC20 public priceToken;
    YesToken public yesToken;
    NoToken public noToken;

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
    }

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


    constructor(
        address _priceToken,
        address _yesToken,
        address _noToken
    ) Ownable(_creator) {
        require(_priceToken != address(0), "Invalid price token");
        require(_yesToken != address(0), "Invalid yes token");
        require(_noToken != address(0), "Invalid no token");
        
        DECIMALS = ud(1e18);
        LIQUIDITY_PARAMETER = ud(10e18);
        priceToken = IERC20(_priceToken);
        yesToken = YesToken(_yesToken);
        noToken = NoToken(_noToken);
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

    function initializeLiquidity(uint256 marketId) public marketActive(marketId) nonReentrant whenNotPaused {
        require(
            markets[marketId].qYes.unwrap() == 0 && markets[marketId].qNo.unwrap() == 0,
            "Liquidity already initialized"
        );
        yesToken.mint(address(this), marketId, INITIAL_LIQUIDITY, "");
        noToken.mint(address(this), marketId, INITIAL_LIQUIDITY, "");
        markets[marketId].qYes = ud(INITIAL_LIQUIDITY);
        markets[marketId].qNo = ud(INITIAL_LIQUIDITY);
    }

    // IERC1155Receiver implementation
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId;
    }

    function resolve(uint256 marketId, bool isYesWon , bytes calldata proof) public onlyResolver(marketId) {
        // DISABLED TO SHOW DEMO. ENABLE FOR PRODUCTION
        // require(block.timestamp >= markets[marketId].endTime, "Market has not ended");

        // TODO: Verify proof here 
        // verifier.verifyProof(markets[marketId].id, isYesWon, proof);

        require(!markets[marketId].resolved, "Market already resolved");


        markets[marketId].resolved = true;
        markets[marketId].won =isYesWon;
        markets[marketId].totalPriceToken = priceToken.balanceOf(address(this));

        emit MarketResolved(marketId, markets[marketId].won , markets[marketId].totalPriceToken);
    }

    /**
     * @notice Calculates the cost of purchasing a given amount of YES or NO tokens.
     * @param isYesToken Indicates if the token being purchased is YES (true) or NO (false).
     * @param amount The amount of tokens to purchase.
     * @return price The cost of the specified amount of tokens.
     */
    function getCost(
        bool isYesToken,
        UD60x18 amount
    ) public view returns (UD60x18 price) {
        require(amount.unwrap() > 0, "Amount must be greater than zero");

        // Current total cost
        UD60x18 totalCost = LIQUIDITY_PARAMETER.mul(
            markets[marketId].qYes
                .div(LIQUIDITY_PARAMETER)
                .exp()
                .add(markets[marketId].qNo.div(LIQUIDITY_PARAMETER).exp())
                .ln()
        );

        // New cost after adding the tokens
        UD60x18 newCost;
        if (isYesToken) {
            newCost = LIQUIDITY_PARAMETER.mul(
                markets[marketId].qYes
                    .add(amount)
                    .div(LIQUIDITY_PARAMETER)
                    .exp()
                    .add(markets[marketId].qNo.div(LIQUIDITY_PARAMETER).exp())
                    .ln()
            );
        } else {
            newCost = LIQUIDITY_PARAMETER.mul(
                markets[marketId].qYes
                    .div(LIQUIDITY_PARAMETER)
                    .exp()
                    .add(markets[marketId].qNo.add(amount).div(LIQUIDITY_PARAMETER).exp())
                    .ln()
            );
        }

        // Price is the difference between new and current costs
        price = newCost.sub(totalCost);
    }

    /**
     * @notice Buys YES or NO tokens by paying the required price in the price token.
     * @param isYesToken Indicates if the token being purchased is YES (true) or NO (false).
     * @param amount The amount of tokens to purchase.
     */
    function buy(bool isYesToken, UD60x18 amount) public marketActive(marketId) nonReentrant whenNotPaused {
        require(amount.unwrap() > 0, "Amount must be greater than zero");
        require(amount.unwrap() <= type(uint128).max, "Amount too large"); // Prevent overflow

        // Calculate cost using LMSR
        UD60x18 cost = getCost(isYesToken, amount);

        // Check liquidity first
        if (isYesToken) {
            require(
                yesToken.balanceOf(address(this), marketId) >= amount.unwrap(),
                "Insufficient liquidity"
            );
        } else {
            require(
                noToken.balanceOf(address(this), marketId) >= amount.unwrap(),
                "Insufficient liquidity"
            );
        }

        // Transfer price token from user using SafeERC20
        priceToken.safeTransferFrom(msg.sender, address(this), cost.unwrap());

        // Update state
        if (isYesToken) {
            markets[marketId].qYes = markets[marketId].qYes.add(amount);
            markets[marketId].totalYes = markets[marketId].totalYes + amount.unwrap();
        } else {
            markets[marketId].qNo = markets[marketId].qNo.add(amount);
            markets[marketId].totalNo = markets[marketId].totalNo + amount.unwrap();
        }
        markets[marketId].totalStaked = markets[marketId].totalStaked + amount.unwrap();

        // Transfer prediction tokens to user
        if (isYesToken) {
            yesToken.safeTransferFrom(
                address(this),
                msg.sender,
                marketId,
                amount.unwrap(),
                ""
            );
        } else {
            noToken.safeTransferFrom(
                address(this),
                msg.sender,
                marketId,
                amount.unwrap(),
                ""
            );
        }

        emit TokenOperation(msg.sender, marketId, 1, isYesToken ? 1 : 2, amount.unwrap(), cost.unwrap());
    }

    function sell(bool isYesToken, UD60x18 amount) public marketActive(marketId) nonReentrant whenNotPaused {
        require(amount.unwrap() > 0, "Amount must be greater than zero");
        require(amount.unwrap() <= type(uint128).max, "Amount too large"); // Prevent overflow

        // Calculate return amount
        UD60x18 returnAmount = getCost(isYesToken, amount);

        // Check user balance first
        if (isYesToken) {
            require(
                yesToken.balanceOf(msg.sender, marketId) >= amount.unwrap(),
                "Insufficient balance"
            );
        } else {
            require(
                noToken.balanceOf(msg.sender, marketId) >= amount.unwrap(),
                "Insufficient balance"
            );
        }

        // Update state
        if (isYesToken) {
            markets[marketId].qYes = markets[marketId].qYes.sub(amount);
            markets[marketId].totalYes = markets[marketId].totalYes - amount.unwrap();
        } else {
            markets[marketId].qNo = markets[marketId].qNo.sub(amount);
            markets[marketId].totalNo = markets[marketId].totalNo - amount.unwrap();
        }
        markets[marketId].totalStaked = markets[marketId].totalStaked - amount.unwrap();

        // Transfer tokens from user to contract
        if (isYesToken) {
            yesToken.safeTransferFrom(
                msg.sender,
                address(this),
                marketId,
                amount.unwrap(),
                ""
            );
        } else {
            noToken.safeTransferFrom(
                msg.sender,
                address(this),
                marketId,
                amount.unwrap(),
                ""
            );
        }

        // Transfer price tokens back to user using SafeERC20
        priceToken.safeTransfer(msg.sender, returnAmount.unwrap());

        emit TokenOperation(msg.sender, marketId, 2, isYesToken ? 1 : 2, amount.unwrap(), returnAmount.unwrap());
    }

    function claimReward() public nonReentrant whenNotPaused {
        require(markets[marketId].resolved, "Market not resolved");

        uint256 reward = 0;
        uint256 userBalance;
        uint256 totalWinningStake = markets[marketId].won ? markets[marketId].totalYes : markets[marketId].totalNo;

        require(totalWinningStake > 0, "No winning stake");

        if (markets[marketId].won) {
            userBalance = yesToken.balanceOf(msg.sender, marketId);
        } else {
            userBalance = noToken.balanceOf(msg.sender, marketId);
        }

        require(userBalance > 0, "No tokens held to claim rewards");

        // Calculate user's share of the reward pool
        uint256 rewardPool = markets[marketId].totalPriceToken;
        reward = (userBalance * rewardPool) / totalWinningStake;

        // Transfer reward to user using SafeERC20
        priceToken.safeTransfer(msg.sender, reward);

        // Burn user's prediction tokens
        if (markets[marketId].won) {
            yesToken.burn(msg.sender, marketId, userBalance);
        } else {
            noToken.burn(msg.sender, marketId, userBalance);
        }

        emit RewardClaimed(msg.sender, marketId, reward);
    }

    // Admin functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Emergency functions
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(markets[marketId].resolved, "Market not resolved");
        IERC20(token).safeTransfer(owner(), amount);
    }

    // Emergency function to add liquidity if needed
    function addLiquidity(uint256 amount) external onlyOwner marketActive(marketId) {
        yesToken.mint(address(this), marketId, amount, "");
        noToken.mint(address(this), marketId, amount, "");
        // Note: This should rarely/never be needed due to LMSR mechanics

        emit EmergencyLiquidityAdded(msg.sender, marketId, amount);
    }

    /**
     * @notice Gets the price of a given token (YES or NO) based on the market state.
     * @param isYesToken The type of token (true for YES, false for NO).
     * @return price The price of the token in fixed-point format.
     */
    function getTokenPrice(
        bool isYesToken
    ) public view returns (UD60x18 price) {
        UD60x18 numerator;
        UD60x18 denominator = markets[marketId].qYes.div(LIQUIDITY_PARAMETER).exp().add(
            markets[marketId].qNo.div(LIQUIDITY_PARAMETER).exp()
        );

        if (isYesToken) {
            numerator = markets[marketId].qYes.div(LIQUIDITY_PARAMETER).exp();
        } else {
            numerator = markets[marketId].qNo.div(LIQUIDITY_PARAMETER).exp();
        }

        price = numerator.div(denominator);
    }

    /**
     * @notice Returns the current state of the market.
     * @return marketState The current state of the market.
     */
    function getMarketState() public view returns (Market memory marketState) {
        return markets[marketId];
    }

    /**
     * @notice Returns the current quantities of YES and NO tokens.
     * @return yesQuantity The current quantity of YES tokens.
     * @return noQuantity The current quantity of NO tokens.
     */
    function getTokenQuantities()
        public
        view
        returns (UD60x18 yesQuantity, UD60x18 noQuantity)
    {
        return (markets[marketId].qYes, markets[marketId].qNo);
    }

    /**
     * @notice Returns the current balances of the price token, YES token, and NO token for a given address.
     * @param account The address to query the balances for.
     * @return priceTokenBalance The balance of the price token.
     * @return yesTokenBalance The balance of the YES token.
     * @return noTokenBalance The balance of the NO token.
     */
    function getBalances(
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
        yesTokenBalance = yesToken.balanceOf(account, marketId);
        noTokenBalance = noToken.balanceOf(account, marketId);
    }

    function setResolver(address newResolver) public onlyOwner {
        require(newResolver != address(0), "Invalid resolver address");
        resolver = newResolver;
    }

    function createMarket(
        string memory _question,
        uint256 _endTime
    ) external whenNotPaused returns (uint256 marketId) {
        // Creates new market with a unique ID
        // Stores it in the mapping
        // Returns the market ID
        marketId = nextMarketId++;
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
            liquidityInitialized: false
        });
        allMarketIds.push(marketId);
        return marketId;
    }

    function getAllMarketIds() public view returns (uint256[] memory) {
        return allMarketIds;
    }

    function getMarketCount() public view returns (uint256) {
        return allMarketIds.length;
    }
}