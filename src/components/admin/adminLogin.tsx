import { useRecoilState, useRecoilValue } from "recoil";
import { useRouter } from "next/router";

import Head from "next/head";

import { authErrorState, authUserState } from "../../recoil/atoms";

import { loginAsAdminFunc, sendEmailVerificationFunc } from "../../firebase/firebaseAuth";

import { useEffect, useState } from "react";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { c, cArr } from "../../styles/eStyle";

import { AdminHeader } from "./adminHeader";

import { useDialogState } from "../../hooks/useDialogState";
import { Box, Button, Container, createStyles, Flex, LoadingOverlay, Title, Text, Anchor, useMantineTheme, Modal, FocusTrap, Center } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";

import * as Yup from "yup";
import { FloatingLabelInput, FloatingLabelInputForPassWord } from "../commonComponents/formComponent";
import { PikaichiLogo2 } from "../../svg/pikaichiLogo2";
import { useFocusTrap, useInterval, useTimeout } from "@mantine/hooks";

export type FormValuesType = {
	pass: string;
};

const adminSet: string = process.env.NEXT_PUBLIC_LOGINSET;

const AdminLogin = () => {
	//

	const schema = Yup.object().shape({
		pass: Yup.string().required("PassWordは必須項目です"),
	});

	const form = useForm<FormValuesType>({
		initialValues: {
			pass: "",
		},
		validate: yupResolver(schema),
	});

	const router = useRouter(); //useRouterフックを定義

	const [authUser, setAuthUser] = useRecoilState(authUserState);
	const [authError, setAuthError] = useRecoilState(authErrorState);

	const { displayAlert, displayAlertEX } = useDialogState();

	const [loading, setLoading] = useState<boolean>(false);

	const [errMsg, setErrMsg] = useState<string>("");

	const fetchLogin = async ({ adminSetObj, member }: { adminSetObj: string[][]; member: string }) => {
		const adminObj = adminSetObj.find((d) => d[0] === member) || ["wrongAltName", "wrongPass", "wrongPass"];

		const adminEmail = adminObj[1];
		const adminPass = adminObj[2];

		const res = await loginAsAdminFunc(adminEmail, adminPass);
		setLoading(false);
		if (!res) {
			return;
		}
		if (res.uid && res.emailVerified) {
			//ログイン成功

			let displayName;
			let authUser;
			if (!res.displayName) {
				const reg = new RegExp(/@.+/);
				displayName = res.email.replace(reg, "");
			} else {
				displayName = res.displayName;
			}
			setAuthUser({ uid: adminPass, displayName: displayName, email: res.email });
		} else if (res === "noEmailVerified") {
			//メール未確認
			await displayAlert("", "入力したユーザーはメール認証が完了していません。メール認証を完了してから再度ログインしてください", "");
			setAuthError("noEmailVerified");
		} else if (res === "noAdminRole") {
			await displayAlert("", "入力したユーザーには、管理者権限がありません。管理者に連絡して管理者権限を付与してもらってください", "");
		} else if (res === "auth/too-many-requests") {
			await displayAlert("", "ログインに何度も失敗したため、アカウントが一時的に無効になっています。しばらく経ってから再度ログインしてください", "");

			setErrMsg("ログインに何度も失敗したため、アカウントが一時的に無効になっています。しばらく経ってから再度ログインしてください");
		} else {
			//その他のエラー
			await displayAlert("", "ログインに失敗しました、メールアドレス・パスワードを確認の上再度入力してください", "red");

			setErrMsg("ログインに失敗しました、メールアドレス・パスワードを確認の上再度入力してください");
		}
	};

	const handleSubmit = async (e: any) => {
		//
		e.preventDefault();
		setLoading(true);

		const { hasErrors } = form.validate();

		if (hasErrors) {
			await displayAlert("", "入力した内容をご確認ください", "red");
			setLoading(false);
			return;
		}

		const v = form.values;

		const aaa = adminSet.split(",");

		const adminSetObj = adminSet.split(",").map((d) => d.split(":"));

		setTimeout(() => {
			fetchLogin({ adminSetObj, member: v.pass });
		}, 1000);
	};

	const ErrMsg = ({ msg }: { msg: string }) => {
		return (
			<Box mt="2em">
				<Text component="p" color="red">
					{msg}
				</Text>
			</Box>
		);
	};

	return (
		<>
			<Head>
				<title>Pikaichi inc.</title>
				<meta name="viewport" content="width=device-width,initial-scale=1.0" />
				<meta name="description" content="Pikaichi inc." />
				<meta property="og:url" content="https://pikaichi-inc.com" />
				<meta property="og:title" content="Pikaichi inc." />
				<meta property="og:site_name" content="Pikaichi inc." />
				<meta property="og:description" content="Pikaichi inc." />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://pikaichi-inc.com/img/ogpImage.png" />
				<meta name="twitter:card" content="summary_large_image" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Modal
				// opened={openLoginWindow}
				size="md"
				opened={Boolean(authUser.uid === "")}
				onClose={() => {
					// setOpenLoginWindow(false);
				}}
				withCloseButton={false}
				overlayProps={{
					color: "#FFF",
					opacity: 0.4,
					// blur: 20,
				}}
				padding="2em"
			>
				<Flex direction="column" align="center">
					<PikaichiLogo2 width="8em" />
					<Text mt="2em" fz="0.9em" lh="1.8em">
						Pikaichi
						inc.は広告を主としたデザイン会社です。このサイトでは弊社の作品を多数紹介していますが、モデル、タレント、およびその他のスタッフの権利を尊重するため、広く一般には公開しておりません。
						弊社へ興味のある方やお仕事の依頼をご検討の方は、下記のアドレスまでメールをお送りください。
					</Text>
					<Anchor href="mailto:info@pikaichi-inc.com">info@pikaichi-inc.com</Anchor>
					{errMsg && <ErrMsg msg={errMsg} />}
				</Flex>

				<Box component="form" onSubmit={handleSubmit} mt="3em" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
					<Box w="100%" sx={{ display: "flex", flexDirection: "column" }}>
						{/* <FloatingLabelInput id="email" w="100%" mt="2em" size="md" withAsterisk={true} label="メールアドレス" placeholder="メールアドレス" form={form} /> */}

						<FloatingLabelInputForPassWord
							id="pass"
							w="100%"
							mt="1em"
							size="md"
							label="パスワード"
							placeholder="パスワード"
							form={form}
							data-autofocus={true}
						/>
					</Box>

					<Button
						w="100%"
						mt="2em"
						onClick={(e) => {
							handleSubmit(e);
						}}
					>
						ログイン
					</Button>
					<Flex direction="column" align="center" mt="2em" fz="10pt">
						{/* <Box component="p">#1104, 2-14-6, TSUKIJI, CHUO-KU,</Box>
                        <Box component="p">TOKYO, 104-0045, JAPAN</Box> */}
						<Anchor href="mailto:info@pikaichi-inc.com" color="none">
							info@pikaichi-inc.com
						</Anchor>
						<Box component="p" mt="1em">
							© PIKAICHI INC, ALL RIGHTS RESERVED.
						</Box>
					</Flex>

					<LoadingOverlay visible={loading} />
				</Box>
			</Modal>
			<Box
				component="video"
				src="/movie/sunlight.mp4"
				autoPlay
				loop
				muted
				playsInline
				sx={{
					position: "fixed",
					top: 0,
					right: 0,
					left: 0,
					bottom: 0,
					overflow: "hidden",
					minWidth: "100%",
					minHeight: "100%",
				}}
			/>
		</>
	);
};

export default AdminLogin;
