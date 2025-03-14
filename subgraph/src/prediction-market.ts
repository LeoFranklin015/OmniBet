import { BigInt } from "@graphprotocol/graph-ts";
import {
  EmergencyLiquidityAdded as EmergencyLiquidityAddedEvent,
  LiquidityAdded as LiquidityAddedEvent,
  MarketCreated as MarketCreatedEvent,
  MarketResolved as MarketResolvedEvent,
  MarketUpdated,
  MarketUpdated as MarketUpdatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RewardClaimed as RewardClaimedEvent,
  TokenOperation as TokenOperationEvent,
} from "../generated/PredictionMarket/PredictionMarket";
import { Market } from "../generated/schema";

export function handleEmergencyLiquidityAdded(
  event: EmergencyLiquidityAddedEvent
): void {
  let entity = Market.load(event.params.marketId.toString());
  if (!entity) {
    entity = new Market(event.params.marketId.toString());
    entity.totalYes = BigInt.fromI32(0);
    entity.totalNo = BigInt.fromI32(0);
    entity.totalPriceToken = BigInt.fromI32(0);
  }
  entity.save();
}

export function handleLiquidityAdded(event: LiquidityAddedEvent): void {
  let entity = Market.load(event.params.marketId.toString());
  if (!entity) {
    entity = new Market(event.params.marketId.toString());
    entity.totalYes = BigInt.fromI32(0);
    entity.totalNo = BigInt.fromI32(0);
    entity.totalPriceToken = BigInt.fromI32(0);
  }
  entity.save();
}

export function handleMarketCreated(event: MarketCreatedEvent): void {
  let entity = new Market(event.params.marketId.toString());
  entity.marketId = event.params.marketId;
  entity.question = event.params.question;
  entity.endTime = event.params.endTime;
  entity.creator = event.params.creator;
  entity.totalYes = BigInt.fromI32(0);
  entity.totalNo = BigInt.fromI32(0);
  entity.totalPriceToken = BigInt.fromI32(0);
  entity.liquidityInitialized = true;
  entity.claimers = [];
  entity.resolved = false;
  entity.createdAt = event.block.timestamp;
  entity.updatedAt = event.block.timestamp;

  entity.save();
}

export function handleMarketResolved(event: MarketResolvedEvent): void {
  let entity = Market.load(event.params.marketId.toString());
  if (!entity) {
    entity = new Market(event.params.marketId.toString());
    entity.totalYes = BigInt.fromI32(0);
    entity.totalNo = BigInt.fromI32(0);
    entity.totalPriceToken = BigInt.fromI32(0);
    entity.claimers = [];
  }
  entity.resolved = true;
  entity.result = event.params.result;
  entity.totalPriceToken = event.params.totalPriceToken;
  entity.updatedAt = event.block.timestamp;
  entity.save();
}

export function handleMarketUpdated(event: MarketUpdatedEvent): void {
  let entity = Market.load(event.params.marketId.toString());
  if (!entity) {
    entity = new Market(event.params.marketId.toString());
    entity.totalYes = BigInt.fromI32(0);
    entity.totalNo = BigInt.fromI32(0);
    entity.totalPriceToken = BigInt.fromI32(0);
    entity.claimers = [];
  }
  if (event.params.isYesToken) {
    entity.totalYes = entity.totalYes.plus(event.params.amount);
  } else {
    entity.totalNo = entity.totalNo.plus(event.params.amount);
  }
  entity.updatedAt = event.block.timestamp;
  entity.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {}

export function handleRewardClaimed(event: RewardClaimedEvent): void {
  let entity = Market.load(event.params.marketId.toString());
  if (!entity) {
    entity = new Market(event.params.marketId.toString());
    entity.totalYes = BigInt.fromI32(0);
    entity.totalNo = BigInt.fromI32(0);
    entity.totalPriceToken = BigInt.fromI32(0);
    entity.claimers = [];
  }
  entity.claimers.push(event.params.user);
  entity.updatedAt = event.block.timestamp;
  entity.save();
}

export function handleTokenOperation(event: TokenOperationEvent): void {
  let entity = Market.load(event.params.marketId.toString());
  if (!entity) {
    entity = new Market(event.params.marketId.toString());
    entity.totalYes = BigInt.fromI32(0);
    entity.totalNo = BigInt.fromI32(0);
    entity.totalPriceToken = BigInt.fromI32(0);
    entity.claimers = [];
  }

  if (event.params.opType === 1) {
    if (event.params.tokenType === 1) {
      entity.totalYes = entity.totalYes.plus(event.params.amount);
    } else {
      entity.totalNo = entity.totalNo.plus(event.params.amount);
    }
  }
  entity.updatedAt = event.block.timestamp;
  entity.save();
}
