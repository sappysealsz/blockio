import { agent } from "../../global/agent";

export const fetchLatestBlock = async (): Promise<number> => {
    return await agent.block();
};
