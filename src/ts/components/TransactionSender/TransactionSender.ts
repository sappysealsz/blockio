import EthClient from "../../classes/EthClient/EthClient";
import { TransactionResponse } from "../../classes/EthClient/types/transaction";
import * as Fallback from "../Fallback/Fallback";
import "../../../scss/transfer.scss";

declare global {
    interface Window {
        ethereum: any;
    }
}

const displayNotice = (notice: HTMLSpanElement, message: string) => {
    notice.style.display = message ? "block" : "none";
    notice.textContent = message;
};

const initTransaction = async (
    addressVal: string,
    account: string,
    amountVal: number
) => {
    const agent: EthClient = new EthClient(window.ethereum, account);
    return await agent.send(addressVal, amountVal);
};

const wInputEvent = (
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
    addressInput: HTMLInputElement,
    amountInput: HTMLInputElement,
    notice: HTMLSpanElement,
    title: HTMLHeadingElement
) => {
    btn.addEventListener("click", async () => {
        displayNotice(notice, "");
        const addressVal: string = addressInput.value.trim();
        const amountVal: number = +amountInput.value.trim();

        try {
            const account: string = (
                await window.ethereum.request({
                    method: "eth_requestAccounts",
                })
            )[0];

            const fallback = Fallback.buildComponent(title, 80);
            const txRes: TransactionResponse = await initTransaction(
                addressVal,
                account,
                amountVal
            );
            fallback.remove();

            if (txRes.status) {
                displayNotice(
                    notice,
                    `Transaction has been processed.\nTransaction Hash: ${txRes.hash}`
                );
            } else {
                handleTransactionError(notice, txRes.error!.code);
            }
        } catch (err) {
            displayNotice(
                notice,
                "An error occurred while initiating the transaction"
            );
        }
    });
};

const handleTransactionError = (notice: HTMLSpanElement, errorCode: number) => {
    switch (errorCode) {
        case 4001:
            displayNotice(
                notice,
                "Transaction Rejected: The user declined the transaction."
            );
            break;
        case 4900:
        case 4901:
            displayNotice(
                notice,
                "Wallet Disconnected: Please reconnect your wallet and try again."
            );
            break;
        default:
            displayNotice(
                notice,
                "Transaction Error: Unable to process the transaction.\nPlease check the amount or recipient address and try again."
            );
            break;
    }
};

const buildComponent = (): HTMLElement => {
    const formContainer: HTMLElement = document.createElement("section");
    formContainer.className = "transaction-form-container";

    const formTitle: HTMLHeadingElement = document.createElement("h2");
    formTitle.textContent = "Transfer Funds";

    const formNotice: HTMLSpanElement = document.createElement("span");
    formNotice.className = "transaction-form-notice";
    formNotice.style.display = "none";

    const form: HTMLFormElement = document.createElement("form");
    const fieldSet: HTMLFieldSetElement = document.createElement("fieldset");

    const wAddressInput: HTMLInputElement = document.createElement("input");
    wAddressInput.type = "text";
    wAddressInput.placeholder = "Enter recipient wallet address";
    wAddressInput.className = "toaddress-input";

    const amountInput: HTMLInputElement = document.createElement("input");
    amountInput.type = "number";
    amountInput.placeholder = "Amount in ETH";
    amountInput.className = "amount-input";

    const submitBtn: HTMLButtonElement = document.createElement("button");
    submitBtn.textContent = "Send";
    submitBtn.disabled = true;

    wInputEvent(wAddressInput, submitBtn, formNotice);
    btnEvent(submitBtn, wAddressInput, amountInput, formNotice, formTitle);

    fieldSet.append(wAddressInput, amountInput);
    form.appendChild(fieldSet);

    formContainer.append(formTitle, formNotice, form, submitBtn);
    return formContainer;
};

export { buildComponent };
