/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";

import { useState, useEffect, useRef, useLayoutEffect, Dispatch, SetStateAction } from "react";

// import P1Button from "../layoutComp/P1Button";

import { mqN, mqTitle, f, c, bp, bpMin } from "../../styles/eStyle";
import { Box, Button, CSSObject, Flex } from "@mantine/core";
import { ExButton } from "../UILib/extendMantine";
import { useElementSize } from "@mantine/hooks";
import { SlideListType } from "../QuickStartSlide";

type slideProps = {
	children: React.ReactNode;
	index: number;
	displayPage: number;
	slideList: SlideListType[];
	setSlideList: Dispatch<SetStateAction<SlideListType[]>>;
};

export const SlideBase = ({ children, index, displayPage, slideList, setSlideList }: slideProps) => {
	//
	const { ref, width, height } = useElementSize();
	// const [contentHeight, setContentHeight] = useState<number>();
	useEffect(() => {
		const list = [...slideList];
		list[index].height = height;
		setSlideList(list);
	}, [ref.current, height]);

	const slideWrapper: CSSObject = {
		label: "slideWrapper",
		position: "absolute",
		width: "100%",
		// left: `${index * 100}%`,
		left: `${Number(index) * 100 - Number(displayPage) * 100}%`,
		// transform: "translate(-50%, 0%)",
		transition: "left 0.5s",
		overflow: "hidden",
	};

	const innner: CSSObject = {
		// maxWidth: "50em",
		// height: "90%",
		// margin: "0 auto",
		// marginTop: "1em",
		// display: "inline-block",
		// width: "90vw",
		// padding: "5vw",
		// border: "5px solid ${color}",
		// borderRadius: "2em",
		// backgroundColor: "#fff",
		// overflow: "auto",

		h2: {
			fontSize: "1.5em",
			textAlign: "left",
			marginBottom: "2em",
			color: "#475854",
			// ${bp.sp} {
			//     font-size: 1.2em;
			// }
		},
		p: {
			fontSize: "1em",
			textAlign: "left",
			whiteSpace: "pre-line",
			color: "#475854",
			// ${bp.sp} {
			//     font-size: 0.9em;
			// }
		},
	};

	const btnWrapper: CSSObject = {
		marginTop: "2em",
		display: "flex",
		justifyContent: "flex-end",
	};

	// 	const closeBtn = css`
	//         position: absolute;
	//         top: 2em;
	//         right: 1em;
	//         width: 1.5em;
	//         height: 1.5em;
	//         background-color: #fff;
	//         border: 2px solid #888;
	//         border-radius: 0.5em;
	//
	//         &:hover {
	//             opacity: 0.5;
	//         }
	//
	//         &::before {
	//             content: "";
	//             position: absolute;
	//             top: 50%;
	//             left: 50%;
	//             width: 2px;
	//             height: 1.2em;
	//             background: #888;
	//             transform: translate(-50%, -50%) rotate(45deg);
	//         }
	//
	//         &::after {
	//             content: "";
	//             position: absolute;
	//             top: 50%;
	//             left: 50%;
	//             width: 2px;
	//             height: 1.2em;
	//             background: #888;
	//             transform: translate(-50%, -50%) rotate(-45deg);
	//         }
	//     `;

	return (
		<Box h={height} sx={slideWrapper}>
			<Box ref={ref}>
				{/* <Box
				sx={closeBtn}
				onClick={() => {
					setWinOpen(false);
				}}
			/> */}
				<Box sx={innner}>{children}</Box>
			</Box>
		</Box>
	);
};
