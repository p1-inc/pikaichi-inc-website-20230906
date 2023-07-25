import { atom } from "recoil";
import { GeneralControlType } from "../types/types";

type DialogType = {
	visible: boolean;
	onClose: (value: boolean | PromiseLike<boolean>) => void;
	title: string;
	msg: string;
	headCells?: any;
	table?: any;
	color: string;
};

type UserType = {
	uid: string;
	displayName: string;
	email: string;
};

///////////////////////////認証/////////////////////////////////
export const authUserState = atom<UserType>({
	key: "authUser",
	default: {
		uid: "",
		displayName: "",
		email: "",
	},
});

///////////////////////////認証エラー/////////////////////////////////
type AuthErrorType = "" | "noEmailVerified" | "noAdminRole" | "auth/too-many-requests";
export const authErrorState = atom<AuthErrorType>({
	key: "authError",
	default: "",
});

///////////////////////////初期設定/////////////////////////////////
export const generalControlsState = atom<GeneralControlType>({
	key: "generalControls",
	default: {
		domain: "",
		description: "",
		copyrite: "",
		logoImg: "",
		webTitle: "",
		email: "",
		favicon: "",
		ogImage: "",
	},
});

/////////////////////////////////////////////////////////////////////
export const dialogAlertState = atom<DialogType>({
	key: "dialogAlert",
	default: {
		visible: false,
		onClose: undefined,
		title: "",
		msg: "",
		color: "",
	},
});

export const dialogConfirmState = atom<DialogType>({
	key: "dialogConfirm",
	default: {
		visible: false,
		onClose: undefined,
		title: "",
		msg: "",
		color: "",
	},
});

export const dialogConfirmSaveState = atom<DialogType>({
	key: "dialogConfirmSave",
	default: {
		visible: false,
		onClose: undefined,
		title: "",
		msg: "",
		color: "",
	},
});

export const dialogConfirmSaveAsState = atom<DialogType>({
	key: "dialogConfirmSaveAs",
	default: {
		visible: false,
		onClose: undefined,
		title: "",
		msg: "",
		color: "",
	},
});

export const bigDialogState = atom<DialogType>({
	key: "bigDialog",
	default: {
		visible: false,
		onClose: undefined,
		title: "",
		msg: "",
		headCells: [],
		table: [],
		color: "",
	},
});

export const bigDialogState2 = atom<DialogType>({
	key: "bigDialog2",
	default: {
		visible: false,
		onClose: undefined,
		title: "",
		msg: "",
		headCells: [],
		table: [],
		color: "",
	},
});

type FullscreenLoadingType = {
	visible: boolean;
	onClose: (value: boolean | PromiseLike<boolean>) => void;
	msg: string;
	color: string;
};

export const fullscreenLoadingState = atom<FullscreenLoadingType>({
	key: "fullscreenLoading",
	default: {
		visible: false,
		onClose: undefined,
		msg: "",
		color: "",
	},
});

///////////////////////////Admin（管理・編集かどうか）　　プレビュー用の画像生成する際に必要/////////////////////////////////
export const isAdminState = atom<boolean>({
	key: "isAdmin",
	default: false,
});
