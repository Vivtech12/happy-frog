import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import pagefind from "astro-pagefind";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// https://astro.build/config
export default defineConfig({
	site: "https://happyfrog2011.co.uk",
	integrations: [icon(), sitemap(), pagefind()],
	vite: {
		plugins: [tailwindcss()],
	},
	experimental: {
        fonts: [{
            provider: fontProviders.google(),
            name: "Poppins",
            cssVariable: "--font-poppins",
            weights:["100 900"]
        }]
    }
});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           

