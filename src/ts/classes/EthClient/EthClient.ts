import Web3 from "web3";
import { TransactionResponse } from "./types/transaction";
import { EtherUnit } from "./types/unit";
import { Chain, Network } from "./types/chains";

class EthClient {
    private provider: Web3;
    private readonly account: string;
    private readonly ETHER: EtherUnit = "ether";

    constructor(web3Provider: Object, address: string) {
        this.provider = new Web3(web3Provider);
        this.account = address;
    }

    async balance(address: string, decimals: number): Promise<number> {
        return +Number(
            this.provider.utils.fromWei(
                await this.provider.eth.getBalance(address),
                this.ETHER
            )
        ).toFixed(decimals);
    }

    async block(): Promise<number> {
        return Number(await this.provider.eth.getBlockNumber());
    }

    async send(to: string, value: number): Promise<TransactionResponse> {
        try {
            const transactionOpts = {
                from: this.account,
                to,
                value: this.provider.utils.toWei(value, this.ETHER),
                gas: await this.provider.eth.estimateGas({
                    to,
                }),
            };

            const res =
                await this.provider.eth.sendTransaction(transactionOpts);

            return {
                hash: this.provider.utils.bytesToHex(res.transactionHash),
                status: true,
            };
        } catch (err: any) {
            return { error: err.innerError, status: false };
        }
    }

    async network(id: number): Promise<Network> {
        try {
            const chains: Chain[] = await (
                await fetch("https://chainid.network/chains.json")
            ).json();
            const networkData: Chain = chains.find(
                (chain: Chain) => chain.chainId == id
            )!;

            return {
                name: networkData.name,
                currency: networkData.nativeCurrency.symbol,
            };
        } catch (err: any) {
            console.error("Error fetching current network data");
            return {
                name: "Unknown",
                currency: "ETH",
            };
        }
    }
}

export default EthClient;
