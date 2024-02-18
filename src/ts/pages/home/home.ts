import * as BalanceChecker from "../../components/BalanceChecker/BalanceChecker";
import * as TransactionSender from "../../components/TransactionSender/TransactionSender";
import * as Navbar from "../../components/Navbar/Navbar";
import "../../../scss/nowallet.scss";
import { storeNetwork } from "../../utils/web3/storeNetwork";

const chainChangeEvent = (): void => {
    window.ethereum.on("chainChanged", async (): Promise<void> => {
        await storeNetwork();
        window.location.reload();
    });
};

const buildComponent = (root: HTMLElement): void => {
    if (typeof window.ethereum === "undefined") {
        const noWalletCont: HTMLDivElement = document.createElement("div");
        noWalletCont.className = "nowallet-container";

        const title: HTMLHeadElement = document.createElement("h1");
        title.textContent = "Hold on!";
        title.className = "nowallet-title";

        const subTitle: HTMLHeadElement = document.createElement("h2");
        subTitle.textContent =
            "Install and set up a browser wallet extension. Blockio recommends using MetaMask.";
        subTitle.className = "nowallet-subtitle";

        const anchor: HTMLAnchorElement = document.createElement("a");
        anchor.className = "no-wallet-link";
        anchor.href = "https://metamask.io/download/";
        anchor.target = "_blank";
        anchor.textContent = "Install MetaMask";

        noWalletCont.append(title, subTitle, anchor);
        root.appendChild(noWalletCont);
        document.body.dataset.wallet = "disabled";
    } else {
        const balanceChecker: HTMLElement = BalanceChecker.buildComponent();
        const transactionSender: HTMLElement =
            TransactionSender.buildComponent();

        root.append(balanceChecker, transactionSender);
    }
};

const render = async (): Promise<void> => {
    await Navbar.render();
    const root: HTMLElement = document.querySelector("#app")!;
    buildComponent(root);
};

render()
    .then(chainChangeEvent)
    .catch((error: any) =>
        console.error("An error occurred during rendering:", error)
    );
