export const displayNotice = (
    notice: HTMLSpanElement,
    message: string
): void => {
    notice.style.display = message ? "block" : "none";
    notice.textContent = message;
};
