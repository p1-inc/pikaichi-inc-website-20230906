import { mqN, mqTitle, f, c, bp, bpMin } from "../styles/eStyle";
import { Box, Flex, SelectItem, TextInput } from "@mantine/core";
import { useMQ } from "../hooks/useMQ";
import { useForm, yupResolver } from "@mantine/form";
import * as Yup from "yup";
import { P1SelectField2, P1TextAreaField2, P1TextField2 } from "./layoutComp/P1TextField2";
import { FormEvent, useEffect, useState } from "react";
import { useDialogState } from "../hooks/useDialogState";
import { ExButton } from "./UILib/extendMantine";

const optionItems: SelectItem[] = [
	{ value: "hidden", label: "選択してください", hidden: true },
	{ value: "application", label: "サービスのお申込み", hidden: false },
	{ value: "inquiry", label: "サービスのお問い合わせ", hidden: false },
	{ value: "other", label: "その他", hidden: false },
];

type ContactType = {
	name: string;
	email: string;
	type: string;
	message: string;
	createdAt: string;
};

export default function Contact() {
	const { displayAlert } = useDialogState();

	const { mq } = useMQ();

	const [isFirstValidation, setIsFirstValidation] = useState<boolean>(false);

	const schema = Yup.object().shape({
		// name: Yup.string(),
		email: Yup.string().required("Emailは必須項目です").email("入力に誤りがあります"),
		// type: Yup.string(),
		// message: Yup.string(),
	});

	const form = useForm<ContactType>({
		initialValues: {
			name: "",
			email: "",
			type: "",
			message: "",
			createdAt: "",
		},

		validate: yupResolver(schema),
	});
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsFirstValidation(true);
		const { hasErrors, errors } = form.validate();
		if (hasErrors) {
			console.log("form.errors: ", form.errors);
			// const errorKey = Object.keys(errors);
			// console.log("errorKey: ", errorKey);
			await displayAlert("記入した内容をご確認ください", Object.values(form.errors).join(" "), "red");
			return;
		}

		console.log(form.values);
	};

	return (
		<Box
			component="form"
			w={mq.sp ? "95%" : "90%"}
			m="0 auto"
			maw="40em"
			miw="15em"
			onSubmit={(e) => {
				handleSubmit(e);
			}}
		>
			{/* <ContactComponent /> */}
			<Flex direction="column" gap="0.8em">
				<P1TextField2
					borderWeight="0.2em"
					radius="0.7em"
					borderColor={c.blue}
					size="lg"
					fontSize="1.1em"
					label="お名前またはニックネーム"
					textColor={c.mainBlack}
					form={form.getInputProps("name")}
				/>

				<P1TextField2
					borderWeight="0.2em"
					radius="0.7em"
					borderColor={c.yellowgreen}
					size="lg"
					fontSize="1.1em"
					label="メールアドレス"
					textColor={c.mainBlack}
					form={form.getInputProps("email")}
				/>

				<P1SelectField2
					data={optionItems}
					placeholder="選択してください"
					borderWeight="0.2em"
					radius="0.7em"
					borderColor={c.yellow}
					size="lg"
					w="50%"
					miw="20em"
					fontSize="1.5em"
					label="メールアドレス"
					textColor={c.mainBlack}
					form={form.getInputProps("type")}
				/>

				<P1TextAreaField2
					borderWeight="0.2em"
					radius="0.7em"
					borderColor={c.purple}
					size="lg"
					fontSize="1.1em"
					label="お問い合わせ内容"
					autosize
					minRows={4}
					textColor={c.mainBlack}
					form={form.getInputProps("message")}
				/>
			</Flex>
			<ExButton type="submit" bc={c.blue} w="100%" size="lg" radius="0.7em" mt="1em">
				お申し込み＆お問合わせ
			</ExButton>
		</Box>
	);
}
