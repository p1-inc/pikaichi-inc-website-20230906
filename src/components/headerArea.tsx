import NextImage from "next/future/image";

import { Anchor, Box, Flex, Text, UnstyledButton } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { getAuth, signOut } from "firebase/auth";
import { useRecoilState } from "recoil";
import { authUserState } from "../recoil/atoms";
import { useRespStyles } from "../hooks/useRespStyles";
import { useRef } from "react";

export const HeaderArea = ({ logoWidth = "15em" }: { logoWidth?: string }) => {
	const [authUser, setAuthUser] = useRecoilState(authUserState);

	const containerRef = useRef<HTMLDivElement>(null);
	const { mq, clp } = useRespStyles({ ref: containerRef, min: 599, max: 1024 });

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
		<Flex w="100%" justify="space-between" align="center" ref={containerRef}>
			<Anchor href="/">
				<Box
					component={NextImage}
					src="/img/pikaichi-logo-01.svg"
					alt="Picture of the author"
					w="40vw"
					maw="15em"
					miw="9em"
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
				<IconLogout color="#7e7e7e" />
				<Text ml="0.2em" display={mq.sps ? "none" : "block"}>
					logout
				</Text>
			</UnstyledButton>
		</Flex>
	);
};
