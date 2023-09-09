import { useState, useEffect, CSSProperties } from "react";
import Image from "next/future/image";

// import { MediaLib, MediaLibInitObj } from "../../types/types";
import { Anchor, Box, Center, CSSObject, Flex, Modal, UnstyledButton } from "@mantine/core";
import { useRecoilValue } from "recoil";
import { WordImageDataType } from "../pages";
// import { isAdminState } from "../../recoil/atoms";

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
export const MediaLibInitObj: WordImageDataType = {
	id: "",
	fileName: "",
	title: "",
	stuff: {},
	src: "",
	width: 0,
	height: 0,
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   photoGalleryDataには、Imageタグに渡すsrcの値を配列で渡す
//
//   bpはbreakpoint
//   [全幅のpx,Boxの個数]を配列で記載
//   例
//    const bp = [
//        [1100, 5],
//        [800, 4],
//        [500, 3],
//        [200, 2],
//    ];
//
//   remainderBoxcolorはBOXを配置したときの余った部分をどういう色で塗り分けるか
//   例
//   const remainderBoxcolor = ["#545554","#FFF","#7B7B7B","#D92424","#e97ab1","#E36234","#ECA71C"];
//   配列の数はなるべく多めに、ここからランダムに使う
//
//   brはborderRadious
//   角丸の指定
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type pgType = {
	windowWidth: number;
	photoGalleryData: WordImageDataType[];
	bp: number[][];
	remainderBoxcolor: string[];
	br: string;
};

export default function PhotoGalleryComp({ windowWidth, photoGalleryData, bp, remainderBoxcolor, br }: pgType) {
	//

	const [numberOfBox, setNumberOfBox] = useState<number>(1); //全幅に対して箱が何個入るか

	const [photoArr, setPhotoArr] = useState<WordImageDataType[]>([]);

	const [slideImages, setSlideImages] = useState<WordImageDataType[]>([]);
	// const [openSlider, setOpenSlider] = useState<boolean>(false);
	const [modalData, setModalData] = useState<WordImageDataType>(null);

	const [sliderStartCount, setSliderStartCount] = useState<number>(0);

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

		const remainderArr = new Array<WordImageDataType>(remainder).fill(MediaLibInitObj).map((d, index) => {
			return { ...d, id: String(index) };
		}) as WordImageDataType[];

		const setData = [...photoGalleryData, ...remainderArr];
		setPhotoArr(setData);

		const slideImg: WordImageDataType[] = photoGalleryData.map((d) => ({
			...MediaLibInitObj,
			fileName: d.fileName,
			src: d.src,
		}));

		setSlideImages(slideImg);
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
					const href = item.fileName.replace(/(\.[^\.]+)$/, "");

					if (!item.src) {
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
							<Anchor
								href={`works/${href}`}
								sx={{ ...photoList, ...marginRight }}
								key={`${item.fileName}${index}`}
								// onClick={() => {
								// 	setModalData(item);
								// }}
							>
								<Image style={imgCoverStyle} src={item.src} width="1000" height="1000" alt="イメージ画像" />
							</Anchor>

							// <UnstyledButton
							// 	component="li"
							// 	sx={{ ...photoList, ...marginRight }}
							// 	key={`${item.fileName}${index}`}
							// 	onClick={() => {
							// 		setModalData(item);
							// 	}}
							// >
							// 	<Image style={imgCoverStyle} src={item.src} width="1000" height="1000" alt="イメージ画像" />
							// </UnstyledButton>
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
						src={modalData?.src}
						w="100%"
						h="fit-content"
						width={modalData?.width}
						height={modalData?.height}
						alt="イメージ画像"
					/>
					{modalData?.fileName}
				</Flex>
			</Modal>
		</>
	);
}
