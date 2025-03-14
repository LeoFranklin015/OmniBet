// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Script.sol";
import "../Token/MockUSDC.sol";
import "../PredictionMarket.sol";

contract DeployPredictionMarket is Script {
    function run() external {

        vm.startBroadcast();

        // Deploy MockUSDC token
        MockUSDC mockUSDC = new MockUSDC("MockUSDC", "USDC");
        console.log("MockUSDC deployed to:", address(mockUSDC));
                address callbackProxyAddr = address(0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA);

        // Deploy PredictionMarket with MockUSDC as price token
        PredictionMarket predictionMarket = new PredictionMarket{value: 0.05 ether}(address(mockUSDC), callbackProxyAddr);
        console.log("PredictionMarket deployed to:", address(predictionMarket));
        console.log("Using price token at:", address(mockUSDC));

        // Mint some tokens to the deployer for testing
        address deployer = 0x4b4b30e2E7c6463b03CdFFD6c42329D357205334;
        uint256 mintAmount = 1_000_000 * 10**18; // 1 million tokens
        mockUSDC.mint(deployer, mintAmount);
        console.log("Minted 1,000,000 tokens to deployer:", deployer);

        // Approve tokens for the prediction market
        mockUSDC.approve(address(predictionMarket), type(uint256).max);
        console.log("Approved PredictionMarket to spend MockUSDC");

        // Create a sample market
        uint256 endTime = block.timestamp + 7 days;
        uint256 marketId = predictionMarket.createMarket(
            "Will ETH price exceed $5000 by the end of the month?", 
            endTime
        );
        
        console.log("Created sample market with ID:", marketId);
        console.log("Market question: Will ETH price exceed $5000 by the end of the month?");
        console.log("Market end time:", endTime);

        // Buy some tokens for the market
        predictionMarket.buy(marketId, true, ud(1000000000000000000));

        // Buy some tokens for the market
        predictionMarket.buy(marketId, false, ud(1000000000000000000));


        predictionMarket.resolve(marketId, true, "");
        console.log("Resolved market with ID:", marketId);

        vm.stopBroadcast();
        console.log("Deployment and setup complete!");
    }
} 