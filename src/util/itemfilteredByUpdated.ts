import dayjs from "dayjs";
import { CompListType, MediaLib } from "../types/types";
import { Dispatch, SetStateAction } from "react";

const dayFormatChange = (str: string) => {
	// "2022-11-08-10-43-35" =>変換  "2022-11-08 10:43:35"
	const arr = str.split("-");
	const yyyymmdd = arr.splice(0, 3).join("-");
	const hhmmss = arr.join(":");

	return `${yyyymmdd} ${hhmmss}`;
};

export const refineByUpdatedList = [
	{ value: "all", label: "全て" },
	{ value: "justnow", label: "さっき" },
	{ value: "hour", label: "1時間以内" },
	{ value: "today", label: "今日" },
	{ value: "yesterday", label: "昨日" },
	{ value: "day1", label: "1日以内" },
	{ value: "day2", label: "2日以内" },
	{ value: "day3", label: "3日以内" },
	{ value: "month", label: "1ヶ月以内" },
	{ value: "month3", label: "3ヶ月以内" },
	{ value: "month6", label: "半年以内" },
	{ value: "year", label: "1年以内" },
];

//コンポーネントの名前の順
export const componentNameArr = [
	"topImage",
	"topWord",
	"news",
	"table",
	"campaign",
	"people",
	"shopInfo",
	"photoGallery",
	"fixedComponent",
];

export const refineByBlockNameList = [
	{ value: "all", label: "全て" },
	{ value: "topImage", label: "トップイメージ" },
	{ value: "topWord", label: "トップワード" },
	{ value: "news", label: "ニュース" },
	{ value: "table", label: "表組" },
	{ value: "campaign", label: "キャンペーン" },
	{ value: "people", label: "スタッフ紹介" },
	{ value: "shopInfo", label: "スタジオ情報" },
	{ value: "photoGallery", label: "フォトギャラリー" },
	{ value: "fixedComponent", label: "固定コンポーネント" },
];

type ItemTypeByUpdated = {
	id: string;
	updatedAt: string;
	[key: string]: any;
};

export const itemsfilteredByUpdated = (filterKeyByDay: string, items: ItemTypeByUpdated[]) => {
	const today = dayjs();
	const yesterday = dayjs().subtract(1, "day");

	if (!items) {
		return;
	}

	const disabledItemsLib = items.flatMap((media) => {
		const createdAtStr = dayFormatChange(media.updatedAt);

		const datefrom = dayjs(createdAtStr);
		const isToday = datefrom.isSame(today, "day");
		const isYesterday = datefrom.isSame(yesterday, "day");

		const diffMin = today.diff(datefrom, "minute");
		const diffDay = today.diff(datefrom, "day");
		const diffMonth = today.diff(datefrom, "month");
		const diffYear = today.diff(datefrom, "year");

		let f = false;
		if (filterKeyByDay === "all") {
			f = true;
		} else if (filterKeyByDay === "justnow" && 0 <= diffMin && diffMin < 10) {
			f = true;
		} else if (filterKeyByDay === "hour" && 0 <= diffMin && diffMin < 60) {
			f = true;
		} else if (filterKeyByDay === "today" && isToday) {
			f = true;
		} else if (filterKeyByDay === "yesterday" && isYesterday) {
			f = true;
		} else if (filterKeyByDay === "day1" && 0 <= diffMin && diffDay < 2) {
			f = true;
		} else if (filterKeyByDay === "day2" && 0 <= diffMin && diffDay < 3) {
			f = true;
		} else if (filterKeyByDay === "day3" && 0 <= diffMin && diffDay < 4) {
			f = true;
		} else if (filterKeyByDay === "month" && 0 <= diffMin && diffMonth < 1) {
			f = true;
		} else if (filterKeyByDay === "month3" && 0 <= diffMin && diffMonth < 3) {
			f = true;
		} else if (filterKeyByDay === "month6" && 0 <= diffMin && diffMonth < 6) {
			f = true;
		} else if (filterKeyByDay === "year" && 0 <= diffMin && diffYear < 1) {
			f = true;
		}
		if (!f) {
			return [];
		} else {
			return media;
		}
	});

	return disabledItemsLib;
};

type ItemTypeByBlockName = {
	id: string;
	blockName: string;
	[key: string]: any;
};

export const itemsfilteredByBlockName = (filterKeyByBlockName: string, items: ItemTypeByBlockName[]) => {
	if (filterKeyByBlockName === "all") {
		return items;
	}
	const disabledItemsLib = items.filter((d) => d.blockName === filterKeyByBlockName);
	return disabledItemsLib;
};

type HandleRefinedByDayType = {
	value: string;
	items: ItemTypeByUpdated[];
	setRefinedItems: (value: SetStateAction<ItemTypeByUpdated[]>) => void;
};

export const handleRefinedByDay = ({ value, items, setRefinedItems }: HandleRefinedByDayType) => {
	const disabledMedia = itemsfilteredByUpdated(value, items);
	setRefinedItems(disabledMedia);
};

type HandleRefinedByBlockName = {
	value: string;
	items: ItemTypeByBlockName[];
	setRefinedItems: (value: SetStateAction<ItemTypeByBlockName[]>) => void;
};

export const handleRefinedByBlockName = ({ value, items, setRefinedItems }: HandleRefinedByBlockName) => {
	const disabledMedia = itemsfilteredByBlockName(value, items);
	setRefinedItems(disabledMedia);
};
