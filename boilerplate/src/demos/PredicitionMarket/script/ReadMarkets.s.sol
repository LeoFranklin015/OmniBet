// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.8.0;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../PredicitionMarketSepolia.sol";
import {UD60x18} from "lib/prb-math/src/UD60x18.sol";

contract ReadMarketsScript is Script {
    function run() public {
        // Replace with your deployed contract address
        address contractAddress = address(0x1033e19794D5f63672Aa1Cb1d1B243F2F3400E94); // TODO: Update with actual address
        // Create an instance of the contract
        PredictionMarketSepolia market = PredictionMarketSepolia(payable(contractAddress));

        // MockUSDC mockUSDC = MockUSDC(0x533b950875527eCD9B7630272ffc2a6998417404);
        // mockUSDC.mint(address(this), 100000000000000000000);
        // mockUSDC.approve(address(market), type(uint256).max);
        
        // vm.startBroadcast();
        // market.buy(1, true, ud(1000000000000000000));
        // vm.stopBroadcast();
        // Get all market IDs
        uint256[] memory marketIds = market.getMarketIds();
        console.log("Total markets found:", marketIds.length);
        
        // Loop through each market and display its details
        for (uint256 i = 0; i < marketIds.length; i++) {
            uint256 marketId = marketIds[i];
            
            // Get market details
            PredictionMarketSepolia.Market memory marketData = market.getMarket(marketId);
            
            console.log("\n--- Market ID:", marketId, "---");
            console.log("YES tokens:", uint256(marketData.qyes.unwrap()) / 1e18);
            console.log("NO tokens:", uint256(marketData.qno.unwrap()) / 1e18);
            console.log("Total cost:", uint256(marketData.totalCost));
            console.log("Resolved:", marketData.resolved);
            
            // If you want to calculate the current price of YES tokens
            // if (marketData.qyes.unwrap() > 0 || marketData.qno.unwrap() > 0) {
            //     try market.getCost(marketId, true, UD60x18(1e18)) returns (UD60x18 yesCost) {
            //         console.log("Cost of 1 YES token:", uint256(yesCost.unwrap()) / 1e18);
            //     } catch {
            //         console.log("Could not calculate YES token cost");
            //     }
                
            //     try market.getCost(marketId, false, UD60x18(1e18)) returns (UD60x18 noCost) {
            //         console.log("Cost of 1 NO token:", uint256(noCost.unwrap()) / 1e18);
            //     } catch {
            //         console.log("Could not calculate NO token cost");
            //     }
            // }

            
        }
    
    }
}