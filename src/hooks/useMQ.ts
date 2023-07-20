import { useMediaQuery } from "@mantine/hooks";

export const useMQ = () => {
	//
	// const mq = {
	// 	sps: useMediaQuery("(max-width: 375px)"),
	// 	sp: useMediaQuery("(min-width:376px) and (max-width: 599px)"),
	// 	spl: useMediaQuery("(min-width:600px) and (max-width: 799px)"),
	// 	tabs: useMediaQuery("(min-width:800px) and (max-width: 899px)"),
	// 	tab: useMediaQuery("(min-width:900px) and (max-width: 1024px)"),
	// 	pc: useMediaQuery("(min-width:1025px) and (max-width: 1425px)"),
	// 	max: useMediaQuery("(min-width:1426px)"),
	// };

	const mq = {
		sps: useMediaQuery("(max-width: 375px)"),
		sp: useMediaQuery(" (max-width: 599px)"),
		spl: useMediaQuery("(max-width: 799px)"),
		tabs: useMediaQuery("(max-width: 899px)"),
		tab: useMediaQuery("(max-width: 1024px)"),
		pc: useMediaQuery("(max-width: 1425px)"),
		max: useMediaQuery("(max-width:1426px)"),
	};

	return { mq };
};

export type MqType = {
	sps: boolean;
	sp: boolean;
	spl: boolean;
	tabs: boolean;
	tab: boolean;
	pc: boolean;
	max: boolean;
};
