export const autoID = (digit = 40) => {
	const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	//先頭の文字は数値以外にする。オブジェクトのキーになったとき数字だと不都合なため
	let autoId = alpha.charAt(Math.floor(Math.random() * alpha.length));

	for (let i = 0; i < digit - 1; i++) {
		autoId += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	return autoId;
};
