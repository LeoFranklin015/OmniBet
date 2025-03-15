// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../PredictionMarket.sol";


contract CreateMarket is Script {
    function run() external {
        // Load the PredictionMarket contract address from environment variable
        // or use a hardcoded address if preferred
        address predictionMarketAddress = vm.envOr("PREDICTION_MARKET_ADDRESS", 
                                                  address(0x0E2119Ccd170485543A77FD4fEc06D0668A350a1));
        
        // Create a reference to the PredictionMarket contract
        PredictionMarketV2 market = PredictionMarketV2(payable(predictionMarketAddress));
        
        // Set up market parameters
        string memory question = vm.envOr("MARKET_QUESTION", 
                                         string("Will ETH price exceed $5000 by the end of 2024?"));
        
        // Default end time: 30 days from now
        uint256 defaultEndTime = block.timestamp + 30 days;
        uint256 endTime = vm.envOr("MARKET_END_TIME", defaultEndTime);
        
        console.log("Creating market with question:", question);
        console.log("End time:", endTime);
        console.log("End time (human readable):", vm.toString(endTime));
        
        vm.startBroadcast();
        
        uint256 marketId = market.createMarket(question, endTime);

        // market.buy(marketId, true, ud(1000000000000000000));
        // market.buy(marketId, false, ud(1000000000000000000));

        // market.resolve(8, true, "");
        // market.claimReward(2);
        vm.stopBroadcast();
        
        console.log("Market created successfully!");
        // console.log("Market ID:", marketId);
    }
}