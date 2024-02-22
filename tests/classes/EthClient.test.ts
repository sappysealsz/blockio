import { describe, test, expect, beforeEach } from "vitest";
import EthClient from "../../src/ts/classes/EthClient/EthClient";
import Ganache, { Provider } from "ganache";
import { TransactionResponse } from "../../src/ts/classes/EthClient/types/transaction";
import { Network } from "../../src/ts/classes/EthClient/types/network";

let ganache: Provider;
let accounts: Array<string>;
let testAgent: EthClient;

// Helper function
function weiToEther(wei: number): number {
    const ether = wei / 1e18;
    return ether;
}

describe("EthClient Class Methods", (): void => {
    // Init Ganache and EthClient
    beforeEach(async (): Promise<void> => {
        ganache = Ganache.provider();
        accounts = await ganache.request({
            method: "eth_accounts",
            params: [],
        });
        testAgent = new EthClient(ganache);
    });

    // .balance()
    test("Should return the same account balance as Ganache when .balance() is called", async (): Promise<void> => {
        const ganacheAcc1Balance: number = +weiToEther(
            Number(
                await ganache.send("eth_getBalance", [accounts[0], "latest"])
            )
        ).toFixed(5);
        const agentAcc1Balance: number = await testAgent.balance(
            accounts[0],
            5
        );

        expect(agentAcc1Balance).toEqual(ganacheAcc1Balance);
    });

    // .block()
    test("Should return the same block number as Ganache when .block() is called", async (): Promise<void> => {
        const ganacheBlock: number = Number(
            await ganache.send("eth_blockNumber")
        );
        const agentBlock: number = await testAgent.block();

        expect(agentBlock).toEqual(ganacheBlock);
    });

    // .send() - fail case
    test("Should return a transaction response with a false status when .send() fails", async (): Promise<void> => {
        const result: TransactionResponse = await testAgent.send(
            accounts[1],
            999999999
        );

        expect(result.status).toBeFalsy();
    });

    // .send() - success case
    test("Should return a transaction response with a true status when .send() succeeds", async (): Promise<void> => {
        const result: TransactionResponse = await testAgent.send(
            accounts[1],
            1,
            false
        );

        expect(result.hash).toBeDefined();
        expect(result.status).toBeTruthy();
    });

    // .send() - validate transaction
    test("Should correctly transfer 7 ETH from Account[0] to Account[1] when .send() succeeds", async (): Promise<void> => {
        const Acc1BalanceBefore: number = +weiToEther(
            Number(
                await ganache.send("eth_getBalance", [accounts[0], "latest"])
            )
        ).toFixed(5);
        const Acc2BalanceBefore: number = +weiToEther(
            Number(
                await ganache.send("eth_getBalance", [accounts[1], "latest"])
            )
        ).toFixed(5);

        await testAgent.send(accounts[1], 7, false);

        const Acc1BalanceAfter: number = +weiToEther(
            Number(
                await ganache.send("eth_getBalance", [accounts[0], "latest"])
            )
        ).toFixed(5);
        const Acc2BalanceAfter: number = +weiToEther(
            Number(
                await ganache.send("eth_getBalance", [accounts[1], "latest"])
            )
        ).toFixed(5);

        expect(Acc1BalanceAfter).toBeLessThanOrEqual(Acc1BalanceBefore - 7);
        expect(Acc2BalanceAfter).toEqual(Acc2BalanceBefore + 7);
    });

    // .network() - Avalanche case
    test("Should return a valid network object for Avalanche network when .network() is called with the Avalanche chain ID", async (): Promise<void> => {
        const network: Network = await testAgent.network(43114);

        expect(network.name).toEqual("Avalanche C-Chain");
        expect(network.currency).toEqual("AVAX");
    });

    // .network() - Invalid case
    test("Should return an unknown network object when .network() is called with an invalid network ID", async (): Promise<void> => {
        const network: Network = await testAgent.network(9999999);

        expect(network.name).toEqual("Unknown");
        expect(network.currency).toEqual("ETH");
    });

    // .chainID()
    test("Should return same chain ID as Ganache", async (): Promise<void> => {
        const agentChainID: number = await testAgent.chainID();
        const ganacheChainID: number = Number(
            await ganache.send("eth_chainId")
        );

        expect(agentChainID).toEqual(ganacheChainID);
    });
});
