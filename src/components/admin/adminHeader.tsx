import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";

import NextLink from "next/link";

import { useRecoilState } from "recoil";
import { authUserState } from "../../recoil/atoms";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { adminPages } from "./adminHome";

import { c, cArr } from "../../styles/eStyle";

import { Burger, Button, Drawer, Flex, Header, Menu, UnstyledButton, Navbar, Box, Text } from "@mantine/core";
import { useDeploy } from "../../hooks/useDeploy";

type AdminHeaderType = {
	title: string;
	color?: string;
};
export const AdminHeader = ({ title, color = c.defaultBlue }: AdminHeaderType) => {
	//
	const [authUser, setAuthUser] = useRecoilState(authUserState);
	const [anchorEl, setAnchorEl] = useState(null);
	const [openMenu, setOpenMenu] = useState(false);

	const { handleDeploy, loading } = useDeploy();

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
		marginBottom: "1em",
		fontSize: "0.9em",
		color: c.mainBlack,
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
						<Navbar.Section sx={{ display: "flex", flexDirection: "column" }}>
							{adminPages.map((menu, index, arr) => (
								<NextLink key={menu.id} href={`/admin/${menu.id}`} passHref>
									<Box sx={navList}> {menu.name}</Box>
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

							<Button
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
							</Button>
						</Navbar.Section>
					</Navbar>
				</Drawer>
			</Box>
		</Header>
	);
};
