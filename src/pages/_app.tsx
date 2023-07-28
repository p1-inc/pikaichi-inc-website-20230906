import React, { useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/router";

import { RecoilRoot } from "recoil";

import { MantineProvider } from "@mantine/core";
import { globalStyle } from "../styles/globals";
import { c, f } from "../styles/eStyle";
import { DialogProvider } from "../components/commonComponents/dialogProvider";

function MyApp({ Component, pageProps }: any) {
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
				<DialogProvider>
					<Component {...pageProps} />
				</DialogProvider>
			</RecoilRoot>
		</MantineProvider>
	);
}

export default MyApp;
