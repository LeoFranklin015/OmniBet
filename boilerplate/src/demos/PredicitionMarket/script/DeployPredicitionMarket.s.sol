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
        PredictionMarketV2 predictionMarket = new PredictionMarketV2{value: 0.05 ether}(callbackProxyAddr ,address(mockUSDC));
        console.log("PredictionMarket deployed to:", address(predictionMarket));
        console.log("Using price token at:", address(mockUSDC));

        // Mint some tokens to the deployer for testing
        address deployer = 0x4b4b30e2E7c6463b03CdFFD6c42329D357205334;
        uint256 mintAmount = 1_000 * 10**18; // 1 million tokens
        mockUSDC.mint(deployer, mintAmount);
        console.log("Minted 1,000,000 tokens to deployer:", deployer);

        // Approve tokens for the prediction market
        mockUSDC.approve(address(predictionMarket), type(uint256).max);
        console.log("Approved PredictionMarket to spend MockUSDC");
        vm.stopBroadcast();
        console.log("Deployment and setup complete!");
    }
} 