// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import '../../../lib/reactive-lib/src/interfaces/IReactive.sol';
import '../../../lib/reactive-lib/src/abstract-base/AbstractReactive.sol';
import '../../../lib/reactive-lib/src/interfaces/ISystemContract.sol';

contract CrossChainAggregator is IReactive, AbstractReactive {

    uint256 public originChainId;
    uint256 public destinationChainId;
    uint64 private constant GAS_LIMIT = 1000000;

    // State specific to reactive network instance of the contract
    address private MainPredictionMarket;
    address private SubPredictionMarket;

    uint256 public MARKET_CREATED = 0x57d0d124b72f81ed1da0dc728fc33db342705974792928796f6577b8db5c3d53;

    uint256 public TOKEN_OPERATION = 0xf812a30160cd1fb46386678219b1c28ddc923c9b3a18805e38c090fd7b41bb71;

    uint256 public MARKET_RESOLVED = 0x6d4d544f5a6dcf38d77a232d3ef7358625c74877a1ad954fcb507872e7a05eaf;

    uint256 public TOKEN_BROUGHT_SUB = 0x9f81db15e86fd9b33c78e9a6f0e018f2f25aadac7ee976e404300b175772e833;

    event MarketCreated(uint256 marketId);

    constructor(
        address _service,
        uint256 _mainChainId,
        uint256 _subChainId,
        address _mainPredictionMarket,
        address _subPredictionMarket
    ) payable {
        service = ISystemContract(payable(_service));

        originChainId = _mainChainId;
        destinationChainId = _subChainId;

        if (!vm) {
            service.subscribe(
                originChainId,
                _mainPredictionMarket,
                MARKET_CREATED,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE
            );
            service.subscribe(
                originChainId,
                _mainPredictionMarket,
                TOKEN_OPERATION,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE
            );
            service.subscribe(
                originChainId,
                _mainPredictionMarket,
                MARKET_RESOLVED,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE
            );
            service.subscribe(
                destinationChainId,
                _subPredictionMarket,
                TOKEN_BROUGHT_SUB,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE
            );
        }
        MainPredictionMarket = _mainPredictionMarket;
        SubPredictionMarket = _subPredictionMarket;
    }

    // Methods specific to ReactVM instance of the contract
    function react(LogRecord calldata log) external vmOnly {

        if (log._contract == MainPredictionMarket) {
            // TODO: Handle the MarketCreated event
            if (log.topic_0 == MARKET_CREATED) {
                // TODO: Handle the MarketCreated event
                uint256 marketId  = uint256(log.topic_1);
                emit MarketCreated(marketId);
                bytes memory payload = abi.encodeWithSignature(
                    "createMarket(address,uint256)",
                    address(0),
                    marketId
                );
                emit Callback(destinationChainId, SubPredictionMarket, GAS_LIMIT, payload);
            } else if (log.topic_0 == TOKEN_OPERATION) {
                // TODO: Handle the TokenOperation event
                uint256 marketId  = uint256(log.topic_2);
                (uint256 opType256, uint256 tokenType256, uint256 amount, uint256 cost) = abi.decode(log.data, (uint256, uint256, uint256, uint256));

                uint8 opType = uint8(opType256);
                uint8 tokenType = uint8(tokenType256);

                if(opType == 1) {
                    if(tokenType == 1) {
                        bytes memory payload = abi.encodeWithSignature(
                            "updateMarket(address,uint256,bool,uint256)",
                            address(0),
                            marketId,
                            true,
                            amount
                        );
                        emit Callback(destinationChainId, SubPredictionMarket, GAS_LIMIT, payload);
                    }

                    else if(tokenType ==2){
                        bytes memory payload = abi.encodeWithSignature(
                            "updateMarket(address,uint256,bool,uint256)",
                            address(0),
                            marketId,
                            false,
                            amount
                        );
                        emit Callback(destinationChainId, SubPredictionMarket, GAS_LIMIT, payload);
                    }
                }

            } else if (log.topic_0 == MARKET_RESOLVED) {
                // TODO: Handle the MarketResolved event

            }
        } else if (log._contract == SubPredictionMarket) {
            // TODO: Handle the MarketCreated event
            if (log.topic_0 == TOKEN_BROUGHT_SUB) {
                // TODO: Handle the TokenBroughtSub event
                // (uint256 marketId, bool isYesToken, uint256 amount, address _buyer) = abi.decode(log.data, (uint256, bool, uint256, address));
                // address buyer = address(uint160(_buyer));
                // if(isYesToken) {
                //     bytes memory payload = abi.encodeWithSignature(
                //         "buyYesToken(uint256,uint256,address)",
                //         marketId,
                //         amount,
                //         buyer
                //     );
                //     emit Callback(originChainId, MainPredictionMarket, GAS_LIMIT, payload);
                // }
            }
        }


        // Parse the MarketCreated event data
        // For MarketCreated(uint256 indexed marketId, string question, uint256 endTime, address creator)
        




        // The indexed marketId will be in log.topic_1
        // uint256 marketId  = uint256(log.topic_1);
        
        // // Decode the non-indexed parameters (question, endTime, creator) from log.data
        // (string memory question, uint256 endTime, address creator) = abi.decode(log.data, (string, uint256, address));
        
        // // Prepare the callback payload with all relevant market information
        // bytes memory payload = abi.encodeWithSignature(
        //     "callback(address,uint256,string,uint256,address)",
        //     address(0),
        //     marketId,
        //     question, 
        //     endTime,
        //     creator
        // );
    
    }
}
