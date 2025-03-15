// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity >=0.8.0;

import "./PredictionMarket.sol";
import '../../../lib/reactive-lib/src/abstract-base/AbstractCallback.sol';
import {UD60x18, ud} from "lib/prb-math/src/UD60x18.sol";
import "./Token/MockUSDC.sol";
import "./LMSRLibrary.sol";

contract PredictionMarketSepolia  is AbstractCallback{
    struct Market {
        uint256 id;
        UD60x18 qyes;
        UD60x18 qno;
        uint256 totalCost;
        bool resolved;
    }

    mapping(uint256 => Market) public markets;
    MockUSDC public priceToken;
    UD60x18 public LIQUIDITY_PARAMETER;
    uint256[] public marketIds;
    address public burner_address;
    event MarketCreated(uint256 marketId);

    event TokenBought(uint256 marketId, uint256 tokenType, uint256 amount, uint256 cost, address buyer);

    event MarketUpdated(uint256 marketId, bool isYesToken, uint256 amount);

    event MarketResolved(uint256 marketId, uint256 totalCost);
    
    constructor(address _callback_sender , address _priceToken , address _burner_address) AbstractCallback(_callback_sender) payable {
        priceToken = MockUSDC(_priceToken);
        LIQUIDITY_PARAMETER = ud(10e18);
        burner_address = _burner_address;
    }

    modifier marketActive(uint256 marketId) {
        require(markets[marketId].id != 0, "Market does not exist");
        require(!markets[marketId].resolved, "Market already resolved");
        _;
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
            markets[marketId].qyes,
            markets[marketId].qno,
            isYesToken,
            amount,
            LIQUIDITY_PARAMETER
        );
    }

      function resolveMarket(address , uint256 marketId) external authorizedSenderOnly{
        markets[marketId].resolved = true;
        if(markets[marketId].totalCost > 0){
            priceToken.transfer(burner_address, markets[marketId].totalCost);
        }
        emit MarketResolved(marketId , markets[marketId].totalCost);
    }


    function buy(uint256 marketId, bool isYesToken, UD60x18 amount) public marketActive(marketId) {
        require(amount.unwrap() > 0, "Amount must be greater than zero");
        require(amount.unwrap() <= type(uint128).max, "Amount too large"); // Prevent overflow

        // Calculate cost using LMSR
        UD60x18 cost = getCost(marketId, isYesToken, amount);

        // Transfer price token from user using SafeERC20
        priceToken.transferFrom(msg.sender, address(this), cost.unwrap());

        // Update state
        if (isYesToken) {
            markets[marketId].qyes = markets[marketId].qyes.add(amount);
        } else {
            markets[marketId].qno = markets[marketId].qno.add(amount);
        }
        markets[marketId].totalCost += cost.unwrap();
        emit TokenBought(marketId, isYesToken ? 1 : 2, amount.unwrap() , cost.unwrap() ,msg.sender);
    }

    function updateMarket(address , uint256 marketId, bool isYesToken, uint256 amount) external authorizedSenderOnly {
        if (isYesToken) {
            markets[marketId].qyes = markets[marketId].qyes.add(ud(amount));
        } else {
            markets[marketId].qno = markets[marketId].qno.add(ud(amount));
        }
        emit MarketUpdated(marketId, isYesToken, amount);
    }

    function createMarket(address , uint256 marketId) external authorizedSenderOnly  {
        markets[marketId] = Market({
            id: marketId,
            qyes: ud(0),
            qno: ud(0),
            totalCost: 0,
            resolved: false
        });
        marketIds.push(marketId);
        emit MarketCreated(marketId);
    }

  
    function getMarketIds() public view returns (uint256[] memory) {
        return marketIds;
    }

    function getMarket(uint256 marketId) public view returns (Market memory) {
        return markets[marketId];
    }
}