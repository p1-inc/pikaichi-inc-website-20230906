import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Box, Center, Flex } from "@mantine/core";
import { useMQ } from "../../hooks/useMQ";

export const Slide6 = () => {
	const { mq } = useMQ();

	const InnerBoxWide = ({ children, color }: any) => {
		return (
			<Box
				sx={{
					fontSize: mq.sp ? "10px" : "1em",
					width: "100%",
					border: `2px solid ${color}`,
					borderRadius: "0.5em",
					padding: "0.5em",
				}}
			>
				{children}
			</Box>
		);
	};

	const InnerBoxWide2 = ({ children, annotation, color }: any) => {
		return (
			<Flex
				direction={mq.sp ? "column" : "row"}
				align="center"
				justify="center"
				w="100%"
				p="0.5em"
				sx={{
					fontSize: mq.sp ? "10px" : "1em",
					border: `2px solid ${color}`,
					borderRadius: "0.5em",
				}}
			>
				<Box w="10em">{children}</Box>

				<Box fz={mq.sp ? "10px" : "1em"} ta="left">
					{annotation}
				</Box>
			</Flex>
		);
	};

	const InnerBoxHarfWidthTitle = ({ children, title, color }: any) => {
		return (
			<Box
				sx={{
					width: "100%",
					height: "20em",
					border: `2px solid ${color}`,
					borderRadius: "0.5em",
					margin: mq.sp ? "0 auto" : "initial",
					fontSize: mq.sp ? "10px" : "1em",
				}}
			>
				<Flex
					w="100%"
					h="2em"
					align="center"
					justify="center"
					sx={{
						backgroundColor: color,
						border: `2px solid ${color}`,
						color: "#fff",
					}}
				>
					{title}
				</Flex>

				<Box mt="1em">{children}</Box>
			</Box>
		);
	};

	return (
		<>
			<h2>
				<span>ご依頼から納品までの流れ</span>
			</h2>
			<InnerBoxWide color="#e97ab1"> 当フォームから問い合わせ、申込み </InnerBoxWide>
			<Center>
				<ArrowDownwardIcon />
			</Center>
			<InnerBoxWide2 color="#e36234" annotation="お客様のご希望、ご相談をお聞きします。ZOOM、メール、電話等でお打ち合わせいたします">
				ヒアリング
			</InnerBoxWide2>
			<Center>
				<ArrowDownwardIcon />
			</Center>
			<Box
				sx={{
					flexShrink: 1,
					fontSize: mq.sp ? "10px" : "1em",
					padding: "1em",
				}}
			>
				写真や文章など 随時お客様から 素材を提供して いただきます
			</Box>
			<Flex direction={mq.sp ? "column" : "row"} justify="space-between">
				<Box w={mq.sp ? "100%" : "48%"}>
					<InnerBoxHarfWidthTitle title="webサイト" color="#eca71c">
						<Flex direction="column" align="center">
							デザイン案提出
							<ArrowDownwardIcon />
							修正作業
							<ArrowDownwardIcon />
							校了
						</Flex>
					</InnerBoxHarfWidthTitle>
					<Center>
						<ArrowDownwardIcon />
					</Center>
				</Box>
				<Box w={mq.sp ? "100%" : "48%"}>
					<InnerBoxHarfWidthTitle title="チラシ" color="#e36234">
						<Flex direction="column" align="center">
							メール等で <br /> デザイン案をご提出
							<ArrowDownwardIcon />
							簡易校正送付
							<ArrowDownwardIcon />
							修正作業
							<ArrowDownwardIcon />
							校了
						</Flex>
					</InnerBoxHarfWidthTitle>
					<Center>
						<ArrowDownwardIcon />
					</Center>
				</Box>
			</Flex>
			<InnerBoxWide2 color="#e36234" annotation="（申込みから納品まで約１ヶ月かかります）">
				納　品
			</InnerBoxWide2>
			<Box mt="2em" fz="0.5em" ta="left">
				<span> ※上記は一般的な例を示していますので、</span>
				<span>制作する内容や、弊社の混雑具合によって変更する場合があります。</span>
			</Box>
		</>
	);
};
