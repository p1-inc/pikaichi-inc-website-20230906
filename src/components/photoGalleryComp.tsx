import { useState, useEffect, CSSProperties } from "react";
import Image from "next/future/image";

import { Anchor, Box, Center, CSSObject, Flex, Modal, UnstyledButton } from "@mantine/core";
import { useRecoilValue } from "recoil";
import { WorksDataType } from "../data/worksData";

export interface MediaLib {
	id: string;
	src: string;
	srcHigh: string;
	widthLow: number;
	heightLow: number;
	widthHigh: number;
	heightHigh: number;
	createdAt: string;
	updatedAt: string;
	contentTypeLow: string;
	contentTypeHigh: string;
	alt?: string;
	caption?: string;
	description?: string;
	tag?: string;
	// use: { [key: string]: string[] };
}
//TODO  型から初期化する方法::typeを定義すると同時に下記のように初期値を設置してexportしておく（型を一致させておく）
export const MediaLibInitObj: WorksDataType = {
	id: "",
	title: "",
	titleEn: "",
	stuff: [],
	srcPC: "",
	srcSP: "",
	widthPC: 0,
	widthSP: 0,
	heightPC: 0,
	heightSP: 0,
	filePathPC: "",
	filePathSP: "",
};

type pgType = {
	windowWidth: number;
	photoGalleryData: WorksDataType[];
	bp: number[][];
	remainderBoxcolor: string[];
	br: string;
};

export default function PhotoGalleryComp({ windowWidth, photoGalleryData, bp, remainderBoxcolor, br }: pgType) {
	//

	const [numberOfBox, setNumberOfBox] = useState<number>(1); //全幅に対して箱が何個入るか

	const [photoArr, setPhotoArr] = useState<WorksDataType[]>([]);

	const [modalData, setModalData] = useState<WorksDataType>(null);

	useEffect(() => {
		const nBreakPoint = bp.map((point, index, arr) => {
			const result = [...point];
			if (index === 0) {
				result.unshift(999999);
			} else {
				result.unshift(arr[index - 1][0]);
			}
			return result;
		});

		if (nBreakPoint[nBreakPoint.length - 1][1] !== 0) {
			nBreakPoint.push([nBreakPoint[nBreakPoint.length - 1][1], 0, 1]);
		}
		const nob = nBreakPoint.find((bp) => bp[0] > windowWidth && windowWidth >= bp[1]);

		if (nob) {
			setNumberOfBox(nob[2]);
		}
	}, [windowWidth, bp]);

	useEffect(() => {
		const _remainder = numberOfBox - (photoGalleryData.length % numberOfBox);
		const remainder = _remainder === numberOfBox ? 0 : _remainder;

		const remainderArr = new Array<WorksDataType>(remainder).fill(MediaLibInitObj).map((d, index) => {
			return { ...d, id: String(index) };
		}) as WorksDataType[];

		const setData = [...photoGalleryData, ...remainderArr];
		setPhotoArr(setData);
	}, [photoGalleryData, numberOfBox]);

	const photoList = {
		label: "photoList",
		listStyle: "none",
		width: `${((92 - 2 * numberOfBox) / (100 * numberOfBox)) * windowWidth - 4}px`,
		//ここの計算式(widthを全幅pxから割り出す。隙間をを全幅の2%として計算)
		height: `${((92 - 2 * numberOfBox) / (100 * numberOfBox)) * windowWidth - 4}px`,
		borderRadius: br,
		overflow: "hidden",
		marginTop: `${windowWidth * (2 / 100)}px`,
		marginRight: "2%",
		"&:hover": {
			opacity: "0.5",
			transition: "all 0.2s",
		},
	};

	const photoWrapper = {
		label: "photoWrapper",
		width: windowWidth,
		margin: "0 auto",
	};

	const slider: CSSObject = {
		label: "slider",
		height: "70vh",
	};

	const imgCoverStyle: CSSProperties = {
		width: "100%",
		height: "100%",
		objectFit: "cover",
	};

	return (
		<>
			<Flex wrap="wrap" justify="center" sx={photoWrapper}>
				{photoArr.map((item, index) => {
					let marginRight: CSSObject = {
						label: "marginRight",
					};

					if ((index + 1) % numberOfBox === 0) {
						// 1行の個数の倍数ごとにmargin-rightを0にする
						marginRight = {
							marginRight: "0%",
						};
					}
					// const href = item.filePathSP.replace(/(\.[^\.]+)$/, "");

					if (!item.srcSP) {
						const colorId = index % remainderBoxcolor.length;
						return (
							<Box sx={[photoList, marginRight]} key={`${item.id}${index}`}>
								<Box
									sx={{
										width: "1000px",
										height: "1000px",
										backgroundColor: remainderBoxcolor[colorId],
									}}
								/>
							</Box>
						);
					} else {
						return (
							<Anchor href={`works/${item.id}`} sx={{ ...photoList, ...marginRight }} key={`${item.filePathSP}${index}`}>
								<Image style={imgCoverStyle} src={item.srcSP} width="1000" height="1000" alt="イメージ画像" />
							</Anchor>
						);
					}
				})}
			</Flex>

			<Modal
				size="xl"
				opened={Boolean(modalData)}
				onClose={() => {
					setModalData(null);
				}}
			>
				<Flex direction="column" m="0 auto" align="center" w="90%" h="50em">
					<Box
						component={Image}
						sx={{ overflow: "hidden", objectFit: "contain" }}
						src={modalData?.srcSP}
						w="100%"
						h="fit-content"
						width={modalData?.widthSP}
						height={modalData?.heightSP}
						alt="イメージ画像"
					/>
					{modalData?.filePathSP}
				</Flex>
			</Modal>
		</>
	);
}
