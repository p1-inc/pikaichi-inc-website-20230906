import { ReactNode, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { authUserState } from "../recoil/atoms";
import { Auth, User, getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import AdminLogin from "./admin/adminLogin";

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

export const PageAuthWrapper = ({ children }: { children: ReactNode }) => {
    //
    const [loading, setLoading] = useState(true);
    const [authUser, setAuthUser] = useRecoilState(authUserState);

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

    return (
        <AuthWrapper loading={loading} authUser={authUser}>
            <div>{children}</div>;
        </AuthWrapper>
    );
};
