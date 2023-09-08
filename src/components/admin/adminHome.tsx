import NextLink from "next/link";

import { AdminHeader } from "./adminHeader";
// import { deployDatabase } from "../../firebase/firebase";
// import { useDialogState } from "../../hooks/useDialogState";
import { Box, Button, Divider, Flex, Text } from "@mantine/core";
import { useState } from "react";
// import { useDeploy } from "../../hooks/useDeploy";
import {
	IconArticle,
	IconBalloon,
	IconBox,
	IconCarouselHorizontal,
	IconCategory,
	IconComponents,
	IconDoor,
	IconForms,
	IconLayoutBottombar,
	IconMenu2,
	IconMist,
	IconNews,
	IconPhoto,
	IconSection,
	IconSettings,
	IconStack2,
	IconTable,
	IconTag,
	IconUsers,
	IconUsersGroup,
	TablerIconsProps,
} from "@tabler/icons-react";

type AdminPagesType = {
	config: { id: string; name: string; icon: (props: TablerIconsProps) => JSX.Element }[];
	media: { id: string; name: string; icon: (props: TablerIconsProps) => JSX.Element }[];
	contents: { id: string; name: string; icon: (props: TablerIconsProps) => JSX.Element }[];
	posts: { id: string; name: string; icon: (props: TablerIconsProps) => JSX.Element }[];
};

export const adminPages: AdminPagesType = {
	config: [
		{
			id: "generalControls",
			name: "初期設定",
			icon: IconSettings,
		},
		{
			id: "userList",
			name: "ユーザーの管理",
			icon: IconUsers,
		},
		{
			id: "editLayout",
			name: "レイアウトの管理",
			icon: IconSection,
		},
		{
			id: "editMenu",
			name: "メニューの管理",
			icon: IconMenu2,
		},
	],
	media: [
		{
			id: "mediaManager",
			name: "メディアの管理",
			icon: IconPhoto,
		},
	],
	contents: [
		{
			id: "topWordList",
			name: "トップワードの管理",
			icon: IconMist,
		},
		{
			id: "selTopImage",
			name: "トップイメージの管理",
			icon: IconCarouselHorizontal,
		},
		{
			id: "editNews",
			name: "ニュースの管理",
			icon: IconNews,
		},
		{
			id: "editPeople",
			name: "スタッフ紹介の管理",
			icon: IconUsersGroup,
		},
		{
			id: "selPhotoGallery",
			name: "フォトギャラリーの管理",
			icon: IconStack2,
		},
		{
			id: "tableList",
			name: "表組みの管理",
			icon: IconTable,
		},
		{
			id: "campaignList",
			name: "キャンペーンの管理",
			icon: IconBalloon,
		},
		{
			id: "shopInfoList",
			name: "スタジオの情報の管理",
			icon: IconDoor,
		},
		{
			id: "editFooter",
			name: "フッターの管理",
			icon: IconLayoutBottombar,
		},
		{
			id: "formList",
			name: "フォームの管理",
			icon: IconForms,
		},
		{
			id: "fixedCompList",
			name: "固定コンポーネントの管理",
			icon: IconComponents,
		},
	],
	posts: [
		{
			id: "postList",
			name: "記事の管理",
			icon: IconArticle,
		},
		{
			id: "editCategory",
			name: "カテゴリーの管理",
			icon: IconCategory,
		},
		{
			id: "editTag",
			name: "タグの管理",
			icon: IconTag,
		},
	],
};

const AdminHome = () => {
	//
	// const { handleDeploy, loading } = useDeploy();

	const adminContaine = {
		width: "90%",
		maxWidth: "50em",
		margin: "0 auto",
		marginTop: "3em",
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

			<Box mt="3em" ml="3em">
				<Flex direction="column" gap="5em">
					<Flex direction="column" gap="0.5em">
						<Flex gap="0.5em">
							<IconSettings width="1.3em" />
							<Text>環境設定</Text>
						</Flex>
						<Flex wrap="wrap" gap="0.5em">
							{adminPages.config.map((item) => (
								<NextLink key={item.id} href={`/admin/${item.id}`} passHref>
									<Button w="20em" h="4em" variant="outline" leftIcon={<item.icon width="1.5em" />}>
										<Flex>
											<Box>{item.name}</Box>
										</Flex>
									</Button>
								</NextLink>
							))}
						</Flex>
					</Flex>

					<Flex direction="column" gap="0.5em">
						<Flex gap="0.5em">
							<IconBox width="1.3em" />
							<Text>メディア</Text>
						</Flex>
						<Flex wrap="wrap" gap="0.5em">
							{adminPages.media.map((item) => (
								<NextLink key={item.id} href={`/admin/${item.id}`} passHref>
									<Button w="20em" h="4em" variant="outline" leftIcon={<item.icon width="1.5em" />}>
										<Flex>
											<Box>{item.name}</Box>
										</Flex>
									</Button>
								</NextLink>
							))}
						</Flex>
					</Flex>

					<Flex direction="column" gap="0.5em">
						<Flex gap="0.5em">
							<IconBox width="1.3em" />
							<Text>コンテンツ</Text>
						</Flex>
						<Flex wrap="wrap" gap="0.5em">
							{adminPages.contents.map((item) => (
								<NextLink key={item.id} href={`/admin/${item.id}`} passHref>
									<Button w="20em" h="4em" variant="outline" leftIcon={<item.icon width="1.5em" />}>
										<Flex>
											<Box>{item.name}</Box>
										</Flex>
									</Button>
								</NextLink>
							))}
						</Flex>
					</Flex>

					<Flex direction="column" gap="0.5em">
						<Flex gap="0.5em">
							<IconArticle width="1.3em" />
							<Text>記 事</Text>
						</Flex>
						<Flex wrap="wrap" gap="0.5em">
							{adminPages.posts.map((item) => (
								<NextLink key={item.id} href={`/admin/${item.id}`} passHref>
									<Button w="20em" h="4em" variant="outline" leftIcon={<item.icon width="1.5em" />}>
										<Flex>
											<Box>{item.name}</Box>
										</Flex>
									</Button>
								</NextLink>
							))}
						</Flex>
					</Flex>

					{/* <Flex direction="column" w="90%" maw="50em" gap="1em">
						<NextLink href="/admin/preview" passHref>
							<Button w="100%" h="3em" size="sm" variant="outline">
								プレビュー
							</Button>
						</NextLink>

						<Button w="100%" h="3em" size="sm" variant="filled" onClick={handleDeploy} loading={loading ? true : false}>
							設定を反映させる
						</Button>
					</Flex> */}
				</Flex>
			</Box>
		</div>
	);
};

export default AdminHome;
