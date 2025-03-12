// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract YesToken is ERC1155, Ownable, ERC1155Burnable {
    address public predictionMarket;

    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function setPredictionMarket(address newPredictionMarket) public onlyOwner {
        predictionMarket = newPredictionMarket;
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public {
        require(
            msg.sender == predictionMarket,
            "Only the Prediction Market contract can mint this token"
        );
        _mint(account, id, amount, data);
    }

    function burn(address account, uint256 id, uint256 amount) public override {
        require(
            msg.sender == predictionMarket,
            "Only the Prediction Market contract can burn this token"
        );
        _burn(account, id, amount);
    }

    function balanceOf(
        address account,
        uint256 id
    ) public view override returns (uint256) {
        return super.balanceOf(account, id);
    }

    function transfer(address to, uint256 id, uint256 amount) public {
        require(balanceOf(msg.sender, id) >= amount, "Insufficient balance");
        safeTransferFrom(msg.sender, to, id, amount, "");
    }
}