import EthClient from "../classes/EthClient/EthClient";

declare global {
    interface Window {
        ethereum: any;
    }
}
export const agent: EthClient = new EthClient(window.ethereum);
