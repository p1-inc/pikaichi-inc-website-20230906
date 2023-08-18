import { useEffect, useState, useRef, forwardRef } from "react";
import Head from "next/head";

import { useForm, yupResolver } from "@mantine/form";
import { Box } from "@mantine/core";

import dayjs from "dayjs";

import { getAllUserList, getImageSrc, getMediaLib, setUserData } from "../../../firebase/firebase";
import { useRouter } from "next/router";

import { AdminHeader } from "../adminHeader";

import { UserType, UserRoleType, MediaLib } from "../../../types/types";

import { useDialogState } from "../../../hooks/useDialogState";

import * as Yup from "yup";

import {
	FormImageFieldComponent,
	FormNumberFieldComponent,
	FormSelectFieldComponent,
	FormTextAreaComponent,
	FormTextFieldComponent,
} from "../../commonComponents/formComponent";

import { AdminSubHeader } from "../adminSubHeader";
import { autoID } from "../../../util/autoID";
import { getDateFormat } from "../../../util/getDateFormat";
import { useRecoilState, useRecoilValue } from "recoil";
import { FormEditContainer, FormMainContainer } from "../../commonComponents/formContainer";

export default function EditUser({ id, isDuplicate }: { id: string; isDuplicate: boolean }) {
	//
	const componentName = "ユーザーの管理";

	const schema = Yup.object().shape({
		displayName: Yup.string().required("名前は必須項目です"),
		age: Yup.number().min(0, "正しい年齢を入力してください").max(130, "正しい年齢を入力してください"),
		zipCode: Yup.string().trim().matches(/^(|[0-9]{3}-?[0-9]{4})$/, "入力に誤りがあります"),
		phoneNumber: Yup.string().trim().matches(/^(|0[-0-9]{9,12})$/, "入力に誤りがあります"),
		namePronunciation: Yup.string().matches(/^[ 　あ-ん゛゜ぁ-ぉゃ-ょー]+$/, "ひらがなで入力してください"),
	});

	const form = useForm<UserType>({
		initialValues: {
			id: "",
			enabled: false,
			email: "",
			displayName: "",
			namePronunciation: "",
			age: 0,
			address: "",
			zipCode: "",
			phoneNumber: "",
			position: "",
			text: "",
			imageId: "",
			src: "",
			srcHigh: "",

			note: "",
			role: "user",
			createdAt: "",
			updatedAt: "",
		},

		validate: yupResolver(schema),
	});

	const router = useRouter(); //useRouterフックを定義

	const [image, setImage] = useState<MediaLib>();

	const [mediaLib, setMediaLib] = useState<MediaLib[]>();

	const [saveLoading, setSaveLoading] = useState<boolean>(false);

	const { displayAlert } = useDialogState();

	useEffect(() => {
		const f = async () => {
			const userData = await getAllUserList();
			const mediaLib = await getMediaLib();
			setMediaLib(mediaLib);

			if (id) {
				const d = userData.find((d) => d.id === id);

				const imgData = mediaLib.find((media) => media.id === d.imageId);

				let newId: string;
				let newDispName: string;
				let newCreatedAt: string;
				let newUpdatedAt: string;

				if (isDuplicate) {
					newId = autoID();
					newDispName = `${d.displayName}（コピー）`;
					newCreatedAt = "";
					newUpdatedAt = "";
				} else {
					newId = d.id;
					newDispName = d.displayName;
					newCreatedAt = d.createdAt;
					newUpdatedAt = d.updatedAt;
				}

				setImage(imgData);

				form.setValues({
					...d,
					id: newId,
					displayName: newDispName,
					createdAt: newCreatedAt,
					updatedAt: newUpdatedAt,
				});
			}
		};
		f();
	}, []);

	useEffect(() => {
		if (image) {
			form.setValues({
				imageId: image.id,
				src: image.src,
				srcHigh: image.srcHigh,
			});
		} else {
			form.setValues({
				imageId: "",
				src: "",
				srcHigh: "",
			});
		}
	}, [image]);

	const handleSave = async () => {
		//
		const { hasErrors } = form.validate();

		if (hasErrors) {
			await displayAlert("", "保存できませんでした。入力した内容をご確認ください", "red");
			return;
		}

		let tmpCreatedAt;
		let tmpUpdatedAt;

		const now = dayjs();

		if (!form.values.createdAt || form.values.createdAt === "") {
			const day = now.format("YYYY-MM-DD-HH-mm-ss");
			tmpCreatedAt = day;
			tmpUpdatedAt = day;
		} else {
			tmpCreatedAt = form.values.createdAt;
			tmpUpdatedAt = now.format("YYYY-MM-DD-HH-mm-ss");
		}

		const newId = form.values.id;

		const v = form.values;

		const data: UserType = {
			...v,
			id: newId,
			createdAt: tmpCreatedAt,
			updatedAt: tmpUpdatedAt,
		};

		setSaveLoading(true);

		try {
			const result = await setUserData(data);

			if (result === "success") {
				await displayAlert("", "保存しました", "");
			} else {
				await displayAlert("", "保存に失敗しました", "red");
			}
		} catch (error) {
			await displayAlert("", "失敗しました", "");
			console.log(error);
		}

		setSaveLoading(false);
		router.push(`/admin/editUser/?id=${newId}`);
	};

	const handleBack = async () => {
		router.push("/admin/userList/");
	};

	const userRole: { value: UserRoleType; label: string }[] = [
		{ value: "super", label: "管理者（最上位）" },
		{ value: "admin", label: "管理者" },
		{ value: "staff", label: "スタッフ" },
		{ value: "user", label: "一般" },
	];

	const SelectItem = forwardRef<HTMLDivElement, any>(({ value, label, ...others }, ref) => (
		<div ref={ref} {...others}>
			<div key={id}>{label}</div>
		</div>
	));
	SelectItem.displayName = "SelectItem";

	return (
		<FormMainContainer>
			<Head>
				<title>{componentName}</title>
			</Head>

			<AdminHeader title={componentName} />

			<AdminSubHeader idState={form.values.id} handleSave={handleSave} handleBack={handleBack} saveLoading={saveLoading} />

			<FormEditContainer ml="5vw" width="48em">
				<Box sx={{ width: "90%", margin: "3em auto 3em auto" }}>
					<FormImageFieldComponent
						title="ユーザー画像"
						titleWidth="7em"
						require={true}
						image={image}
						setImage={setImage}
						mediaLib={mediaLib}
						setMediaLib={setMediaLib}
						width="15em"
						height="15em"
						type="user"
						trimCircle={true}
					/>

					<FormTextFieldComponent title="名前" width="20em" titleWidth="7em" formProps={form.getInputProps("displayName")} require={true} />

					<FormTextFieldComponent title="ふりがな" width="20em" titleWidth="7em" formProps={form.getInputProps("namePronunciation")} require={true} />

					<FormNumberFieldComponent title="年齢" width="10em" unit="才" formProps={form.getInputProps("age")} />

					<FormTextFieldComponent
						title="Eメール"
						width="20em"
						titleWidth="7em"
						readOnly={true}
						formProps={form.getInputProps("email")}
						tooltip="Eメールは変更できません"
					/>

					<FormSelectFieldComponent
						title="権限"
						width="10em"
						titleWidth="7em"
						data={userRole}
						itemComponent={SelectItem}
						formProps={form.getInputProps("role")}
						helperText="※注意：管理者はすべてのユーザーデータを閲覧・変更することができます。管理者(最上位)は権限を変更することはできません
						"
						disabled={form.values.role === "super"}
					/>

					<FormTextFieldComponent title="郵便番号" width="10em" titleWidth="7em" placeholder="123-4567" formProps={form.getInputProps("zipCode")} />

					<FormTextFieldComponent title="住所" width="32em" titleWidth="7em" formProps={form.getInputProps("address")} />

					<FormTextFieldComponent title="電話番号" width="20em" titleWidth="7em" formProps={form.getInputProps("phoneNumber")} />

					<FormTextAreaComponent title="自己紹介" width="32em" titleWidth="7em" rows={5} formProps={form.getInputProps("text")} />

					<FormTextAreaComponent title="備考" width="32em" titleWidth="7em" formProps={form.getInputProps("note")} />

					<FormTextFieldComponent
						readOnly
						title="作成日"
						width="18em"
						titleWidth="7em"
						value={getDateFormat(form.values.createdAt)}
						tooltip="作成日は変更できません"
					/>

					<FormTextFieldComponent
						readOnly
						title="更新日"
						width="18em"
						titleWidth="7em"
						value={getDateFormat(form.values.updatedAt)}
						tooltip="更新日は変更できません"
					/>
				</Box>
			</FormEditContainer>
		</FormMainContainer>
	);
}
