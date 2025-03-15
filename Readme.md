![image](https://github.com/user-attachments/assets/002e164a-0f84-468b-9637-e6dd2ade5ef8)

Deplying Steps

Set The `SOURCE_RPC_URL` , `DESTINATION_RPC_URL` , `SOURCE_CHAINID` , `DESTINATION_CHAINID`, `SERVICE_CONTRACT` , `CALLBACK_CONTRACT` , `PRIVATE_KEY` in your ENV

Deploying Main Prediction Market

```bash
forge script src/demos/PredicitionMarket/script/DeployPredictionMarket.s.sol --rpc-url $SOURCE_RPC_URL --private-key $PRIVATE_KEY --broadcast --via-ir
```

```ts
  MockUSDC deployed to: 0x1e0a64f445B7Cb80D3Ad85d6F893e037dD7DAD09
  PredictionMarket deployed to: 0x0ffcAb38F5Fd76F1Eec27a46eD37D184Ed9B0931
```

Deploying Sub Prediction Market

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
