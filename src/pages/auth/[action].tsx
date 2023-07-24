import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/future/image";
import { c } from "../../styles/eStyle";

import { Box, Button, Flex, Text } from "@mantine/core";

import { initializeApp } from "firebase/app";
import { applyActionCode, Auth, getAuth } from "firebase/auth";

import { IconAlertTriangle } from "@tabler/icons-react";
import { useIdle } from "@mantine/hooks";

export type FormValuesType = {
	email: string;
	pass: string;
};

const handleVerifyEmail = async ({ auth, actionCode }: { auth: Auth; actionCode: string }) => {
	try {
		const res = await applyActionCode(auth, actionCode);
	} catch (error) {
		console.log("error: ", error);
	}
};

const ActionContainer = ({ children }) => {
	return (
		<Box w="100vw" h="100vh" pt="3em" sx={{ backgroundColor: "#F6F6F6" }}>
			<Flex
				direction="column"
				w="25em"
				p="2em"
				m="0 auto"
				align="center"
				justify="center"
				gap="1em"
				sx={{ borderRadius: "0.5em", backgroundColor: "#FFF", boxShadow: "0.4em 0.4em 0.4em 0px rgba(0, 0, 0, 0.2);" }}
			>
				{children}
			</Flex>
		</Box>
	);
};
const Action = () => {
	//

	const firebaseConfig = {
		apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
		authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
		projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
		storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BAKET,
		messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
		appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	};

	const app = initializeApp(firebaseConfig);
	const auth = getAuth(app);

	const router = useRouter(); //useRouterフックを定義

	const idle = useIdle(200);

	if (router.query.mode === "verifyEmail") {
		handleVerifyEmail({ auth, actionCode: router.query.oobCode as string });
	}
	if (router.query.mode === "verifyEmail") {
		return (
			<ActionContainer>
				<Box w="4em">
					<Box component={Image} src="/img/verifyEmail.svg" width={101} height={102} alt="メール" w="100%" h="100%" sx={{ objectFit: "cover" }} />
				</Box>
				<Flex direction="column" fz="1em">
					<Box>メールアドレスを確認しました</Box>
					<Box>新規アカウントでログインできます</Box>
				</Flex>
				<Button
					px="4em"
					onClick={() => {
						router.push("/admin/index/");
					}}
				>
					ログイン
				</Button>

				<Text component="a" fz="0.8em">
					{process.env.NEXT_PUBLIC_STUDIO_EMAIL}
				</Text>
			</ActionContainer>
		);
	} else if (idle && router.query.mode === "") {
		return (
			<ActionContainer>
				<IconAlertTriangle color="red" />
				<Flex direction="column" fz="1em">
					<Box>エラーが発生しました</Box>
					<Box>再度やり直してください</Box>
				</Flex>
				<Button
					px="4em"
					onClick={() => {
						router.push("/admin/index/");
					}}
				>
					ログイン
				</Button>
				<Text component="a" fz="0.8em">
					{process.env.NEXT_PUBLIC_STUDIO_EMAIL}
				</Text>
			</ActionContainer>
		);
	} else {
		return <></>;
	}
};

export default Action;
