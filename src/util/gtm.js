export const GTM_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages

export const pageview = (url) => {
	if (typeof window !== "undefined") {
		window.gtag("config", GTM_ID, {
			page_path: url,
		});
	}
};
