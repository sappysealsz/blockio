import logoWhite from "./logoWhite.svg";
import EthClient from "../../classes/EthClient/EthClient";
import "../../../scss/navbar.scss";
import { Network } from "../../classes/EthClient/types/chains";

declare global {
    interface Window {
        ethereum: any;
    }
}

const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const connectEvent = (li: HTMLLIElement): void => {
    li.addEventListener("click", async (): Promise<void> => {
        await window.ethereum.request({
            method: "eth_requestAccounts",
        });
    });
};

// Self invoked IIFE to handle accountChange events
((): void => {
    if (typeof window.ethereum != "undefined") {
        window.ethereum.on("accountsChanged", async (): Promise<void> => {
            const header: HTMLElement | null = document.querySelector("header");
            if (header) {
                header.classList.add("fade-out");
                await delay(200);
                header.remove();
                await render();
            }
        });
    }
})();

// Store network for selected address in localStorage
const storeNetwork = async (account: string): Promise<void> => {
    async function getChainID(): Promise<number> {
        const chainID: number = await window.ethereum.request({
            method: "net_version",
        });
        return chainID;
    }

    const agent: EthClient = new EthClient(window.ethereum, account);
    const networkData: Network = await agent.network(await getChainID());

    localStorage.setItem("blockioNetwork", networkData.name);
    localStorage.setItem("blockioCurrency", networkData.currency);
};

const resetAnchorText = (
    anchor: HTMLAnchorElement,
    originalText: string
): void => {
    const RESET_TEXT_DELAY = 4000;
    setTimeout(() => {
        anchor.textContent = originalText;
    }, RESET_TEXT_DELAY);
};

const anchorHandler = (account: string, anchor: HTMLAnchorElement): void => {
    anchor.addEventListener("click", async () => {
        const originalText: string = anchor.textContent!;

        try {
            const cBlockNum: number = await fetchCurrentBlock(account);
            anchor.textContent = `Block: ${cBlockNum}`;

            resetAnchorText(anchor, originalText);
        } catch (err: any) {
            console.error("An error has occured while fetching current block");
        }
    });
};

const homeLogoEvent = (logo: HTMLImageElement): void => {
    logo.addEventListener("click", () => {
        window.location.reload();
    });
};

const fetchCurrentBlock = async (account: string): Promise<number> => {
    const agent: EthClient = new EthClient(window.ethereum, account);
    return await agent.block();
};

const buildComponent = async (): Promise<HTMLElement> => {
    const headerContainer: HTMLElement = document.createElement("header");
    headerContainer.classList.add("header", "fade-in");

    const logo: HTMLImageElement = document.createElement("img");
    logo.src = logoWhite;
    logo.alt = "Blockio Logo Image";
    logo.className = "logo";
    [logo.width, logo.height] = [300, 80];
    homeLogoEvent(logo);

    const navbar: HTMLElement = document.createElement("nav");
    const ul: HTMLUListElement = document.createElement("ul");

    if (typeof window.ethereum != "undefined") {
        const account: string | null = (
            await window.ethereum.request({
                method: "eth_accounts",
            })
        )[0];

        if (!account) {
            // Connect Button
            const li: HTMLLIElement = document.createElement("li");
            const a: HTMLAnchorElement = document.createElement("a");
            a.href = "#";
            a.textContent = "Connect";
            li.appendChild(a);

            connectEvent(li);
            ul.appendChild(li);
        } else {
            await storeNetwork(account);

            // Selected Address Element
            const li1: HTMLLIElement = document.createElement("li");
            li1.textContent = account;

            // Network Name Element
            const li2: HTMLLIElement = document.createElement("li");
            li2.textContent = localStorage.getItem("blockioNetwork");

            // Current Block Anchor
            const li3: HTMLLIElement = document.createElement("li");
            const a1: HTMLAnchorElement = document.createElement("a");
            a1.href = "#";
            a1.textContent = "What's the current block?";

            li3.appendChild(a1);

            anchorHandler(account, a1);
            ul.append(li1, li2, li3);
        }
    }

    navbar.append(ul);

    if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        )
    ) {
        const detailsEl: HTMLDetailsElement = document.createElement("details");
        const summaryEl: HTMLElement = document.createElement("summary");

        summaryEl.prepend(logo);
        detailsEl.append(summaryEl, navbar);

        headerContainer.append(detailsEl);
    } else {
        headerContainer.append(logo, navbar);
    }

    void headerContainer.offsetWidth;
    return headerContainer;
};

const render = async (): Promise<void> => {
    const header: HTMLElement = await buildComponent();
    document.body.prepend(header);
    setTimeout(() => header.classList.remove("fade-in"), 0);
};

export { render };
