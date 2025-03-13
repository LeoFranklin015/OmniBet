// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../DemoCallback.sol";

contract DeployDemoCallback is Script {
    function run() external {
        // uint256 deployerPrivateKey = vm.envUint("DESTINATION_PRIVATE_KEY"); // Load private key from env
        address callbackProxyAddr = vm.envAddress("DESTINATION_CALLBACK_PROXY_ADDR"); // Load constructor arg

        vm.startBroadcast(); // Use Foundry's broadcast mode

        // Deploy contract with constructor argument and 0.05 ETH funding
        DemoCallback demoCallback = (new DemoCallback){value: 0.05 ether}(callbackProxyAddr);

        vm.stopBroadcast();

        console.log("DemoCallback deployed at:", address(demoCallback));
    }
}
