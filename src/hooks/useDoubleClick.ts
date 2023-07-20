import { useState, useEffect, useRef } from "react";

type ClickHandler<T> = (props: T) => void;

export const useDoubleClick = <T>({
	handleNormalClicked, //ノーマルクリック
	handleSingleClicked, //ダブルクリック
	handleDoubleClicked, //シングルクリック確定(ダブルクリックではないことを確認するのでタイミングが遅い)
}: {
	handleNormalClicked?: ClickHandler<T>;
	handleSingleClicked?: ClickHandler<T>;
	handleDoubleClicked?: ClickHandler<T>;
}) => {
	//
	const clickCount = useRef(0);

	const handleClicked = (props: T) => {
		clickCount.current++;

		if (handleNormalClicked) {
			handleNormalClicked(props);
		}

		if (clickCount.current < 2) {
			setTimeout(() => {
				if (1 < clickCount.current) {
					if (handleDoubleClicked) {
						handleDoubleClicked(props);
					}
				} else {
					if (handleSingleClicked) {
						handleSingleClicked(props);
					}
				}
				clickCount.current = 0;
			}, 300);
		}
	};

	return {
		handleClicked,
	};
};
