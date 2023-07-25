import React, { useState, useEffect, useCallback, useMemo, Fragment } from "react";
import { useRecoilState } from "recoil";

import {
	dialogConfirmState,
	dialogAlertState,
	dialogConfirmSaveState,
	dialogConfirmSaveAsState,
	bigDialogState,
	bigDialogState2,
	fullscreenLoadingState,
} from "../../recoil/atoms";

import { Affix, Box, Button, Flex, Loader, LoadingOverlay, Modal, Overlay, Table, Text } from "@mantine/core";

const replaceBS = (text: string) => {
	const nText = text.split("\n");
	return (
		<div>
			{nText.map((txt, index) => (
				<div key={`${text}${index}`}>{txt}</div>
			))}
		</div>
	);
};

export const AlertComp = () => {
	//
	const [dialogAlert, setDialogAlert] = useRecoilState(dialogAlertState);

	const handleClose = (prop: boolean) => {
		if (dialogAlert.onClose) {
			dialogAlert.onClose(prop);
		}

		setDialogAlert({
			visible: false,
			onClose: undefined,
			title: "",
			msg: "",
			color: "",
		});
	};

	return (
		<Modal
			zIndex={1000}
			opened={dialogAlert?.visible}
			onClose={() => {
				handleClose(true);
			}}
			title={dialogAlert.title}
			styles={{ header: { color: dialogAlert.color } }}
		>
			<Flex direction="column">
				<Text c={dialogAlert.color}>{replaceBS(dialogAlert.msg)}</Text>
				<Button
					ml="auto"
					mr="0"
					mt="1em"
					onClick={() => {
						handleClose(true);
					}}
				>
					O K
				</Button>
			</Flex>
		</Modal>
	);
};

//

export const ConfirmComp = () => {
	//
	const [dialogConfirm, setDialogConfirm] = useRecoilState(dialogConfirmState);

	const handleClose = (prop: boolean) => {
		if (dialogConfirm.onClose) {
			dialogConfirm.onClose(prop);
		}

		setDialogConfirm({
			visible: false,
			onClose: undefined,
			title: "",
			msg: "",
			color: "",
		});
	};

	return (
		<Modal
			zIndex={1000}
			opened={dialogConfirm?.visible}
			onClose={() => {
				handleClose(true);
			}}
			title={dialogConfirm.title}
		>
			<Flex direction="column" gap="1em">
				<Text c={dialogConfirm.color}>{replaceBS(dialogConfirm.msg)}</Text>

				<Flex ml="auto" mt="1em" gap="1em">
					<Button
						variant="outline"
						onClick={() => {
							handleClose(false);
						}}
					>
						キャンセル
					</Button>
					<Button
						onClick={() => {
							handleClose(true);
						}}
					>
						O K
					</Button>
				</Flex>
			</Flex>
		</Modal>
	);
};

export const BigDialog = () => {
	//
	const [displayBigDialog, setDisplayBigDialog] = useRecoilState(bigDialogState);

	const headCells = displayBigDialog.headCells || [
		{
			id: "id",
			label: "データ名",
			width: "20em",
		},
		{
			id: "usage",
			label: "データの使用状況",
			width: "50em",
		},
	];

	const handleClose = (prop: boolean) => {
		if (displayBigDialog.onClose) {
			displayBigDialog.onClose(prop);
		}

		setDisplayBigDialog({
			visible: false,
			onClose: undefined,
			title: "",
			msg: "",
			color: "",
		});
	};

	const rows = displayBigDialog?.table?.map((row: [string, string[]]) => {
		return (
			<tr key={row[0]}>
				<td>{row[0]}</td>
				<td>
					{row[1].map((d, index) => (
						<div key={`key${index}`}>{d}</div>
					))}
				</td>
			</tr>
		);
	});

	return (
		<Modal
			size="xl"
			zIndex={1000}
			opened={displayBigDialog?.visible}
			onClose={() => {
				handleClose(true);
			}}
			title={displayBigDialog?.title}
		>
			<Flex direction="column" gap="1em">
				<Text mb="1.5em" c={displayBigDialog.color}>
					{replaceBS(displayBigDialog.msg)}
				</Text>
				<Table striped>
					<thead>
						<tr>
							{headCells.map((headCell: { id: string; label: string }) => (
								<th key={headCell.id}>{headCell.label}</th>
							))}
						</tr>
					</thead>
					<tbody>{rows}</tbody>
				</Table>

				<Flex ml="auto" gap="1em">
					<Button
						onClick={() => {
							handleClose(true);
						}}
					>
						O K
					</Button>
				</Flex>
			</Flex>
		</Modal>
	);
};

export const BigDialog2 = () => {
	//
	const [displayBigDialog, setDisplayBigDialog] = useRecoilState(bigDialogState2);
	const headCells = displayBigDialog.headCells || [
		{
			id: "id",
			label: "データ名",
			width: "20em",
		},
		{
			id: "usage",
			label: "データの使用状況",
			width: "50em",
		},
	];

	const handleClose = (prop: boolean) => {
		if (displayBigDialog.onClose) {
			displayBigDialog.onClose(prop);
		}

		setDisplayBigDialog({
			visible: false,
			onClose: undefined,
			title: "",
			msg: "",
			color: "",
		});
	};

	const rows = displayBigDialog?.table?.map((row: [string, string[]]) => {
		return (
			<tr key={row[0]}>
				<td>{row[0]}</td>
				<td>
					{row[1].map((d, index) => (
						<div key={`key${index}`}>{d}</div>
					))}
				</td>
			</tr>
		);
	});

	return (
		<Modal
			size="xl"
			zIndex={1000}
			opened={displayBigDialog?.visible}
			onClose={() => {
				handleClose(true);
			}}
			title={displayBigDialog?.title}
		>
			<Flex direction="column" gap="1em">
				<Text mb="1.5em" c={displayBigDialog.color}>
					{replaceBS(displayBigDialog.msg)}
				</Text>
				<Table striped>
					<thead>
						<tr>
							{headCells.map((headCell: { id: string; label: string }) => (
								<th key={headCell.id}>{headCell.label}</th>
							))}
						</tr>
					</thead>
					<tbody>{rows}</tbody>
				</Table>

				<Flex ml="auto" gap="1em">
					<Button
						onClick={() => {
							handleClose(true);
						}}
					>
						O K
					</Button>
				</Flex>
			</Flex>
		</Modal>
	);
};

export const FullscreenLoading = () => {
	//
	const [fullscreenLoading, setFullscreenLoading] = useRecoilState(fullscreenLoadingState);

	if (fullscreenLoading.onClose) {
		fullscreenLoading.onClose(true);
	}

	return (
		<Affix w="100vw" h="100vh" display={fullscreenLoading?.visible ? "block" : "none"}>
			<Overlay blur={5} center color="#FFF">
				<Flex direction="column" align="center" justify="center" gap="0.5em">
					<Loader size="lg" />
					<Text fz="1em">保存中...</Text>
				</Flex>
			</Overlay>
		</Affix>
	);
};
