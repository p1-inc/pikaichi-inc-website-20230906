/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import Head from "next/head";

import BackgoundIllustration from "../components/BackgoundIllustration";
import Topview from "../components/Topview";
import Price from "../components/Price";
import Sample from "../components/Sample";
import WhatIs from "../components/WhatIs";
import Workflow from "../components/Workflow";
import Message2 from "../components/Message2";
import Question from "../components/Question";
import Quickstart from "../components/Quickstart";

import Footer from "../components/Footer";
import Contact from "../components/Contact";
import { Box, Modal } from "@mantine/core";
import { SlideFlyerSample } from "../components/Slide/SlideFlyerSample";
import { useScrollIntoView, useToggle } from "@mantine/hooks";
// import { AlertComp, BigDialog, BigDialog2, ConfirmComp } from "../components/commonComponents/alertComp";

export default function Home() {
	//

	const { scrollIntoView, targetRef: contactRef } = useScrollIntoView<HTMLDivElement>({
		offset: 60,
	});

	const rootSize = css`
        font-size: 1rem;
    `;

	const [openFlyerSample, toggleOpenFlyerSample] = useToggle([false, true]);

	return (
		<div>
			<Head>
				<title>ヨガ専門webサイト・チラシ制作 || これからスタジオを始めるインストラクターさんへ集客のお手伝い</title>
				<meta name="viewport" content="width=device-width,initial-scale=1.0" />
				<meta
					name="description"
					content="これからスタジオを始めるインストラクターさんのためのヨガ専門webサイト・チラシ制作サービスです。月々4980円、初回19980円で効果の高い集客施策をご提供"
				/>
				<meta property="og:url" content="https://pick-yoga.com" />
				<meta property="og:title" content="ヨガ専門webサイト・チラシ制作 || これからスタジオを始めるインストラクターさんへ集客のお手伝い" />
				<meta property="og:site_name" content="ヨガ専門webサイト・チラシ制作 " />
				<meta
					property="og:description"
					content="これからスタジオを始めるインストラクターさんのためのヨガ専門webサイト・チラシ制作サービスです。月々4980円、初回19980円で効果の高い集客施策をご提供"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://pick-yoga.com/img/ogpImage.png" />
				<meta name="twitter:card" content="summary_large_image" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main css={rootSize}>
				<BackgoundIllustration>
					<Topview scrollIntoView={scrollIntoView} contactRef={contactRef} />
					<Price />
					<Sample toggleOpenFlyerSample={toggleOpenFlyerSample} />
					<WhatIs />
					<Workflow />
					<Message2 />
					<Question />
					<Quickstart toggleOpenFlyerSample={toggleOpenFlyerSample} />

					<Box ref={contactRef}>
						<Contact />
					</Box>
					<Footer />
				</BackgoundIllustration>
				<Modal
					size="xl"
					opened={openFlyerSample}
					onClose={() => {
						toggleOpenFlyerSample();
					}}
					zIndex={99999999}
					title="クリックして裏返す"
					styles={{ title: { color: "#FFF" }, content: { borderRadius: 0 }, body: { backgroundColor: "#222" }, header: { backgroundColor: "#222" } }}
				>
					<SlideFlyerSample setWinOpen={openFlyerSample} />
				</Modal>
			</main>
			<AlertComp />
			<ConfirmComp />
		</div>
	);
}
