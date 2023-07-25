import { useState } from "react";
import { useRouter } from "next/router";

import NextLink from "next/link";

import { AlertComp, BigDialog, BigDialog2, ConfirmComp } from "../../components/commonComponents/alertComp";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { sendEmailVerificationFunc, signupFunc } from "../../firebase/firebaseAuth";

import { useDialogState } from "../../hooks/useDialogState";

import { c } from "../../styles/eStyle";

import { AdminHeader } from "../../components/admin/adminHeader";

import * as Yup from "yup";
import { useForm, yupResolver } from "@mantine/form";

import { Box, Button, Container, createStyles, Flex, LoadingOverlay, Title } from "@mantine/core";
import { FloatingLabelInput, FloatingLabelInputForPassWord } from "../../components/commonComponents/formComponent";

export type FormValuesType = {
	email: string;
	pass: string;
};

const AdminSignup = () => {
	//

	//TODO signUpに失敗すると、サポートに連絡してくださいと、表示されるサポートの連絡先を作る
	const schema = Yup.object().shape({
		email: Yup.string().required("Emailは必須項目です").email("Emailの入力に誤りがあります"),
		pass: Yup.string()
			.required("PassWordは必須項目です")
			.min(6, "PassWordの文字数は6文字以上にしてください")
			.max(30, "PassWordの文字数は30文字以下にしてください"),
	});

	const form = useForm<FormValuesType>({
		initialValues: {
			email: "",
			pass: "",
		},
		validate: yupResolver(schema),
	});

	const router = useRouter();

	const [loading, setLoading] = useState<boolean>(false);

	const { displayAlert, displayConfirm, displayConfirmSaveAs } = useDialogState();

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		setLoading(true);

		const { hasErrors, errors } = form.validate();

		if (hasErrors) {
			if (Object.keys(errors).length > 1) {
				await displayAlert("", "入力した内容をご確認ください", "red");
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

		const res = await signupFunc(v.email, v.pass);
		setLoading(false);

		if (res === "auth/email-already-in-use") {
			await displayAlert(
				"",
				"入力したメールアドレスは既に登録されています。このメールアドレスを使用される場合は、ログイン画面に戻ってログインしてください。パスワードがお忘れの方はログイン画面からパスワードの再発行をお願いします",
				"",
			);

			router.push("/admin/index/");
		} else if (res) {
			await displayAlert(
				"",
				"登録したアドレスに確認メールをお送りいたしました。しばらくお待ちの上、受信メールに記載されているURLをクリックして認証を完了してください。（確認メールが迷惑メールのフォルダに入っている場合もあります、こちらもご確認ください）",
				"",
			);
			router.push("/admin/index/");
		} else {
			await displayAlert("", "アカウント登録に失敗しました。再度登録してください。問題が解決しない場合は、サポートまでお問い合わせください", "red");
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
			await displayAlert(
				"",
				"登録したアドレスに確認メールをお送りいたしました。しばらくお待ちの上、受信メールに記載されているURLをクリックして認証を完了してください。（確認メールが迷惑メールのフォルダに入っている場合もあります、こちらもご確認ください）",
				"",
			);

			router.push("/admin/index/");
		} else {
			await displayAlert("", "失敗しました。問題が解決しない場合は、サポートまでお問い合わせください", "red");
		}
	};

	return (
		<>
			<AdminHeader title={"新規ユーザー登録"} color={c.green} />

			<Container size="xs">
				<Box component="form" onSubmit={handleSubmit} mt="3em" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
					<Flex w="3em" h="3em" m="1em" align="center" justify="center" sx={{ color: "#FFF", backgroundColor: c.green, borderRadius: "50%" }}>
						<LockOutlinedIcon />
					</Flex>
					<Title fz="1.2em" fw="normal" order={1}>
						ログイン
					</Title>

					<Box w="100%" sx={{ display: "flex", flexDirection: "column" }}>
						<FloatingLabelInput
							color="teal"
							id="email"
							w="100%"
							mt="2em"
							size="md"
							withAsterisk={true}
							label="メールアドレス"
							placeholder="メールアドレス"
							form={form}
						/>

						<FloatingLabelInputForPassWord
							color="teal"
							id="pass"
							w="100%"
							mt="2em"
							size="md"
							withAsterisk={true}
							label="パスワード"
							placeholder="パスワード"
							form={form}
						/>
					</Box>
					<Button type="submit" w="100%" mt="2em" color="teal">
						新規ユーザー登録
					</Button>

					<Box w="100%" mt="2em">
						<Button
							w="100%"
							mt="1em"
							variant="outline"
							color="teal"
							onClick={() => {
								handleReSendEmailVerification();
							}}
						>
							認証メールを再送
						</Button>
						<NextLink href="/admin/login" passHref>
							<Button w="100%" mt="1.5em" variant="outline" color="teal">
								ログイン画面へ
							</Button>
						</NextLink>
					</Box>

					<LoadingOverlay visible={loading} />
				</Box>
			</Container>
			{/* <AlertComp />
			<ConfirmComp />
			<BigDialog />
			<BigDialog2 /> */}
		</>
	);
};

export default AdminSignup;
