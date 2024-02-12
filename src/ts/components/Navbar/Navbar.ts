import logoWhite from "./logoWhite.svg";
import EthClient from "../../classes/EthClient/EthClient";
declare global {
    interface Window {
        ethereum: any;
    }
}
const fetchCurrentBlock = async (account: string): Promise<number> => {
    const agent: EthClient = new EthClient(window.ethereum, account);
    return await agent.block();
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

const buildComponent = async (): Promise<HTMLElement> => {
    const headerContainer: HTMLElement = document.createElement("header");
    headerContainer.className = "header";

    const logo: HTMLImageElement = document.createElement("img");
    logo.src = logoWhite;
    logo.alt = "Blockio Logo Image";
    logo.className = "logo";
    [logo.width, logo.height] = [300, 80];

    const navbar: HTMLElement = document.createElement("nav");
    const ul: HTMLUListElement = document.createElement("ul");

    if (typeof window.ethereum != "undefined") {
        const account: string = (
            await window.ethereum.request({
                method: "eth_requestAccounts",
            })
        )[0];

        const li1: HTMLLIElement = document.createElement("li");
        li1.textContent = account;

        // Current Block Anchor
        const li2: HTMLLIElement = document.createElement("li");
        const a1: HTMLAnchorElement = document.createElement("a");
        a1.href = "#";
        a1.textContent = "What's the current block?";

        li2.appendChild(a1);

        anchorHandler(account, a1);
        ul.append(li1, li2);
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

    return headerContainer;
};

const render = async (): Promise<void> => {
    document.body.prepend(await buildComponent());
};

render();
