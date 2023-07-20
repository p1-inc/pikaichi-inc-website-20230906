import { c } from "../../../../styles/eStyle";

export const getMenuTagArr = () => {
	const reArr = [];
	for (const i in styleMenuItems) {
		const menuItem = styleMenuItems[i].items;
		const tmp = [];
		for (const j in menuItem) {
			tmp.push(menuItem[j].tag);
		}
		reArr.push(tmp);
	}

	return reArr;
};

export interface MenuItemsItemType {
	key: string;
	tag: string;
	style?: string;
	src?: string;
	text?: string;
}

export interface MenuItemsType {
	name: string;
	src: string;
	width: string;
	height: string;
	childWidth: string;
	childHeight: string;
	items: MenuItemsItemType[];
}

export const styleMenuItems: MenuItemsType[] = [
	{
		name: "textAlign",
		src: "/img/editTable_btn_Align.svg",
		width: "55",
		height: "39",
		childWidth: "39",
		childHeight: "39",
		items: [
			{
				key: "reset__textAlign",
				tag: "no__textAlign",
				src: "/img/editTable_btn_Remove.svg",
			},
			{
				key: "alignLeft",
				tag: "ta_l",
				src: "/img/editTable_btn_AlignLeft.svg",
			},
			{
				key: "alignCenter",
				tag: "ta_c",
				src: "/img/editTable_btn_AlignCenter.svg",
			},
			{
				key: "alignRight",
				tag: "ta_r",
				src: "/img/editTable_btn_AlignRight.svg",
			},
		],
	},
	{
		name: "textColor",
		src: "/img/editTable_btn_TextColor.svg",
		width: "55",
		height: "39",
		childWidth: "39",
		childHeight: "39",
		items: [
			{
				key: "reset__textColor",
				tag: "no__textColor",
				src: "/img/editTable_btn_Remove.svg",
			},
			{
				key: "textColorBlack",
				tag: "c_bk",
				src: "/img/editTable_btn_TextColorBlack.svg",
			},
			{
				key: "textColorRed",
				tag: "c_r",
				src: "/img/editTable_btn_TextColorRed.svg",
			},
			{
				key: "textColorBlue",
				tag: "c_bl",
				src: "/img/editTable_btn_TextColorBlue.svg",
			},
			{
				key: "textColorLightRed",
				tag: "c_lr",
				src: "/img/editTable_btn_TextColorLightRed.svg",
			},
			{
				key: "textColorLightBlue",
				tag: "c_lb",
				src: "/img/editTable_btn_TextColorLightBlue.svg",
			},
			{
				key: "textColorLightYellow",
				tag: "c_ly",
				src: "/img/editTable_btn_TextColorLightYellow.svg",
			},
			{
				key: "textColorWhite",
				tag: "c_w",
				src: "/img/editTable_btn_TextColorWhite.svg",
			},
		],
	},
	{
		name: "bcColor",
		src: "/img/editTable_btn_BcColor.svg",
		width: "55",
		height: "39",
		childWidth: "39",
		childHeight: "39",
		items: [
			{
				key: "reset__bcColor",
				tag: "no__bcColor",
				src: "/img/editTable_btn_Remove.svg",
			},
			{
				key: "bcColorBlack",
				tag: "bc_bk",
				src: "/img/editTable_btn_BcColorBlack.svg",
			},
			{
				key: "bcColorRed",
				tag: "bc_r",
				src: "/img/editTable_btn_BcColorRed.svg",
			},
			{
				key: "bcColorBlue",
				tag: "bc_bl",
				src: "/img/editTable_btn_BcColorBlue.svg",
			},
			{
				key: "bcColorLightRed",
				tag: "bc_lr",
				src: "/img/editTable_btn_BcColorLightRed.svg",
			},
			{
				key: "bcColorLightBlue",
				tag: "bc_lb",
				src: "/img/editTable_btn_BcColorLightBlue.svg",
			},
			{
				key: "bcColorLightYellow",
				tag: "bc_ly",
				src: "/img/editTable_btn_BcColorLightYellow.svg",
			},
			{
				key: "bcColorWhite",
				tag: "bc_w",
				src: "/img/editTable_btn_BcColorWhite.svg",
			},
		],
	},
	{
		name: "textSize",
		src: "/img/editTable_btn_TextSize.svg",
		width: "55",
		height: "39",
		childWidth: "39",
		childHeight: "39",
		items: [
			{
				key: "reset__fontSize",
				tag: "no__fontSize",
				src: "/img/editTable_btn_Remove.svg",
			},
			{
				key: "fontSizeS",
				tag: "fs_s",
				text: "小",
			},
			{
				key: "fontSizeM",
				tag: "fs_m",
				text: "中",
			},
			{
				key: "fontSizeL",
				tag: "fs_l",
				text: "大",
			},
		],
	},
	{
		name: "marginLeft",
		src: "/img/editTable_btn_MarginLeft.svg",
		width: "55",
		height: "39",
		childWidth: "39",
		childHeight: "39",
		items: [
			{
				key: "reset__marginLeft",
				tag: "no__marginLeft",
				src: "/img/editTable_btn_Remove.svg",
			},
			{
				key: "marginLeft05",
				tag: "ml_05",
				text: "左1",
			},
			{
				key: "marginLeft1",
				tag: "ml_1",
				text: "左2",
			},
			{
				key: "marginLeft2",
				tag: "ml_2",
				text: "左3",
			},
		],
	},
	{
		name: "marginRight",
		src: "/img/editTable_btn_MarginRight.svg",
		width: "55",
		height: "39",
		childWidth: "39",
		childHeight: "39",
		items: [
			{
				key: "reset__marginRight",
				tag: "no__marginRight",
				src: "/img/editTable_btn_Remove.svg",
			},
			{
				key: "marginRight05",
				tag: "mr_05",
				text: "右1",
			},
			{
				key: "marginRight1",
				tag: "mr_1",
				text: "右2",
			},
			{
				key: "marginRight2",
				tag: "mr_2",
				text: "右3",
			},
		],
	},
	{
		name: "border",
		src: "/img/editTable_btn_Border.svg",
		width: "55",
		height: "39",
		childWidth: "39",
		childHeight: "39",
		items: [
			{
				key: "reset__border",
				tag: "no__border",
				src: "/img/editTable_btn_Remove.svg",
			},
			{
				key: "border_all",
				tag: "border_all",
				src: "/img/editTable_btn_BorderAll.svg",
			},
			{
				key: "border_left",
				tag: "border_left",
				src: "/img/editTable_btn_BorderLeft.svg",
			},
			{
				key: "border_right",
				tag: "border_right",
				src: "/img/editTable_btn_BorderRight.svg",
			},
			{
				key: "border_top",
				tag: "border_top",
				src: "/img/editTable_btn_BorderTop.svg",
			},
			{
				key: "border_bottom",
				tag: "border_bottom",
				src: "/img/editTable_btn_BorderBottom.svg",
			},
		],
	},
];

export const formatMenuItems: MenuItemsType[] = [
	{
		name: "format",
		src: "/img/editTable_btn_type.svg",
		width: "80",
		height: "39",
		childWidth: "80",
		childHeight: "39",
		items: [
			{
				key: "normal",
				tag: "normal",
				text: "テキスト",
			},
			{
				key: "kakaku",
				tag: "kakaku",
				text: "価 格",
			},
			{
				key: "leaders",
				tag: "leaders",
				text: "点線",
			},
			{
				key: "yen_zeikomi",
				tag: "yen_zeikomi",
				text: "円（税込）",
			},
			{
				key: "yen_zeinuki",
				tag: "yen_zeinuki",
				text: "円（税抜）",
			},
			{
				key: "per_tsuki",
				tag: "per_tsuki",
				text: "／月",
			},
		],
	},
];
