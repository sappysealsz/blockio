import EthClient from "../../classes/EthClient/EthClient";
import "../../../scss/balance.scss";
declare global {
    interface Window {
        ethereum: any;
    }
}
const displayNotice = (notice: HTMLSpanElement, message: string) => {
    notice.style.display = message ? "block" : "none";
    notice.textContent = message;
};

const getBalance = async (inputVal: string, account: string) => {
    const agent: EthClient = new EthClient(window.ethereum, account);
    return await agent.balance(inputVal, 4);
};

const inputEvent = (
    input: HTMLInputElement,
    btn: HTMLButtonElement,
    notice: HTMLSpanElement
) => {
    input.addEventListener("input", () => {
        const wAddressRegex = /^0x/;

        if (wAddressRegex.test(input.value.trim())) {
            btn.disabled = false;
            displayNotice(notice, "");
        } else {
            btn.disabled = true;
            displayNotice(notice, "Ensure the wallet address is valid");
        }
    });
};

const btnEvent = (
    btn: HTMLButtonElement,
    input: HTMLInputElement,
    notice: HTMLSpanElement
) => {
    btn.addEventListener("click", async () => {
        const inputVal: string = input.value.trim();

        try {
            const account: string = (
                await window.ethereum.request({
                    method: "eth_requestAccounts",
                })
            )[0];
            const balance: number = await getBalance(inputVal, account);
            displayNotice(
                notice,
                `${balance} ${localStorage.getItem("blockioCurrency") || "ETH"}`
            );
        } catch (err) {
            displayNotice(
                notice,
                "An error occurred while getting the balance"
            );
        }
    });
};

const buildComponent = (): HTMLElement => {
    const formContainer: HTMLElement = document.createElement("section");
    formContainer.className = "balance-form-container";

    const formTitle: HTMLHeadingElement = document.createElement("h2");
    formTitle.textContent = "Balance Tracker";

    const formNotice: HTMLSpanElement = document.createElement("span");
    formNotice.className = "balance-form-notice";
    formNotice.style.display = "none";

    const form: HTMLFormElement = document.createElement("form");
    const fieldSet: HTMLFieldSetElement = document.createElement("fieldset");

    const wAddressInput: HTMLInputElement = document.createElement("input");
    wAddressInput.type = "text";
    wAddressInput.placeholder = "Enter a wallet address";
    wAddressInput.className = "address-input";

    const submitBtn: HTMLButtonElement = document.createElement("button");
    submitBtn.textContent = "Check";
    submitBtn.disabled = true;

    inputEvent(wAddressInput, submitBtn, formNotice);
    btnEvent(submitBtn, wAddressInput, formNotice);

    fieldSet.appendChild(wAddressInput);
    form.appendChild(fieldSet);

    formContainer.append(formTitle, formNotice, form, submitBtn);
    return formContainer;
};

export { buildComponent };
