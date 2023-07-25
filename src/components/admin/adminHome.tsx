import NextLink from "next/link";

import { AdminHeader } from "./adminHeader";
import { deployDatabase } from "../../firebase/firebase";
import { useDialogState } from "../../hooks/useDialogState";
import { Box, Button, Divider, Flex } from "@mantine/core";
import { useState } from "react";

export const adminPages = [
	{
		id: "index",
		name: "ホーム",
	},
	{
		id: "generalControls",
		name: "初期設定",
	},
	{
		id: "userList",
		name: "ユーザーの管理",
	},
	{
		id: "editPeople",
		name: "スタッフ紹介の管理",
	},
	{
		id: "editNews",
		name: "ニュースの管理",
	},
	{
		id: "editLayout",
		name: "レイアウトの管理",
	},
	{
		id: "editMenu",
		name: "メニューの管理",
	},
	{
		id: "topWordList",
		name: "トップワードの管理",
	},
	{
		id: "selTopImage",
		name: "トップイメージの管理",
	},
	{
		id: "selPhotoGallery",
		name: "フォトギャラリーの管理",
	},
	{
		id: "tableList",
		name: "表組みの管理",
	},
	{
		id: "campaignList",
		name: "キャンペーンの管理",
	},
	{
		id: "shopInfoList",
		name: "スタジオの情報の管理",
	},
	{
		id: "formList",
		name: "フォームの管理",
	},
	{
		id: "editFooter",
		name: "フッターの管理",
	},
	{
		id: "fixedCompList",
		name: "固定コンポーネントの管理",
	},
	{
		id: "postList",
		name: "記事の管理",
	},
	{
		id: "editCategory",
		name: "カテゴリーの管理",
	},
	{
		id: "editTag",
		name: "タグの管理",
	},
	{
		id: "mediaManager",
		name: "メディアの管理",
	},
];

const AdminHome = () => {
	//
	const [submitLoading, setSubmitLoading] = useState<boolean>(false);

	const { displayAlert } = useDialogState();

	const adminContaine = {
		width: "90%",
		maxWidth: "50em",
		margin: "0 auto",
		marginTop: "3em",
	};

	const handleSubmit = async () => {
		setSubmitLoading(true);
		const res = await deployDatabase();

		const vercelDeployUrl = process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_URL;
		if (!vercelDeployUrl) throw new Error("環境変数が設定されていません。");

		if (res === "success") {
			await displayAlert("", "設定を反映しました", "");
			await fetch(vercelDeployUrl, { method: "POST" });
		} else {
			await displayAlert("", "反映に失敗しました", "red");
		}
		setSubmitLoading(false);

		//////////vercel deploy処理必要！！！
	};

	const LinkBtnList = ({ txt, url }: { txt: string; url: string }) => {
		return (
			<Box component="li" mb="1em">
				<NextLink href={`/admin/${url}`} passHref>
					<Button w="100%" size="sm" variant="outline">
						{txt}
					</Button>
				</NextLink>
			</Box>
		);
	};
	return (
		<div>
			<AdminHeader title="管理" />

			<Box sx={adminContaine}>
				<ul>
					<Flex direction="column">
						{adminPages.map((page) => (
							<LinkBtnList key={page.name} txt={page.name} url={page.id} />
						))}

						<Box m="2em 0">
							<Box component="li" mb="1em">
								<NextLink href="/admin/preview" passHref>
									<Button w="100%" size="sm" variant="outline">
										プレビュー
									</Button>
								</NextLink>
							</Box>
							<Box component="li" mb="1em">
								<Button w="100%" size="sm" variant="filled" onClick={handleSubmit} loading={submitLoading ? true : false}>
									設定を反映させる
								</Button>
							</Box>
						</Box>
					</Flex>
				</ul>
			</Box>
		</div>
	);
};

export default AdminHome;
