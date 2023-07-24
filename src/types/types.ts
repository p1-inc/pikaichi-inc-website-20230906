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

export const CompListInit = {
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

export const ContainerInitObj = {
	id: "",
	title: "",
	bcColor: "",
	marginTop: "0em",
	marginBottom: "0em",
	minWidth: "",
	maxWidth: "",
	minWidthActive: false,
	maxWidthActive: false,
	child: [] as string[],
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
	id: undefined,
	src: undefined,
	srcHigh: undefined,
	widthLow: undefined,
	heightLow: undefined,
	widthHigh: undefined,
	heightHigh: undefined,
	createdAt: undefined,
	updatedAt: undefined,
	contentTypeLow: undefined,
	contentTypeHigh: undefined,
	alt: undefined,
	caption: undefined,
	description: undefined,
	tag: undefined,
};

export interface TopImageType {
	id: string;
	topImageList: string[];
	createdAt: string;
	updatedAt: string;
}

export interface TopWordType {
	id: string;
	body: string; //テキスト
	bodyArr?: string[]; //行ごとに配列に分ける
	memo: string; //メモ
	createdAt: string;
	updatedAt: string;
	usage?: boolean;
}

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
	id: undefined,
	user: { uid: undefined, displayName: undefined }, //寄稿者
	body: undefined, //メイン記事
	canPublic: undefined, //公開・非公開
	isDraft: true, //下書き
	date: undefined,
	mainImage: undefined,
	src: undefined, //イメージのパス
	srcHigh: undefined, //イメージのパス
	pin: undefined, //ピン留め
	priority: undefined,
	relatedArticles: [],
	subCopy: undefined,
	category: undefined,
	tag: [{ id: undefined, name: undefined }],
	title: undefined,
	metaTitle: undefined,
	metaDescription: undefined,
	createdAt: undefined,
	updatedAt: undefined,
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

export interface NewsType {
	id: string;
	newsList: string[];
	createdAt: string;
	updatedAt: string;
}

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

export interface PhotoGalleryType {
	id: string;
	photoGalleryList: string[];
	createdAt: string;
	updatedAt: string;
}

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

export interface FooterCompType {
	footerText1: string;
	footerText2: string;
	footerText3: string;
	snsList: string[];
	copyrite: string;
	createdAt: string;
	updatedAt: string;
}

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
