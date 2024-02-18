import EthClient from "../../classes/EthClient/EthClient";
import { Network } from "../../classes/EthClient/types/chains";

export const storeNetwork = async (): Promise<void> => {
    async function getChainID(): Promise<number> {
        const chainID: number = await window.ethereum.request({
            method: "net_version",
        });
        return chainID;
    }

    const agent: EthClient = new EthClient(window.ethereum, "NULL");
    const networkData: Network = await agent.network(await getChainID());

    localStorage.setItem("blockioNetwork", networkData.name);
    localStorage.setItem("blockioCurrency", networkData.currency);
};
