import React, { ReactNode } from "react";
import { AlertComp, AlertCompEX, BigDialog, BigDialog2, ConfirmComp, FullscreenLoading, ModalWithJSXComp } from "../../components/commonComponents/alertComp";

export const DialogProvider = ({ children }: { children: ReactNode }) => {
	//
	return (
		<>
			{children}
			<AlertComp />
			<AlertCompEX />
			<ConfirmComp />
			<BigDialog />
			<BigDialog2 />
			<FullscreenLoading />
			<ModalWithJSXComp />
		</>
	);
};
