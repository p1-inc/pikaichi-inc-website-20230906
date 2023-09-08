import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";

import NextLink from "next/link";

import { useRecoilState } from "recoil";
import { authUserState } from "../../recoil/atoms";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { adminPages } from "./adminHome";

import { c, cArr } from "../../styles/eStyle";

import { Burger, Button, Container, Drawer, Flex, Group, Header, Menu, UnstyledButton, Navbar, NavLink, Box, Text, Divider } from "@mantine/core";
// import { useDeploy } from "../../hooks/useDeploy";
import { IconHome } from "@tabler/icons-react";

type AdminHeaderType = {
	title: string;
	color?: string;
};
export const AdminHeader = ({ title, color = c.defaultBlue }: AdminHeaderType) => {
	//
	const [authUser, setAuthUser] = useRecoilState(authUserState);
	const [anchorEl, setAnchorEl] = useState(null);
	const [openMenu, setOpenMenu] = useState(false);

	// const { handleDeploy, loading } = useDeploy();

	const handleShowMenu = (e: { currentTarget: HTMLButtonElement }) => {
		if (anchorEl) {
			setAnchorEl(null);
		} else {
			setAnchorEl(e.currentTarget);
		}
	};

	const handleLogout = async () => {
		setAuthUser({
			uid: "",
			displayName: "",
			email: "",
		});
		const auth = getAuth();
		try {
			const res = await signOut(auth);
		} catch (error) {
			console.log(error);
		}
	};

	const navList = {
		label: "navList",
		fontSize: "0.9em",
		cursor: "pointer",
		transition: "all 0.1s",
		"&:hover": {
			opacity: 0.5,
		},
	};

	return (
		<Header height="3em" sx={{ backgroundColor: color, display: "flex" }}>
			<Box w="90%" m="0 auto" sx={{ display: "flex", justifyContent: "space-between" }}>
				<Flex align="center" gap="1em" sx={{ color: "#FFF" }}>
					<Burger
						opened={openMenu}
						onClick={() => {
							setOpenMenu(!openMenu);
						}}
						size="sm"
						color="#fff"
					/>
					<div> {title}</div>
				</Flex>

				<Menu shadow="md">
					<Menu.Target>
						<UnstyledButton
							sx={{
								ml: "auto",
								mr: 0,
								color: "#FFF",
								fontSize: "0.8em",
								"&:hover": {
									opacity: "0.5",
									transition: "opacity 0.1s",
								},
							}}
							onClick={handleShowMenu}
						>
							{authUser.displayName ? (
								<Flex align="center">
									<AccountCircleIcon />
									<Text ml="0.3em">{authUser.displayName}</Text>
								</Flex>
							) : (
								<Flex align="center">
									<AccountCircleIcon />
									<Text ml="0.3em">NO USER</Text>
								</Flex>
							)}
						</UnstyledButton>
					</Menu.Target>
					<Menu.Dropdown>
						{authUser.uid ? (
							<Menu.Item sx={{ fontSize: "0.9em" }} onClick={handleLogout}>
								ログアウト
							</Menu.Item>
						) : (
							<NextLink href="/admin/index" passHref>
								<Menu.Item sx={{ fontSize: "0.9em" }} onClick={handleLogout}>
									ログイン
								</Menu.Item>
							</NextLink>
						)}
					</Menu.Dropdown>
				</Menu>

				<Drawer opened={openMenu} onClose={() => setOpenMenu(false)}>
					<Navbar p="xl" styles={{ root: { border: "none" } }}>
						<Navbar.Section sx={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
							<NextLink href="/admin/index" passHref>
								<Flex sx={navList} gap="0.8em">
									<IconHome width="1em" />
									<Box> ホーム</Box>
								</Flex>
							</NextLink>
						</Navbar.Section>

						<Divider my="1em" w="15em" />

						<Navbar.Section sx={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
							{adminPages.config.map((item, index, arr) => (
								<NextLink key={item.id} href={`/admin/${item.id}`} passHref>
									<Flex sx={navList} gap="0.8em">
										<item.icon width="1em" />
										<Box> {item.name}</Box>
									</Flex>
								</NextLink>
							))}
						</Navbar.Section>

						<Divider my="1em" w="15em" />

						<Navbar.Section sx={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
							{adminPages.media.map((item, index, arr) => (
								<NextLink key={item.id} href={`/admin/${item.id}`} passHref>
									<Flex sx={navList} gap="0.8em">
										<item.icon width="1em" />
										<Box> {item.name}</Box>
									</Flex>
								</NextLink>
							))}
						</Navbar.Section>

						<Divider my="1em" w="15em" />

						<Navbar.Section sx={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
							{adminPages.contents.map((item, index, arr) => (
								<NextLink key={item.id} href={`/admin/${item.id}`} passHref>
									<Flex sx={navList} gap="0.8em">
										<item.icon width="1em" />
										<Box> {item.name}</Box>
									</Flex>
								</NextLink>
							))}
						</Navbar.Section>

						<Divider my="1em" w="15em" />

						<Navbar.Section sx={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
							{adminPages.posts.map((item, index, arr) => (
								<NextLink key={item.id} href={`/admin/${item.id}`} passHref>
									<Flex sx={navList} gap="0.8em">
										<item.icon width="1em" />
										<Box> {item.name}</Box>
									</Flex>
								</NextLink>
							))}
						</Navbar.Section>

						<Navbar.Section
							sx={{
								display: "flex",
								flexDirection: "column",
								gap: "0.5em",
								marginTop: "2em",
							}}
						>
							<NextLink href="/admin/preview" passHref>
								<Button size="xs" sx={{ width: "15em" }} variant="outline">
									プレビュー
								</Button>
							</NextLink>

							{/* <Button
								size="xs"
								sx={{ width: "15em" }}
								variant="filled"
								onClick={() => {
									setOpenMenu(false);
									handleDeploy();
								}}
								loading={loading ? true : false}
							>
								設定を反映させる
							</Button> */}
						</Navbar.Section>
					</Navbar>
				</Drawer>
			</Box>
		</Header>
	);
};
