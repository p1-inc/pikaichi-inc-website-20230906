import { useState, useEffect, useRef } from "react";

export const useGetComputedStyles = () => {
	//
	const ref = useRef(null);
	const styleRef = useRef(null);
	const [fz, setFz] = useState<number>(0);

	useEffect(() => {
		const style = window.getComputedStyle(ref.current);
		styleRef.current = style;
		const _fontSize = style.getPropertyValue("font-size");
		const fontSize = _fontSize.replace("px", "");
		setFz(Number(fontSize));
	}, [ref.current]);

	return {
		ref,
		styleRef,
		fz,
	};
};
