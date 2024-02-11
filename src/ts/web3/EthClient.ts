import Web3 from "web3";
import { TransactionResponse } from "./types/transaction";
import { EtherUnit } from "./types/unit";

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
}

export default EthClient;
