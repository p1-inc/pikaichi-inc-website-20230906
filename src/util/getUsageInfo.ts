export const getUsageInfo = (item: [string, string[][]]): [string, string[][]] | undefined => {
	if (!item) {
		return undefined;
	}

	const transList = [
		["topImage", "トップイメージ"],
		["topImageList", "--"],
		["campaign", "キャンペーン"],
		["campaignList", "--"],
		["people", "スタッフ"],
		["peopleList", "--"],
		["photoGallery", "フォトギャラリー"],
		["photoGalleryList", "--"],
		["users", "ユーザー"],
		["generalControls", "初期設定"],
	];

	const nMessage = item[1].map((data) => {
		let res;
		if (data[1] === "post") {
			const isMainImage = data[0].match(/(^.+)__mainImage$/);
			const isBodyImage = data[0].match(/(^.+)__body$/);
			let res2;
			if (isMainImage) {
				res = [`ID:${isMainImage[1].slice(0, 8)}`, "記事>メインイメージ"];
			} else if (isBodyImage) {
				res = [`ID:${isBodyImage[1].slice(0, 8)}`, "記事>本文"];
			}
		} else {
			res = data.map((d) => {
				const res = transList.find((d2) => d2[0] === d);
				return res ? res[1] : d;
			});
		}

		return res;
	});

	return [item[0], nMessage];
};
