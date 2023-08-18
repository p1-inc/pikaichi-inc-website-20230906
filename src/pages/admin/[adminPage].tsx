import Head from "next/head";

import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import { useRecoilState, atom, useSetRecoilState } from "recoil";
import { authUserState, isAdminState } from "../../recoil/atoms";

import { useState, useEffect, ReactNode } from "react";

import { AlertComp, BigDialog, BigDialog2 } from "../../components/commonComponents/alertComp";
import { ConfirmComp } from "../../components/commonComponents/alertComp";

import { initializeApp } from "firebase/app";

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

// const GeneralControls = dynamic(() => import("../../components/admin/generalControls/generalControls"));
// const EditLayout = dynamic(() => import("../../components/admin/editLayoutComponents/editLayout"));
// const EditMenu = dynamic(() => import("../../components/admin/editMenuComponents/editMenu"));
// const TopWordList = dynamic(() => import("../../components/admin/editTopWordComponents/topWordList"));
// const EditTopWord = dynamic(() => import("../../components/admin/editTopWordComponents/editTopWord"));
// const SelTopImage = dynamic(() => import("../../components/admin/editTopImageComponents/selTopImage"));
// const SelPhotoGallery = dynamic(() => import("../../components/admin/editPhotoGalleryComponents/selPhotoGallery"));
// const EditTag = dynamic(() => import("../../components/admin/editTagComponents/editTag"));
// const EditCategory = dynamic(() => import("../../components/admin/editCategoryComponents/editCategory"));
const TableList = dynamic(() => import("../../components/admin/editTableComponents/tableList"));
const EditTable = dynamic(() => import("../../components/admin/editTableComponents/editTable"));
// const ShopInfoList = dynamic(() => import("../../components/admin/editShopInfoComponents/shopInfoList"));
// const EditShopInfo = dynamic(() => import("../../components/admin/editShopInfoComponents/editShopInfo"));
// const CampaignList = dynamic(() => import("../../components/admin/editCampagnComponents/campaignList"));
// const EditCampaign = dynamic(() => import("../../components/admin/editCampagnComponents/editCampaign"));
// const SelNews = dynamic(() => import("../../components/admin/editNewsComponents/selNews"));
// const SelPeople = dynamic(() => import("../../components/admin/editPeopleComponents/selPeople"));
// const EditForm = dynamic(() => import("../../components/admin/editFormComponents/editForm"));
// const FormList = dynamic(() => import("../../components/admin/editFormComponents/formList"));
// const ManageFixedComp = dynamic(() => import("../../components/admin/manageFixedComponents/manageFixedComp"));
// const FixedCompList = dynamic(() => import("../../components/admin/manageFixedComponents/fixedCompList"));
// const EditFooterComp = dynamic(() => import("../../components/admin/editFooterComponents/editFooterComp"));

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
				if (user.emailVerified && (token?.claims.role === "super" || token?.claims.role === "admin")) {
					setAuthUser({ uid: user.uid, displayName: user.displayName, email: user.email });
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
				{/* {adminPage === "selTopImage" && <SelTopImage />} */}
				{/* {adminPage === "topWordList" && <TopWordList />} */}
				{/* {adminPage === "editTopWord" && <EditTopWord id={id} isDuplicate={strToBoolean(dup)} />} */}
				{/* {adminPage === "editNews" && <SelNews />} */}
				{adminPage === "tableList" && <TableList />}
				{adminPage === "editTable" && <EditTable id={id} isDuplicate={strToBoolean(dup)} />}
				{/* {adminPage === "campaignList" && <CampaignList />} */}
				{/* {adminPage === "editCampaign" && <EditCampaign id={id} isDuplicate={strToBoolean(dup)} />} */}
				{/* {adminPage === "editPeople" && <SelPeople />} */}
				{/* {adminPage === "shopInfoList" && <ShopInfoList />} */}
				{/* {adminPage === "editShopInfo" && <EditShopInfo id={id} isDuplicate={strToBoolean(dup)} />} */}
				{/* {adminPage === "selPhotoGallery" && <SelPhotoGallery />} */}
				{/* {adminPage === "fixedCompList" && <FixedCompList />} */}
				{/* {adminPage === "manageFixedComp" && <ManageFixedComp id={id} isDuplicate={strToBoolean(dup)} logoImg={logoImg} />} */}
				{/* {adminPage === "formList" && <FormList />} */}
				{/* {adminPage === "editForm" && <EditForm id={id} isDuplicate={strToBoolean(dup)} />} */}
				{/* {adminPage === "editFooter" && <EditFooterComp generalData={generalData} />} */}

				{/* {adminPage === "generalControls" && <GeneralControls />} */}
				{/* {adminPage === "editLayout" && <EditLayout generalData={generalData} />} */}
				{/* {adminPage === "editMenu" && <EditMenu generalData={generalData} />} */}

				{adminPage === "userList" && <UserList />}
				{adminPage === "editUser" && <EditUser id={id} isDuplicate={strToBoolean(dup)} />}

				{adminPage === "postList" && <PostList />}
				{adminPage === "editPost" && <EditPost id={id} isDuplicate={strToBoolean(dup)} />}

				{adminPage === "mediaManager" && <MediaManager />}
				{adminPage === "login" && <AdminLogin />}
			</AuthWrapper>

			{/* <AlertComp />
			<ConfirmComp />
			<BigDialog />
			<BigDialog2 /> */}
		</Flex>
	);
}
