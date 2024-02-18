import fallback from "./fallback.svg";

const buildComponent = (
    mountOn: HTMLElement,
    size: number
): Record<string, Function> => {
    const fallbackEl: HTMLImageElement = document.createElement("img");
    fallbackEl.src = fallback;
    fallbackEl.alt = "Loading animation";
    [fallbackEl.width, fallbackEl.height] = [size, size];

    mountOn.appendChild(fallbackEl);

    return {
        remove: function () {
            mountOn.removeChild(fallbackEl);
        },
    };
};

export { buildComponent };
