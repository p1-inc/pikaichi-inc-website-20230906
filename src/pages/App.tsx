import Head from "next/head";
import { WorksDataType } from "../data/worksData";
import { Home } from "../components/home";
import { ReactNode, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authUserState, isAdminState } from "../recoil/atoms";
import AdminLogin from "../components/admin/adminLogin";
import { Auth, User, signOut } from "firebase/auth";

export default function App({ workImageData }: { workImageData: WorksDataType[] }) {
	//
	const [loading, setLoading] = useState(true);
	const [authUser, setAuthUser] = useRecoilState(authUserState);

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

	const AuthWrapper = ({ children }: { children: ReactNode }) => {
		if (!loading && authUser.uid !== "") {
			return <>{children}</>;
		} else if (loading || authUser.uid !== "") {
			return;
		} else {
			console.log("cdscjds;");
			return <AdminLogin />;
		}
	};

	return (
		<div>
			<Head>
				<title>Pikaichi inc.</title>
				<meta name="viewport" content="width=device-width,initial-scale=1.0" />
				<meta name="description" content="Pikaichi inc." />
				<meta property="og:url" content="https://pikaichi-inc.com" />
				<meta property="og:title" content="Pikaichi inc." />
				<meta property="og:site_name" content="Pikaichi inc." />
				<meta property="og:description" content="Pikaichi inc." />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://pikaichi-inc.com/img/ogpImage.png" />
				<meta name="twitter:card" content="summary_large_image" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<AuthWrapper>
				<Home workImageData={workImageData} />
			</AuthWrapper>
		</div>
	);
}
