import React, { useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
// import { GTM_ID, pageview } from "../util/gtm";

import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from "recoil";
// import { globalStyle } from "../styles/globals";
import { Global } from "@emotion/react";

import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { globalStyle } from "../styles/globals";
import { c, f } from "../styles/eStyle";

function MyApp({ Component, pageProps }: any) {
	const router = useRouter();

	// useEffect(() => {
	//     router.events.on("routeChangeComplete", pageview);
	//     return () => {
	//         router.events.off("routeChangeComplete", pageview);
	//     };
	// }, [router.events]);

	return (
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
				<Component {...pageProps} />
			</RecoilRoot>
		</MantineProvider>
	);
}

export default MyApp;
