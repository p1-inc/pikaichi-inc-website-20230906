export const AddressSVG = ({ width = "100%", height = "100%", rotate = "0", stroke = "currentcolor", strokeWidth = "1px" }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 86 101">
			<title>AddressSVG</title>

			<path
				fill="none"
				stroke={stroke}
				strokeWidth={strokeWidth}
				d="m80.5,43.16c0,10.26-4.2,19.55-10.98,26.28-6.79,6.73-26.52,25.56-26.52,25.56,0,0-19.73-18.83-26.52-25.56-6.79-6.73-10.98-16.02-10.98-26.28s4.2-19.55,10.98-26.28,16.16-10.89,26.52-10.89,19.73,4.16,26.52,10.89c6.79,6.73,10.98,16.02,10.98,26.28Z"
			/>
			<ellipse fill="none" stroke={stroke} strokeWidth={strokeWidth} cx="43" cy="43.16" rx="14.06" ry="13.94" />
		</svg>
	);
};
