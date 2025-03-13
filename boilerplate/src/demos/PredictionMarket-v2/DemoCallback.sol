// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity >=0.8.0;

import '../../../lib/reactive-lib/src/abstract-base/AbstractCallback.sol';

contract DemoCallback is AbstractCallback {
    event CallbackReceived(
        address indexed origin,
        address indexed sender,
        uint256 indexed marketId,
        address  creator,
        string question,
        uint256 endTime
    );

    constructor(address _callback_sender) AbstractCallback(_callback_sender) payable {}

    function callback( uint256 marketId , string memory question , uint256 endTime , address creator)
        external
        authorizedSenderOnly

    {
        emit CallbackReceived(
            tx.origin,
            msg.sender,
            marketId,
            creator,
            question,
            endTime
        );
    }
}
