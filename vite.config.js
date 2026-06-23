import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/AG-Home/",
  root: "src",

  build: {
    outDir: "../dist",

    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/index.html"),
        home: resolve(__dirname, "src/home.html"),
        about: resolve(__dirname, "src/about.html"),
        contact: resolve(__dirname, "src/contact.html"),
        control: resolve(__dirname, "src/control.html"),
        privacy: resolve(__dirname, "src/privacy.html"),
        products: resolve(__dirname, "src/products.html")
      }
    }
  },

  publicDir: "../public",
  envDir: ".."
});