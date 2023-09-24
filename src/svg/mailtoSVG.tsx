export const MailToSVG = ({ width = "100%", height = "100%", rotate = "0", stroke = "currentcolor", strokeWidth = "1px" }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 95 67">
			<title>MailToSVG</title>
			<rect fill="none" stroke={stroke} strokeWidth={strokeWidth} x="2.5" y="2.5" width="90" height="62" />
			<polyline fill="none" stroke={stroke} strokeWidth={strokeWidth} points="92.5 2.5 47.5 37.99 2.5 2.5" />
		</svg>
	);
};
