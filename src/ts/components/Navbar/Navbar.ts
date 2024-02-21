import logoWhite from "./logoWhite.svg";
import "../../../scss/navbar.scss";
import { navbarState } from "../../utils/web3/navbarState";
import { storeNetwork } from "../../utils/web3/storeNetwork";
import { agent } from "../../global/agent";

const homeLogoEvent = (logo: HTMLImageElement): void => {
    logo.addEventListener("click", (): void => {
        window.location.replace(".");
    });
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

    if (typeof agent.provider != "undefined") {
        const accounts: Array<string> = await agent.eth.getAccounts();
        await storeNetwork();
        await navbarState(ul, accounts);

        agent.provider.on(
            "accountsChanged",
            async (accounts: Array<string>): Promise<void> => {
                await navbarState(ul, accounts);
            }
        );
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
};

export { render };
