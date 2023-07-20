export const ImageCopySVG = ({
	width = "100%",
	height = "100%",
	color = "rgb(84,85,84)",
	rotate = "0",
	subText = true,
}) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			viewBox="0 0 284 54"
			preserveAspectRatio="none"
		>
			<title>ImageCopySVG</title>
			<text
				id="画像を挿入_最大アップロードサイズ:10MB"
				data-name="画像を挿入
最大アップロードサイズ:10MB"
				transform="translate(142 18)"
				fontSize="20"
				fill={color}
			>
				<tspan x="-50" y="0">
					画像を挿入
				</tspan>

				<tspan x="-141.21" y="28">
					最大アップロードサイズ:10MB
				</tspan>
			</text>
		</svg>
	);
};
