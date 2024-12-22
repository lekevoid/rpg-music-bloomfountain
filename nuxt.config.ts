// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
	devtools: { enabled: true },

	runtimeConfig: {
		APP_USERNAME: process.env.APP_USERNAME,
		APP_PASSWORD: process.env.APP_PASSWORD,
		SUPABASE_URL: process.env.SUPABASE_URL,
		SUPABASE_KEY: process.env.SUPABASE_KEY,
		public: {
			ENVIRONMENT: process.env.NUXT_ENV,
		},
	},

	app: {
		head: {
			charset: "utf-16",
			viewport: "width=1024, initial-scale=1",
			title: "Bloomfountain",
			meta: [
				{ name: "description", content: "RPG music" },
				{ name: "robots", content: "noindex nofollow" },
			],
		},
	},

	modules: ["@kgierke/nuxt-basic-auth", "@vite-pwa/nuxt", "@vueuse/nuxt", "@nuxtjs/supabase", "@nuxt/ui", "@pinia/nuxt"],

	plugins: ["~/plugins/chronicle.js"],

	nitro: {
		serverAssets:
			process.env.NUXT_ENV === "development"
				? [
						{
							baseName: "music",
							dir: "../public/music",
						},
						{
							baseName: "images",
							dir: "../public/img",
						},
				  ]
				: [
						{
							baseName: "images",
							dir: "../public/img",
						},
				  ],
	},

	supabase: {
		url: process.env.SUPABASE_URL,
		key: process.env.SUPABASE_KEY,

		redirectOptions: {
			login: "/login",
			callback: "/admin",
		},
	},

	pwa: {
		manifest: {
			name: "Bloomfountain",
			short_name: "Bloomfountain",
			background_color: "#000000",
			theme_color: "#0088FF",
			display: "standalone",
			icons: [
				{
					src: "./icons/manifest-icon-64.maskable.png",
					sizes: "64x64",
					type: "image/png",
					purpose: "maskable",
				},
				{
					src: "./icons/apple-icon-180",
					sizes: "180x180",
					type: "image/png",
					purpose: "any",
				},
				{
					src: "./icons/manifest-icon-192.maskable.png",
					sizes: "192x192",
					type: "image/png",
					purpose: "any",
				},
				{
					src: "./icons/manifest-icon-192.maskable.png",
					sizes: "192x192",
					type: "image/png",
					purpose: "maskable",
				},
				{
					src: "./icons/manifest-icon-512.maskable.png",
					sizes: "512x512",
					type: "image/png",
					purpose: "any",
				},
				{
					src: "./icons/manifest-icon-512.maskable.png",
					sizes: "512x512",
					type: "image/png",
					purpose: "maskable",
				},
			],
		},
		registerWebManifestInRouteRules: true,
	},
});
