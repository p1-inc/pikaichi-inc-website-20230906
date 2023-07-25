import { OutputBlockData } from "../components/admin/p1_Editor/p1_EditorTypes";

export type BlockNameType =
	| "topImage"
	| "topWord"
	| "news"
	| "table"
	| "campaign"
	| "people"
	| "shopInfo"
	| "photoGallery"
	| "fixedComponent"
	| "post"
	| "users"
	| "layout";

export interface CompListType {
	id: string;
	blockName: string;
	subName: string;
	thumbImage?: string;
	thumbWidth?: number;
	thumbHeight?: number;
	createdAt: string;
	updatedAt: string;
}

export const CompListInit: CompListType = {
	id: "",
	blockName: "",
	subName: "",
	thumbImage: "",
	thumbWidth: 0,
	thumbHeight: 0,
	createdAt: "",
	updatedAt: "",
};

export interface ContainerType {
	id: string;
	title?: string;
	titleFont?: string;
	bcColor?: string;
	marginTop?: string;
	marginBottom?: string;
	minWidth?: string;
	maxWidth?: string;
	minWidthActive?: boolean;
	maxWidthActive?: boolean;
	child: string[];
}

export const ContainerInitObj: ContainerType = {
	id: "",
	title: "",
	bcColor: "",
	marginTop: "0em",
	marginBottom: "0em",
	minWidth: "",
	maxWidth: "",
	minWidthActive: false,
	maxWidthActive: false,
	child: [],
};

export interface MediaLib {
	id: string;
	src: string;
	srcHigh: string;
	widthLow: number;
	heightLow: number;
	widthHigh: number;
	heightHigh: number;
	createdAt: string;
	updatedAt: string;
	contentTypeLow: string;
	contentTypeHigh: string;
	alt?: string;
	caption?: string;
	description?: string;
	tag?: string;
	// use: { [key: string]: string[] };
}
//TODO  型から初期化する方法::typeを定義すると同時に下記のように初期値を設置してexportしておく（型を一致させておく）
export const MediaLibInitObj: MediaLib = {
	id: "",
	src: "",
	srcHigh: "",
	widthLow: 0,
	heightLow: 0,
	widthHigh: 0,
	heightHigh: 0,
	createdAt: "",
	updatedAt: "",
	contentTypeLow: "",
	contentTypeHigh: "",
	alt: "",
	caption: "",
	description: "",
	tag: "",
};

export interface TopImageType {
	id: string;
	topImageList: string[];
	createdAt: string;
	updatedAt: string;
}

export const TopImageInit: TopImageType = {
	id: "",
	topImageList: [],
	createdAt: "",
	updatedAt: "",
};

export interface TopWordType {
	id: string;
	body: string; //テキスト
	bodyArr?: string[]; //行ごとに配列に分ける
	memo: string; //メモ
	createdAt: string;
	updatedAt: string;
	usage?: boolean;
}

export const TopWordInit: TopWordType = {
	id: "",
	body: "",
	bodyArr: [],
	memo: "",
	createdAt: "",
	updatedAt: "",
	usage: false,
};

export interface PostDataType {
	id: string;
	user: { uid: string; displayName: string }; //寄稿者
	body: { blocks: OutputBlockData[] }; //メイン記事
	canPublic: boolean; //公開・非公開
	isDraft: boolean; //下書き
	date: string;
	mainImage: string;
	src?: string; //イメージのパス
	srcHigh?: string; //イメージのパス
	pin: boolean; //ピン留め
	priority: number;
	relatedArticles: string[];
	subCopy: string;
	category: string;
	tag: { id: string; name: string }[];
	title: string;
	metaTitle: string;
	metaDescription: string;
	createdAt: string;
	updatedAt: string;
}

export const PostDataInitObj: PostDataType = {
	id: "",
	user: { uid: "", displayName: "" }, //寄稿者
	body: { blocks: [] }, //メイン記事
	canPublic: false, //公開・非公開
	isDraft: true, //下書き
	date: "",
	mainImage: "",
	src: "", //イメージのパス
	srcHigh: "", //イメージのパス
	pin: false, //ピン留め
	priority: 0,
	relatedArticles: [],
	subCopy: "",
	category: "",
	tag: [{ id: "", name: "" }],
	title: "",
	metaTitle: "",
	metaDescription: "",
	createdAt: "",
	updatedAt: "",
};

export interface CategoryType {
	id: string;
	name: string; //タグの名前
	active: boolean; //表示非表示
	color: string; //色分け
	description?: string; //説明
	createdAt: string;
	updatedAt: string;
}

export const CategoryInit: CategoryType = {
	id: "",
	name: "",
	active: false,
	color: "",
	description: "",
	createdAt: "",
	updatedAt: "",
};

export type TableFormat = "normal" | "kakaku" | "yen_zeikomi" | "yen_zeinuki" | "per_tsuki" | "leaders" | "none" | "sideTopCell" | "topCell" | "sideCell";

export interface TableCellData {
	id: string;
	label: string;
	textField: string;
	format: TableFormat;
	style: string;
	border: string;
}

export const TableCellDataInitObj: TableCellData = {
	id: "",
	label: "",
	textField: "",
	format: "normal",
	style: "",
	border: "",
};

export interface TableType {
	id: string;
	readOnly: boolean;
	cellData: TableCellData[];
	templateAreas: string;
	templateColumns: string[];
	templateRows: string[];
	innerWidth: any[];
	tableTitle: string;
	createdAt: string;
	updatedAt: string;
	usage?: boolean;
}

export const TableInit: TableType = {
	id: "",
	readOnly: false,
	cellData: [],
	templateAreas: "",
	templateColumns: [],
	templateRows: [],
	innerWidth: [],
	tableTitle: "",
	createdAt: "",
	updatedAt: "",
	usage: false,
};

export interface BlockList {
	blockName: string;
	subName: string;
	containerId: string;
}

export interface CampaignType {
	id: string;
	design: string;
	color?: string;
	bgColor?: string;
	title?: string;
	subTitle?: string;
	shoulderTitle?: string;
	body?: string;
	buttonText?: string;
	buttonIcon?: "door" | "login" | "";
	link?: string;
	imageId: string;
	imageWidth: number;
	imageHeight: number;
	src: string;
	srcHigh: string;
	createdAt: string;
	updatedAt: string;
	usage?: boolean;
}

export const CampaignInit: CampaignType = {
	id: "",
	design: "",
	color: "",
	bgColor: "",
	title: "",
	subTitle: "",
	shoulderTitle: "",
	body: "",
	buttonText: "",
	buttonIcon: "",
	link: "",
	imageId: "",
	imageWidth: 0,
	imageHeight: 0,
	src: "",
	srcHigh: "",
	createdAt: "",
	updatedAt: "",
	usage: false,
};

export interface NewsType {
	id: string;
	newsList: string[];
	createdAt: string;
	updatedAt: string;
}

export const NewsInit: NewsType = {
	id: "",
	newsList: [],
	createdAt: "",
	updatedAt: "",
};

export interface UserType {
	id: string;
	enabled: boolean;
	email: string;
	displayName?: string;
	namePronunciation?: string; //よみがな
	age?: number;
	address?: string;
	zipCode?: string;
	phoneNumber?: string;
	position?: string;
	text?: string;
	imageId: string;
	src: string;
	srcHigh: string;
	note?: string;
	role: UserRoleType;
	createdAt: string;
	updatedAt: string;
}

export const UserTypeInit: UserType = {
	id: "",
	enabled: false,
	email: "",
	displayName: "",
	namePronunciation: "",
	age: 0,
	address: "",
	zipCode: "",
	phoneNumber: "",
	position: "",
	text: "",
	imageId: "",
	src: "",
	srcHigh: "",
	note: "",
	role: "user",
	createdAt: "",
	updatedAt: "",
};

export interface PeopleType {
	id: string;
	peopleList: string[];
	createdAt: string;
	updatedAt: string;
}

export const PeopleTypeInit: PeopleType = {
	id: "",
	peopleList: [],
	createdAt: "",
	updatedAt: "",
};

export type UserRoleType = "admin" | "staff" | "user";

export interface TagType {
	id: string;
	name: string; //タグの名前
	active: boolean; //表示非表示
	priority: number; //優先度
	description?: string; //説明
	createdAt: string;
	updatedAt: string;
}

export interface ShopInfoType {
	id: string;
	address: { value: string; visibility: boolean };
	businessInfo: { value: string; visibility: boolean };
	directions: { value: string; visibility: boolean };
	link: { value: string; visibility: boolean };
	map: { value: string; visibility: boolean };
	zipCode: { value: string; visibility: boolean };
	phoneNumber: { value: string; visibility: boolean };
	createdAt: string;
	updatedAt: string;
	active?: boolean;
	usage?: boolean;
}

export const ShopInfoInit: ShopInfoType = {
	id: "",
	address: { value: "", visibility: false },
	businessInfo: { value: "", visibility: false },
	directions: { value: "", visibility: false },
	link: { value: "", visibility: false },
	map: { value: "", visibility: false },
	zipCode: { value: "", visibility: false },
	phoneNumber: { value: "", visibility: false },
	createdAt: "",
	updatedAt: "",
	active: false,
	usage: false,
};

export interface PhotoGalleryType {
	id: string;
	photoGalleryList: string[];
	createdAt: string;
	updatedAt: string;
}

export const PhotoGalleryInit: PhotoGalleryType = {
	id: "",
	photoGalleryList: [],
	createdAt: "",
	updatedAt: "",
};

export interface FixedComponentType {
	id: string;
	compName: string;
	imageId: string[];
	path: string;
	createdAt: string;
	updatedAt: string;
	usage?: boolean;
}

export interface AlertType {
	visible: boolean;
	msg?: string;
	color?: string;
	handle?: any;
}

export interface StaticPropsType {
	displayNote?: boolean;
	layoutData: ContainerType[];
	menuList: MenuType[];
	topImageData: MediaLib[];
	topWordData: TopWordType[];
	newsData: PostDataType[];
	categoryList: CategoryType[];
	tableData: TableType[];
	campaignData: CampaignType[];
	peopleData: UserType[];
	shopInfoData: ShopInfoType[];
	photoGallery: MediaLib[];
	footerData: FooterCompType;
	generalData: GeneralControlType;
	allComplist: CompListType[];
	mediaLib?: MediaLib[];
	// postData: PostDataType[];
	faviconImg: MediaLib;
	logoImg: MediaLib;
	ogImg: MediaLib;
}

export interface MenuType {
	id: string;
	index: number;
	subMenu: boolean;
	parentId: string;
	title: string;
	link: string;
	protected: boolean;
	noSubMenu?: boolean; //サブメニュー不可
	// tmp?: boolean; // 仮メニュー用
}

export const MenuInit: MenuType = {
	id: "",
	index: 0,
	subMenu: false,
	parentId: "",
	title: "",
	link: "",
	protected: false,
	noSubMenu: false,
};

export interface GeneralControlType {
	domain: string;
	description: string;
	copyrite: string;
	logoImg: string;
	webTitle: string;
	email: string;
	favicon: string;
	ogImage: string;
}

export const GeneralControlInit: GeneralControlType = {
	domain: "",
	description: "",
	copyrite: "",
	logoImg: "",
	webTitle: "",
	email: "",
	favicon: "",
	ogImage: "",
};

export interface FooterCompType {
	footerText1: string;
	footerText2: string;
	footerText3: string;
	snsList: string[];
	copyrite: string;
	createdAt: string;
	updatedAt: string;
}

export const FooterCompInit: FooterCompType = {
	footerText1: "",
	footerText2: "",
	footerText3: "",
	snsList: [],
	copyrite: "",
	createdAt: "",
	updatedAt: "",
};

export interface PeopleType {
	id: string;
	peopleList: string[];
	createdAt: string;
	updatedAt: string;
}

export interface MediaLogType {
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
