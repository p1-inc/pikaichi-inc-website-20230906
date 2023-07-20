export interface LogType {
	code: string;
	type: "fatal" | "error" | "warn" | "info"; // 致命的 | エラー | 警告 | 情報
	message: string;
	createdAt: string;
}

//TODO ログコードとは?
// storage　=> trash 移動 :m101
// trash を消去 : m102
// missingImage（firestoreににあるのにstorageに存在しない画像）が見つかった : m103
// deploy失敗: m104
