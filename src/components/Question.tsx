import { c } from "../styles/eStyle";

// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// import Accordion from "@mui/material/Accordion";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import Typography from "@mui/material/Typography";
import { Accordion, Box, CSSObject } from "@mantine/core";

type FlowType = {
	title: string;
	body: string;
	color: string;
	noarrow?: boolean;
};

const BlockQuestions = ({ title, body, color, noarrow }: FlowType) => {
	//
	const typeColor = { color: "#000" };
	return (
		<Box
			sx={{
				width: "95%",
				margin: "0 auto",
				marginBottom: "0.5em",
				borderRadius: "0.5em",
				border: `5px ${color} solid`,
			}}
		>
			<Accordion radius="md" styles={{ item: { backgroundColor: "#FFF" } }}>
				<Accordion.Item value="customization">
					<Accordion.Control>{title}</Accordion.Control>
					<Accordion.Panel>{body}</Accordion.Panel>
				</Accordion.Item>
			</Accordion>
		</Box>
	);
};

export default function Quetion() {
	//
	const getRGBAColor = (color: string) => {
		if (color[0] !== "#" || color.length !== 7) {
			return "rgba(94, 188, 146, 0.15)";
		}

		const str = color.replace("#", "").match(/.{2}/g);
		let c1;
		let c2;
		let c3;

		if (str && str.length === 3) {
			c1 = parseInt(str[0], 16);
			c2 = parseInt(str[1], 16);
			c3 = parseInt(str[2], 16);
		}

		return `rgba(${c1}, ${c2}, ${c3}, 0.4)`;
	};

	const question: CSSObject = {
		width: "90%",
		maxWidth: "800px",
		backgroundColor: getRGBAColor(c.l2_purple),
		backgroundSize: "120%",

		margin: "0 auto",
		marginBottom: "7em",
		borderRadius: "1em",
		padding: "1em",
		paddingBottom: "3em",

		h2: {
			fontSize: "1.5em",
			textAlign: "center",
			marginTop: "2em",
			marginBottom: "1em",
		},
	};

	return (
		<Box sx={question}>
			<h2>よくある質問</h2>

			<BlockQuestions
				title="なぜ、低価格で依頼できるのですか？"
				body="当サービスは、webサイトとチラシのセット価格で低価格を実現しております。両方を同時に制作することで、素材を共有しつつクオリティを高めることができるので、効率的に制作することができます"
				color={c.orange}
			/>

			<BlockQuestions
				title="チラシだけ、webサイトだけでもいいですか？"
				body="申し訳ございません、当サービスはwebサイトとチラシのセットで低価格のサービスを提供しておりますので、単体でのサービスのご提供はしておりません"
				color={c.yellow}
			/>

			<BlockQuestions
				title="チラシの刷り増しはできますか？"
				body="もちろんできます。原稿内容に変更がない場合は追加の印刷代だけで刷り増しができます、内容に変更がある場合は新規の価格になます。内容によって価格が変動します、お見積りをお出ししますのでお気軽にお問合せください"
				color={c.green}
			/>

			<BlockQuestions
				title="依頼してから納品まではどのくらいかかりますか？"
				body="内容にもよりますが、だいたい1ヶ月くらいお考えください。お急ぎの方は、ご希望に添えるようにいたしますのでお問合せください"
				color={c.yellowgreen}
			/>

			<BlockQuestions
				title="ヒアリング（打合わせ）はどのように行いますか？"
				body="お打ち合わせは、基本的に非対面で行います。Zoom、Teams、Skype、Facetime、LINE通話や、メールだけでも行えますのでご都合のいい方法をご指定ください"
				color={c.blue}
			/>

			<BlockQuestions
				title="写真がないので撮影もお願いしたいのですが？"
				body="東京都内でしたら撮影にうかがうこともできます。その際、撮影費は別料金になります（別途お見積り提示します）"
				color={c.purple}
			/>

			<BlockQuestions
				title="ロゴデザインもお願いできますか？"
				body="ロゴデザインも承ります。その際、ロゴデザイン費は別料金になります（別途お見積り提示します）"
				color={c.redpurple}
			/>

			<BlockQuestions
				title="写真素材、イラスト素材は使用できますか？"
				body="写真素材、イラスト素材は、webサイト、チラシのデザインとして使用できます。他のツールや媒体には転用できませんのでご注意ください"
				color={c.orange}
			/>

			<BlockQuestions
				title="webサイトやチラシの文字原稿は自分でつくらないといけませんか？"
				body="文字原稿の用意はご自身でお願いします。ただ、どうしても文章が苦手という方はご相談ください。おおまかな文章を用意していただければ、こちらで精緻化することもできます"
				color={c.yellow}
			/>

			<BlockQuestions
				title="更新費用はどのくらいかかりますか？"
				body="更新費用は、1回3,000円〜にて承ります。ただし、スタジオのお知らせや価格改定など、ほとんどの更新作業はお客様自身で更新できるようにCMS機能（web編集機能）を備えていますので、ほぼ月額のままサイトの運営ができると思います。"
				color={c.green}
			/>

			<BlockQuestions
				title="告知やブログを自分更新したのですが？"
				body="当サービスは、CMS機能のついたwebサイトのご提供になります。webサイトの編集が簡単にできるように編集画面を設置しておりますので、告知やブログ等お客様自身で編集・更新ができます。"
				color={c.yellowgreen}
			/>

			<BlockQuestions
				title="解約したいときは？"
				body="解約は当webサイトやメールで解約できます。最低契約期間にあたる設定はありません、解約料もありません。いつでも解約することができます。また契約後のwebサイトのデータは最低3ヶ月保持いたしますので、契約再開したい場合は解約前のデータのまま再開できます"
				color={c.blue}
			/>

			<BlockQuestions
				title="SEOってなに？SEO対策はしてもらえますか？"
				body="SEO対策とは、お客様のwebサイトが検索サイトの上位に表示させるように最適化する対策のことを指します。当サービスでは最新のSEO対策をしております、ただSEO対策は現在はあまり重要視されていません。（諸説あり）検索エンジンのAIが高機能になったため、webサイト側がSEO対策としてできることが減ったためです。"
				color={c.purple}
			/>

			<BlockQuestions title="チラシのポスティングもお願いできますか？" body="申し訳ございません、チラシのポスティングは行っておりません" color={c.redpurple} />

			<BlockQuestions
				title="チラシとwebサイトの効果はありますか？"
				body="ヨガスタジオなどの小規模商圏の業態にとって、チラシwebサイトを使った集客は大変効果があります。詳しくは「なぜwebサイトとチラシをセットにするのですか？」をご覧ください"
				color={c.orange}
			/>
		</Box>
	);
}
