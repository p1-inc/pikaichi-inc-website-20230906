import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Box, Button, Container, createStyles, Flex, LoadingOverlay, Title } from "@mantine/core";
import { FloatingLabelInput, FloatingLabelInputForPassWord } from "../../components/commonComponents/formComponent";

import { FirebaseApp, initializeApp } from "firebase/app";
import { applyActionCode, Auth, getAuth } from "firebase/auth";

export type FormValuesType = {
	email: string;
	pass: string;
};

const handleVerifyEmail = async ({ auth, actionCode }: { auth: Auth; actionCode: string }) => {
	console.log("actionCode: ", actionCode);
	console.log("auth: ", auth);
	try {
		const res = await applyActionCode(auth, actionCode);
		console.log("res: ", res);
	} catch (error) {
		console.log("error: ", error);
	}
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

	if (router.query.mode === "verifyEmail") {
		handleVerifyEmail({ auth, actionCode: router.query.oobCode as string });
	}

	return (
		<Box>
			<Box>メールアドレスを確認しました</Box>
			<Box>新規アカウントでログインできます</Box>
			<Button
				onClick={() => {
					router.push("/admin/index/");
				}}
			>
				ログイン
			</Button>
			<Button
				onClick={() => {
					console.log("auth: ", auth.currentUser);
				}}
			>
				TEST
			</Button>
		</Box>
	);
};

export default Action;
