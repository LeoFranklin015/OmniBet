import { BigInt, Bytes } from "@graphprotocol/graph-ts";
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
import { Market, User, UserMarket } from "../generated/schema";

function getOrCreateUser(address: Bytes): User {
  let user = User.load(address);
  if (!user) {
    user = new User(address);
    user.userAddress = address;
    user.totalYesBought = BigInt.fromI32(0);
    user.totalNoBought = BigInt.fromI32(0);
    user.totalYesSold = BigInt.fromI32(0);
    user.totalNoSold = BigInt.fromI32(0);
    user.totalSpent = BigInt.fromI32(0);
    user.totalReceived = BigInt.fromI32(0);
    user.totalRewards = BigInt.fromI32(0);
    user.save();
  }
  return user;
}

function getOrCreateUserMarket(userId: Bytes, marketId: string): UserMarket {
  let id = userId.toHexString() + "-" + marketId;
  let userMarket = UserMarket.load(id);
  if (!userMarket) {
    userMarket = new UserMarket(id);
    userMarket.user = userId;
    userMarket.market = marketId;
    userMarket.yesBought = BigInt.fromI32(0);
    userMarket.noBought = BigInt.fromI32(0);
    userMarket.yesSold = BigInt.fromI32(0);
    userMarket.noSold = BigInt.fromI32(0);
    userMarket.yesInMarket = BigInt.fromI32(0);
    userMarket.noInMarket = BigInt.fromI32(0);
    userMarket.spent = BigInt.fromI32(0);
    userMarket.rewards = BigInt.fromI32(0);
    userMarket.claimed = false;
    userMarket.save();
  }
  return userMarket;
}

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

  // Create initial user market entry for creator
  let user = getOrCreateUser(event.params.creator);
  getOrCreateUserMarket(event.params.creator, event.params.marketId.toString());
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

  // Update market totals
  if (event.params.isYesToken) {
    entity.totalYes = entity.totalYes.plus(event.params.amount);
  } else {
    entity.totalNo = entity.totalNo.plus(event.params.amount);
  }
  entity.totalPriceToken = entity.totalPriceToken.plus(event.params.cost);
  entity.updatedAt = event.block.timestamp;
  entity.save();

  // Update user and user market data
  let user = getOrCreateUser(event.params.account);
  let userMarket = getOrCreateUserMarket(
    event.params.account,
    event.params.marketId.toString()
  );

  // Update user totals
  if (event.params.isYesToken) {
    user.totalYesBought = user.totalYesBought.plus(event.params.amount);
    userMarket.yesBought = userMarket.yesBought.plus(event.params.amount);
    userMarket.yesInMarket = userMarket.yesInMarket.plus(event.params.amount);
  } else {
    user.totalNoBought = user.totalNoBought.plus(event.params.amount);
    userMarket.noBought = userMarket.noBought.plus(event.params.amount);
    userMarket.noInMarket = userMarket.noInMarket.plus(event.params.amount);
  }
  user.totalSpent = user.totalSpent.plus(event.params.cost);
  userMarket.spent = userMarket.spent.plus(event.params.cost);

  user.save();
  userMarket.save();
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

  // Update user rewards
  let user = getOrCreateUser(event.params.user);
  let userMarket = getOrCreateUserMarket(
    event.params.user,
    event.params.marketId.toString()
  );

  user.totalRewards = user.totalRewards.plus(event.params.rewardAmount);
  userMarket.rewards = userMarket.rewards.plus(event.params.rewardAmount);
  userMarket.claimed = true;

  user.save();
  userMarket.save();
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

  let user = getOrCreateUser(event.params.user);
  let userMarket = getOrCreateUserMarket(
    event.params.user,
    event.params.marketId.toString()
  );

  // Buy operation
  if (event.params.opType === 1) {
    if (event.params.tokenType === 1) {
      entity.totalYes = entity.totalYes.plus(event.params.amount);
      user.totalYesBought = user.totalYesBought.plus(event.params.amount);
      userMarket.yesBought = userMarket.yesBought.plus(event.params.amount);
      userMarket.yesInMarket = userMarket.yesInMarket.plus(event.params.amount);
    } else {
      entity.totalNo = entity.totalNo.plus(event.params.amount);
      user.totalNoBought = user.totalNoBought.plus(event.params.amount);
      userMarket.noBought = userMarket.noBought.plus(event.params.amount);
      userMarket.noInMarket = userMarket.noInMarket.plus(event.params.amount);
    }
    entity.totalPriceToken = entity.totalPriceToken.plus(event.params.cost);
    user.totalSpent = user.totalSpent.plus(event.params.cost);
    userMarket.spent = userMarket.spent.plus(event.params.cost);
  }
  // Sell operation
  else if (event.params.opType === 2) {
    if (event.params.tokenType === 1) {
      entity.totalYes = entity.totalYes.minus(event.params.amount);
      user.totalYesSold = user.totalYesSold.plus(event.params.amount);
      userMarket.yesSold = userMarket.yesSold.plus(event.params.amount);
      userMarket.yesInMarket = userMarket.yesInMarket.minus(
        event.params.amount
      );
    } else {
      entity.totalNo = entity.totalNo.minus(event.params.amount);
      user.totalNoSold = user.totalNoSold.plus(event.params.amount);
      userMarket.noSold = userMarket.noSold.plus(event.params.amount);
      userMarket.noInMarket = userMarket.noInMarket.minus(event.params.amount);
    }
    user.totalReceived = user.totalReceived.plus(event.params.cost);
  }

  entity.updatedAt = event.block.timestamp;
  entity.save();
  user.save();
  userMarket.save();
}
