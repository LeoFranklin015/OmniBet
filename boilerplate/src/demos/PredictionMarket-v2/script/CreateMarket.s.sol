// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../PredictionMarket.sol";


contract CreateMarket is Script {
    function run() external {
        // Load the PredictionMarket contract address from environment variable
        // or use a hardcoded address if preferred
        address predictionMarketAddress = vm.envOr("PREDICTION_MARKET_ADDRESS", 
                                                  address(0xB8b6192E296A97b1CD5E065a9A66f82f148272AE));
        
        // Create a reference to the PredictionMarket contract
        PredictionMarket2 market = PredictionMarket2(predictionMarketAddress);
        
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
        
        vm.stopBroadcast();
        
        console.log("Market created successfully!");
        console.log("Market ID:", marketId);
    }
}