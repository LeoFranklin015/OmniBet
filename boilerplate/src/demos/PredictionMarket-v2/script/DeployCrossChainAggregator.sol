
// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// import "forge-std/Script.sol";
// import "../CrossChainReactiveAggregator.sol";

// contract DeployCrossChainAggregator is Script {
//     function run() external {
//     // ...

//         // Load deployment parameters from environment variables
//         address serviceContract = 0x0000000000000000000000000000000000fffFfF;
//         uint256 originChainId = 84532;
//         uint256 destinationChainId = 11155111;
//         address predictionMarketContract = 0x9BDA9bBf191633978453D624Dc75EeACEa1cC37C;
//         uint256 marketCreatedTopic = 0x25d6481082aba357ad115061cbb1152222d946e85c5764f75470e53f48e3e2eb;
//         address callbackAddress = 0xa2B766e08e14C9EA96cE55d5343B3d3987c5024c;
        
//         // Value to send with deployment (for gas fees on destination chain)

        
//         vm.startBroadcast();
        
//         // Deploy the CrossChainReactiveAggregator with constructor arguments and funding
//         CrossChainReactiveAggregator aggregator = (new CrossChainReactiveAggregator){value: 0.001 ether}(
//             serviceContract,
//             originChainId,
//             destinationChainId,
//             predictionMarketContract,
//             marketCreatedTopic,
//             callbackAddress
//         );
        
//         vm.stopBroadcast();
        
//         console.log("CrossChainReactiveAggregator deployed at:", address(aggregator));
//         console.log("Origin Chain ID:", originChainId);
//         console.log("Destination Chain ID:", destinationChainId);
//         console.log("Monitoring contract:", predictionMarketContract);
//         console.log("Callback contract:", callbackAddress);
//     }
// }