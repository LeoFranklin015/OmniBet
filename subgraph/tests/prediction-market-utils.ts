import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  EmergencyLiquidityAdded,
  LiquidityAdded,
  MarketCreated,
  MarketResolved,
  MarketUpdated,
  OwnershipTransferred,
  RewardClaimed,
  TokenOperation
} from "../generated/PredictionMarket/PredictionMarket"

export function createEmergencyLiquidityAddedEvent(
  owner: Address,
  marketId: BigInt,
  amount: BigInt
): EmergencyLiquidityAdded {
  let emergencyLiquidityAddedEvent = changetype<EmergencyLiquidityAdded>(
    newMockEvent()
  )

  emergencyLiquidityAddedEvent.parameters = new Array()

  emergencyLiquidityAddedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  emergencyLiquidityAddedEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  emergencyLiquidityAddedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return emergencyLiquidityAddedEvent
}

export function createLiquidityAddedEvent(
  provider: Address,
  marketId: BigInt,
  amount: BigInt
): LiquidityAdded {
  let liquidityAddedEvent = changetype<LiquidityAdded>(newMockEvent())

  liquidityAddedEvent.parameters = new Array()

  liquidityAddedEvent.parameters.push(
    new ethereum.EventParam("provider", ethereum.Value.fromAddress(provider))
  )
  liquidityAddedEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  liquidityAddedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return liquidityAddedEvent
}

export function createMarketCreatedEvent(
  marketId: BigInt,
  question: string,
  endTime: BigInt,
  creator: Address
): MarketCreated {
  let marketCreatedEvent = changetype<MarketCreated>(newMockEvent())

  marketCreatedEvent.parameters = new Array()

  marketCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  marketCreatedEvent.parameters.push(
    new ethereum.EventParam("question", ethereum.Value.fromString(question))
  )
  marketCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "endTime",
      ethereum.Value.fromUnsignedBigInt(endTime)
    )
  )
  marketCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )

  return marketCreatedEvent
}

export function createMarketResolvedEvent(
  marketId: BigInt,
  result: boolean,
  totalPriceToken: BigInt
): MarketResolved {
  let marketResolvedEvent = changetype<MarketResolved>(newMockEvent())

  marketResolvedEvent.parameters = new Array()

  marketResolvedEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  marketResolvedEvent.parameters.push(
    new ethereum.EventParam("result", ethereum.Value.fromBoolean(result))
  )
  marketResolvedEvent.parameters.push(
    new ethereum.EventParam(
      "totalPriceToken",
      ethereum.Value.fromUnsignedBigInt(totalPriceToken)
    )
  )

  return marketResolvedEvent
}

export function createMarketUpdatedEvent(
  marketId: BigInt,
  isYesToken: boolean,
  amount: BigInt,
  account: Address,
  cost: BigInt
): MarketUpdated {
  let marketUpdatedEvent = changetype<MarketUpdated>(newMockEvent())

  marketUpdatedEvent.parameters = new Array()

  marketUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  marketUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "isYesToken",
      ethereum.Value.fromBoolean(isYesToken)
    )
  )
  marketUpdatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  marketUpdatedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  marketUpdatedEvent.parameters.push(
    new ethereum.EventParam("cost", ethereum.Value.fromUnsignedBigInt(cost))
  )

  return marketUpdatedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRewardClaimedEvent(
  user: Address,
  marketId: BigInt,
  rewardAmount: BigInt
): RewardClaimed {
  let rewardClaimedEvent = changetype<RewardClaimed>(newMockEvent())

  rewardClaimedEvent.parameters = new Array()

  rewardClaimedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  rewardClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  rewardClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "rewardAmount",
      ethereum.Value.fromUnsignedBigInt(rewardAmount)
    )
  )

  return rewardClaimedEvent
}

export function createTokenOperationEvent(
  user: Address,
  marketId: BigInt,
  opType: i32,
  tokenType: i32,
  amount: BigInt,
  cost: BigInt
): TokenOperation {
  let tokenOperationEvent = changetype<TokenOperation>(newMockEvent())

  tokenOperationEvent.parameters = new Array()

  tokenOperationEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  tokenOperationEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  tokenOperationEvent.parameters.push(
    new ethereum.EventParam(
      "opType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(opType))
    )
  )
  tokenOperationEvent.parameters.push(
    new ethereum.EventParam(
      "tokenType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(tokenType))
    )
  )
  tokenOperationEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  tokenOperationEvent.parameters.push(
    new ethereum.EventParam("cost", ethereum.Value.fromUnsignedBigInt(cost))
  )

  return tokenOperationEvent
}
