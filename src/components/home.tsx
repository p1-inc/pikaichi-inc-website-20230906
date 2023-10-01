import { Flex, Transition, useMantineTheme } from "@mantine/core";

import Footer from "../components/Footer";
import { Box } from "@mantine/core";
import P1_Slider2 from "../components/P1_Slider2";
import { ReactNode, useEffect, useRef, useState } from "react";
import { WorksCard } from "../components/worksCard";
import { WorksDataType, worksData } from "../data/worksData";
import { PikaichistarSVG } from "../svg/pikaichistarSVG";
import { HeaderArea } from "../components/headerArea";
import { Profile } from "../components/profile";
import { Company } from "../components/company";
import { Contact } from "../components/contact";
import { useRecoilState } from "recoil";
import { authUserState } from "../recoil/atoms";
import { Auth, User, getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { LoginModal } from "./loginModal";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BAKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

export const Home = ({ workImageData: originalItems }: { workImageData: WorksDataType[] }) => {
	//

	const [items, setItems] = useState([]);

	const [loading, setLoading] = useState(true);
	const [authUser, setAuthUser] = useRecoilState(authUserState);

	const [openLoginWindow, setOpenLoginWindow] = useState(true);

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
		const shuffleArray = (array: WorksDataType[]) => {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
			return array;
		};

		setItems(shuffleArray([...originalItems]));
	}, [originalItems]);

	const theme = useMantineTheme();

	return (
		<Box component="main" fz="1rem">
			<Flex w="90%" m="0 auto" mt="3em">
				<HeaderArea />
			</Flex>
			<Flex mt="3em">
				<P1_Slider2 images={items} />
			</Flex>
			<Flex direction="column" align="center" mt="5em">
				<PikaichistarSVG width="2em" />
				<Box>works</Box>
			</Flex>

			<WorksCard items={items} mt="2em" />

			<Flex w="80%" mx="auto" mt="3em" sx={{ overflowWrap: "break-word" }}>
				<Profile />
			</Flex>

			<Flex w="80%" mx="auto" mt="3em" sx={{ overflowWrap: "break-word" }}>
				<Company />
			</Flex>
			<Box mt="10em">
				<Contact />
			</Box>
			<Footer mt="10em" />
		</Box>
	);
};
