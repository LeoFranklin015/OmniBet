import { request, gql } from "graphql-request";
import { GRAPH_URL } from "./const";
export const fetchMarkets = async () => {
  const query = gql`
    query getMarkets {
      markets {
        claimers
        creator
        createdAt
        endTime
        id
        liquidityInitialized
        marketId
        question
        resolved
        result
        totalNo
        totalYes
        totalPriceToken
        updatedAt
      }
    }
  `;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await request(GRAPH_URL, query);
  return data.markets;
};
