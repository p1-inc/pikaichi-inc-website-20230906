import fs from "fs";
import path from "path";
import sizeOf from "image-size";

import { Carousel } from "@mantine/carousel";
import { Transition } from "@mantine/core";
import Head from "next/head";
import NextImage from "next/future/image";
import Topview from "../components/Topview";

import Footer from "../components/Footer";
import { Box, Modal, createStyles, getStylesRef, rem, keyframes } from "@mantine/core";
import { useScrollIntoView, useToggle } from "@mantine/hooks";
import P1_Slider from "../components/P1_Slider";
import { useEffect, useState } from "react";
import { MediaLib } from "../types/types";

export const bounce = keyframes({
	"0%": {
		transform: "scale(1)",
	},
	"50%": {
		transform: "scale(1.5)",
	},
	"100%": {
		transform: "scale(1)",
	},
});

type wordImageDataType = {
	fileName: string;
	src: string;
	width: number;
	height: number;
};
export default function Home({ workImageData }: { workImageData: wordImageDataType[] }) {
	//
	const { scrollIntoView, targetRef: contactRef } = useScrollIntoView<HTMLDivElement>({
		offset: 60,
	});

	// const [imgSize, setImgSize] = useState(100);

	// 	useEffect(() => {
	// 		// インターバルを設定して5秒ごとにステートを変更
	// 		const interval = setInterval(() => {
	// 			setImgSize((prevWidth) => (prevWidth === 100 ? 150 : 100));
	// 		}, 5000);
	//
	// 		// コンポーネントのクリーンアップ時にインターバルをクリア
	// 		return () => clearInterval(interval);
	// 	}, []);

	const useStyles = createStyles((theme) => ({
		workImgAnimation: {
			animation: `${bounce} 10s ease-in-out infinite`,
		},
	}));

	const { classes } = useStyles();

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
					{workImageData.map((image, index) => (
						<Carousel.Slide key={image.fileName}>
							<Box className={classes.workImgAnimation}>
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
							</Box>
						</Carousel.Slide>
					))}
				</Carousel>

				{/* <Topview scrollIntoView={scrollIntoView} contactRef={contactRef} /> */}

				<Footer />
			</Box>
		</div>
	);
}

export async function getStaticProps() {
	const imgPath = ["public", "img", "works"];
	const imgDirectory = path.join(process.cwd(), ...imgPath);
	const imageFiles = fs.readdirSync(imgDirectory);

	const imagesWithSizes = imageFiles.map((file) => {
		const fullPath = path.join(imgDirectory, file);
		const dimensions = sizeOf(fullPath);

		return {
			fileName: file,
			src: `/${imgPath[1]}/${imgPath[2]}/${file}`,
			width: dimensions.width,
			height: dimensions.height,
		};
	});

	return {
		props: {
			workImageData: imagesWithSizes,
		},
	};
}
