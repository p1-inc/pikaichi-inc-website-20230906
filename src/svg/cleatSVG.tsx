export const CleatSVG = ({ width = "100%", height = "100%", color = "rgb(84,85,84)", rotate = "0" }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 21 21">
			<rect fill={color} width="5" height="5" />
			<rect fill={color} x="8" width="5" height="5" />
			<rect fill={color} x="16" width="5" height="5" />
			<rect fill={color} y="8" width="5" height="5" />
			<rect fill={color} x="8" y="8" width="5" height="5" />
			<rect fill={color} x="16" y="8" width="5" height="5" />
			<rect fill={color} y="16" width="5" height="5" />
			<rect fill={color} x="8" y="16" width="5" height="5" />
			<rect fill={color} x="16" y="16" width="5" height="5" />
		</svg>
	);
};
