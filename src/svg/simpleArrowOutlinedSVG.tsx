export const SimpleArrowOutlinedSVG = ({ width = "100%", height = "100%", color = "rgb(84,85,84)", rotate = "0" }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 34 21">
			<title>SimpleArrowOutlinedSVG</title>
			<polygon
				stroke={color}
				strokeWidth="4"
				fill="none"
				points="34,21 0,21 17,0 "
				transform={`rotate(${rotate} 17 10.5)`}
			/>
		</svg>
	);
};
