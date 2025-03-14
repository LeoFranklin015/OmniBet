import {
  EmergencyLiquidityAdded as EmergencyLiquidityAddedEvent,
  LiquidityAdded as LiquidityAddedEvent,
  MarketCreated as MarketCreatedEvent,
  MarketResolved as MarketResolvedEvent,
  MarketUpdated as MarketUpdatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RewardClaimed as RewardClaimedEvent,
  TokenOperation as TokenOperationEvent
} from "../generated/PredictionMarket/PredictionMarket"
import {
  EmergencyLiquidityAdded,
  LiquidityAdded,
  MarketCreated,
  MarketResolved,
  MarketUpdated,
  OwnershipTransferred,
  RewardClaimed,
  TokenOperation
} from "../generated/schema"

export function handleEmergencyLiquidityAdded(
  event: EmergencyLiquidityAddedEvent
): void {
  let entity = new EmergencyLiquidityAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.marketId = event.params.marketId
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLiquidityAdded(event: LiquidityAddedEvent): void {
  let entity = new LiquidityAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.provider = event.params.provider
  entity.marketId = event.params.marketId
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMarketCreated(event: MarketCreatedEvent): void {
  let entity = new MarketCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.marketId = event.params.marketId
  entity.question = event.params.question
  entity.endTime = event.params.endTime
  entity.creator = event.params.creator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMarketResolved(event: MarketResolvedEvent): void {
  let entity = new MarketResolved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.marketId = event.params.marketId
  entity.result = event.params.result
  entity.totalPriceToken = event.params.totalPriceToken

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMarketUpdated(event: MarketUpdatedEvent): void {
  let entity = new MarketUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.marketId = event.params.marketId
  entity.isYesToken = event.params.isYesToken
  entity.amount = event.params.amount
  entity.account = event.params.account
  entity.cost = event.params.cost

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRewardClaimed(event: RewardClaimedEvent): void {
  let entity = new RewardClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.marketId = event.params.marketId
  entity.rewardAmount = event.params.rewardAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenOperation(event: TokenOperationEvent): void {
  let entity = new TokenOperation(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.marketId = event.params.marketId
  entity.opType = event.params.opType
  entity.tokenType = event.params.tokenType
  entity.amount = event.params.amount
  entity.cost = event.params.cost

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
