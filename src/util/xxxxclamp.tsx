import { px } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

export const clamp = (min: string, rec: string, max: string) => {
	//
	// 	const { height, width } = useViewportSize();
	// 	const minArr = min.match(/-?[0-9]*\.?[0-9]+rem/);
	// 	const maxArr = max.match(/-?[0-9]*\.?[0-9]+rem/);
	//
	// 	const _recArr = rec.split("+").map((d) => {
	// 		const a = d.match(/(-?[0-9]*\.?[0-9]+)(rem)/);
	// 		const b = d.match(/(-?[0-9]*\.?[0-9]+)(vw)/);
	// 		if (!a && !b) {
	// 			return undefined;
	// 		}
	// 		return a ? a : b;
	// 	});
	// 	const isCorrect = _recArr.every((d) => d);
	// 	const recArr = _recArr.map((d) => {
	// 		if (d[2] === "rem") {
	// 			return px(d[0]);
	// 		} else if (d[2] === "vw") {
	// 			return (width / 100) * Number(d[1]);
	// 		}
	// 		return d;
	// 	});
	//
	// 	const recNum = recArr.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0) as number;
	//
	// 	if (!minArr || !maxArr || !isCorrect) {
	// 		console.log("error::clamp");
	// 		return;
	// 	}
	//
	// 	const minNum = px(minArr[0]);
	// 	const maxNum = px(maxArr[0]);
	// 	let result = 0;
	// 	if (minNum > recNum) {
	// 		result = minNum;
	// 	} else if (maxNum < recNum) {
	// 		result = maxNum;
	// 	} else {
	// 		result = recNum;
	// 	}
	//
	// 	return `${result}px`;
};

// export const testVW = (num: number) => {
// 	const { height, width } = useViewportSize();
//
// 	return (width / 100) * Number(num);
// };
