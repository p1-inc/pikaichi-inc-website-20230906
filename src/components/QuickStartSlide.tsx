/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";

import { useState, useEffect, useRef, useLayoutEffect, Dispatch, SetStateAction } from "react";

import { mqN, mqTitle, f, c, bp } from "../styles/eStyle";

import { Slide1 } from "./Slide/Slide1";
import { Slide2 } from "./Slide/Slide2";
import { Slide3 } from "./Slide/Slide3";
import { Slide4 } from "./Slide/Slide4";
import { Slide5 } from "./Slide/Slide5";
import { Slide6 } from "./Slide/Slide6";
import { Slide7 } from "./Slide/Slide7";
import { Slide8 } from "./Slide/Slide8";
import { Affix, Box, CSSObject, Flex } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { SlideBase } from "./Slide/SlideBase";
import { ExButton } from "./UILib/extendMantine";

export type SlideListType = {
	Component: ({
		toggleOpenFlyerSample,
	}: {
		toggleOpenFlyerSample?: (value?: SetStateAction<boolean>) => void;
	}) => JSX.Element;
	color: string;
	height: number;
	isFlyerSample: boolean;
};

export const QuickStartSlide = ({ toggleOpenFlyerSample }: { toggleOpenFlyerSample: (value?: SetStateAction<boolean>) => void }) => {
	//

	const slideListInit: SlideListType[] = [
		{ Component: Slide1, color: "#e97ab1", height: 100, isFlyerSample: false },
		{ Component: Slide2, color: "#E36234", height: 100, isFlyerSample: false },
		{ Component: Slide3, color: "#ECA71C", height: 100, isFlyerSample: true },
		{ Component: Slide4, color: "#5EBC92", height: 100, isFlyerSample: false },
		{ Component: Slide5, color: "#83D193", height: 100, isFlyerSample: false },
		{ Component: Slide6, color: "#7ecef4", height: 100, isFlyerSample: false },
		{ Component: Slide7, color: "#3EAFBF", height: 100, isFlyerSample: false },
		{ Component: Slide8, color: "#1976d2", height: 100, isFlyerSample: false },
	];

	const [slideList, setSlideList] = useState<SlideListType[]>(slideListInit);

	// useEffect(() => {
	// 	console.log("slideList: ", slideList);
	// }, [slideList]);
	const [displayPage, setDisplayPage] = useState<number>(0);

	const container: CSSObject = {
		label: "container",
		position: "relative",
		top: "0",
		left: "0",
		width: "90%",
		margin: "0 auto",
		height: slideList[displayPage].height,
		zIndex: 1000,
		backgroundColor: "rgba(256, 256, 256, 0.9)",
		overflow: "hidden",
	};

	return (
		<Box my="2em" sx={container}>
			{slideList.map((list, index) => (
				<SlideBase key={`slide_${index}`} index={index} displayPage={displayPage} slideList={slideList} setSlideList={setSlideList}>
					{list.isFlyerSample ? <Slide3 toggleOpenFlyerSample={toggleOpenFlyerSample} /> : <list.Component />}
					<Flex mt="2em" justify="flex-end" gap="1em">
						<ExButton
							display={index === 0 ? "none" : "block"}
							w="10em"
							color={list.color}
							onClick={() => {
								setDisplayPage(displayPage - 1);
							}}
						>
							戻 る
						</ExButton>

						<ExButton
							display={index === slideListInit.length - 1 ? "none" : "block"}
							w="10em"
							color={list.color}
							onClick={() => {
								setDisplayPage(displayPage + 1);
							}}
						>
							次 へ
						</ExButton>
					</Flex>
				</SlideBase>
			))}

			{/* <Slide2 setContentSize={setContentSize} displayPage={displayPage} setDisplayPage={setDisplayPage} setWinOpen={setWinOpen} /> */}
			{/* <Slide3 setContentSize={setContentSize} displayPage={displayPage} setDisplayPage={setDisplayPage} setWinOpen={setWinOpen} /> */}
			{/* <Slide4 displayPage={displayPage} setDisplayPage={setDisplayPage} setWinOpen={setWinOpen} /> */}
			{/* <Slide5 displayPage={displayPage} setDisplayPage={setDisplayPage} setWinOpen={setWinOpen} /> */}
			{/* <Slide6 displayPage={displayPage} setDisplayPage={setDisplayPage} setWinOpen={setWinOpen} /> */}
			{/* <Slide7 displayPage={displayPage} setDisplayPage={setDisplayPage} setWinOpen={setWinOpen} /> */}
			{/* <Slide8 displayPage={displayPage} setDisplayPage={setDisplayPage} setWinOpen={setWinOpen} /> */}
		</Box>
	);
};
