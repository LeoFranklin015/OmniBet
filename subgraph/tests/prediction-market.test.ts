import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { EmergencyLiquidityAdded } from "../generated/schema"
import { EmergencyLiquidityAdded as EmergencyLiquidityAddedEvent } from "../generated/PredictionMarket/PredictionMarket"
import { handleEmergencyLiquidityAdded } from "../src/prediction-market"
import { createEmergencyLiquidityAddedEvent } from "./prediction-market-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let owner = Address.fromString("0x0000000000000000000000000000000000000001")
    let marketId = BigInt.fromI32(234)
    let amount = BigInt.fromI32(234)
    let newEmergencyLiquidityAddedEvent = createEmergencyLiquidityAddedEvent(
      owner,
      marketId,
      amount
    )
    handleEmergencyLiquidityAdded(newEmergencyLiquidityAddedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("EmergencyLiquidityAdded created and stored", () => {
    assert.entityCount("EmergencyLiquidityAdded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "EmergencyLiquidityAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "owner",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "EmergencyLiquidityAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "marketId",
      "234"
    )
    assert.fieldEquals(
      "EmergencyLiquidityAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
