import { mqN, mqTitle, f, c, bp, bpMin } from "../../styles/eStyle";
import { Box } from "@mantine/core";
import { useMQ } from "../../hooks/useMQ";

export const Slide7 = () => {
	const { mq } = useMQ();
	return (
		// <SlideBase id={6} color="#3EAFBF" displayPage={displayPage} setDisplayPage={setDisplayPage} btnBack={true} btnNext={true} setWinOpen={setWinOpen}>
		<>
			<h2>
				<span>解約に関して</span>
			</h2>
			<Box
				component="p"
				sx={{
					span: {
						fontSize: "1em",
						lineHeight: mq.sp ? "10px" : "2em",
					},
				}}
			>
				<span>解約は当webサイトやメールで解約できます。</span> <br />
				<span>最低契約期間にあたる設定はありません、</span>
				<span>解約料もありません。</span> <br />
				<span>いつでも解約することができます。</span> <br />
				<br />
				<span>また契約後のwebサイトのデータは</span>
				<span>最低3ヶ月保持いたしますので、</span> <br />
				<span>契約再開したい場合は解約前の</span>
				<span>データのまま再開できます</span> <br />
			</Box>
		</>
	);
};
