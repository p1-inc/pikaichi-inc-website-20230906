import React, { useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import { GTM_ID, pageview } from "../util/gtm";
import { RecoilRoot } from "recoil";

import { MantineProvider } from "@mantine/core";
import { globalStyle } from "../styles/globals";
import { c, f } from "../styles/eStyle";
import { DialogProvider } from "../components/commonComponents/dialogProvider";

function MyApp({ Component, pageProps }: any) {
	const router = useRouter();

	useEffect(() => {
		router.events.on("routeChangeComplete", pageview);
		return () => {
			router.events.off("routeChangeComplete", pageview);
		};
	}, [router.events]);

	return (
		<>
			<Script
				id="gtag-base"
				strategy="afterInteractive"
				// rome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${GTM_ID}');
          `,
				}}
			/>

			<MantineProvider
				theme={{
					globalStyles: (theme) => globalStyle,

					black: c.mainBlack,
					fontFamily: f.fontfamily_jp_01,
				}}
				withNormalizeCSS
				withGlobalStyles
			>
				<RecoilRoot>
					<DialogProvider>
						<Component {...pageProps} />
					</DialogProvider>
				</RecoilRoot>
			</MantineProvider>
		</>
	);
}

export default MyApp;
