import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Image from "next/future/image";

import { useState, useEffect } from "react";
// const EditorContainer = dynamic(() => import("../../components/admin/editorjs/editorContainer"), { ssr: false });
import { getDeployData, getfilteredPostDataByCanPublic } from "../../firebase/firebase";
import { CategoryType, FooterCompType, GeneralControlType, MediaLib, PostDataType } from "../../types/types";

import { c, cArr } from "../../styles/eStyle";

import Footer from "../../components/Footer";
import { Box, CSSObject, Flex, Space, Text } from "@mantine/core";

// import EditorJS from "@editorjs/editorjs";
import { CategoryUI, UpdatedAtUI } from "../../components/UILib/UIset";
import { P1_EditorContainer } from "../../components/admin/p1_Editor/p1_EditorContainer";
import { useSetBlocksState } from "../../components/admin/p1_Editor/hooks/useSetBlocksState";
import { BlockControlType } from "../../components/admin/p1_Editor/p1_EditorTypes";
import { ImageSVG } from "../../svg/imageSVG";

export const DisplayId = ({ id = "" }: { id: string }) => {
	return (
		<Text component="p" fz="0.5em">
			ID : {id.slice(0, 8)}
		</Text>
	);
};

type WrittenByType = {
	writer: {
		uid: string;
		displayName: string;
	};
};
export const WrittenBy = ({ writer }: WrittenByType) => {
	return (
		<Text component="p" fz="0.5em">
			Written by {writer?.displayName}
		</Text>
	);
};

type TagsType = {
	id: string;
	name: string;
};

export const Tags = ({ tags = [] }: { tags: TagsType[] }) => {
	return (
		<>
			{tags.map((tag) => (
				<Box
					key={tag.id}
					sx={{
						fontSize: "0.5em",
						padding: "0.3em 1em",
						backgroundColor: c.mainGray,
						color: "#fff",
						borderRadius: "9999px",
					}}
				>
					{tag.name}
				</Box>
			))}
		</>
	);
};

type PostType = {
	postData: PostDataType;
	categoryList: CategoryType[];
	footerData: FooterCompType;
	generalData: GeneralControlType;
	logoImg: MediaLib;
};
export default function Post({ postData: pData, categoryList, footerData, generalData, logoImg }: PostType) {
	//

	const {
		id,
		user,
		body, //メイン記事
		canPublic, //公開・非公開
		date,
		mainImage,
		src, //イメージのパス
		srcHigh, //イメージのパス
		pin, //ピン留め
		priority,
		relatedArticles,
		subCopy,
		category,
		tag,
		title,
		createdAt,
		updatedAt,
	} = pData;

	const api: BlockControlType = useSetBlocksState();

	useEffect(() => {
		api.handleSetBlockDataArr({ blockDataArr: body.blocks });
	}, []);

	const mainContainer = {
		label: "mainContainer",
		width: "80%",
		maxWidth: "40em",
		margin: "0 auto",
		marginTop: "2em",
	};

	const nav = {
		label: "nav",
		display: "flex",
		justifyContent: "center",
		color: c.mainBlack,
		fontSize: "1em",
		marginTop: "2em",
		gap: "1em",
	};

	const topImageWrapper: CSSObject = {
		label: "topImageWrapper",
		width: "100%",
		aspectRatio: "3/2",
		overflow: "hidden",
	};

	const topImage: CSSObject = {
		label: "topImage",
		width: "100%",
		height: "100%",
		objectFit: "cover",
		objectPosition: "50% 50%",
	};

	const titleStyle = {
		label: "titleStyle",
		fontSize: "1.8em",
		marginTop: "0.2em",
		color: c.mainBlack,
	};

	const menuListStyle = {
		label: "menuListStyle",
		fontSize: "0.8em",
		fontFamily: "Noto Sans JP, sans-serif",
		cursor: "pointer",
		transition: "opacity 0.5s",
		"&:hover": {
			opacity: "0.5",
			transition: "opacity 0.5s",
		},
	};

	const navList = [
		{ title: "HOME", href: "/" },
		{ title: "記事一覧へ", href: "/posts/postIndex" },
	];
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
			<Box component="ul" sx={nav}>
				{navList.map((nav, index) => (
					<Box
						component="li"
						key={`${nav.title}${index}`}
						sx={{
							...menuListStyle,
							marginRight: navList.length - 1 === index ? "0" : "1em",
						}}
					>
						<a href={nav.href}>{nav.title}</a>
					</Box>
				))}
			</Box>

			<Box mt="4em">
				<Box sx={topImageWrapper}>
					{srcHigh === "" ? (
						<Flex direction="column" justify="center" align="center" w="100%" h="100%" sx={{ aspectRatio: "3/2", backgroundColor: cArr.skyblue[2] }}>
							<ImageSVG color="#FFF" width="8em" height="8em" />
							<Text fz="1.2em" color="#FFF">
								No Image
							</Text>
						</Flex>
					) : (
						<Box component={Image} sx={topImage} src={srcHigh} alt={`${title}の記事メイン画像`} width="1200" height="400" />
					)}
				</Box>

				{category && (
					<Box mt="2em">
						<CategoryUI category={getCategoryName(category)} />
					</Box>
				)}

				{title && (
					<Text component="h1" sx={titleStyle}>
						{title}
					</Text>
				)}

				<Flex align="center" mt="0.5em" gap="1em">
					<DisplayId id={id} />
					<UpdatedAtUI updatedAt={date} />
					<Flex gap="0.2em">
						<Tags tags={tag} />
					</Flex>
				</Flex>

				{body && (
					<Box mt="5em">
						<P1_EditorContainer api={api} readOnly={true} maw="40em" />
					</Box>
				)}

				<Box>
					<WrittenBy writer={user} />
					<Box
						sx={{
							borderTop: `1px solid ${c.mainBlack}`,
							marginTop: "0.5em",
						}}
					/>

					<Flex gap="1em" align="center" mt="0.5em" />
				</Box>
			</Box>
			<Space h="5em" />
		</Box>
	);
}

export async function getStaticPaths() {
	//
	const postData = await getfilteredPostDataByCanPublic();

	const posts = postData.map((post) => ({ params: { pid: post.id } }));

	return {
		paths: posts,
		fallback: false,
	};
}

export async function getStaticProps({ params }: { params: { pid: string } }) {
	//

	const {
		layoutData,
		topImageData,
		topWordData,
		newsData,
		categoryList,
		tableData,
		campaignData,
		peopleData,
		shopInfoData,
		photoGallery: _photoGallery,
		footerData,
		menuList,
		generalData,
		allComplist,
		mediaLib: _mediaLib,
	} = await getDeployData();

	const generalDataAsParse: GeneralControlType = JSON.parse(generalData || "null");

	const mediaLib: MediaLib[] = JSON.parse(_mediaLib || "null");

	const _postData = await getfilteredPostDataByCanPublic();

	const _postData2: PostDataType[] = _postData.map((d) => {
		const mediaProp = mediaLib.find((d2) => d2.id === d.mainImage);
		return { ...d, src: mediaProp?.src || "", srcHigh: mediaProp?.srcHigh || "" };
	});
	const postData = _postData2.find((d) => d.id === params.pid);

	return {
		props: {
			postData: postData || null,
			categoryList: JSON.parse(categoryList || "null") as CategoryType[],
			footerData: JSON.parse(footerData || "null") as FooterCompType[],
			generalData: generalDataAsParse,
		},
	};
}
