import { useState, useEffect, useRef, ChangeEventHandler, ChangeEvent, MutableRefObject } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { authUserState } from "../../../recoil/atoms";

// import EditorJS, { OutputData } from "@editorjs/editorjs";

import dayjs from "dayjs";

import { EditPost_SubHeader } from "./editPost_SubHeader";
import { EditPost_Taglist } from "./editPost_Taglist";
import { AdminHeader } from "../adminHeader";

import ViewComfyIcon from "@mui/icons-material/ViewComfy";

import { CSSObject, Global } from "@emotion/react";

import { autoID } from "../../../util/autoID";

import { getAllPostCategory, setPostData, getAllPostTag, getPostDataAsId, deletePostAsIdArr, getMediaLib } from "../../../firebase/firebase";

import { PostDataType, TagType, CategoryType, MediaLib, GeneralControlType } from "../../../types/types";

import { ImageSelectTrigger } from "../imageSelectTrigger";

import { useDialogState } from "../../../hooks/useDialogState";
import { AdminSubHeader } from "../adminSubHeader";
import { Box, Button, Flex, TextInput, Tooltip, UnstyledButton, Text, ActionIcon, LoadingOverlay, Modal, Loader, Affix, Overlay } from "@mantine/core";

import { useRecoilState } from "recoil";
import { EditPost_LinkBar } from "./editPost_LinkBar";
import { P1_EditorContainer } from "../p1_Editor/p1_EditorContainer";
import { useSetBlocksState } from "../p1_Editor/hooks/useSetBlocksState";
import { BlockControlType, OutputBlockData, OutputData } from "../p1_Editor/p1_EditorTypes";
import { LLABClassName, config } from "../p1_Editor/p1_EditorConfig";
import { P1_EditorStyle } from "../p1_Editor/p1_EditorStyle";

export type TagstateType = {
	id: string;
	name: string;
};

type EditPostType = {
	id: string;
	isDuplicate: boolean;
	readOnly?: boolean;
	old?: boolean;
	test?: boolean;
};

export type UndoStackType = {
	data: OutputData;
	changedBlock: { type: string; index: number; id: string };
	eventType: string;
};

export default function EditPost({ id, isDuplicate, readOnly = false, old = false, test = false }: EditPostType) {
	//
	const componentName = "記事の管理";

	const router = useRouter(); //useRouterフックを定義

	const [authUser, setAuthUser] = useRecoilState(authUserState);
	const [title, setTitle] = useState("");
	const [idState, setIdState] = useState("");
	const [postDataState, setPostDataState] = useState<PostDataType>();
	const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
	const [tagList, setTagList] = useState<TagType[]>([]);

	const [metaTitle, setMetaTitle] = useState<string>("");
	const [metaDescription, setMetaDescription] = useState<string>("");

	const { displayAlert, displayConfirm, displayFullscreenLoading } = useDialogState();

	const [saveLoading, setSaveLoading] = useState<boolean>(false);

	const api: BlockControlType = useSetBlocksState();

	const [dateState, setDateState] = useState<dayjs.Dayjs | Date>();
	const [categoryState, setCategoryState] = useState<string>("");
	const [tagState, setTagState] = useState<TagstateType[]>([]);
	const [mainImage, setMainImage] = useState<MediaLib>();
	const [canPublic, setCanPublic] = useState<boolean>(false); // 公開のときはtrue、非公開のときはfalse
	const [pin, setPin] = useState<boolean>(false); // ピンどめのときはtrue
	const [isDraft, setIsDraft] = useState<boolean>(true);

	const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

	const [mediaLib, setMediaLib] = useState<MediaLib[]>();

	useEffect(() => {
		const f = async () => {
			const postData = await getPostDataAsId({ id: id });
			const _post_tag = await getAllPostTag({});
			const post_tag = _post_tag ? _post_tag : [];
			const _post_category = await getAllPostCategory({});
			const post_category = _post_category ? _post_category : [];

			const post_categorySort = post_category.sort((a, b) => {
				const a2 = a.updatedAt.replace(/\-/g, "");
				const b2 = b.updatedAt.replace(/\-/g, "");

				return Number(a2) - Number(b2);
			});

			let post: PostDataType;

			if (postData.id === undefined) {
				post = {
					id: autoID(),
					user: { uid: "", displayName: "" }, //寄稿者
					body: { blocks: [] }, //メイン記事
					canPublic: false, //公開・非公開
					isDraft: true, //下書き
					date: "",
					mainImage: "",
					src: "", //イメージのパス
					srcHigh: "", //イメージのパス
					pin: false, //ピン留め
					priority: 0,
					relatedArticles: [],
					subCopy: "",
					category: post_categorySort[0]?.id,
					tag: [],
					title: "",
					metaTitle: "",
					metaDescription: "",
					createdAt: "",
					updatedAt: "",
				};
			} else {
				post = postData;
			}

			const mediaLib = await getMediaLib();
			setMediaLib(mediaLib);
			const mainImage = mediaLib.find((d) => d.id === post.mainImage);
			setMainImage(mainImage);

			if (isDuplicate) {
				const nId = autoID();
				post.id = nId;
				post.title = `${post.title}（コピー)`;
			}
			setPostDataState(post);

			setTitle(post.title || "");

			//メタタグ用のtitleとdescriptionを設置
			setMetaTitle(post.title);
			//metadiscriptionは headerとparagraphsをjoinしたものとする
			const body_blocks: any[] = post?.body?.blocks;
			const metaDesc = body_blocks
				?.filter((block) => (block.type === "header" || block.type === "paragraph" ? true : false))
				.map((d) => d.data?.text?.replace(/<br>/g, ""))
				.join("");

			setMetaDescription(metaDesc);

			if (post.body.blocks.length === 0) {
				const _defaultData = config.blockTools.find((d) => d.id === config.defaultTool);
				const defaultData = { ..._defaultData.defaultData };
				const def = { id: autoID(10), type: config.defaultTool, data: defaultData };
				api.handleSetBlockDataArr({ blockDataArr: [def] });
			} else {
				api.handleSetBlockDataArr({ blockDataArr: post.body.blocks });
			}

			setCategoryState(post.category);

			if (post.date && !isDuplicate) {
				const date = post.date.split("-").slice(0, 3).join("-");
				setDateState(dayjs(date));
				const today = dayjs(new Date());
				post.updatedAt = today.format("YYYY-MM-DD-HH-mm-ss");
			} else {
				const today = dayjs(new Date());
				setDateState(today);
				post.createdAt = today.format("YYYY-MM-DD-HH-mm-ss");
				post.updatedAt = today.format("YYYY-MM-DD-HH-mm-ss");
			}

			setTagState(post.tag);

			setCanPublic(Boolean(post.canPublic));
			setPin(Boolean(post.pin));
			setIsDraft(Boolean(post.isDraft));

			setCategoryList(post_categorySort);

			setTagList(post_tag);
			setIdState(post.id);
		};

		f();
	}, []);

	const handleDate = (value: dayjs.Dayjs | Date) => {
		setDateState(value);
	};

	const onImgUrlChange = (newData: MediaLib) => {
		if (!newData) {
			setMainImage(null);
		} else {
			const mData = mediaLib.find((d) => d.id === newData.id);
			setMainImage(mData);
		}
	};

	const handleSaveAs = async () => {
		const nId = autoID();
		const isConfirm = await displayConfirm("", `別IDとして保存します。  新ID : ${nId.slice(0, 8)}`, "");
		if (!isConfirm) {
			return;
		}
		handleSave(nId);
	};

	const validateClassName = (text: string) => {
		const temporaryDiv = document.createElement("div");
		temporaryDiv.innerHTML = text;
		const boldElements = temporaryDiv.getElementsByTagName("b");
		for (const boldElement of boldElements) {
			boldElement.classList.add("pe-inline_bold");
		}
		const italicElements = temporaryDiv.getElementsByTagName("i");
		for (const italicElement of italicElements) {
			italicElement.classList.add("pe-inline_italic");
		}
		const linkElements = temporaryDiv.getElementsByTagName("a");
		for (const linkElement of linkElements) {
			linkElement.classList.add("pe-inline_link");
		}
		return temporaryDiv.innerHTML;
	};

	const sanitizeBlockdata = (blockDataArr: OutputBlockData[]) => {
		const nBlockDataArr = blockDataArr.map((d) => {
			const blockTool = config.blockTools.find((d2) => d2.id === d.type);
			if (!blockTool.isContentEditable || !("text" in d.data)) {
				return d;
			}
			const _pureBlockText1 = api.getPureBlockData(d.data.text);
			const _pureBlockText2 = validateClassName(_pureBlockText1);
			const pureBlockText = _pureBlockText2.replace(`<br class="${LLABClassName}">`, "");

			d.data.text = pureBlockText;

			return d;
		});
		return nBlockDataArr;
	};

	const handleSave = async (nId = idState) => {
		if (!postDataState) {
			await displayAlert("", "保存に失敗しました", "red");
			return;
		}

		if (canPublic && isDraft) {
			await displayAlert("", "記事を公開として保存する場合は、下書きのチェックを外してください", "");
			return;
		}

		const body = sanitizeBlockdata(api.blockDataArr);

		let createdAt;
		let updatedAt;
		const now = dayjs();

		if (postDataState.createdAt === "") {
			const day = now.format("YYYY-MM-DD-HH-mm-ss");
			createdAt = day;
			updatedAt = day;
		} else {
			createdAt = postDataState.createdAt;
			updatedAt = now.format("YYYY-MM-DD-HH-mm-ss");
		}
		const HHmmss = now.format("HH-mm-ss");
		const nData = dayjs(dateState).format("YYYY-MM-DD");

		const data: PostDataType = {
			id: nId || null,
			user: authUser || null,
			body: { blocks: body }, //メイン記事
			canPublic: canPublic || null, //公開true,非公開false
			isDraft: isDraft || null, // 下書き
			date: `${nData}-${HHmmss}` || null,
			mainImage: mainImage?.id || null,
			src: "", //イメージのパス
			srcHigh: null, //イメージのパス
			pin: pin, //ピン留め
			priority: 0,
			relatedArticles: [],
			subCopy: null,
			category: categoryState || null,
			tag: tagState || null,
			title: title || null,
			metaTitle: metaTitle || null,
			metaDescription: metaDescription || null,
			createdAt: createdAt || null,
			updatedAt: updatedAt || null,
		};
		displayFullscreenLoading(true);
		// setSaveLoading(true);
		// await new Promise((resolve) => setTimeout(resolve, 1000));
		try {
			const result = await setPostData(nId, data);
			displayFullscreenLoading(false);
			if (result === "success") {
				await displayAlert("", "保存しました", "");
			} else {
				await displayAlert("", "保存に失敗しました", "red");
			}
		} catch (error) {
			await displayAlert("", "失敗しました", "");
			console.log(error);
		}

		// setSaveLoading(false);
		displayFullscreenLoading(false);
		router.push(`/admin/editPost/?id=${nId}`);
	};

	const handleChangeTitle = (e: any) => {
		setTitle(e.target.value);
	};

	const handleSetNew = () => {
		router.push("/admin/editPost/");
	};

	const handleBack = async () => {
		router.push("/admin/postList/");
	};

	const handleDelete = async () => {
		const isConfirm = await displayConfirm("", "このデータを削除しますか？", "");

		if (!isConfirm) {
			return;
		}

		setDeleteLoading(true);
		try {
			const result = await deletePostAsIdArr([idState]);

			if (result === "success") {
				await displayAlert("", "データを削除しました", "");
				setDeleteLoading(false);
				router.push("/admin/postList/");
			} else {
				await displayAlert("", "データの削除に失敗しました", "red");
			}
		} catch (error) {
			await displayAlert("", "失敗しました", "");
			console.log(error);
		}

		setDeleteLoading(false);
	};

	return (
		<Box id="editPostComponent" sx={editBlog}>
			{/* {saveLoading && (
				<Affix w="100vw" h="100vh">
					<Overlay blur={5} center color="#FFF">
						<Flex direction="column" align="center" justify="center" gap="0.5em">
							<Loader size="lg" />
							<Text fz="1em">保存中...</Text>
						</Flex>
					</Overlay>
				</Affix>
			)} */}

			<Global styles={P1_EditorStyle({ bg: api.viewGrid }) as CSSObject} />
			<Head>
				<title>{componentName}</title>
			</Head>

			<AdminHeader title={componentName} />

			<AdminSubHeader
				idState={idState}
				handleBack={handleBack}
				handleSetNew={handleSetNew}
				handleSaveAs={handleSaveAs}
				handleSave={handleSave}
				saveLoading={saveLoading}
				handleDelete={handleDelete}
			/>
			<EditPost_LinkBar link={`/posts/${id}`} />
			<EditPost_SubHeader
				id={idState}
				dateState={dateState}
				handleDate={handleDate}
				pin={pin}
				setPin={setPin}
				canPublic={canPublic}
				setCanPublic={setCanPublic}
				isDraft={isDraft}
				setIsDraft={setIsDraft}
				categoryState={categoryState}
				setCategoryState={setCategoryState}
				categoryList={categoryList}
				metaTitle={metaTitle}
				setMetaTitle={setMetaTitle}
				metaDescription={metaDescription}
				setMetaDescription={setMetaDescription}
			/>

			<EditPost_Taglist tagState={tagState} setTagState={setTagState} tagList={tagList} />

			<Box sx={editorWrapper}>
				<Box w="40em" mb="2em">
					<Text fz="0.8em" mb="0.6em">
						トップイメージ用の画像を選択
					</Text>
					<Box sx={topImage}>
						<ImageSelectTrigger imgData={mainImage} size="xl" onImgUrlChange={onImgUrlChange} />
					</Box>
					<Box mt="1em">
						<TextInput
							size="xl"
							label="タイトル"
							placeholder="タイトル"
							variant="unstyled"
							sx={{ borderBottom: "1px dashed #ababab" }}
							styles={{ input: { fontSize: "2em" }, label: { fontSize: "0.5em" } }}
							value={title}
							onChange={handleChangeTitle}
						/>
					</Box>
				</Box>

				<Flex justify="flex-end">
					<Tooltip label="補助ブロックを表示" color="gray">
						<ActionIcon
							onClick={() => {
								api.setViewGrid(!api.viewGrid);
								api.setReadOnly(!api.viewGrid);
							}}
						>
							<ViewComfyIcon />
						</ActionIcon>
					</Tooltip>
				</Flex>

				<Box
					sx={{
						position: "relative",
						border: "1px solid #AAA",
						borderRadius: "0.2em",
						padding: "3em 2em",
						marginBottom: "20em",
					}}
				>
					<P1_EditorContainer api={api} readOnly={readOnly} maw="40em" />
				</Box>
			</Box>
		</Box>
	);
}

const editBlog = {
	label: "editBlog",
	width: "100%",
	overflow: "hidden",
};

const editorWrapper = {
	label: "editorWrapper",
	width: "80%",
	minWidth: "20em",
	margin: "0 auto",
	marginTop: "5em",
};

const topImage = {
	label: "topImage",
	margin: "0 auto",
};
