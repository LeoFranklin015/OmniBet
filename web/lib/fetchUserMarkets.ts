import { request, gql } from "graphql-request";
import { GRAPH_URL } from "./const";

export const fetchUserMarkets = async (address: string) => {
  const query = gql`
    query MyQuery {
      userMarkets(
        where: { user_: { id: "${address}" } }
      ) {
        id
        noBought
        noInMarket
        noSold
        rewards
        spent
        yesInMarket
        yesBought
        yesSold
        claimed
        market {
          claimers
          createdAt
          creator
          endTime
          id
          liquidityInitialized
          marketId
          question
          resolved
          result
          totalPriceToken
          totalNo
          totalYes
          updatedAt
        }
      }
    }
  `;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await request(GRAPH_URL, query);
  console.log(data);
  return data.userMarkets;
};
