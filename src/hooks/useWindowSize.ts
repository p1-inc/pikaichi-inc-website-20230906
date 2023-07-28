import { useState, useEffect, useLayoutEffect } from "react";

export const useWindowSize = () => {
	//
	const [windowWidth, setWindowWidth] = useState<number>(0);
	const [windowHeight, setWindowHeight] = useState<number>(0);

	//全幅に対して180pxのBOXが何個入るか

	useLayoutEffect(() => {
		const updateSize = (): void => {
			setWindowWidth(window.innerWidth);
			setWindowHeight(window.innerHeight);
		};

		window.addEventListener("resize", updateSize);
		updateSize();

		return () => window.removeEventListener("resize", updateSize);
	}, []);

	return { windowWidth, windowHeight };
};
