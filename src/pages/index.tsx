/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Carousel } from "@mantine/carousel";
import Head from "next/head";
import NextImage from "next/future/image";
import Topview from "../components/Topview";

import Footer from "../components/Footer";
import { Box, Modal } from "@mantine/core";
import { useScrollIntoView, useToggle } from "@mantine/hooks";
import P1_Slider from "../components/P1_Slider";
import { useEffect, useState } from "react";
import { MediaLib } from "../types/types";
// import { AlertComp, BigDialog, BigDialog2, ConfirmComp } from "../components/commonComponents/alertComp";
import topImageJSON from "../data/works.json";

const worksPaths = [
	"/img/works/image1.jpg",
	"/img/image2.jpg",
	// ... その他の画像パス
];
const worksImgPath = "/img/works/";

export default function Home() {
	//
	const [topImageData, setTopImageData] = useState<MediaLib[]>();
	const { scrollIntoView, targetRef: contactRef } = useScrollIntoView<HTMLDivElement>({
		offset: 60,
	});
	const [worksPaths, setWorksPaths] = useState<string[]>([]);

	const [imagesArr, setImagesArr] = useState<MediaLib[]>([]);

	useEffect(() => {
		const worksData = topImageJSON.map((d) => {
			return { ...d, src: `${worksImgPath}${d.id}.jpg` };
		});

		setTopImageData(worksData);
	}, []);

	return (
		<div>
			<Head>
				<title>ヨガ専門webサイト・チラシ制作 || これからスタジオを始めるインストラクターさんへ集客のお手伝い</title>
				<meta name="viewport" content="width=device-width,initial-scale=1.0" />
				<meta
					name="description"
					content="これからスタジオを始めるインストラクターさんのためのヨガ専門webサイト・チラシ制作サービスです。月々4980円、初回29,980円で効果の高い集客施策をご提供"
				/>
				<meta property="og:url" content="https://pick-yoga.com" />
				<meta property="og:title" content="ヨガ専門webサイト・チラシ制作 || これからスタジオを始めるインストラクターさんへ集客のお手伝い" />
				<meta property="og:site_name" content="ヨガ専門webサイト・チラシ制作 " />
				<meta
					property="og:description"
					content="これからスタジオを始めるインストラクターさんのためのヨガ専門webサイト・チラシ制作サービスです。月々4980円、初回29,980円で効果の高い集客施策をご提供"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://pick-yoga.com/img/ogpImage.png" />
				<meta name="twitter:card" content="summary_large_image" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Box component="main" fz="1rem">
				{/* <P1_Slider images={topImageData} /> */}
				<Carousel loop mx="auto" withIndicators w="100%" height="100vh" mah="50em" sx={{ overflow: "hidden" }}>
					{topImageData.map((image, index) => (
						<Carousel.Slide>
							<Box
								component={NextImage}
								src={image.src}
								alt="Picture of the author"
								w="100%"
								h="100%"
								mah="50em"
								width={image.width}
								height={image.height}
								sx={{ objectFit: "cover" }}
							/>
						</Carousel.Slide>
					))}
				</Carousel>

				{/* <Topview scrollIntoView={scrollIntoView} contactRef={contactRef} /> */}

				<Footer />
			</Box>
		</div>
	);
}
