import { useRouter } from "next/router";

import { useState, useEffect, useRef, MutableRefObject } from "react";
import Image from "next/future/image";
import { getAllPostData, getDeployData, getfilteredPostDataByCanPublic } from "../../firebase/firebase";

import { cArr, f } from "../../styles/eStyle";

import { CategoryType, GeneralControlType, MediaLib, MenuType, PostDataType, ShopInfoType } from "../../types/types";
import { NoImageSVG } from "../../svg/noImageSVG";

import { Box, UnstyledButton, Button, Anchor, Text, CSSObject, Flex } from "@mantine/core";
import { useResizeObserver } from "@mantine/hooks";
import { CategoryUI, UpdatedAtUI } from "../../components/UILib/UIset";
import { ImageSVG } from "../../svg/imageSVG";

type PostsType = {
	categoryList: CategoryType[];
	shopInfoData: ShopInfoType[];
	menuList: MenuType[];
	generalData: GeneralControlType;
	postData: PostDataType[];
	logoImg: MediaLib;
	mediaLib: MediaLib[];
};
export default function PostIndex({ categoryList, shopInfoData, menuList, generalData, postData, logoImg, mediaLib: mLib }: PostsType) {
	//
	const [rootRef, rootRect] = useResizeObserver();

	const router = useRouter();

	const [overCell, setOverCell] = useState<number[]>([]); //postDataを並べ行の途中で終わった時、足らないセル分の配列
	const [cellRowNum, setCellRowNum] = useState<number>(1); //横並びの数

	const [cellWidth, setCellWidth] = useState<number>(10);

	const widthRatio = 0.9; //横幅の%
	const maxWidthRatio = 1200; //最大幅px

	const gapWidth = 2; //隙間の幅(em)
	const imgAspectRatio = 3 / 2; //画像の縦横比

	const cellRowNumList: number[][] = [
		//横並びの数をリスト化
		//[最小幅、最大幅、セルの数]
		[0, 599, 1],
		[600, 899, 2],
		[900, 9999, 3],
	];

	const [nPostData, setNPostData] = useState<PostDataType[]>([]);

	useEffect(() => {
		const sort = postData.sort((a, b) => {
			const aData = a.updatedAt.replace(/-/g, "");
			const bData = b.updatedAt.replace(/-/g, "");
			return Number(bData) - Number(aData);
		});
		console.log("sort : ", sort);
		setNPostData(sort);
	}, [postData]);

	useEffect(() => {
		const nCellWidth = (rootRect.width * widthRatio - gapWidth * 16 * (cellRowNum - 1)) / cellRowNum;
		setCellWidth(nCellWidth);
	}, [rootRect]);

	useEffect(() => {
		//横並びの数
		const _cellRowNum = cellRowNumList.find((d) => {
			const isRange = d[0] <= rootRect.width && rootRect.width < d[1];
			if (isRange) {
				return true;
			} else {
				return false;
			}
		})?.[2];

		setCellRowNum(_cellRowNum);

		const _overCell = _cellRowNum - (postData.length % _cellRowNum);

		if (!_overCell) {
			return;
		}
		const _overCell2 = Array.from(Array(_overCell)).map((d, index) => index);

		setOverCell(_overCell2);
	}, [rootRect, postData]);

	const mainContainer = {
		label: "mainContainer",
		marginTop: "2em",
	};

	const header = {
		label: "header",
		display: "flex",
		justifyContent: "flex-end",
	};

	const h2: CSSObject = {
		label: "h2",
		fontSize: "2em",
		textAlign: "center",
		fontFamily: f.fontfamily_en_01,
		fontWeight: 400,
		fontStyle: "normal",
		marginTop: "3em",
	};

	const postWrapper: CSSObject = {
		label: "postWrapper",
		width: "100%",
		maxWidth: maxWidthRatio,
		margin: "0 auto",
		marginTop: "3em",
	};

	const cellWrapper: CSSObject = {
		label: "cellWrapper",
		width: `${cellWidth}px`,
		marginBottom: "2em",
	};

	const cellImgStyle: CSSObject = {
		label: "cellImgStyle",
		width: "100%",
		objectFit: "cover",
	};

	const belowBlock: CSSObject = {
		label: "belowBlock",
		marginTop: "1em",
		marginBottom: "2em",
	};

	const titleStyle: CSSObject = {
		label: "titleStyle",
		fontSize: "1em",
		marginTop: "0.2em",
		cursor: "pointer",
		transition: "opacity 0.3s",
		"&:hover": {
			opacity: "0.7",
			transition: "all 0.1s",
		},
	};

	const handleLinkTo = (id: string) => {
		router.push(`/posts/${id}`);
	};

	const getCategoryName = (id: string) => {
		//
		let result: {
			name: string;
			color: string;
		};

		if (id) {
			const res = categoryList.find((cate) => cate.id === id);
			result = { name: res?.name, color: res?.color };
		} else {
			result = { name: "", color: "" };
		}
		return result;
	};

	return (
		<Box sx={mainContainer}>
			<Box sx={header}>
				<Button
					mr="3%"
					variant="outline"
					onClick={() => {
						router.push("/");
					}}
				>
					&lt;&lt; GO TO HOME
				</Button>
			</Box>
			<Text component="h2" sx={h2}>
				Articles
			</Text>
			<Flex justify="center" align="flex-start" wrap="wrap" sx={postWrapper} gap="2em" ref={rootRef}>
				{nPostData.map((post, index) => {
					const _body = post.body.blocks.map((block: any) => block.data.text).join("");
					const body = _body.replace(/<br>/g, "");

					return (
						<Box
							key={post.id}
							sx={{
								width: cellWidth,
								marginBottom: "2em",

								"&:hover": {
									opacity: "0.7",
									transition: "all 0.1s",
								},
							}}
						>
							<UnstyledButton
								sx={titleStyle}
								onClick={() => {
									handleLinkTo(post.id);
								}}
							>
								<Box component="li" sx={{ width: cellWidth, aspectRatio: "3 / 2", overflow: "hidden" }}>
									{post.srcHigh === "" ? (
										<Flex direction="column" justify="center" align="center" w="100%" h="100%" sx={{ aspectRatio: "3/2", backgroundColor: cArr.skyblue[2] }}>
											<ImageSVG color="#FFF" width="5em" height="5em" />
											<Text color="#FFF">No Image</Text>
										</Flex>
									) : (
										<Box component={Image} sx={cellImgStyle} src={post.srcHigh} alt={post.title} width={cellWidth} height={cellWidth / imgAspectRatio} />
									)}
								</Box>
							</UnstyledButton>

							<Box sx={belowBlock}>
								{post.category && <CategoryUI category={getCategoryName(post.category)} />}
								<UnstyledButton
									sx={titleStyle}
									onClick={() => {
										handleLinkTo(post.id);
									}}
								>
									{post.title}
								</UnstyledButton>
								<UpdatedAtUI updatedAt={post.date} />
								<Text component="p" lineClamp={2} fz="0.8em" mt="1em">
									{body}
								</Text>
							</Box>
						</Box>
					);
				})}

				{overCell.map((post, index) => {
					return (
						<Box
							component="li"
							sx={{
								...cellWrapper,
								marginRight: `${(index + 1) % cellRowNum === 0 ? 0 : gapWidth}em`,
								height: `${cellWidth / imgAspectRatio}px`,
								color: cArr.skyblue[5],
								fontSize: "0.7em",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
							key={`${post}${index}`}
						>
							{index === 0 ? "以上で記事は全てです" : ""}
						</Box>
					);
				})}
			</Flex>
		</Box>
	);
}

export async function getStaticProps() {
	//
	const { categoryList, shopInfoData, photoGallery: _photoGallery, menuList, generalData, mediaLib: _mediaLib } = await getDeployData();

	const generalDataAsParse: GeneralControlType = JSON.parse(generalData || "null");

	const mediaLib: MediaLib[] = JSON.parse(_mediaLib || "null");
	const logoImg = mediaLib.find((d: MediaLib) => d.id === generalDataAsParse.logoImg);

	const _postData = await getfilteredPostDataByCanPublic();

	const postData: PostDataType[] = _postData.map((d) => {
		const mediaProp = mediaLib.find((d2) => d2.id === d.mainImage);
		return { ...d, src: mediaProp?.src || "", srcHigh: mediaProp?.srcHigh || "" };
	});

	const props = {
		categoryList: JSON.parse(categoryList || "null"),
		shopInfoData: JSON.parse(shopInfoData || "null"),
		menuList: JSON.parse(menuList || "null"),
		generalData: JSON.parse(generalData || "null"),
		postData: postData,
		logoImg: logoImg || null,
		mediaLib: JSON.parse(JSON.stringify(mediaLib)),
	};

	return {
		props: props,
	};
}
