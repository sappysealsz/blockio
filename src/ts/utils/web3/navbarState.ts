import { agent } from "../../global/agent";
import { fetchLatestBlock } from "./fetchLatestBlock";

const connectEvent = (li: HTMLLIElement): void => {
    li.addEventListener("click", async (): Promise<void> => {
        await agent.eth.requestAccounts();
    });
};

const anchorHandler = (anchor: HTMLAnchorElement): void => {
    anchor.addEventListener("click", async (): Promise<void> => {
        const originalText: string = anchor.textContent!;

        try {
            const cBlockNum: number = await fetchLatestBlock();
            anchor.textContent = `Block: ${cBlockNum}`;

            resetAnchorText(anchor, originalText);
        } catch (err: any) {
            console.error("An error has occured while fetching current block");
        }
    });
};

const resetAnchorText = (
    anchor: HTMLAnchorElement,
    originalText: string
): void => {
    const RESET_TEXT_DELAY: number = 4000;
    setTimeout((): void => {
        anchor.textContent = originalText;
    }, RESET_TEXT_DELAY);
};

export const navbarState = async (
    ul: HTMLUListElement,
    accounts: Array<string>
): Promise<void> => {
    while (ul.firstChild) {
        ul.firstChild.remove();
    }
    const account: string | null = accounts[0] || null;
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
        a1.textContent = "What's the latest block?";

        li3.appendChild(a1);

        anchorHandler(a1);
        ul.append(li1, li2, li3);
    }
};
