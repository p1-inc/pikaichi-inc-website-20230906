export const ImageSVG = ({ width = "100%", height = "100%", color = "rgb(84,85,84)", rotate = "0" }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			viewBox="0 0 164 164"
			preserveAspectRatio="none"
		>
			<title>ImageSVG</title>
			<path
				fill={color}
				strokeWidth={0}
				d="M164,82c0,45.3-36.7,82-82,82S0,127.3,0,82S36.7,0,82,0S164,36.7,164,82z M143,115l-37-60L80,97.2L62.5,69L34,115h57H143z
	 M31,44c0,6.1,4.9,11,11,11S53,50,53,44s-4.9-11-11-11S31,37.9,31,44z"
			/>
		</svg>
	);
};
