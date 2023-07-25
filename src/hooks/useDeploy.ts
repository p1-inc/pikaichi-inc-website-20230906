import { useState, useEffect } from "react";

import { deployDatabase } from "../firebase/firebase";
import { useDialogState } from "./useDialogState";

export const useDeploy = () => {
	//
	const [loading, setLoading] = useState<boolean>(false);
	const { displayAlert, displayFullscreenLoading } = useDialogState();

	const handleDeploy = async () => {
		displayFullscreenLoading(true);

		let res;
		try {
			res = await deployDatabase();
		} catch (error) {
			await displayAlert("", "反映に失敗しました", "red");
			displayFullscreenLoading(false);
		}

		const vercelDeployUrl = process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_URL;
		if (!vercelDeployUrl) throw new Error("VERCEL_DEPLOY_環境変数が設定されていません。");

		if (res === "success") {
			displayFullscreenLoading(false);
			await displayAlert("", "設定を反映しました", "");
			await fetch(vercelDeployUrl, { method: "POST" });
		} else {
			await displayAlert("", "反映に失敗しました", "red");
		}
		displayFullscreenLoading(false);
	};

	return { handleDeploy, loading };
};
