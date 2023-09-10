import path from "path";
import sizeOf from "image-size";

import Head from "next/head";

import { useScrollIntoView } from "@mantine/hooks";
import { WorksDataType, worksData } from "../data/worksData";

import { ReactNode, useEffect, useState } from "react";
import AdminLogin from "../components/admin/adminLogin";
import { Auth, User, getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useRecoilState } from "recoil";
import { authUserState } from "../recoil/atoms";
import { Home } from "../components/home";

// const firebaseConfig = {
// 	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
// 	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
// 	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
// 	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BAKET,
// 	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
// 	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

// const app = initializeApp(firebaseConfig);

type UserType = {
	uid: string;
	displayName: string;
	email: string;
};

export default function App({ workImageData }: { workImageData: WorksDataType[] }) {
	//

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

			<Home workImageData={workImageData} />
		</div>
	);
}

export async function getStaticProps() {
	const imgPath = ["public", "img", "works"];
	const imgDirectory = path.join(process.cwd(), ...imgPath);

	const nWorksData = worksData.map((d) => {
		const fullPath = path.join(imgDirectory, d.fileName);
		const dimensions = sizeOf(fullPath);
		const type = dimensions.type;
		return {
			...d,
			src: `/${imgPath[1]}/${imgPath[2]}/${d.fileName}`,
			width: dimensions.width,
			height: dimensions.height,
		};
	});

	return {
		props: {
			workImageData: nWorksData,
		},
	};
}
