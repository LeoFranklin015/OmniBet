![image](https://github.com/user-attachments/assets/002e164a-0f84-468b-9637-e6dd2ade5ef8)

Deplying Steps

Set The `SOURCE_RPC_URL` , `DESTINATION_RPC_URL` , `SOURCE_CHAINID` , `DESTINATION_CHAINID`, `SERVICE_CONTRACT` , `CALLBACK_CONTRACT` , `PRIVATE_KEY` , `REACTIVE_RPC` ,`REACTIVE_PRIVATE_KEY` in your ENV

Deploying Main Prediction Market (Sepolia)

```bash
forge script src/demos/PredicitionMarket/script/DeployPredictionMarket.s.sol --rpc-url $SOURCE_RPC_URL --private-key $PRIVATE_KEY --broadcast --via-ir
```

```ts
  MockUSDC deployed to: 0x1e0a64f445B7Cb80D3Ad85d6F893e037dD7DAD09
  PredictionMarket deployed to: 0x0ffcAb38F5Fd76F1Eec27a46eD37D184Ed9B0931
```

Deploying Sub Prediction Market (Sepolia)

```bash
forge script src/demos/PredicitionMarket/script/DeploySubPredictionMarket.s.sol --rpc-url $SOURCE_RPC_URL --private-key $PRIVATE_KEY --broadcast --via-ir
```

```ts
MockUSDC deployed to: 0x83606f12aC1a708cb9D4Ad92a1203d1c9Da06424
PredictionMarketSepolia deployed to: 0x8d34bb6217344AC5F1Af114ecec9fa6f4038B5c2
```

Deploying RSC Cross Chain Agreegator

```bash
forge create --legacy --rpc-url $REACTIVE_RPC --private-key $REACTIVE_PRIVATE_KEY --broadcast src/demos/PredicitionMarket/CrossChainAggregator.sol:CrossChainAggregator --value 0.01ether --constructor-args $SYSTEM_CONTRACT_ADDR $SOURCE_CHAINID $DESTINATION_CHAINID <PredictionMarket_Address_Main> <PredictionMarket_Address_Sub> --via-ir
```

```ts
Deployed to: 0x7fca273E558f7C37b1b763Bcf21E2F93F6e150E4
```

## Market creation

Orgin : https://sepolia.etherscan.io/tx/0x9b064f66953311fc10f79009a81d4ff75ff73e9d389a9af0e4a39b1503a7020e
RSC : https://kopli.reactscan.net/rvm/0x4b4b30e2e7c6463b03cdffd6c42329d357205334/217
Destination : https://sepolia.etherscan.io/tx/0xaf29c00ff7f0b17d389b9feefc52b090afd381979ecf7b989ce5aa72c69ed7be

## Buy Shares on Main Market

Orgin : https://sepolia.etherscan.io/tx/0x5a5930fad304ea303ddcc1bf4efb9c92d1f16ab6552d3e95f98c135f7ac1ed81
RSC : https://kopli.reactscan.net/rvm/0x4b4b30e2e7c6463b03cdffd6c42329d357205334/218
Destination : https://sepolia.etherscan.io/tx/0xe182794a95e3ae5f16d5b668ac89da7580ede9dcce441d9791879f9961d8673b

## Buy Shares on Sub Markets

Origin: https://sepolia.etherscan.io/tx/0x5b393539e1711c583b0a4afb9e3601877095113ded9d476b8021d08c59598a15
RSC: https://kopli.reactscan.net/rvm/0x4b4b30e2e7c6463b03cdffd6c42329d357205334/219
Destination: https://sepolia.etherscan.io/tx/0x772cd9b21b38e2d045fbbb76a5f1f19e4603306f2481123b44b16b0dacfd494e

## Resolve Market

Origin: https://sepolia.etherscan.io/tx/0x5da984ba458aadea18eafb835c4be1ae45e798a4bc41c5e8f6f99d1434e6cfc8
RSC: https://kopli.reactscan.net/rvm/0x4b4b30e2e7c6463b03cdffd6c42329d357205334/220
Destination: https://sepolia.etherscan.io/tx/0x06c3e3da14d4140c98289c0a07fbb6f8c976a5376e224d1d738d0f29d3fcbdb1
