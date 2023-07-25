import NextLink from "next/link";

import { AlertComp, BigDialog, BigDialog2, ConfirmComp } from "../../components/commonComponents/alertComp";

import { sendPasswordReset } from "../../firebase/firebaseAuth";

import { useState } from "react";

import { AdminHeader } from "../../components/admin/adminHeader";

import * as Yup from "yup";

import { useDialogState } from "../../hooks/useDialogState";

import { c } from "../../styles/eStyle";

import { Box, Button, Container, Flex, LoadingOverlay, Title, Text } from "@mantine/core";
import { FloatingLabelInput, FloatingLabelInputForPassWord } from "../../components/commonComponents/formComponent";
import { useForm, yupResolver } from "@mantine/form";

export type FormValuesType = {
	email: string;
};

const AdminPassWordReset = () => {
	//

	const schema = Yup.object().shape({
		email: Yup.string().required("Emailは必須項目です").email("入力に誤りがあります"),
	});

	const form = useForm<FormValuesType>({
		initialValues: {
			email: "",
		},
		validate: yupResolver(schema),
	});

	// const [uid, setUid] = useState<string>("");

	const [loading, setLoading] = useState<boolean>(false);

	const [errMsg, setErrMsg] = useState<string>("");

	const { displayAlert, displayConfirm, displayConfirmSaveAs } = useDialogState();

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		setLoading(true);

		const { hasErrors } = form.validate();

		if (hasErrors) {
			await displayAlert("", "入力した内容をご確認ください", "red");
			setLoading(false);
			return;
		}

		const v = form.values;

		const res = await sendPasswordReset(v.email);
		setLoading(false);

		if (!res) {
			return;
		}

		if (res === "success") {
			await displayAlert("", "パスワードをリセットするメールを送信しました", "");
		} else if (res === "auth/user-not-found") {
			//メールアドレスは存在しない
			await displayAlert("", "入力されたメールアドレスは存在しませんでした", "red");
			setErrMsg("入力されたメールアドレスは存在しませんでした");
		} else if (res === "auth/invalid-email") {
			await displayAlert("", "入力されたメールアドレスは正しくありませんでした", "red");
			setErrMsg("入力されたメールアドレスは正しくありませんでした");
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
		<>
			<AdminHeader title={"パスワードのリセット"} />

			<Container size="xs">
				<Box component="form" onSubmit={handleSubmit} mt="3em" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
					<Title fz="1.2em" fw="normal" order={1} color={c.mainBlack}>
						パスワードリセット
					</Title>

					{errMsg && <ErrMsg msg={errMsg} />}

					<Box w="100%" sx={{ display: "flex", flexDirection: "column" }}>
						<FloatingLabelInput id="email" w="100%" mt="2em" size="md" withAsterisk={true} label="メールアドレス" placeholder="メールアドレス" form={form} />
					</Box>
					<Button type="submit" w="100%" mt="2em">
						パスワードリセット
					</Button>

					<Box w="100%" mt="2em">
						<NextLink href="/admin/login" passHref>
							<Button w="100%" mt="1.5em" variant="outline">
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

export default AdminPassWordReset;
