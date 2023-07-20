import Head from "next/head";

import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import { useRecoilState, atom, useSetRecoilState } from "recoil";
import { authUserState, isAdminState } from "../../recoil/atoms";

import { useState, useEffect, ReactNode } from "react";

import { AlertComp, BigDialog, BigDialog2 } from "../../components/commonComponents/alertComp";
import { ConfirmComp } from "../../components/commonComponents/alertComp";

import { getApp, getApps, initializeApp } from "firebase/app";

import { getAuth, signOut, onAuthStateChanged, User, Auth } from "firebase/auth";

import { getStorage } from "firebase/storage";

import EditUser from "../../components/admin/editUserComponents/editUser";
import { getGeneralData, getMediaLib } from "../../firebase/firebase";
import { Flex } from "@mantine/core";
// import { mediaLibState } from "../../recoil/mediaLibAtoms";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BAKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth();
const storage = getStorage(app);

const AdminHome = dynamic(() => import("../../components/admin/adminHome"));
const UserList = dynamic(() => import("../../components/admin/editUserComponents/userList"));
const PostList = dynamic(() => import("../../components/admin/editPostComponents/postList"));
const EditPost = dynamic(() => import("../../components/admin/editPostComponents/editPost"));
const MediaManager = dynamic(() => import("../../components/admin/mediaManager/mediaManager"));

const AdminLogin = dynamic(() => import("../../components/admin/adminLogin"));

export default function Admin() {
	//
	const [pageName, setPageName] = useState("index");
	// const [generalData, setGeneralData] = useState<GeneralControlType>();
	// const [faviconImg, setFaviconImg] = useState<MediaLib>();

	const router = useRouter();

	const { adminPage: _adminPage, id: _id, dup: _dup } = router.query;

	const adminPage = Array.isArray(_adminPage) ? _adminPage[0] : _adminPage;
	const id = Array.isArray(_id) ? _id[0] : _id;
	const dup = Array.isArray(_dup) ? _dup[0] : _dup;

	const [loading, setLoading] = useState(true);
	const [authUser, setAuthUser] = useRecoilState(authUserState);
	// const [logoImg, setLogoImg] = useState<MediaLib>();

	// const setMediaState = useSetRecoilState(mediaLibState);

	const setIsAdminState = useSetRecoilState(isAdminState);

	useEffect(() => {
		setIsAdminState(true);
	}, []);

	useEffect(() => {
		const getRole = async (user: User, auth: Auth) => {
			if (user) {
				const token = await user?.getIdTokenResult();

				if (user.emailVerified && token?.claims.role === "admin") {
					setAuthUser({ uid: user.uid, displayName: user.displayName, email: user.email });
					// const mediaLib = await getMediaLib();
					// setMediaState(mediaLib);
				} else {
					try {
						const res = await signOut(auth);
						setAuthUser({
							uid: "",
							displayName: "",
							email: "",
						});
					} catch (error) {
						console.log(error);
					}
				}
			}

			setLoading(false);
			return;
		};
		onAuthStateChanged(auth, (user) => {
			getRole(user, auth);
		});
	}, []);

	useEffect(() => {
		if (Array.isArray(adminPage)) {
		} else {
			setPageName(adminPage);
		}
	}, [adminPage]);

	const AuthWrapper = ({ children }: { children: ReactNode }) => {
		if (!loading && authUser.uid !== "") {
			return <>{children}</>;
		} else if (loading || authUser.uid !== "") {
			return;
		} else {
			return <AdminLogin />;
		}
	};

	const strToBoolean = (str: string) => {
		return str === "true" ? Boolean(true) : Boolean(false);
	};

	const adminWrapper = {
		label: "adminWrapper",
		minHeight: "100vh",
		width: "100%",
		minWidth: "700px",
		overflow: "hidden",
	};

	return (
		<Flex direction="column" sx={adminWrapper}>
			<AuthWrapper>
				{adminPage === "index" && <AdminHome />}

				{/* {adminPage === "userList" && <UserList />} */}
				{/* {adminPage === "editUser" && <EditUser id={id} isDuplicate={strToBoolean(dup)} />} */}

				{adminPage === "postList" && <PostList />}
				{adminPage === "editPost" && <EditPost id={id} isDuplicate={strToBoolean(dup)} />}

				{adminPage === "mediaManager" && <MediaManager />}
				{adminPage === "login" && <AdminLogin />}
			</AuthWrapper>

			<AlertComp />
			<ConfirmComp />
			<BigDialog />
			<BigDialog2 />
		</Flex>
	);
}
