import Web3, { Transaction, TransactionReceipt } from "web3";
import { TransactionResponse } from "./types/transaction";
import { EtherUnit } from "./types/unit";
import { Chain } from "./types/chain";
import { Network } from "./types/network";

class EthClient extends Web3 {
    private readonly ETHER: EtherUnit = "ether";

    constructor(web3Provider: Object) {
        super(web3Provider);
    }

    async balance(address: string, decimals: number): Promise<number> {
        return +Number(
            this.utils.fromWei(await this.eth.getBalance(address), this.ETHER)
        ).toFixed(decimals);
    }

    async block(): Promise<number> {
        return Number(await this.eth.getBlockNumber());
    }

    async send(to: string, value: number): Promise<TransactionResponse> {
        try {
            const transactionOpts: Transaction = {
                from: (await this.eth.requestAccounts())[0],
                to,
                value: this.utils.toWei(value, this.ETHER),
                gas: await this.eth.estimateGas({
                    to,
                }),
            };

            const res: TransactionReceipt =
                await this.eth.sendTransaction(transactionOpts);

            return {
                hash: this.utils.bytesToHex(res.transactionHash),
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

    async chainID(): Promise<number> {
        return Number(await this.eth.getChainId());
    }
}

export default EthClient;
