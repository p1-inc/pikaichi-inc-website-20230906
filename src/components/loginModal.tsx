import { Anchor, Button, Flex, LoadingOverlay, Title, useMantineTheme } from "@mantine/core";
import NextImage from "next/future/image";

import { Box, Modal, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { authErrorState, authUserState } from "../recoil/atoms";
import { Auth, User, getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { IconLock } from "@tabler/icons-react";

import * as Yup from "yup";
import { useForm, yupResolver } from "@mantine/form";
import { loginAsAdminFunc } from "../firebase/firebaseAuth";
import { useDialogState } from "../hooks/useDialogState";
import { FloatingLabelInput, FloatingLabelInputForPassWord } from "./commonComponents/formComponent";

import { c, cArr } from "../styles/eStyle";
import { PikaichiLogo2 } from "../svg/pikaichiLogo2";

export type FormValuesType = {
	email: string;
	pass: string;
};

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BAKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

export const LoginModal = () => {
	//
	const schema = Yup.object().shape({
		email: Yup.string().required("Emailは必須項目です").email("入力に誤りがあります"),
		pass: Yup.string().required("PassWordは必須項目です"),
	});

	const form = useForm<FormValuesType>({
		initialValues: {
			email: "",
			pass: "",
		},
		validate: yupResolver(schema),
	});

	const [loading, setLoading] = useState(true);
	const [authUser, setAuthUser] = useRecoilState(authUserState);
	const [authError, setAuthError] = useRecoilState(authErrorState);

	const [errMsg, setErrMsg] = useState<string>("");

	const [openLoginWindow, setOpenLoginWindow] = useState(true);

	const { displayAlert, displayAlertEX } = useDialogState();

	useEffect(() => {
		const getRole = async (user: User, auth: Auth) => {
			if (user) {
				const token = await user?.getIdTokenResult();
				if (user.emailVerified && (token?.claims.role === "super" || token?.claims.role === "admin")) {
					setAuthUser({ uid: user.uid, displayName: user.displayName, email: user.email });
				} else {
					try {
						const res = await signOut(auth);
						setAuthUser({
							uid: "",
							displayName: "",
							email: "",
						});
					} catch (error) {
						console.log(error);
					}
				}
			}

			setLoading(false);
			return;
		};
		onAuthStateChanged(auth, (user) => {
			getRole(user, auth);
		});
	}, []);

	const theme = useMantineTheme();

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

		const res = await loginAsAdminFunc(v.email, v.pass);
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
			setAuthUser({ uid: v.pass, displayName: displayName, email: res.email });
			// router.push("/admin/index/");
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
		<Modal
			// opened={openLoginWindow}
			opened={Boolean(authUser.uid !== "")}
			onClose={() => {
				// setOpenLoginWindow(false);
			}}
			withCloseButton={false}
			overlayProps={{
				color: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2],
				opacity: 0.55,
				blur: 20,
			}}
			padding="2em"
		>
			<Box component="form" onSubmit={handleSubmit} mt="3em" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
				<PikaichiLogo2 width="8em" />
				<Text mt="2em" fz="0.9em" lh="1.8em">
					こちらはPikaichi inc.のwebサイトです。 モデル、タレント、およびその他のスタッフの権利を尊重するため、広く一般には公開しておりません。
					弊社へ興味のある方やお仕事の依頼をご検討の方は、下記のアドレスまでメールをお送りください。 idおよびパスワードを発行いたします。
				</Text>
				<Anchor href="mailto:info@pikaichi-inc.com">info@pikaichi-inc.com</Anchor>
				{errMsg && <ErrMsg msg={errMsg} />}

				<Box w="100%" sx={{ display: "flex", flexDirection: "column" }}>
					<FloatingLabelInput id="email" w="100%" mt="2em" size="md" withAsterisk={true} label="メールアドレス" placeholder="メールアドレス" form={form} />

					<FloatingLabelInputForPassWord id="pass" w="100%" mt="1em" size="md" withAsterisk={true} label="パスワード" placeholder="パスワード" form={form} />
				</Box>
				<Button type="submit" w="100%" mt="2em">
					ログイン
				</Button>

				{/* <Box w="100%" mt="2em">
					{authError !== "" && (
						<Button
							w="100%"
							mt="1em"
							color="red"
							onClick={() => {
								handleReSendEmailVerification();
							}}
						>
							認証メールを再送
						</Button>
					)}

					<NextLink href="/auth/adminPassWordReset" passHref>
						<Button w="100%" mt="1.5em" variant="outline">
							パスワードをお忘れの方
						</Button>
					</NextLink>
					<Button
						w="100%"
						mt="1em"
						variant="outline"
						onClick={() => {
							handleLinkToSignup();
						}}
					>
						新規アカウントを作成
					</Button>
				</Box> */}
				<LoadingOverlay visible={loading} />
			</Box>
		</Modal>
	);
};
