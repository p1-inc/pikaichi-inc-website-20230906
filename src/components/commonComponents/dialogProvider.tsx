import React, { ReactNode } from "react";
import { AlertComp, BigDialog, BigDialog2, ConfirmComp, FullscreenLoading } from "../../components/commonComponents/alertComp";

export const DialogProvider = ({ children }: { children: ReactNode }) => {
	//
	return (
		<>
			{children}
			<AlertComp />
			<ConfirmComp />
			<BigDialog />
			<BigDialog2 />
			<FullscreenLoading />
		</>
	);
};
