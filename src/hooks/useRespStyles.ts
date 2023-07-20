import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import { useMQ } from "./useMQ";
import { useEffect, useRef, useState } from "react";
import { px } from "@mantine/core";

//ref=基準となるコンテナのref
//minはレスポンシブルの最小画面幅(px)
//maxはレスポンシブルの最大画面幅(px)
//fz=1emからpxサイズ変換
export const useRespStyles = ({ ref, min: minW, max: maxW }: { ref: React.MutableRefObject<HTMLElement>; min?: number; max?: number }) => {
	//
	const styleRef = useRef(null);
	const [fz, setFz] = useState<number>(0); //fz=1emからpxサイズ変換

	useEffect(() => {
		if (!ref) {
			return;
		}
		const style = window.getComputedStyle(ref.current);
		styleRef.current = style;
		const _fontSize = style.getPropertyValue("font-size");
		const fontSize = _fontSize.replace("px", "");
		setFz(Number(fontSize));
	}, [ref?.current]);

	const mq = {
		sps: useMediaQuery("(max-width: 375px)"),
		sp: useMediaQuery(" (max-width: 599px)"),
		spl: useMediaQuery("(max-width: 799px)"),
		tabs: useMediaQuery("(max-width: 899px)"),
		tab: useMediaQuery("(max-width: 1024px)"),
		pc: useMediaQuery("(max-width: 1425px)"),
		max: useMediaQuery("(max-width:1426px)"),
	};

	///////////////clamp計算/////////////////

	const { height, width } = useViewportSize();

	//_minFz,_maxFz="1em" => em設定
	//_minFz,_maxFz=1（数値のみ） => 1px、px設定
	const clp = (_minFz: number | string, _maxFz: number | string) => {
		let minFz = _minFz as number;
		let maxFz = _maxFz as number;

		if (typeof _minFz === "string") {
			const minArr = _minFz.match(/(-?[0-9]*\.?[0-9])+em/);
			minFz = Number(minArr[1]) * fz;
		}

		if (typeof _maxFz === "string") {
			const maxArr = _maxFz.match(/(-?[0-9]*\.?[0-9])+em/);
			maxFz = Number(maxArr[1]) * fz;
		}

		const slope = ((maxFz - minFz) / (maxW - minW)) * 100;
		const yIntercept = minFz + (-minW / 100) * slope;

		const recNum = (width / 100) * Number(slope) + yIntercept;

		let result = 0;
		if (minFz > recNum) {
			result = minFz;
		} else if (maxFz < recNum) {
			result = maxFz;
		} else {
			result = recNum;
		}

		return `${result}px`;
	};

	return { mq, fz, clp };
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

///  使い方
///  以下のようにカスタムフックとして読み込む
///	 const { mq, clp } = useRespStyles({ ref: containerRef, min: 599, max: 1024 });
///  ref=基準となるコンテナのref
///  minはレスポンシブルの最小画面幅(px)
///  maxはレスポンシブルの最大画面幅(px)
///
///  以下のように設定
///  fontSize: clp("2.5em", "3.3em"),
///  引数が文字列="1em" => em設定  *emしか対応していません
/// 　 引数が数値 => 1px、px設定
