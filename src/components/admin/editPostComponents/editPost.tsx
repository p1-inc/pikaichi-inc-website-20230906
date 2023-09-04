import { useState, useEffect, useRef, ChangeEventHandler, ChangeEvent, MutableRefObject } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { authUserState } from "../../../recoil/atoms";

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
import { config } from "../p1_Editor/p1_EditorConfig";
import { P1_EditorStyle } from "../p1_Editor/p1_EditorStyle";

import { getHotkeyHandler, useEventListener, useHotkeys } from "@mantine/hooks";
import { useDeploy } from "../../../hooks/useDeploy";

export type TagstateType = {
	id: string;
	name: string;
};

type EditPostType = {
	id: string;
	isDuplicate: boolean;
	readOnly?: boolean;
};

export type UndoStackType = {
	data: OutputData;
	changedBlock: { type: string; index: number; id: string };
	eventType: string;
};

export default function EditPost({ id, isDuplicate, readOnly = false }: EditPostType) {
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

	const { displayAlert, displayAlertEX, displayConfirm, displayFullscreenLoading } = useDialogState();

	const [saveLoading, setSaveLoading] = useState<boolean>(false);

	const api: BlockControlType = useSetBlocksState();

	const [dateState, setDateState] = useState<dayjs.Dayjs | Date>();
	const [categoryState, setCategoryState] = useState<string>("");
	const [tagState, setTagState] = useState<TagstateType[]>([]);
	const [mainImage, setMainImage] = useState<MediaLib>();
	const [canPublic, setCanPublic] = useState<boolean>(false); // 公開のときはtrue、非公開のときはfalse
	const [pin, setPin] = useState<boolean>(false); // ピンどめのときはtrue
	// const [isDraft, setIsDraft] = useState<boolean>(true);

	const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

	const [mediaLib, setMediaLib] = useState<MediaLib[]>();

	const [confirmSaveOpen, setConfirmSaveOpen] = useState<{ visible: boolean; onClose: (value: string | PromiseLike<string>) => void }>({
		visible: false,
		onClose: undefined,
	});

	const { handleDeploy, loading } = useDeploy();

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
			const defaultTool = config.blockTools.find((d) => d.id === config.defaultTool);
			const _defaultBody = defaultTool ? defaultTool.defaultData : { align: "left", lineHeight: 2, level: 2, style: "none", text: "" };
			const defaultBody = { id: autoID(10), type: config.defaultTool, data: _defaultBody };

			if (postData.id === "" || postData.id === undefined) {
				post = {
					id: autoID(),
					user: { uid: "", displayName: "" }, //寄稿者
					body: { blocks: [defaultBody] }, //メイン記事
					canPublic: false, //公開・非公開
					// isDraft: true, //下書き
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
				if (postData.body.blocks.length === 0) {
					post.body = { blocks: [defaultBody] };
				}
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

			api.handleSetBlockDataArr({ blockDataArr: post.body.blocks });

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

			setCategoryList(post_categorySort);

			setTagList(post_tag);
			setIdState(post.id);
		};

		f();
	}, []);

	useEffect(() => {
		if (postDataState) {
			handleSave({ noReload: true, noDialog: true });
		}
	}, [api.autoSave]);

	//　command+sのショートカット処理、
	//　command+zなどは、エディタの機能に内包されるので、p1_editorContainer.tsx内でイベント処理する
	//command+sは保存処理を分離したいので、このコンポーネントで処理する
	const eventRef = useEventListener("keydown", getHotkeyHandler([["mod+S", (e) => handleSave({ noReload: true }), { preventDefault: true }]]));

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
		handleSave({ nId });
	};

	const confirmSaveDialog = (visible = true) => {
		return new Promise((resolve) => {
			setConfirmSaveOpen({
				visible: visible,
				onClose: resolve,
			});
		});
	};

	const ConfirmSave = () => {
		const handleClose = (prop: string) => {
			if (confirmSaveOpen.onClose) {
				confirmSaveOpen.onClose(prop);
			}
			setConfirmSaveOpen({
				visible: false,
				onClose: undefined,
			});
		};

		return (
			<Modal
				size="lg"
				zIndex={1000}
				opened={confirmSaveOpen.visible}
				onClose={() => {
					handleClose("cancel");
				}}
				title="保存しました"
			>
				<Flex direction="column" gap="1em">
					<Text>記事を本番のwebサイトに反映させるには【設定を反映させる】ボタンを押してください</Text>
					<Text>※反映させるまで多少時間がかかります</Text>
					<Flex w="100%" ml="auto" mt="1em" justify="flex-end">
						<Flex gap="1em">
							<Button
								variant="outline"
								onClick={() => {
									handleClose("deploy");
								}}
							>
								設定を反映させる
							</Button>
							<Button
								w="8em"
								onClick={() => {
									handleClose("ok");
								}}
							>
								O K
							</Button>
						</Flex>
					</Flex>
				</Flex>
			</Modal>
		);
	};

	const handleSave = async ({ nId = idState, noReload = false, noDialog = false }: { nId?: string; noReload?: boolean; noDialog?: boolean } = {}) => {
		if (!postDataState && !noDialog) {
			await displayAlert("", "保存に失敗しました1", "red");
			return;
		}

		const body = api.sanitizeBlockdata(api.blockDataArr);

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
		// const HHmmss = now.format("HH-mm-ss");
		// const nData = dayjs(dateState).format("YYYY-MM-DD");

		const data: PostDataType = {
			id: nId || null,
			user: authUser || null,
			body: { blocks: body }, //メイン記事
			canPublic: canPublic || null, //公開true,非公開false
			// isDraft: isDraft || null, // 下書き
			date: updatedAt || null,
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

		if (!noDialog) {
			displayFullscreenLoading(true);
		}

		try {
			const result = await setPostData(nId, data);
			displayFullscreenLoading(false);

			if (result === "success" && !noDialog) {
				if (canPublic) {
					const res = await confirmSaveDialog();
					if (res === "deploy") {
						await handleDeploy();
					}
				} else {
					await displayAlertEX({
						title: "保存しました",
						msg: "記事はまだ公開されていません。公開する場合は、【公開】にチェックをしてください",
					});
				}
			} else if (result === "error") {
				await displayAlert("", "保存に失敗しました", "red");
			}
		} catch (error) {
			await displayAlert("", "失敗しました", "");
			console.log(error);
		}

		displayFullscreenLoading(false);

		if (!noReload) {
			router.push(`/admin/editPost/?id=${nId}`);
		}
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
		<Box id="editPostComponent" sx={editBlog} ref={eventRef}>
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
						minHeight: "40em",
					}}
				>
					<P1_EditorContainer api={api} readOnly={readOnly} maw="40em" />
				</Box>
			</Box>
			<ConfirmSave />
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
