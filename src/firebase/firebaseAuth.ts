import { initializeApp } from "firebase/app";

import {
	getAuth,
	signOut,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendEmailVerification,
	onAuthStateChanged,
	updateProfile,
	sendPasswordResetEmail,
	setPersistence,
	browserSessionPersistence,
} from "firebase/auth";

import { doc, setDoc, getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BAKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

import { UserType } from "../types/types";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth();

export const loginFunc = async (uid: string, password: string) => {
	try {
		await setPersistence(auth, browserSessionPersistence); //認証状態の永続性の変更(sesson)
		const userCredential = await signInWithEmailAndPassword(auth, uid, password);
		const user = userCredential.user;

		if (user.emailVerified) {
			return user;
		} else {
			await signOut(auth);
			return user;
		}
	} catch (error) {
		console.log(error);
		return error.code;
	}
};

export const loginAsAdminFunc = async (uid: string, password: string) => {
	try {
		await setPersistence(auth, browserSessionPersistence); //認証状態の永続性の変更(sesson)
		const userCredential = await signInWithEmailAndPassword(auth, uid, password);

		const user = userCredential.user;
		const token = await user.getIdTokenResult();

		if (user.emailVerified && token?.claims.role === "admin") {
			return user;
		} else if (!user.emailVerified) {
			await signOut(auth);
			return "noEmailVerified";
		} else if (token?.claims.role !== "admin") {
			await signOut(auth);
			return "noAdminRole";
		} else {
			return false;
		}
	} catch (error) {
		console.log(error);
		return error.code;
	}
};

export const sendEmailVerificationFunc = async (uid: string, password: string) => {
	const userCredential = await signInWithEmailAndPassword(auth, uid, password);

	const user = userCredential.user;

	try {
		const res = await sendEmailVerification(user);
		const res2 = await signOut(auth);
		return true;
	} catch (error) {
		console.log(error);
		return;
	}
};

export const signupFunc = async (email: string, password: string) => {
	const auth = getAuth();

	let userCredential;
	try {
		userCredential = await createUserWithEmailAndPassword(auth, email, password);
		const tmpUser = userCredential.user;

		updateProfile(tmpUser, {
			displayName: email,
		});
	} catch (error) {
		console.log(error);
		return error.code;
	}

	try {
		const res = await sendEmailVerification(auth.currentUser);
		return userCredential;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const getAuthState = async () => {
	const auth = getAuth();
	onAuthStateChanged(auth, (user) => {
		return user;
	});

	const user = auth.currentUser;

	return user;
};

export const sendPasswordReset = async (email: string) => {
	const auth = getAuth();

	try {
		const res = await sendPasswordResetEmail(auth, email);
		return "success";
	} catch (error) {
		return error.code;
	}
};

export const setUserData = async (user: UserType) => {
	//

	if (!user) {
		console.log("no-user-data");
		return;
	}
	const reg = new RegExp(/@.+/);
	const dispName = user.email.replace(reg, "");

	const uid = user.id;
	const email = user.email;
	const data: UserType = {
		id: uid,
		enabled: false,
		email: user.email,
		displayName: dispName,
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
		role: "staff",
		createdAt: "",
		updatedAt: "",
	};

	try {
		await setDoc(doc(db, "users", uid), data);
	} catch (error) {
		console.log(error);
	}
};
