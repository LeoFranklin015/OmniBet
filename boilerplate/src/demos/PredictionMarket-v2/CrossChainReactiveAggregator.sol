// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.0;

import '../../../lib/reactive-lib/src/interfaces/IReactive.sol';
import '../../../lib/reactive-lib/src/abstract-base/AbstractReactive.sol';
import '../../../lib/reactive-lib/src/interfaces/ISystemContract.sol';

contract CrossChainReactiveAggregator is IReactive, AbstractReactive {

    uint256 public originChainId;
    uint256 public destinationChainId;
    uint64 private constant GAS_LIMIT = 1000000;

    // State specific to reactive network instance of the contract
    address private callback;

    constructor(
        address _service,
        uint256 _originChainId,
        uint256 _destinationChainId,
        address _contract,
        uint256 topic_0,
        address _callback
    ) payable {
        service = ISystemContract(payable(_service));

        originChainId = _originChainId;
        destinationChainId = _destinationChainId;

        if (!vm) {
            service.subscribe(
                originChainId,
                _contract,
                topic_0,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE
            );
        }
        callback = _callback;
    }

    // Methods specific to ReactVM instance of the contract
    function react(LogRecord calldata log) external vmOnly {
        // Parse the MarketCreated event data
        // For MarketCreated(uint256 indexed marketId, string question, uint256 endTime, address creator)
        
        // The indexed marketId will be in log.topic_1
        uint256 marketId  = uint256(log.topic_1);
        
        // Decode the non-indexed parameters (question, endTime, creator) from log.data
        (string memory question, uint256 endTime, address creator) = abi.decode(log.data, (string, uint256, address));
        
        // Prepare the callback payload with all relevant market information
        bytes memory payload = abi.encodeWithSignature(
            "callback(address,uint256,string,uint256,address)",
            address(0),
            marketId,
            question, 
            endTime,
            creator
        );
        
        // Emit callback to the destination chain
        emit Callback(destinationChainId, callback, GAS_LIMIT, payload);
    }
}
