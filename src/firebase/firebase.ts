import {
	BlockNameType,
	CampaignInit,
	CategoryInit,
	CompListInit,
	ContainerInitObj,
	ContainerType,
	FooterCompInit,
	FooterCompType,
	GeneralControlInit,
	MediaLibInitObj,
	MenuInit,
	NewsInit,
	PeopleType,
	PeopleTypeInit,
	PhotoGalleryInit,
	ShopInfoInit,
	StaticPropsType,
	TableInit,
	TopImageInit,
	TopWordInit,
	UserTypeInit,
} from "./../types/types";
//
//

//TODO usageの処理は複雑なので管理しない方法もある
// 例えば、post(記事)はnewsやmenuなどで使用を想定されるが、
// 他にも新しく作った機能にも使用する場合がある。だからそのたびにusageコレクションを管理するコードを書かないといけないが、
// それが正確かどうか管理しきれない。なので、対策として、usageがなくなって表示するコンポーネントが行方不明になった場合でもそのままほっておくか、
// mediaやpostなどの削除処理にてデータベースを探索する処理を走らせるか

import { longBoundStr } from "./../util/resizeImage";
import { initializeApp } from "firebase/app";

import { getFunctions, httpsCallable } from "firebase/functions";

import dayjs from "dayjs";

import {
	getFirestore,
	collection,
	doc,
	setDoc,
	getDoc,
	getDocs,
	updateDoc,
	deleteDoc,
	deleteField,
	writeBatch,
	WriteBatch,
	query,
	orderBy,
	limit,
	startAt,
	startAfter,
	DocumentData,
	addDoc,
	where,
} from "firebase/firestore";

import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject, StorageReference } from "firebase/storage";

import {
	MediaLib,
	TableType,
	PostDataType,
	UserType,
	TopWordType,
	ShopInfoType,
	CampaignType,
	CompListType,
	TopImageType,
	NewsType,
	FixedComponentType,
	PhotoGalleryType,
	BlockList,
	TagType,
	CategoryType,
	MenuType,
	GeneralControlType,
	PostDataInitObj,
} from "../types/types";
import { toBlob } from "../util/toImage";

import { Dispatch, SetStateAction } from "react";
import { LogType } from "../types/logtypes";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const _hostName = process.env.NEXT_PUBLIC_HOSTNAME;
const _dbName = "preDeploy";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BAKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const functions = getFunctions(app);

const storage = getStorage();

export const StringForMedia_Low = `__${longBoundStr[0]}__`;
export const StringForMedia_High = `__${longBoundStr[1]}__`;

export const getDocDataFromDB = async (dbName: string, docName: string) => {
	let result: any[];
	const docRef = doc(db, dbName, docName);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		const docData = docSnap.data();
		result = Object.entries(docData).map((d) => d[1]);
	} else {
		console.log("No such document!");
	}
	return result;
};

export const getDocDataFromDBWithFieldName = async (dbName: string, docName: string) => {
	let result: any;
	const docRef = doc(db, dbName, docName);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		const docData = docSnap.data();
		result = docData.containerList;
	} else {
		console.log("No such document!");
	}
	return result;
};

export const setDocDataToDB = (docName: string, key: string, data: any, batch: WriteBatch) => {
	let restrData;
	if (Array.isArray(data)) {
		restrData = data;
	} else {
		// valueがundifinedの場合エラーがでるので
		// dataのvalueの  undefinedをnullに変更
		const _restrData = Object.entries(data).map((d) => (d[1] === undefined ? [d[0], null] : d));
		restrData = Object.fromEntries(_restrData);
	}

	let result: "success" | "error";

	const docRef = doc(db, _dbName, docName);

	try {
		batch.update(docRef, {
			[key]: restrData,
		});
		result = "success";
	} catch (error) {
		console.log(error);
		result = "error";
	}

	return result;
};

export const deleteDocDataFromDB = (docName: string, keyArr: string[], batch: WriteBatch) => {
	const result: "success" | "error" = "success";

	keyArr.forEach((id) => {
		const docRef = doc(db, _dbName, docName);

		batch.update(docRef, {
			[id]: deleteField(),
		});
	});

	return result;
};

//TODO  https://blog.totoraj.net/2022-01-07-html-to-canvas/
//画像を予めダウンロードし、BASE64に変換してdata-urlとして挿入する
export const setThumbImageToStorage = async (node: HTMLElement, docName: string, key: string, width: number, height: number) => {
	let blob;

	try {
		blob = await toBlob(node, {
			width: Math.round(width),
			height: Math.round(height),
		});
	} catch (error) {
		console.log(error);
		return "error";
	}

	const dir = "componentThumb/";
	const fileName = `${docName}/${key}.png`;

	const storageRef = ref(storage, `${dir}/${fileName}`);

	let blobUrl: string;
	try {
		await uploadBytesResumable(storageRef, blob);
		blobUrl = await getDownloadURL(ref(storage, `${dir}/${fileName}`));
	} catch (error) {
		console.log(error);
		return "error";
	}

	return blobUrl;
};

export const delThumbImageFromStorage = async (docName: string, keyArr: string[]) => {
	let result: "success" | "error" = "success";

	const dir = "componentThumb/";
	const delStoragePromise: Promise<void>[] = [];

	keyArr.forEach((id) => {
		const docRef = ref(storage, `${dir}/${docName}/${id}.png`);
		const p = deleteObject(docRef);

		delStoragePromise.push(p);
	});

	try {
		await Promise.all(delStoragePromise);
		result = "success";
	} catch (error) {
		console.log(error);
		result = "error";
	}

	return result;
};

export const getMediaUsage = async () => {
	const docRef = doc(db, "usage", "media");
	const docSnap = await getDoc(docRef);
	let usageData: [string, string[][]][] = [];
	if (docSnap.exists()) {
		const data = docSnap.data();
		usageData = Object.entries(data).map((d: [string, string[]]) => [d[0], d[1].map((d2) => d2.split("/"))]);
	} else {
		console.log("No such document!");
	}

	return usageData;
};

type SetMediaUsageType = {
	compBlockName: BlockNameType;
	compSubName: string;
	mediaArr: string[];
	batch: WriteBatch;
};

export const setMediaUsage = async ({ compBlockName, compSubName, mediaArr, batch }: SetMediaUsageType) => {
	//

	const _usageData = await getMediaUsage();

	const _usageIds = _usageData.map((d) => d[0]);

	const _allMedia = await getMediaLib();

	const _noUsedMedia: [string, string[][]][] = _allMedia.map((d) => [d.id, []]);
	const noUsedMedia = _noUsedMedia.filter((d) => !_usageIds.includes(d[0]));

	const usageData = [...noUsedMedia, ..._usageData];

	const _nUsageData: [string, string[][]][] = usageData.map((media) => {
		//新規追加されるmediaに対するusage
		if (mediaArr.includes(media[0])) {
			const isExist = media[1].find((d) => d[d.length - 1] === compBlockName && d[d.length - 2] === compSubName);
			if (isExist) {
				return media;
			} else {
				const tmp = [...media[1], [compSubName, compBlockName]];
				return [media[0], tmp];
			}
		} else {
			//それ以外のmediaのusage(すでにusageに登録されているものは消去)
			const tmp = media[1].filter((d) => !(d[d.length - 1] === compBlockName && d[d.length - 2] === compSubName));
			if (tmp.length === media[1].length) {
				return null;
			} else {
				return [media[0], tmp];
			}
		}
	});

	const nUsageData: [string, string[]][] = _nUsageData.filter((d) => d).map((d2) => [d2[0], d2[1].map((d3) => d3.join("/"))]);

	nUsageData.forEach((media) => {
		const docRef = doc(db, "usage", "media");
		batch.update(docRef, {
			[media[0]]: media[1],
		});
	});

	return "success";
};

export const getTableUsage = async () => {
	const docRef = doc(db, "usage", "table");
	const docSnap = await getDoc(docRef);
	let _usageData: [string, string[][]][] = [];
	if (docSnap.exists()) {
		const data = docSnap.data();
		_usageData = Object.entries(data).map((d: [string, string[]]) => [d[0], d[1].map((d2) => d2.split("/"))]);
	} else {
		console.log("No such document!");
	}
	const usageData = _usageData.filter((d) => d[1].length > 0);
	return usageData;
};

type SetTableUsageType = {
	compBlockName: BlockNameType;
	compSubName: string;
	tableArr: string[];
	batch: WriteBatch;
};

export const setTableUsage = async ({ compBlockName, compSubName, tableArr, batch }: SetTableUsageType) => {
	//
	const _usageData = await getTableUsage();

	const _usageIds = _usageData.map((d) => d[0]);

	const _allTable = await getAllTables({});

	const _noUsedTable: [string, string[][]][] = _allTable.map((d) => [d.id, []]);
	const noUsedTable = _noUsedTable.filter((d) => !_usageIds.includes(d[0]));

	const usageData = [...noUsedTable, ..._usageData];

	const _nUsageData: [string, string[][]][] = usageData.map((table) => {
		//新規追加されるtableに対するusage
		if (tableArr.includes(table[0])) {
			const isExist = table[1].find((d) => d[d.length - 1] === compBlockName && d[d.length - 2] === compSubName);
			if (isExist) {
				return table;
			} else {
				const tmp = [...table[1], [compSubName, compBlockName]];
				return [table[0], tmp];
			}
		} else {
			//それ以外のmediaのusage(すでにusageに登録されているものは消去)
			const tmp = table[1].filter((d) => !(d[d.length - 1] === compBlockName && d[d.length - 2] === compSubName));
			if (tmp.length === table[1].length) {
				return null;
			} else {
				return [table[0], tmp];
			}
		}
	});

	const nUsageData: [string, string[]][] = _nUsageData.filter((d) => d).map((d2) => [d2[0], d2[1].map((d3) => d3.join("/"))]);

	nUsageData.forEach((table) => {
		const docRef = doc(db, "usage", "table");

		if (table[1].length > 0) {
			batch.update(docRef, {
				[table[0]]: table[1],
			});
		} else {
			batch.update(docRef, {
				[table[0]]: deleteField(),
			});
		}
	});

	return "success";
};

export const getlayoutUsage = async () => {
	let usageData: string[];

	const docRef = doc(db, "usage", "layout");
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		const data = docSnap.data();
		if ("layout" in data) {
			usageData = data.layout;
		}
	} else {
		console.log("No such document!");
	}

	return usageData;
};

export const setlayoutUsage = (layoutList: string[], batch: WriteBatch) => {
	const docRef = doc(db, "usage", "layout");
	const data = { layout: layoutList };
	batch.set(docRef, data);

	return "success";
};

export const getAllCampaignList = async ({ dbName = _dbName }: { dbName?: string }) => {
	const _result: CampaignType[] = await getDocDataFromDB(dbName, "campaign");
	const list = await getListInLayoutUsage("campaign");

	let result: CampaignType[] = [CampaignInit];

	if (_result && list) {
		result = _result.map((d) => (list.includes(d.id) ? { ...d, usage: true } : { ...d, usage: false }));
	}
	return result;
};

export const setCampaign = async (data: CampaignType, node: HTMLElement, width: number, height: number, createdAt: string, updatedAt: string) => {
	//

	const docName = "campaign";
	const key = data.id;

	const batch = writeBatch(db);

	const blobUrl = await setThumbImageToStorage(node, docName, key, width, height);
	if (blobUrl === "error") {
		return "error";
	}

	const resSetDoc = setDocDataToDB(docName, key, data, batch);

	const resSetComp = await setComponentData({ docName, key, blobUrl, width, height, createdAt, updatedAt, batch });

	if (!(resSetDoc === "success" && resSetComp === "success")) {
		return "error";
	}

	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	//Usageを再構築
	const checksProp = {
		checkMediaUsageFunc: true,
		checkTableUsageFunc: false,
		checkLayoutUsageFunc: false,
	};
	try {
		const func = httpsCallable(functions, "restructureUsageDataOnCall");
		await func(checksProp);
	} catch (error) {
		console.log("error: ", error);
	}

	return "success";
};

export const deleteCampaign = async (idArr: string[]) => {
	//
	const list = await getAllCampaignList({});

	const delArr = list.filter((d: any) => idArr.includes(d.id));

	const isIncludes = delArr.length > 0;
	if (!isIncludes) {
		console.log("データベースと一致しませんでした");
		return "error";
	}

	const batch = writeBatch(db);

	const docName = "campaign";

	const resDelThumbImage = await delThumbImageFromStorage(docName, idArr);
	if (resDelThumbImage === "error") {
		return "error";
	}

	const resDeleteDoc = deleteDocDataFromDB(docName, idArr, batch);

	const resDeleteComp = deleteComponentData(docName, idArr, batch);

	if (!(resDeleteDoc === "success" && resDeleteComp === "success")) {
		return "error";
	}

	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	//Usageを再構築
	const checksProp = {
		checkMediaUsageFunc: true,
		checkTableUsageFunc: false,
		checkLayoutUsageFunc: false,
	};
	try {
		const func = httpsCallable(functions, "restructureUsageDataOnCall");
		await func(checksProp);
	} catch (error) {
		console.log("error: ", error);
	}

	return "success";
};

export const getTopImage = async ({ dbName = _dbName }) => {
	const _result: TopImageType[] = await getDocDataFromDB(dbName, "topImage");
	let result: TopImageType = TopImageInit;

	if (_result) {
		result = _result[0];
	}
	return result;
};

export const setTopImage = async <T>(
	data: T,
	selectedMedia: string[],
	node: HTMLElement,
	width: number,
	height: number,
	createdAt: string,
	updatedAt: string,
) => {
	//

	const docName = "topImage";
	const key = "topImageList";

	const batch = writeBatch(db);

	const blobUrl = await setThumbImageToStorage(node, docName, key, width, height);
	if (blobUrl === "error") {
		return "error";
	}

	const resSetDoc = setDocDataToDB(docName, key, data, batch);

	const resSetComp = await setComponentData({ docName, key, blobUrl, width, height, createdAt, updatedAt, batch });

	if (!(resSetDoc === "success" && resSetComp === "success")) {
		return "error";
	}

	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	//Usageを再構築
	const checksProp = {
		checkMediaUsageFunc: true,
		checkTableUsageFunc: false,
		checkLayoutUsageFunc: false,
	};
	try {
		const func = httpsCallable(functions, "restructureUsageDataOnCall");
		await func(checksProp);
	} catch (error) {
		console.log("error: ", error);
	}

	return "success";
};

export const getTopWord = async ({ dbName = _dbName }) => {
	const _result: TopWordType[] = await getDocDataFromDB(dbName, "topWord");
	const list = await getListInLayoutUsage("topWord");

	let result: TopWordType[] = [TopWordInit];

	if (_result && list) {
		result = _result.map((d) => (list.includes(d.id) ? { ...d, usage: true } : { ...d, usage: false }));
	}

	return result;
};

export const setTopWord = async (data: TopWordType, node: HTMLElement, width: number, height: number, createdAt: string, updatedAt: string) => {
	//

	const docName = "topWord";

	const key = data.id;
	const nData = { ...data };

	nData.body = nData.body.replace(/\n/g, "\\n"); //改行変換

	const batch = writeBatch(db);

	const blobUrl = await setThumbImageToStorage(node, docName, key, width, height);
	if (blobUrl === "error") {
		return "error";
	}

	const resSetDoc = setDocDataToDB(docName, key, nData, batch);

	const resSetComp = await setComponentData({ docName, key, blobUrl, width, height, createdAt, updatedAt, batch });

	if (!(resSetDoc === "success" && resSetComp === "success")) {
		return "error";
	}

	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	return "success";
};

export const deleteTopWord = async (idArr: string[]) => {
	//

	const list = await getTopWord({});

	const delArr = list.filter((d) => idArr.includes(d.id));

	const delIdArr = delArr.map((d) => d.id);

	const isIncludes = [...idArr].filter((d) => delIdArr.includes(d));

	if (isIncludes.length !== delIdArr.length) {
		console.log("データベースと一致しませんでした");
		return "error";
	}

	const batch = writeBatch(db);

	const docName = "topWord";

	const resDelThumbImage = await delThumbImageFromStorage(docName, idArr);
	if (resDelThumbImage === "error") {
		return "error";
	}

	const resDeleteDoc = deleteDocDataFromDB(docName, idArr, batch);

	const resDeleteComp = deleteComponentData(docName, idArr, batch);

	if (!(resDeleteDoc === "success" && resDeleteComp === "success")) {
		return "error";
	}

	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	return "success";
};

export const getAllFormList = async ({ dbName = _dbName }) => {
	const result = await getDocDataFromDB(dbName, "form");
	return result;
};

export const getDeployData = async () => {
	//
	let result;

	const docRef = doc(db, "deploy", "deploy");
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		result = docSnap.data();
	} else {
		console.log("No such document!");
	}

	return result;
};

export const getAllUserList = async () => {
	//
	const result: UserType[] = [UserTypeInit];

	const querySnapshot = await getDocs(collection(db, "users"));
	querySnapshot.forEach((doc) => {
		result.push(doc.data() as UserType);
	});
	return result;
};

export const setUserData = async (data: UserType) => {
	//
	let resHttpsCallable;

	try {
		const func = httpsCallable(functions, "updateUserDataOnCall");
		await func(data);
		resHttpsCallable = "success";
	} catch (error) {
		resHttpsCallable = "error";
	}

	const batch = writeBatch(db);

	if (!(resHttpsCallable === "success")) {
		return "error";
	}

	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	//Usageを再構築
	const checksProp = {
		checkMediaUsageFunc: true,
		checkTableUsageFunc: false,
		checkLayoutUsageFunc: false,
	};
	try {
		const func = httpsCallable(functions, "restructureUsageDataOnCall");
		await func(checksProp);
	} catch (error) {
		console.log("error: ", error);
	}

	return "success";
};

export const getPeopleData = async ({ dbName = _dbName }) => {
	let result: PeopleType[] = [PeopleTypeInit];
	const _result: PeopleType[] = await getDocDataFromDB(dbName, "people");
	if (_result) {
		result = _result;
	}
	return result;
};

type SetPeopleDataType = {
	id: string;
	peopleList: string[];
};

export const setPeopleData = async (data: SetPeopleDataType, node: HTMLElement, width: number, height: number, createdAt: string, updatedAt: string) => {
	const docName = "people";
	const key = "peopleList";

	const batch = writeBatch(db);

	const blobUrl = await setThumbImageToStorage(node, docName, key, width, height);
	if (blobUrl === "error") {
		return "error";
	}

	const resSetDoc = setDocDataToDB(docName, key, data, batch);

	const resSetComp = await setComponentData({ docName, key, blobUrl, width, height, createdAt, updatedAt, batch });

	if (!(resSetDoc === "success" && resSetComp === "success")) {
		return "error";
	}

	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	//Usageを再構築
	const checksProp = {
		checkMediaUsageFunc: true,
		checkTableUsageFunc: false,
		checkLayoutUsageFunc: false,
	};
	try {
		const func = httpsCallable(functions, "restructureUsageDataOnCall");
		await func(checksProp);
	} catch (error) {
		console.log("error: ", error);
	}

	return "success";
};

export const getAllShopInfoList = async ({ dbName = _dbName }) => {
	const _result: ShopInfoType[] = await getDocDataFromDB(dbName, "shopInfo");
	const list = await getListInLayoutUsage("shopInfo");

	let result: any[] = [ShopInfoInit];
	if (_result && list) {
		result = _result.map((d) => (list.includes(d.id) ? { ...d, usage: true } : { ...d, usage: false }));
	}

	return result;
};

export const setShopInfo = async (data: ShopInfoType, node: HTMLElement, width: number, height: number, createdAt: string, updatedAt: string) => {
	//

	const docName = "shopInfo";
	const key = data.id;

	const batch = writeBatch(db);

	const blobUrl = await setThumbImageToStorage(node, docName, key, width, height);
	if (blobUrl === "error") {
		return "error";
	}

	const resSetDoc = setDocDataToDB(docName, key, data, batch);

	const resSetComp = await setComponentData({ docName, key, blobUrl, width, height, createdAt, updatedAt, batch });

	if (!(resSetDoc === "success" && resSetComp === "success")) {
		return "error";
	}

	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	return "success";
};

export const deleteShopInfo = async (idArr: string[]) => {
	//

	const list = await getAllShopInfoList({});
	const delArr = list.filter((d) => idArr.includes(d.id));

	const isIncludes = delArr.length > 0;
	if (!isIncludes) {
		console.log("データベースと一致しませんでした");
		return "error";
	}

	const batch = writeBatch(db);

	const docName = "shopInfo";

	const resDelThumbImage = await delThumbImageFromStorage(docName, idArr);
	if (resDelThumbImage === "error") {
		return "error";
	}

	const resDeleteDoc = deleteDocDataFromDB(docName, idArr, batch);

	const resDeleteComp = deleteComponentData(docName, idArr, batch);

	if (!(resDeleteDoc === "success" && resDeleteComp === "success")) {
		return "error";
	}

	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	return "success";
};

export const getListInLayoutUsage = async (key: string) => {
	//DB > usage > layout　の中から、　keyでfilterして、そのIDをリストにして返す
	const layoutUsage = await getlayoutUsage();
	if (!layoutUsage) {
		return [];
	}
	const reg = new RegExp(`^${key}_(.*)`);
	const _filterd = layoutUsage.map((d) => (d.match(reg) ? d.match(reg) : []));
	const filterd = _filterd.flatMap((d) => (d?.[1] ? d[1] : []));

	return filterd;
};

export const getListInTableUsage = async (key: string) => {
	//DB > usage > tableをリストにして返す

	let usageData: string[];

	const docRef = doc(db, "usage", "table");
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		const data = docSnap.data();
		usageData = Object.keys(data);
	} else {
		console.log("No such document!");
	}

	return usageData;
};

export const getImageSrc = async (id: string) => {
	//idに画像のIDを入れると、そのsrcとsrcHighを返す
	if (!id || id === null) {
		return {
			id: "",
			src: "",
			srcHigh: "",
		};
	}

	const mLib = await getMediaLib();
	const media = mLib.find((media) => media.id === id);

	const result = {
		id: id,
		src: media?.src || "",
		srcHigh: media?.srcHigh || "",
	};

	return result;
};

export const getMediaLib = async () => {
	const mediaLib: MediaLib[] = [MediaLibInitObj];
	const querySnapshot = await getDocs(collection(db, "mediaLib"));
	querySnapshot.forEach((doc) => {
		const data = doc.data();

		const d = {
			id: data.id,
			src: data.src,
			srcHigh: data.srcHigh,
			widthLow: data.widthLow,
			heightLow: data.heightLow,
			widthHigh: data.widthHigh,
			heightHigh: data.heightHigh,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			contentTypeHigh: data.contentTypeHigh,
			contentTypeLow: data.contentTypeLow,
			alt: data.alt,
			caption: data.caption,
			description: data.description,
			tag: data.tag,
		};
		mediaLib.push(d);
	});

	return mediaLib;
};

export const getMediaLibAsId = async ({ id }: { id: string }) => {
	if (!id) {
		return null;
	}
	let result;

	const docRef = doc(db, "mediaLib", id);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		result = docSnap.data() as MediaLib;
	} else {
		result = null;
		console.log("No such document!");
	}

	return result;
};

export const setTempMedia = async (uploadedMediaData: [string, string, number, number, string][], canOverWrite: boolean) => {
	//
	const batch = writeBatch(db);

	const regLow = new RegExp("__low__");
	const regHigh = new RegExp("__high__");

	type MediaforSetObjType = {
		[id: string]: {
			widthLow: number;
			heightLow: number;
			widthHigh: number;
			heightHigh: number;
			src: string;
			srcHigh: string;
			typeLow: string;
			typeHigh: string;
		};
	};
	const _mediaforSetObj: MediaforSetObjType = uploadedMediaData.reduce((acc, val, index, arr) => {
		const _fileName = val[0].replace(/\.[^.]*$/, "").replace(regHigh, "").replace(regLow, "");
		return {
			...acc,
			[_fileName]: {
				widthLow: undefined,
				heightLow: undefined,
				widthHigh: undefined,
				heightHigh: undefined,
				src: undefined,
				srcHigh: undefined,
				typeLow: undefined,
				typeHigh: undefined,
			},
		};
	}, {});

	uploadedMediaData.forEach((media) => {
		const _fileName = media[0].replace(/\.[^.]*$/, "");

		const isLow = _fileName.match(regLow);
		const isHigh = _fileName.match(regHigh);

		let mediaId;
		if (isLow) {
			mediaId = _fileName.replace(regLow, "");
			_mediaforSetObj[mediaId].src = media[1];
			_mediaforSetObj[mediaId].widthLow = media[2];
			_mediaforSetObj[mediaId].heightLow = media[3];
			_mediaforSetObj[mediaId].typeLow = media[4];
		} else {
			mediaId = _fileName.replace(regHigh, "");
			_mediaforSetObj[mediaId].srcHigh = media[1];
			_mediaforSetObj[mediaId].widthHigh = media[2];
			_mediaforSetObj[mediaId].heightHigh = media[3];
			_mediaforSetObj[mediaId].typeHigh = media[4];
		}
	});

	const _mediaArr: [
		string,
		{
			src: string;
			srcHigh: string;
			widthLow: number;
			heightLow: number;
			widthHigh: number;
			heightHigh: number;
			typeLow: string;
			typeHigh: string;
		},
	][] = Object.entries(_mediaforSetObj);

	const now = dayjs();
	const day = now.format("YYYY-MM-DD-HH-mm-ss");

	const tmpImgDataArr: MediaLib[] = _mediaArr.map((d) => ({
		id: d[0],
		src: d[1].src,
		srcHigh: d[1].srcHigh,
		widthLow: d[1].widthLow,
		heightLow: d[1].heightLow,
		widthHigh: d[1].widthHigh,
		heightHigh: d[1].heightHigh,
		createdAt: day,
		updatedAt: day,
		contentTypeLow: d[1].typeLow,
		contentTypeHigh: d[1].typeHigh,
		use: {},
	}));

	await setMediaToDB({ mediaArr: tmpImgDataArr, overWrite: canOverWrite, batch: batch });

	try {
		await batch.commit();
		return tmpImgDataArr;
	} catch (error) {
		console.log(error);
		return "error";
	}
};
type SetMediaToDBType = {
	mediaArr: MediaLib[];
	overWrite: boolean;
	batch: WriteBatch;
};
export const setMediaToDB = async ({ mediaArr = [], overWrite = false, batch }: SetMediaToDBType) => {
	const allMediaArr: MediaLib[] = await getMediaLib();

	mediaArr.forEach((media) => {
		const mediaIfExist = allMediaArr.find((d) => d.id === media.id);
		if (!overWrite && mediaIfExist) {
			return;
		}
		const ref = doc(db, "mediaLib", media.id);
		batch.set(ref, media);
	});
};

export const updateMediaToDB = async (media: MediaLib) => {
	const _nMedia = Object.entries(media).map((d) => (d[1] === undefined ? [d[0], null] : d));
	const nMedia = Object.fromEntries(_nMedia);
	const mediaLibRef = doc(db, "mediaLib", media.id);

	try {
		await setDoc(mediaLibRef, nMedia);
	} catch (error) {
		console.log(error);
		return "error";
	}

	return "success";
};

export const setMediaToStorage = async (
	mediaArr: { fileName: string; width: number; height: number; blob: Blob }[],
	setProgress: Dispatch<SetStateAction<number>>,
) => {
	//
	let result = undefined;

	const dir = "media/images/resizedItems/";
	const dirLow = `${dir}low/`;
	const dirHigh = `${dir}high/`;

	const uploadImages = async (file: Blob, fileName: string, width: number, height: number) => {
		return new Promise((resolve, reject) => {
			const storage = getStorage();
			const storageRef = ref(storage, fileName);

			const uploadTask = uploadBytesResumable(storageRef, file);

			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
					setProgress(progress);
				},
				(error) => {
					console.log(error);
					reject();
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						const fPath = uploadTask.snapshot.ref.fullPath.replace(dirLow, "").replace(dirHigh, "");
						resolve([fPath, downloadURL, width, height, file.type]);
					});
				},
			);
		});
	};

	// uploading images
	if (mediaArr.length > 0) {
		const mArr: Promise<any>[] = [];

		mediaArr.forEach((media) => {
			const { width, height } = media;

			const regHigh = new RegExp("__high__");
			let nDir: string;

			if (media.fileName.match(regHigh)) {
				nDir = `${dirHigh}${media.fileName}`;
			} else {
				nDir = `${dirLow}${media.fileName}`;
			}

			const pr = uploadImages(media.blob, nDir, width, height);

			mArr.push(pr);
		});

		// const promises = [...mArr, ...mArrForSVG, ...mArrForIco];
		const imgUrls = await Promise.all(mArr).catch(() => {
			console.log("Image couldn't uploaded");
			return;
		});

		if (imgUrls && imgUrls.length > 0) {
			result = imgUrls;
		}
	}

	return result;
};

export const deleteMediaLib = async (mediaLibArr: string[]) => {
	let result;
	const batch = writeBatch(db);

	mediaLibArr.forEach((media) => {
		const ref = doc(db, "mediaLib", media);
		batch.delete(ref);
	});

	try {
		await batch.commit();
		result = "success";
	} catch (error) {
		result = "error";
	}

	return result;
	///////////////////////////////////////////////////////////
};

export const getNews = async ({ dbName = _dbName }) => {
	const _result: NewsType[] = await getDocDataFromDB(dbName, "news");

	let result: NewsType[] = [NewsInit];
	if (_result) {
		result = _result;
	}
	return result;
};

export const setNews = async (data: NewsType, node: HTMLElement, width: number, height: number, createdAt: string, updatedAt: string) => {
	const docName = "news";
	const key = "newsList";

	const batch = writeBatch(db);

	const blobUrl = await setThumbImageToStorage(node, docName, key, width, height);

	if (blobUrl === "error") {
		return "error";
	}

	const resSetDoc = setDocDataToDB(docName, key, data, batch);

	const resSetComp = await setComponentData({ docName, key, blobUrl, width, height, createdAt, updatedAt, batch });

	if (!(resSetDoc === "success" && resSetComp === "success")) {
		return "error";
	}

	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	return "success";
};

export const setTable = async (data: TableType, node: HTMLElement, width: number, height: number, createdAt: string, updatedAt: string) => {
	//

	const docName = "table";
	const key = data.id;

	const batch = writeBatch(db);

	const blobUrl = await setThumbImageToStorage(node, docName, key, width, height);
	if (blobUrl === "error") {
		return "error";
	}

	const resSetDoc = setDocDataToDB(docName, key, data, batch);

	const resSetComp = await setComponentData({ docName, key, blobUrl, width, height, createdAt, updatedAt, batch });

	if (!(resSetDoc === "success" && resSetComp === "success")) {
		return "error";
	}

	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	return "success";
};

export const setTableAsTemplate = async (data: TableType, node: HTMLElement, width: number, height: number, createdAt: string, updatedAt: string) => {
	//

	const docName = "table_readOnly";
	const key = data.id;

	const batch = writeBatch(db);

	const blobUrl = await setThumbImageToStorage(node, docName, key, width, height);
	if (blobUrl === "error") {
		return "error";
	}

	const resSetDoc = setDocDataToDB(docName, key, data, batch);

	const resSetComp = await setComponentData({ docName, key, blobUrl, width, height, createdAt, updatedAt, batch });

	if (!(resSetDoc === "success" && resSetComp === "success")) {
		return "error";
	}

	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	return "success";
};

export const getAllTables = async ({ dbName = _dbName }: { dbName?: string }) => {
	const _result: TableType[] = await getDocDataFromDB(dbName, "table");
	const list = await getListInTableUsage("topWord");
	let result: TableType[] = [TableInit];
	if (_result && list) {
		result = _result.map((d) => (list.includes(d.id) ? { ...d, usage: true } : { ...d, usage: false }));
	}
	return result;
};

export const getAllTables_readOnly = async ({ dbName = _dbName }: { dbName?: string }) => {
	const result: TableType[] = await getDocDataFromDB(dbName, "table_readOnly");
	return result;
};

export const deleteTable = async (idArr: string[]) => {
	//

	const list = await getAllTables({});
	const delArr = list.filter((d) => idArr.includes(d.id));

	if (idArr.length !== delArr.length) {
		console.log("データベースと一致しませんでした");
		return "error";
	}

	const batch = writeBatch(db);

	const docName = "table";

	const resDelThumbImage = await delThumbImageFromStorage(docName, idArr);
	if (resDelThumbImage === "error") {
		return "error";
	}

	const resDeleteDoc = deleteDocDataFromDB(docName, idArr, batch);

	const resDeleteComp = deleteComponentData(docName, idArr, batch);

	if (!(resDeleteDoc === "success" && resDeleteComp === "success")) {
		return "error";
	}

	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	return "success";
};

export const getLayoutData = async ({ dbName = _dbName }: { dbName?: string }): Promise<ContainerType[]> => {
	//
	const _result: ContainerType[] = await getDocDataFromDBWithFieldName(dbName, "layout");
	let result: ContainerType[] = [ContainerInitObj];
	if (_result) {
		result = _result;
	}
	return result;
};

export const setLayoutData = async (layoutData: ContainerType[]): Promise<"success" | "error"> => {
	//
	const batch = writeBatch(db);

	const docName = "layout";
	const layoutKey = "containerList";

	const resSetLayoutDoc = setDocDataToDB(docName, layoutKey, layoutData, batch);

	if (!(resSetLayoutDoc === "success")) {
		return "error";
	}

	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	//Usageを再構築
	const checksProp = {
		checkMediaUsageFunc: false,
		checkTableUsageFunc: true,
		checkLayoutUsageFunc: true,
	};
	try {
		const func = httpsCallable(functions, "restructureUsageDataOnCall");
		await func(checksProp);
	} catch (error) {
		console.log("error: ", error);
	}

	return "success";
};

export const getPhotoGalleryData = async ({ dbName = _dbName }) => {
	const _result: PhotoGalleryType[] = await getDocDataFromDB(dbName, "photoGallery");
	let result: PhotoGalleryType[] = [PhotoGalleryInit];
	if (_result) {
		result = _result;
	}
	return result;
};

export const setPhotoGalleryData = async (
	data: any,
	selectedMedia: string[],
	node: HTMLElement,
	width: number,
	height: number,
	createdAt: string,
	updatedAt: string,
) => {
	const docName = "photoGallery";
	const key = "photoGalleryList";

	const batch = writeBatch(db);

	const blobUrl = await setThumbImageToStorage(node, docName, key, width, height);
	if (blobUrl === "error") {
		return "error";
	}

	const resSetDoc = setDocDataToDB(docName, key, data, batch);

	const resSetComp = await setComponentData({ docName, key, blobUrl, width, height, createdAt, updatedAt, batch });

	if (!(resSetDoc === "success" && resSetComp === "success")) {
		return "error";
	}

	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	//Usageを再構築
	const checksProp = {
		checkMediaUsageFunc: true,
		checkTableUsageFunc: false,
		checkLayoutUsageFunc: false,
	};
	try {
		const func = httpsCallable(functions, "restructureUsageDataOnCall");
		await func(checksProp);
	} catch (error) {
		console.log("error: ", error);
	}

	return "success";
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
///////////////////////ここから下は記事に関するメソッド//////////////////////////////
// export const getAllPostData___old = async ({ dbName = _dbName }: { dbName?: string }) => {
// 	const result: PostDataType[] = await getDocDataFromDB(dbName, "post");
// 	return result;
// };

export const getAllPostData = async () => {
	const result: PostDataType[] = [PostDataInitObj];
	const querySnapshot = await getDocs(collection(db, "posts"));
	querySnapshot.forEach((doc) => {
		result.push(doc.data() as PostDataType);
	});
	return result;
};

export const getfilteredPostDataByCanPublic = async () => {
	const result: PostDataType[] = [];

	const docRef = collection(db, "posts");
	const q = query(docRef, where("canPublic", "==", true));

	const querySnapshot = await getDocs(q);

	querySnapshot.forEach((doc) => {
		result.push(doc.data() as PostDataType);
	});
	return result;
};

export const getPostDataAsId = async ({ id }: { id: string }) => {
	if (!id) {
		return PostDataInitObj;
	}
	let result: PostDataType | "error";
	const docRef = doc(db, "posts", id);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		result = docSnap.data() as PostDataType;
	} else {
		result = PostDataInitObj;
		console.log("No such document!");
	}

	return result;
};

export const setPostData = async (id: string, data: PostDataType) => {
	const batch = writeBatch(db);
	batch.set(doc(db, "posts", id), data);
	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	//Usageを再構築
	const checksProp = {
		checkMediaUsageFunc: true,
		checkTableUsageFunc: true,
		checkLayoutUsageFunc: true,
	};

	try {
		const func = httpsCallable(functions, "restructureUsageDataOnCall");
		func(checksProp);
	} catch (error) {
		console.log("error: ", error);
	}

	return "success";
};

// export const deletePost__old = async (arr: string[]) => {
// 	const f = false;
// 	//////////////////////すべてのidが存在するかチェック///////////////////////////
//
// 	const docRef = doc(db, _dbName, "post");
// 	const docSnap = await getDoc(docRef);
//
// 	const allPostData = await getAllPostData();
//
// 	const allPostId = allPostData.map((d) => d.id);
//
// 	const isExist = arr.filter((d) => allPostId.includes(d));
//
// 	if (isExist.length !== arr.length) {
// 		console.log("No such document!");
// 		return "error";
// 	}
// };

// const getDeletedMediaUsageByPostId = async (postIdArr: string[]) => {
// 	//postIdを配列で指定して、deleteするusageを更新し、新しくupdateするmediaUsage　の　dataを取得する
// 	const docRef = doc(db, "usage", "media");
// 	const docSnap = await getDoc(docRef);
//
// 	if (docSnap.exists()) {
// 		const nData1 = docSnap.data();
// 		const nData2: [string, string[]][] = Object.entries(nData1);
// 		const nData3 = nData2.map((d) => {
// 			const nUsagelist = d[1].filter((d2) => {
// 				const isExistId = postIdArr.filter((id) => (d2.match(id) ? true : false));
// 				return isExistId.length > 0 ? false : true;
// 			});
//
// 			return [d[0], nUsagelist];
// 		}) as [string, string[]];
//
// 		const res = nData3.reduce((acc: { [index: string]: string }, value) => {
// 			const [key, val] = value;
// 			acc[key] = val;
// 			return acc;
// 		}, {});
//
// 		return res;
// 	} else {
// 		console.log("No such document!");
// 	}
// };

// const getDeletedTableUsageByPostId = async (postIdArr: string[]) => {
// 	//postIdを配列で指定して、deleteするusageを更新し、新しくupdateするmediaUsage　の　dataを取得する
// 	const docRef = doc(db, "usage", "table");
// 	const docSnap = await getDoc(docRef);
//
// 	if (docSnap.exists()) {
// 		const nData1 = docSnap.data();
// 		console.log("nData1 : ", nData1);
// 		const nData2: [string, string[]][] = Object.entries(nData1);
// 		const nData3 = nData2.map((d) => {
// 			const nUsagelist = d[1].filter((d2) => {
// 				const isExistId = postIdArr.filter((id) => (d2.match(id) ? true : false));
// 				return isExistId.length > 0 ? false : true;
// 			});
//
// 			return [d[0], nUsagelist];
// 		}) as [string, string[]];
//
// 		const res = nData3.reduce((acc: { [index: string]: string }, value) => {
// 			const [key, val] = value;
// 			acc[key] = val;
// 			return acc;
// 		}, {});
//
// 		return res;
// 	} else {
// 		console.log("No such document!");
// 	}
// };

export const deletePostAsIdArr = async (arr: string[]) => {
	const batch: WriteBatch = writeBatch(db);

	arr.forEach((postId) => {
		const laRef = doc(db, "posts", postId);
		batch.delete(laRef);
	});

	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	//Usageを再構築
	const checksProp = {
		checkMediaUsageFunc: true,
		checkTableUsageFunc: true,
		checkLayoutUsageFunc: true,
	};
	try {
		const func = httpsCallable(functions, "restructureUsageDataOnCall");
		func(checksProp);
	} catch (error) {
		console.log("error: ", error);
	}

	return "success";
};

export const getPostDataAsLimit = async ({ lim = 12, startNum = "" }) => {
	const result: PostDataType[] = [];

	const postsRef = collection(db, "posts");
	const q = query(postsRef, orderBy("date"), limit(lim), startAfter(startNum));

	const querySnapshot = await getDocs(q);

	querySnapshot.forEach((doc) => {
		const data = doc.data() as PostDataType;
		result.push(data);
	});

	return result;
};

export const getAllPostTag = async ({ dbName = _dbName }: { dbName?: string }) => {
	const result: TagType[] = await getDocDataFromDB(dbName, "post_tag");
	return result;
};

export const setPostTag = async (tagArr: TagType[]) => {
	const nTags = tagArr.reduce(function (target, key, index) {
		// @ts-ignore
		target[key.id] = key;
		return target;
	}, {});

	try {
		await setDoc(doc(db, _dbName, "post_tag"), nTags);
		return "success";
	} catch (error) {
		console.log(error);
		return "error";
	}
};

export const getAllPostCategory = async ({ dbName = _dbName }: { dbName?: string }) => {
	const _result: CategoryType[] = await getDocDataFromDB(dbName, "post_category");
	let result: CategoryType[] = [CategoryInit];
	if (_result) {
		result = _result;
	}
	return result;
};

export const setPostCategory = async (categoryArr: CategoryType[]) => {
	const nCategory = categoryArr.reduce((acc, val, index) => {
		// @ts-ignore
		acc[val.id] = val;
		return acc;
	}, {});

	try {
		await setDoc(doc(db, _dbName, "post_category"), nCategory);
		return "success";
	} catch (error) {
		console.log(error);
		return "error";
	}
};

export const getMenuList = async ({ dbName = _dbName }) => {
	const _result: MenuType[] = await getDocDataFromDB(dbName, "menu");

	let result = [MenuInit];
	if (_result) {
		result = _result;
	}
	return [result];
};

export const setMenuList = async (dataArr: MenuType[], node: HTMLElement, width: number, height: number, createdAt: string, updatedAt: string) => {
	//

	const docName = "menu";
	const key = "menuList";

	const batch = writeBatch(db);

	const blobUrl = await setThumbImageToStorage(node, docName, key, width, height);
	if (blobUrl === "error") {
		return "error";
	}

	const resSetDoc = setDocDataToDB(docName, key, dataArr, batch);

	const resSetComp = await setComponentData({ docName, key, blobUrl, width, height, createdAt, updatedAt, batch });

	if (!(resSetDoc === "success" && resSetComp === "success")) {
		return "error";
	}

	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	return "success";
};

export const getFooterData = async ({ dbName = _dbName }) => {
	const _result: FooterCompType[] = await getDocDataFromDB(dbName, "footer");
	let result: FooterCompType[] = [FooterCompInit];
	if (_result) {
		result = _result;
	}
	return result;
};

export const setFooterData = async (data: FooterCompType, node: HTMLElement, width: number, height: number, createdAt: string, updatedAt: string) => {
	const docName = "footer";
	const key = "footerData";

	const batch = writeBatch(db);

	const blobUrl = await setThumbImageToStorage(node, docName, key, width, height);
	if (blobUrl === "error") {
		return "error";
	}

	const resSetDoc = setDocDataToDB(docName, key, data, batch);

	const resSetComp = await setComponentData({ docName, key, blobUrl, width, height, createdAt, updatedAt, batch });

	if (!(resSetDoc === "success" && resSetComp === "success")) {
		return "error";
	}

	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	return "success";
};

export const getAllFixedComponent = async ({ dbName = _dbName }) => {
	const _result: FixedComponentType[] = await getDocDataFromDB(dbName, "fixedComponent");
	const list = await getListInLayoutUsage("fixedComponent");

	const result = _result.map((d) => (list.includes(d.id) ? { ...d, usage: true } : { ...d, usage: false }));

	return result;
};

export const setFixedComponent = async (data: FixedComponentType, node: HTMLElement, width: number, height: number, createdAt: string, updatedAt: string) => {
	const docName = "fixedComponent";
	const key = data.id;

	const batch = writeBatch(db);

	const blobUrl = await setThumbImageToStorage(node, docName, key, width, height);
	if (blobUrl === "error") {
		return "error";
	}

	const resSetDoc = setDocDataToDB(docName, key, data, batch);

	const resSetComp = await setComponentData({ docName, key, blobUrl, width, height, createdAt, updatedAt, batch });

	const resSetMedia = await setMediaUsage({
		compBlockName: docName,
		compSubName: key,
		mediaArr: data.imageId,
		batch: batch,
	});

	if (!(resSetDoc === "success" && resSetComp === "success" && resSetMedia === "success")) {
		return "error";
	}

	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	return "success";
};

export const deleteFixedComponent = async (idArr: string[]) => {
	//
	let result;

	const _list = await getAllFixedComponent({});
	const list = Object.entries(_list).map((d) => d[0]);

	const isIncludes = [...idArr, ...list].filter((d) => idArr.includes(d) && list.includes(d)).length > 0;

	if (!isIncludes) {
		console.log("データベースと一致しませんでした");
		return "error";
	}
	const promise: Promise<void>[] = [];
	idArr.forEach((id) => {
		const docRef = doc(db, _dbName, "fixedComponent");

		const p = updateDoc(docRef, {
			[id]: deleteField(),
		});

		promise.push(p);
	});

	try {
		const res = await Promise.all(promise);
	} catch (error) {
		console.log(error);
		result = "error";
	}

	///storegaeの削除

	const delStoragePromise = [];

	idArr.forEach((id) => {
		const p = delThumbImageFromStorage("fixedComponent", [id]);
		delStoragePromise.push(p);
	});

	try {
		await Promise.all(promise);
		result = "success";
	} catch (error) {
		console.log(error);
		result = "error";
	}

	return result;
};

export const getGeneralData = async ({ dbName = _dbName }: { dbName?: string }) => {
	const _result: GeneralControlType[] = await getDocDataFromDB(dbName, "generalControls");
	let result: GeneralControlType[] = [GeneralControlInit];
	if (_result) {
		result = _result;
	}
	return result;
};

export const setGeneralData = async ({ data }: { data: GeneralControlType }) => {
	const result = "success";

	const docName = "generalControls";
	const key = "generalControls";

	const batch = writeBatch(db);

	const resSetDoc = setDocDataToDB(docName, key, data, batch);

	if (!(resSetDoc === "success")) {
		return "error";
	}

	try {
		await batch.commit();
	} catch (error) {
		console.log(error);
		return "error";
	}

	//Usageを再構築
	const checksProp = {
		checkMediaUsageFunc: true,
		checkTableUsageFunc: false,
		checkLayoutUsageFunc: false,
	};
	try {
		const func = httpsCallable(functions, "restructureUsageDataOnCall");
		await func(checksProp);
	} catch (error) {
		console.log("error: ", error);
	}

	return result;
};

export const getAllComponent = async ({ dbName = _dbName }) => {
	const _result: CompListType[] = await getDocDataFromDB(dbName, "componentList");
	let result: CompListType[] = [CompListInit];
	if (_result) {
		result = _result;
	}
	return result;
};

type SetComponentDataType = {
	docName: string;
	key: string;
	blobUrl: string;
	width: number;
	height: number;
	marginTop?: string;
	marginBottom?: string;
	minWidth?: string;
	createdAt: string;
	updatedAt: string;
	batch: WriteBatch;
};

export const setComponentData = async ({
	docName: blockName,
	key: subName,
	blobUrl,
	width,
	height,
	marginTop,
	marginBottom,
	minWidth,
	createdAt,
	updatedAt,
	batch,
}: SetComponentDataType) => {
	let result: "success" | "error";

	const keyName = `${blockName}_${subName}`;
	const docRef = doc(db, _dbName, "componentList");

	const componentData: CompListType = {
		id: keyName,
		blockName: blockName,
		subName: subName,
		thumbImage: blobUrl,
		thumbWidth: Math.round(width),
		thumbHeight: Math.round(height),
		createdAt: createdAt,
		updatedAt: updatedAt,
	};

	try {
		batch.update(docRef, {
			[keyName]: componentData,
		});
		result = "success";
	} catch (error) {
		console.log(error);
		result = "error";
	}
	return result;
};

export const deleteComponentData = (name: string, idArr: string[], batch: WriteBatch) => {
	const result: "success" | "error" = "success";

	const docRef = doc(db, _dbName, "componentList");

	idArr.forEach((id) => {
		const idName = `${name}_${id}`;

		batch.update(docRef, {
			[idName]: deleteField(),
		});
	});

	return result;
};

export const deployDatabase = async () => {
	//
	///////////////////Usageを再構築//////////////////////////
	const checksProp = {
		checkMediaUsageFunc: true,
		checkTableUsageFunc: true,
		checkLayoutUsageFunc: true,
	};
	try {
		const func = httpsCallable(functions, "restructureUsageDataOnCall");
		await func(checksProp);
	} catch (error) {
		console.log("error: ", error);
		const createdAtFull = dayjs().tz("Asia/Tokyo").format("YYYY-MM-DD-hh-mm-ss");

		const logData: LogType = {
			code: "m104",
			type: "fatal",
			message: `deployに失敗しました${JSON.stringify(error)}`,
			createdAt: createdAtFull,
		};

		await setLog(logData);
		return "error";
	}
	///////////////////Usageを読み取る//////////////////////////

	let _layoutUsage: string[] = [];
	let tableUsage: [string, string[]][] = [];
	let mediaUsage: [string, string[]][] = [];

	const querySnapshot = await getDocs(collection(db, "usage"));
	querySnapshot.forEach((doc) => {
		if (doc.id === "layout") {
			_layoutUsage = doc.data()?.layout;
		}
		if (doc.id === "table") {
			const _tableUsage = doc.data();
			tableUsage = Object.entries(_tableUsage);
		}
		if (doc.id === "media") {
			const _mediaUsage = doc.data();
			mediaUsage = Object.entries(_mediaUsage);
		}
	});

	///////////////////全コンポーネントのを読み取る//////////////////////////
	let result;

	const {
		layoutData,
		topImageData,
		topWordData,
		newsData,
		tableData,
		campaignData,
		peopleData,
		shopInfoData,
		photoGallery,
		footerData,
		categoryList,
		menuList,
		generalData,
		allComplist,
	} = await initWebData(_dbName);

	const _media = await getMediaLib();
	const mediaUsageList = mediaUsage.map((d) => d[0]);
	const media = _media.filter((d) => mediaUsageList.includes(d.id));

	//////////////////postデータのblockにimageが合った場合srcを埋め込む////////

	const deoployData = {
		layoutData: JSON.stringify(layoutData),
		topImageData: JSON.stringify(media.filter((m) => topImageData.topImageList.includes(m.id))),
		topWordData: JSON.stringify(topWordData),
		newsData: JSON.stringify(newsData),
		tableData: JSON.stringify(tableData),
		campaignData: JSON.stringify(campaignData),
		peopleData: JSON.stringify(peopleData),
		shopInfoData: JSON.stringify(shopInfoData),
		photoGallery: JSON.stringify(media.filter((m) => photoGallery[0].photoGalleryList.includes(m.id))),
		footerData: JSON.stringify(footerData),
		categoryList: JSON.stringify(categoryList),
		menuList: JSON.stringify(menuList),
		generalData: JSON.stringify(generalData),
		allComplist: JSON.stringify(allComplist),
		mediaLib: JSON.stringify(media),
	};

	const batch = writeBatch(db);

	const deployRef = doc(db, "deploy", "deploy");
	batch.set(deployRef, deoployData);

	try {
		await batch.commit();
		result = "success";
	} catch (error) {
		console.log(error);
		result = "error";
	}

	return result;
};

export const initWebData = async (_dbName: string) => {
	//
	const mediaLib = await getMediaLib();
	const topImageData = await getTopImage({ dbName: _dbName });

	const layoutData = await getLayoutData({ dbName: _dbName });

	const containerChild = layoutData.flatMap((d) => [...d.child]);

	const allTableData = await getAllTables({ dbName: _dbName });
	const tableIdArr = containerChild
		.map((d) => d.match(/table_(.+)/))
		.filter((d2) => d2)
		.map((d3) => d3[1]);

	const tableData = tableIdArr.map((d) => allTableData.find((d2) => d2.id === d));

	const topWords = await getTopWord({ dbName: _dbName });
	const topWordIdArr = containerChild
		.map((d) => d.match(/topWord_(.+)/))
		.filter((d2) => d2)
		.map((d3) => d3[1]);

	const topWordData = topWords.filter((d) => topWordIdArr.includes(d.id));

	const _shopInfoData: ShopInfoType[] = await getAllShopInfoList({});
	const _shopInfoData2 = Object.entries(_shopInfoData).map((d) => d[1]);

	const shopInfoIdArr = containerChild
		.map((d) => d.match(/shopInfo_(.+)/))
		.filter((d2) => d2)
		.map((d3) => d3[1]);

	const shopInfoData = _shopInfoData2.filter((d) => shopInfoIdArr.includes(d.id));

	const allCampaignData: CampaignType[] = await getAllCampaignList({ dbName: _dbName });

	const campaignIdArr = containerChild
		.map((d) => d.match(/campaign_(.+)/))
		.filter((d2) => d2)
		.map((d3) => d3[1]);

	const campaignData = allCampaignData
		.filter((d) => campaignIdArr.includes(d.id))
		.map((d2) => {
			const media = mediaLib.find((m) => m.id === d2.imageId);
			if (media?.src && media.srcHigh) {
				return { ...d2, src: media.src, srcHigh: media.srcHigh };
			} else {
				return d2;
			}
		});

	const userData: UserType[] = await getAllUserList();

	const peopleData1 = await getPeopleData({});

	const peopleData2 = userData.filter((d) => peopleData1[0].peopleList.includes(d.id));
	const peopleData = peopleData2.map((d) => {
		const imgId = d.imageId;
		const thisMedia = mediaLib.find((media) => media.id === imgId);
		if (thisMedia) {
			d.src = thisMedia.src;
			d.srcHigh = thisMedia.srcHigh;
		}

		return d;
	});

	const photoGallery = await getPhotoGalleryData({});

	const _postData = await getAllPostData();
	const postData = _postData.map((d) => {
		const media = mediaLib.find((media) => media.id === d.mainImage);
		if (media) {
			return { ...d, src: media.src, srcHigh: media.srcHigh };
		} else {
			return d;
		}
	});
	const _newsData = await getNews({});
	const newsData = _newsData[0].newsList.map((d) => postData.find((d2) => d2.id === d));

	const categoryList = await getAllPostCategory({ dbName: _dbName });

	const _menuList = await getMenuList({});
	const menuList: MenuType[] = _menuList[0];

	const _footerData = await getFooterData({ dbName: _dbName });
	const footerData = _footerData[0];

	const _generalData = await getGeneralData({});

	const _logoImgSrc = mediaLib.find((m) => m.id === _generalData[0].logoImg);

	const generalData = { ..._generalData[0], logoImgSrc: _logoImgSrc?.srcHigh };
	const faviconImg = mediaLib.find((d) => d.id === generalData?.favicon);
	const logoImg = mediaLib.find((d) => d.id === generalData?.logoImg);
	const ogImg = mediaLib.find((d) => d.id === generalData?.ogImage);

	const _allComplist = await getAllComponent({});
	const allComplist = _allComplist.filter((d) => containerChild.includes(d.id));

	return {
		layoutData,
		topImageData,
		topWordData,
		newsData,
		tableData,
		campaignData,
		peopleData,
		shopInfoData,
		photoGallery,
		footerData,
		categoryList,
		menuList,
		generalData,
		allComplist,
		faviconImg,
		logoImg,
		ogImg,
	};
};

export const setLog = async (logData: LogType) => {
	const docRef = await addDoc(collection(db, "log"), logData);
	return docRef.id;
};
//////////////////////////ここから上は記事に関するメソッド///////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export { app, db, collection, doc, setDoc };
