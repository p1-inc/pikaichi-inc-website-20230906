import { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import {
	dialogConfirmState,
	dialogAlertState,
	dialogAlertStateEX,
	dialogConfirmSaveState,
	dialogConfirmSaveAsState,
	bigDialogState,
	bigDialogState2,
	fullscreenLoadingState,
	modalWithJSXCompState,
} from "../recoil/atoms";

export const useDialogState = () => {
	//
	const setDialogAlert = useSetRecoilState(dialogAlertState);
	const setDialogAlertEX = useSetRecoilState(dialogAlertStateEX);

	const setDialogConfirm = useSetRecoilState(dialogConfirmState);
	const setDialogConfirmSave = useSetRecoilState(dialogConfirmSaveState);
	const setDialogConfirmSaveAs = useSetRecoilState(dialogConfirmSaveAsState);
	const setBigDialog = useSetRecoilState(bigDialogState);
	const setBigDialog2 = useSetRecoilState(bigDialogState2);

	const setFullscreenLoading = useSetRecoilState(fullscreenLoadingState);

	// const setModalWithJSXComp = useSetRecoilState(modalWithJSXCompState);

	const displayAlert = (title = "", msg = "", color = "") => {
		return new Promise<boolean>((resolve) => {
			setDialogAlert({
				visible: true,
				onClose: resolve,
				title: title,
				msg: msg,
				color: color,
			});
		});
	};

	const displayAlertEX = ({ title = "", msg = "", body = "", color = "" }: { title?: string; msg?: string; body?: string; color?: string }) => {
		return new Promise<boolean>((resolve) => {
			setDialogAlertEX({
				visible: true,
				onClose: resolve,
				title: title,
				msg: msg,
				body: body,
				color: color,
			});
		});
	};

	const displayConfirm = (title = "", msg = "", color = "") => {
		return new Promise<boolean>((resolve) => {
			setDialogConfirm({
				visible: true,
				onClose: resolve,
				title: title,
				msg: msg,
				color: color,
			});
		});
	};

	const displayConfirmSave = (title = "", msg = "", color = "") => {
		return new Promise((resolve) => {
			setDialogConfirmSave({
				visible: true,
				onClose: resolve,
				title: title,
				msg: msg,
				color: color,
			});
		});
	};

	const displayConfirmSaveAs = (title = "", msg = "", color = "") => {
		return new Promise((resolve) => {
			setDialogConfirmSaveAs({
				visible: true,
				onClose: resolve,
				title: title,
				msg: msg,
				color: color,
			});
		});
	};

	type headCellsType = {
		id: string;
		label: string;
		width: string;
	};
	const displayBigDialog = (title = "", msg = "", headCells: headCellsType[] = [], table: [string, string[]][] = [], color = "") => {
		return new Promise((resolve) => {
			setBigDialog({
				visible: true,
				onClose: resolve,
				title: title,
				msg: msg,
				headCells: headCells,
				table: table,
				color: color,
			});
		});
	};

	const displayBigDialog2 = (title = "", msg = "", headCells: headCellsType[] = [], table: [string, string[][]][] = [], color = "") => {
		return new Promise((resolve) => {
			setBigDialog2({
				visible: true,
				onClose: resolve,
				title: title,
				msg: msg,
				headCells: headCells,
				table: table,
				color: color,
			});
		});
	};

	const displayFullscreenLoading = (visible = true, msg = "", color = "") => {
		return new Promise((resolve) => {
			setFullscreenLoading({
				visible: visible,
				onClose: resolve,
				msg: msg,
				color: color,
			});
		});
	};

	// const modalWithJSXComp = ({ visible = true, JSX = null }: { visible?: boolean; JSX: JSX.Element }) => {
	// 	return new Promise((resolve) => {
	// 		setModalWithJSXComp({
	// 			visible: visible,
	// 			onClose: resolve,
	// 			JSX: JSX,
	// 		});
	// 	});
	// };

	return {
		setDialogAlert,
		displayAlert,

		setDialogAlertEX,
		displayAlertEX,

		setDialogConfirm,
		displayConfirm,

		setDialogConfirmSave,
		displayConfirmSave,

		setDialogConfirmSaveAs,
		displayConfirmSaveAs,

		setBigDialog,
		displayBigDialog,

		displayBigDialog2,

		displayFullscreenLoading,

		// modalWithJSXComp,
		// setModalWithJSXComp,
	};
};
