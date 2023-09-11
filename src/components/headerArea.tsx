import NextImage from "next/future/image";

import { Anchor, Box, Flex, Text, UnstyledButton } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { getAuth, signOut } from "firebase/auth";
import { useRecoilState } from "recoil";
import { authUserState } from "../recoil/atoms";

export const HeaderArea = ({ logoWidth = "15em" }: { logoWidth?: string }) => {
	const [authUser, setAuthUser] = useRecoilState(authUserState);

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

	return (
		<Flex w="100%" justify="space-between">
			<Anchor href="/">
				<Box
					component={NextImage}
					src="/img/pikaichi-logo-01.svg"
					alt="Picture of the author"
					w={logoWidth}
					h="fit-content"
					width="86"
					height="14"
					sx={{ objectFit: "contain" }}
				/>
			</Anchor>

			<UnstyledButton
				component={Flex}
				sx={{ "&:hover": { opacity: 0.7 } }}
				onClick={() => {
					handleLogout();
				}}
			>
				<IconLogout color="#545554" />
				<Text>logout</Text>
			</UnstyledButton>
		</Flex>
	);
};
