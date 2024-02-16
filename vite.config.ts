import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import webfontDownload from "vite-plugin-webfont-dl";

export default defineConfig({
    plugins: [nodePolyfills(), webfontDownload()],
    base: "./",
    mode: "production",
});
