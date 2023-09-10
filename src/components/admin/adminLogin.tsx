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
import { Box, Button, Container, createStyles, Flex, LoadingOverlay, Title, Text } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";

import * as Yup from "yup";
import { FloatingLabelInput, FloatingLabelInputForPassWord } from "../commonComponents/formComponent";

export type FormValuesType = {
	email: string;
	pass: string;
};

const AdminLogin = () => {
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

	const router = useRouter(); //useRouterフックを定義

	const [authUser, setAuthUser] = useRecoilState(authUserState);
	const [authError, setAuthError] = useRecoilState(authErrorState);

	const { displayAlert, displayAlertEX } = useDialogState();

	const [loading, setLoading] = useState<boolean>(false);

	const [errMsg, setErrMsg] = useState<string>("");

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

	const handleReSendEmailVerification = async () => {
		setLoading(true);

		const { hasErrors, errors } = form.validate();

		if (hasErrors) {
			if (Object.keys(errors).length > 1) {
				await displayAlert("", "メールアドレス、パスワードをご確認ください", "red");
				setLoading(false);
				return;
			}
			if (errors.email) {
				await displayAlert("", String(errors.email), "red");
				setLoading(false);
				return;
			}
			if (errors.pass) {
				await displayAlert("", String(errors.pass), "red");
				setLoading(false);
				return;
			}
		}

		const v = form.values;

		const res = await sendEmailVerificationFunc(v.email, v.pass);
		setLoading(false);

		if (res) {
			await displayAlertEX({
				title: "登録したアドレスに確認メールをお送りいたしました",
				msg: "しばらくお待ちの上、受信メールに記載されているURLをクリックして認証を完了してください",
				body: "確認メールが迷惑メールのフォルダに入っている場合もあります、こちらもご確認ください",
			});

			setAuthError("");
			// router.push("/admin/index/");
		} else {
			await displayAlert("", "失敗しました。問題が解決しない場合は、サポートまでお問い合わせください", "red");
		}
	};

	const handleLinkToSignup = () => {
		router.push("/auth/adminSignup/");
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
		<div>
			<AdminHeader title={"ログイン"} />

			<Container size="xs">
				<Box component="form" onSubmit={handleSubmit} mt="3em" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
					<Flex w="3em" h="3em" m="1em" align="center" justify="center" sx={{ color: "#FFF", backgroundColor: c.skyblue, borderRadius: "50%" }}>
						<LockOutlinedIcon />
					</Flex>
					<Title fz="1.2em" fw="normal" order={1} color={c.mainBlack}>
						ログイン
					</Title>

					{errMsg && <ErrMsg msg={errMsg} />}

					<Box w="100%" sx={{ display: "flex", flexDirection: "column" }}>
						<FloatingLabelInput id="email" w="100%" mt="2em" size="md" withAsterisk={true} label="メールアドレス" placeholder="メールアドレス" form={form} />

						<FloatingLabelInputForPassWord id="pass" w="100%" mt="2em" size="md" withAsterisk={true} label="パスワード" placeholder="パスワード" form={form} />
					</Box>
					<Button type="submit" w="100%" mt="2em">
						ログイン
					</Button>

					<Box w="100%" mt="2em">
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
					</Box>
					<LoadingOverlay visible={loading} />
				</Box>
			</Container>
		</div>
	);
};

export default AdminLogin;
