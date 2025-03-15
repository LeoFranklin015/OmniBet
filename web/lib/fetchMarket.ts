import { request, gql } from "graphql-request";
import { GRAPH_URL } from "./const";

export const fetchMarket = async (marketId: string) => {
  const query = gql`
    query MyQuery {
      markets(where: { id: "${marketId}" }) {
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
  console.log(data);
  return data.markets[0];
};
