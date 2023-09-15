export type WorksDataType = {
	id: string;
	title: string;
	titleEn: string;
	stuff: { [index: string]: string }[];
	srcPC: string;
	srcSP: string;
	widthPC: number;
	widthSP: number;
	heightPC: number;
	heightSP: number;
	filePathPC: string;
	filePathSP: string;
};

export const worksData: WorksDataType[] = [
	{
		id: "aichi-banpaku",
		filePathPC: "aichi-banpaku/aichi-banpaku_01.jpg",
		filePathSP: "aichi-banpaku/aichi-banpaku_02.jpg",
		title: "愛知万博 日本政府出展事業",
		titleEn: "Aichi banpaku",
		stuff: [{ client: "経済産業省" }, { CD: "Jiro Kanahara" }, { "AD+D": "Hikaru Shimzu" }],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},
	{
		id: "budweiser01",
		filePathPC: "budweiser01.jpg",
		filePathSP: "budweiser01.jpg",
		title: "Budweiser",
		titleEn: "Budweiser",
		stuff: [{ "CD+AD": "Hikaru Shimzu" }, { C: "yohei kawano" }],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},
	{
		id: "donbee",
		filePathPC: "donbee.jpg",
		filePathSP: "donbee.jpg",
		title: "日進どん兵衛",
		titleEn: "Nissin Donbe",
		stuff: [{ "CD+C": "Ken Shimzu" }, { AD: "Hikaru Shimzu" }, { D: "Hiromi Oshima" }],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},
	{
		id: "hottomotto01",
		filePathPC: "hottomotto01.jpg",
		filePathSP: "hottomotto01.jpg",
		title: "ほっともっと",
		titleEn: "Hotto Motto",
		stuff: [{ "CD+C": "Ken Shimzu" }, { CMP: "Makoto Yoshida" }, { AD: "Hikaru Shimzu" }, { D: "Hiromi Oshima" }],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},
	{
		id: "hottomotto02",
		filePathPC: "hottomotto02.jpg",
		filePathSP: "hottomotto02.jpg",
		title: "ほっともっと",
		titleEn: "Hotto Motto",
		stuff: [{ "CD+C": "Ken Shimzu" }, { AD: "Hikaru Shimzu" }, { D: "Hiromi Oshima" }],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},
	{
		id: "illust",
		filePathPC: "illust.jpg",
		filePathSP: "illust.jpg",
		title: "雑誌挿絵イラスト",
		titleEn: "Illustration",
		stuff: [{ I: "Hikaru Shimzu" }],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},
	{
		id: "jagariko",
		filePathPC: "jagariko/jagariko_01.jpg",
		filePathSP: "jagariko/jagariko_02.jpg",
		title: "カルビーじゃがりこ",
		titleEn: "Calbee Jagariko",
		stuff: [
			{ client: "カルビー株式会社" },
			{ CD: "Isamu Nakaigawa" },
			{ CMP: "Yashushi Kanada\nMitsuru Murahashi\nMasaya Adachi" },
			{ AD: "Hikaru Shimzu" },
			{ D: "Hiromi Oshima" },
			{ Dir: "Erika Konno" },
			{ Photo: "Muga Miyahara" },
			{ St: "Takashi Yamamoto" },
			{ Hm: "SHIZUE、Yumi Nemoto" },
		],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},
	{
		id: "jimintou",
		filePathPC: "jimintou.jpg",
		filePathSP: "jimintou.jpg",
		title: "自民党",
		titleEn: "Jiminto",
		stuff: [{ CD: "Isamu Nakaigawa" }, { AD: "Hikaru Shimzu" }, { D: "Hiromi Oshima" }],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},
	{
		id: "kamenrider01",
		filePathPC: "kamenrider01.jpg",
		filePathSP: "kamenrider01.jpg",
		title: "仮面ライダー",
		titleEn: "Kamen Rider",
		stuff: [{ "CD+C": "Ken Shimzu" }, { AD: "Hikaru Shimzu" }],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},
	{
		id: "kamenrider02",
		filePathPC: "kamenrider02.jpg",
		filePathSP: "kamenrider02.jpg",
		title: "仮面ライダー",
		titleEn: "Kamen Rider",
		stuff: [{ "CD+C": "Ken Shimzu", AD: "Hikaru Shimzu" }, { D: "Hiromi Oshima" }],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},
	{
		id: "kamenrider03",
		filePathPC: "kamenrider03.jpg",
		filePathSP: "kamenrider03.jpg",
		title: "仮面ライダー",
		titleEn: "Kamen Rider",
		stuff: [{ "CD+C": "Ken Shimzu" }, { AD: "Hikaru Shimzu" }, { D: "Hiromi Oshima" }],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},
	{
		id: "bathclin",
		filePathPC: "bathclin/bathclin_01.jpg",
		filePathSP: "bathclin/bathclin_02.jpg",
		title: "バスクリン きき湯",
		titleEn: "Bathclin Kikiyu",
		stuff: [{ "CD+C": "Ken Shimzu" }, { AD: "Hikaru Shimzu" }, { D: "Hiromi Oshima" }, { Photo: "Toshinobu Kobayashi" }],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},
	{
		id: "lawsonbank",
		filePathPC: "lawsonbank.jpg",
		filePathSP: "lawsonbank.jpg",
		title: "ローソン銀行",
		titleEn: "Lowson Bank",
		stuff: [{ CD: "Isamu Nakaigawa" }, { AD: "Hikaru Shimzu" }, { D: "Hiromi Oshima" }],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},
	{
		id: "milknoyouni",
		filePathPC: "milknoyouni.jpg",
		filePathSP: "milknoyouni.jpg",
		title: "大塚 ミルクのようにやさしい大豆",
		titleEn: "Otsuka Milknoyouniyasashiidaizu",
		stuff: [{ CD: "Atsushi Matsumoto" }, { AD: "Hikaru Shimzu" }, { D: "Hiromi Oshima" }],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},
	{
		id: "niigatamai",
		filePathPC: "niigatamai.jpg",
		filePathSP: "niigatamai.jpg",
		title: "JA新潟 新潟米",
		titleEn: "JA Niigata Niigatamai",
		stuff: [{ CD: "Isamu Nakaigawa" }, { AD: "Hikaru Shimzu" }, { D: "Hiromi Oshima" }],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},
	{
		id: "pocari",
		filePathPC: "pocari/pocari_01.jpg",
		filePathSP: "pocari/pocari_02.jpg",
		title: "ポカリスエット",
		titleEn: "Pocari Sweat",
		stuff: [{ CD: "Katsuo Yonezawa" }, { AD: "Hikaru Shimzu" }, { D: "Hiromi Oshima" }, { Photo: "Shinichi Kaneko" }],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},

	{
		id: "savas01",
		filePathPC: "savas/savas01_01.jpg",
		filePathSP: "savas/savas01_02.jpg",
		title: "明治 ザバス",
		titleEn: "Meiji SAVAS",
		stuff: [{ "CD+C": "Ken Shimzu" }, { AD: "Hikaru Shimzu" }, { D: "Hiromi Oshima" }, { Photo: "Tsunaki Kuwashima" }],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},

	{
		id: "kinkatsu",
		filePathPC: "kinkatsu/kinkatsu_01.jpg",
		filePathSP: "kinkatsu/kinkatsu_02.jpg",
		title: "明治 ザバス スタイルプロテイン",
		titleEn: "Meiji SAVAS StyleProtein",
		stuff: [
			{ "CD+C": "Ken Shimzu" },
			{ "CMP+CW": "Kensuke Harada" },
			{ AD: "Hikaru Shimzu" },
			{ D: "Hiromi Oshima" },
			{ Dir: "Kengo Arima" },
			{ Photo: "Toshinobu Kobayashi" },
			{ St: "Akiko Kizu" },
			{ Hm: "Atsushi Takatori" },
		],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},
	{
		id: "yamakumiso",
		filePathPC: "yamakumiso.jpg",
		filePathSP: "yamakumiso.jpg",
		title: "ヤマク食品 809miso",
		titleEn: "Yamaku 809MISO",
		stuff: [{ "CD+C,AD": "Hikaru Shimzu" }, { D: "Hiromi Oshima" }],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},
	{
		id: "henshu-techou",
		filePathPC: "henshu-techou/henshu-techou_01.jpg",
		filePathSP: "henshu-techou/henshu-techou_02.jpg",
		title: "読売新聞 編集手帳",
		titleEn: "Yomiuri shimbun Henshu Techou",
		stuff: [{ CD: "Katsuya Sato" }, { AD: "Hikaru Shimzu" }, { D: "Hiromi Oshima" }, { C: "Hitoshi Ono" }],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},
	{
		id: "boys-and-men",
		filePathPC: "boys-and-men/boys-and-men_01.jpg",
		filePathSP: "boys-and-men/boys-and-men_02.jpg",
		title: "Boys And Men Entenka Dash CD & PV",
		titleEn: "Boys And Men Entenka Dash CD & PV",
		stuff: [{ "CD+C": "Ken Shimzu" }, { AD: "Hikaru Shimzu" }, { D: "Hiromi Oshima" }, { Photo: "Tsunaki Kuwashima" }],
		srcPC: null,
		srcSP: null,
		widthPC: null,
		widthSP: null,
		heightPC: null,
		heightSP: null,
	},
];
