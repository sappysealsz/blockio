import { Network } from "../../classes/EthClient/types/network";
import { agent } from "../../global/agent";

export const storeNetwork = async (): Promise<void> => {
    const networkData: Network = await agent.network(await agent.chainID());

    localStorage.setItem("blockioNetwork", networkData.name);
    localStorage.setItem("blockioCurrency", networkData.currency);
};
