import * as BalanceChecker from "../../components/BalanceChecker/BalanceChecker";
import * as TransactionSender from "../../components/TransactionSender/TransactionSender";
import * as Navbar from "../../components/Navbar/Navbar";
import "../../../scss/nowallet.scss";

const chainChangeEvent = () => {
    window.ethereum.on("chainChanged", () => {
        window.location.reload();
    });
};

const buildComponent = (root: HTMLElement): void => {
    if (typeof window.ethereum === "undefined") {
        const noWalletCont: HTMLDivElement = document.createElement("div");
        noWalletCont.className = "nowallet-container";

        const title: HTMLHeadElement = document.createElement("h1");
        title.textContent = "Hang tight!";
        title.className = "nowallet-title";

        const subTitle: HTMLHeadElement = document.createElement("h3");
        subTitle.textContent =
            "Before moving forward, make sure to install and set up a wallet extension in your browser.";
        subTitle.className = "nowallet-subtitle";

        const anchor: HTMLAnchorElement = document.createElement("a");
        anchor.className = "no-wallet-link";
        anchor.href = "https://metamask.io/download/";
        anchor.target = "_blank";
        anchor.textContent = "Download MetaMask";

        noWalletCont.append(title, subTitle, anchor);
        root.appendChild(noWalletCont);
        document.body.dataset.wallet = "disabled";
    } else {
        const balanceChecker: HTMLElement = BalanceChecker.buildComponent();
        const transactionSender: HTMLElement =
            TransactionSender.buildComponent();

        root.append(balanceChecker, transactionSender);
        chainChangeEvent();
    }
};

const render = async () => {
    await Navbar.render();
    const root: HTMLElement = document.querySelector("#app")!;
    buildComponent(root);
};

render();
