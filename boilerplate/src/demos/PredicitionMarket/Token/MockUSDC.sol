// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function safeTransferFrom(address from, address to, uint256 amount) public {
        transferFrom(from, to, amount);
    }

    function safeTransfer(address to, uint256 amount) public {
        transfer(to, amount);
    }
}