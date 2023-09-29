import { useRecoilState, useRecoilValue } from "recoil";
import { useRouter } from "next/router";

import NextLink from "next/link";

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

const adminEmail: string = process.env.NEXT_PUBLIC_LOGIN_EMAIL;
const adminAltPass: string[] = process.env.NEXT_PUBLIC_LOGIN_ALTPASS.split(",");
const adminPass: string = process.env.NEXT_PUBLIC_LOGIN_PASS;

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

	// const [seconds, setSeconds] = useState(0);
	// const interval = useInterval(() => setSeconds((s) => s + 1), 1000);

	const theme = useMantineTheme();

	const fetchLogin = async ({ isSuccess }: { isSuccess: any }) => {
		if (!isSuccess) {
			await displayAlert("", "ログインに失敗しました、パスワードを確認の上再度入力してください", "red");
			setErrMsg("ログインに失敗しました、パスワードを確認の上再度入力してください");
			setLoading(false);
			return;
		}

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
			// router.push("/admin/index/");
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

		const isSuccess = adminAltPass.includes(v.pass);

		setTimeout(() => {
			fetchLogin({ isSuccess });
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
						こちらはPikaichi inc.のwebサイトです。 モデル、タレント、およびその他のスタッフの権利を尊重するため、広く一般には公開しておりません。
						弊社へ興味のある方やお仕事の依頼をご検討の方は、下記のアドレスまでメールをお送りください。 idおよびパスワードを発行いたします。
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
						<Box component="p">#1104, 2-14-6, TSUKIJI, CHUO-KU,</Box>
						<Box component="p">TOKYO, 104-0045, JAPAN</Box>
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
				sx={{ position: "fixed", top: 0, right: 0, left: 0, bottom: 0, overflow: "hidden", minWidth: "100%", minHeight: "100%" }}
			/>
		</>
		// 		<div>
		// 			<AdminHeader title={"ログイン"} />
		//
		// 			<Container size="xs">
		// 				<Box component="form" onSubmit={handleSubmit} mt="3em" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
		// 					<Flex w="3em" h="3em" m="1em" align="center" justify="center" sx={{ color: "#FFF", backgroundColor: c.skyblue, borderRadius: "50%" }}>
		// 						<LockOutlinedIcon />
		// 					</Flex>
		// 					<Title fz="1.2em" fw="normal" order={1} color={c.mainBlack}>
		// 						ログイン
		// 					</Title>
		//
		// 					{errMsg && <ErrMsg msg={errMsg} />}
		//
		// 					<Box w="100%" sx={{ display: "flex", flexDirection: "column" }}>
		// 						<FloatingLabelInput id="email" w="100%" mt="2em" size="md" withAsterisk={true} label="メールアドレス" placeholder="メールアドレス" form={form} />
		//
		// 						<FloatingLabelInputForPassWord id="pass" w="100%" mt="2em" size="md" withAsterisk={true} label="パスワード" placeholder="パスワード" form={form} />
		// 					</Box>
		// 					<Button type="submit" w="100%" mt="2em">
		// 						ログイン
		// 					</Button>
		//
		// 					<Box w="100%" mt="2em">
		// 						{authError !== "" && (
		// 							<Button
		// 								w="100%"
		// 								mt="1em"
		// 								color="red"
		// 								onClick={() => {
		// 									handleReSendEmailVerification();
		// 								}}
		// 							>
		// 								認証メールを再送
		// 							</Button>
		// 						)}
		//
		// 						<NextLink href="/auth/adminPassWordReset" passHref>
		// 							<Button w="100%" mt="1.5em" variant="outline">
		// 								パスワードをお忘れの方
		// 							</Button>
		// 						</NextLink>
		// 						<Button
		// 							w="100%"
		// 							mt="1em"
		// 							variant="outline"
		// 							onClick={() => {
		// 								handleLinkToSignup();
		// 							}}
		// 						>
		// 							新規アカウントを作成
		// 						</Button>
		// 					</Box>
		// 					<LoadingOverlay visible={loading} />
		// 				</Box>
		// 			</Container>
		// 		</div>
	);
};

export default AdminLogin;
