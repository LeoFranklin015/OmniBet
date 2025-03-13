// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {UD60x18, ud} from "lib/prb-math/src/UD60x18.sol";

library MarketMath {
    function getCost(
        UD60x18 qYes,
        UD60x18 qNo,
        bool isYesToken,
        UD60x18 amount,
        UD60x18 liquidityParameter
    ) public pure returns (UD60x18 price) {
        require(amount.unwrap() > 0, "Amount must be greater than zero");

        // Current total cost
        UD60x18 totalCost = liquidityParameter.mul(
            qYes.div(liquidityParameter)
                .exp()
                .add(qNo.div(liquidityParameter).exp())
                .ln()
        );

        // New cost after adding the tokens
        UD60x18 newCost;
        if (isYesToken) {
            newCost = liquidityParameter.mul(
                qYes.add(amount)
                    .div(liquidityParameter)
                    .exp()
                    .add(qNo.div(liquidityParameter).exp())
                    .ln()
            );
        } else {
            newCost = liquidityParameter.mul(
                qYes.div(liquidityParameter)
                    .exp()
                    .add(qNo.add(amount).div(liquidityParameter).exp())
                    .ln()
            );
        }

        // Price is the difference between new and current costs
        price = newCost.sub(totalCost);
    }

    function getTokenPrice(
        UD60x18 qYes,
        UD60x18 qNo,
        bool isYesToken,
        UD60x18 liquidityParameter
    ) public pure returns (UD60x18 price) {
        UD60x18 numerator;
        UD60x18 denominator = qYes.div(liquidityParameter).exp().add(
            qNo.div(liquidityParameter).exp()
        );

        if (isYesToken) {
            numerator = qYes.div(liquidityParameter).exp();
        } else {
            numerator = qNo.div(liquidityParameter).exp();
        }

        price = numerator.div(denominator);
    }
}