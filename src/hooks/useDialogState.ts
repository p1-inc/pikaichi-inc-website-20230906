import { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import {
	dialogConfirmState,
	dialogAlertState,
	dialogConfirmSaveState,
	dialogConfirmSaveAsState,
	bigDialogState,
	bigDialogState2,

	// loadingOverlayState,
} from "../recoil/atoms";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; //セルの記号の順番

export const useDialogState = () => {
	//
	const setDialogAlert = useSetRecoilState(dialogAlertState);
	const setDialogConfirm = useSetRecoilState(dialogConfirmState);
	const setDialogConfirmSave = useSetRecoilState(dialogConfirmSaveState);
	const setDialogConfirmSaveAs = useSetRecoilState(dialogConfirmSaveAsState);
	const setBigDialog = useSetRecoilState(bigDialogState);
	const setBigDialog2 = useSetRecoilState(bigDialogState2);

	// const setLoadingOverlay = useSetRecoilState(loadingOverlayState);

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

	// const displayLoadingOverlay = (open: boolean) => {
	// 	return new Promise((resolve) => {
	// 		setLoadingOverlay(open);
	// 	});
	// };

	return {
		setDialogAlert,
		displayConfirm,

		setDialogConfirm,
		displayAlert,

		setDialogConfirmSave,
		displayConfirmSave,

		setDialogConfirmSaveAs,
		displayConfirmSaveAs,

		setBigDialog,
		displayBigDialog,

		displayBigDialog2,

		// setLoadingOverlay,
		// displayLoadingOverlay,
	};
};
