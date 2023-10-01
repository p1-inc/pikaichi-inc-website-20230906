import React, { useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
// import { GTM_ID, pageview } from "../util/gtm";
import { RecoilRoot } from "recoil";

import { MantineProvider } from "@mantine/core";
import { globalStyle } from "../styles/globals";
import { c, f } from "../styles/eStyle";
import { DialogProvider } from "../components/commonComponents/dialogProvider";
import GoogleTagManager, { GtmId } from "../util/googleTagManager";
import { gtmId } from "../util/gtm";

function MyApp({ Component, pageProps }: any) {
	const router = useRouter();

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
			<GoogleTagManager gtmId={gtmId as GtmId} />
			<RecoilRoot>
				<DialogProvider>
					<Component {...pageProps} />
				</DialogProvider>
			</RecoilRoot>
		</MantineProvider>
	);
}

export default MyApp;
