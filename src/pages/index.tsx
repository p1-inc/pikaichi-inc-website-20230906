import path from "path";
import sizeOf from "image-size";

import Head from "next/head";
import { WorksDataType, worksData } from "../data/worksData";
import { Home } from "../components/home";
import { ReactNode, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authUserState, isAdminState } from "../recoil/atoms";
import AdminLogin from "../components/admin/adminLogin";
import { Auth, User, getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import StartUkimaMessage from "../components/startUkimaMessage";

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

const AuthWrapper = ({ loading, authUser, children }: { loading: any; authUser: any; children: ReactNode }) => {
    if (!loading && authUser.uid !== "") {
        return <>{children}</>;
    } else if (loading || authUser.uid !== "") {
        return;
    } else {
        return <AdminLogin />;
    }
};

export default function App({ workImageData }: { workImageData: WorksDataType[] }) {
    //
    const [loading, setLoading] = useState(true);
    const [authUser, setAuthUser] = useRecoilState(authUserState);
    const [displayUkimaMessage, setDisplayUkimaMessage] = useState<boolean>(false);

    const setIsAdminState = useSetRecoilState(isAdminState);

    const displayFirstMessage = ({ email }: { email: string }) => {
        //ファーストメッセージ
        if (email === "ukimakoen@pikaichi-inc.com") {
            setDisplayUkimaMessage(true);
        }
    };

    useEffect(() => {
        setIsAdminState(true);
    }, []);

    useEffect(() => {
        const getRole = async (user: User, auth: Auth) => {
            if (user) {
                const token = await user?.getIdTokenResult();
                if (user.emailVerified && (token?.claims.role === "super" || token?.claims.role === "admin")) {
                    setAuthUser({ uid: user.uid, displayName: user.displayName, email: user.email });
                    displayFirstMessage({ email: user.email });
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
            <AuthWrapper loading={loading} authUser={authUser}>
                <StartUkimaMessage
                    displayUkimaMessage={displayUkimaMessage}
                    setDisplayUkimaMessage={setDisplayUkimaMessage}
                />
                <Home workImageData={workImageData} />
            </AuthWrapper>
        </div>
    );
}

export async function getStaticProps() {
    const imgPath = ["public", "img", "works"];
    const imgDirectory = path.join(process.cwd(), ...imgPath);

    const nWorksData = worksData.map((d) => {
        const fullPathPC = path.join(imgDirectory, d.filePathPC);
        const fullPathSP = path.join(imgDirectory, d.filePathSP);
        const dimensionsPC = sizeOf(fullPathPC);
        const dimensionsSP = sizeOf(fullPathSP);

        return {
            ...d,
            srcPC: `/${imgPath[1]}/${imgPath[2]}/${d.filePathPC}`,
            srcSP: `/${imgPath[1]}/${imgPath[2]}/${d.filePathSP}`,
            widthPC: dimensionsPC.width,
            widthSP: dimensionsSP.width,
            heightPC: dimensionsPC.height,
            heightSP: dimensionsSP.height,
        };
    });

    return {
        props: {
            workImageData: nWorksData,
        },
    };
}
