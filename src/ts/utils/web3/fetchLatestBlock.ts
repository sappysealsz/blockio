import EthClient from "../../classes/EthClient/EthClient";

export const fetchLatestBlock = async (account: string): Promise<number> => {
    const agent: EthClient = new EthClient(window.ethereum, account);
    return await agent.block();
};
