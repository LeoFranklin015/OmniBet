// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Script.sol";
import "../Token/MockUSDC.sol";
import "../PredicitionMarketSepolia.sol";

contract DeployPredictionMarketSepolia is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy MockUSDC token
        MockUSDC mockUSDC = new MockUSDC("MockUSDC", "USDC");
        console.log("MockUSDC deployed to:", address(mockUSDC));

        // Deploy a mock callback sender (for AbstractCallback)
        address callbackProxyAddr = address(0xc9f36411C9897e7F959D99ffca2a0Ba7ee0D7bDA);
        console.log("Using mock callback sender:", callbackProxyAddr);

        // Deploy PredictionMarketSepolia with MockUSDC as price token
        PredictionMarketSepolia predictionMarket = new PredictionMarketSepolia{value: 0.02 ether}(
            callbackProxyAddr,
            address(mockUSDC),
            address(0x4b4b30e2E7c6463b03CdFFD6c42329D357205334)
        );
        console.log("PredictionMarketSepolia deployed to:", address(predictionMarket));
        console.log("Using price token at:", address(mockUSDC));

        // Mint some tokens to the deployer for testing
        address deployer = 0x4b4b30e2E7c6463b03CdFFD6c42329D357205334;
        uint256 mintAmount = 1_000_000 * 10**18; // 1 million tokens
        mockUSDC.mint(deployer, mintAmount);
        console.log("Minted 1,000,000 tokens to deployer:", deployer);

        // Approve tokens for the prediction market
        mockUSDC.approve(address(predictionMarket), type(uint256).max);
        console.log("Approved PredictionMarketSepolia to spend MockUSDC");

        // Create a sample market
        // uint256 marketId = 1;
        // predictionMarket.createMarket(marketId);
        // console.log("Created sample market with ID:", marketId);

        // // Buy some YES tokens for the market
        // predictionMarket.buy(marketId, true, ud(1000000000000000000));
        // console.log("Bought 1 YES token for market:", marketId);

        // // Buy some NO tokens for the market
        // predictionMarket.buy(marketId, false, ud(1000000000000000000));
        // console.log("Bought 1 NO token for market:", marketId);

        // // Update the market with additional tokens
        // predictionMarket.updateMarket(marketId, true, ud(500000000000000000));
        // console.log("Updated market with additional 0.5 YES tokens");

        vm.stopBroadcast();
        console.log("Deployment and setup complete!");
    }
}