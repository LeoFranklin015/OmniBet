// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import "../Tokens/YesToken.sol";
import "../Tokens/NoToken.sol";
import "../Tokens/MockUSDC.sol";

contract DeployTokens is Script {
    function run() external returns (YesToken, NoToken, MockUSDC) {
        vm.startBroadcast();

        // Deploy tokens with the deployer as the initial owner
        YesToken yesToken = new YesToken(msg.sender);
        NoToken noToken = new NoToken(msg.sender);
        MockUSDC mockUSDC = new MockUSDC("Mock USDC", "mUSDC");


        console.log("YesToken deployed at:", address(yesToken));
        console.log("NoToken deployed at:", address(noToken));
        console.log("MockUSDC deployed at:", address(mockUSDC));

        vm.stopBroadcast();

        return (yesToken, noToken, mockUSDC);
    }
} 