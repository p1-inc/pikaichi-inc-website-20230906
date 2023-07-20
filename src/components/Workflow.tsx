import { c } from "../styles/eStyle";

import { Box, CSSObject, Flex, Title } from "@mantine/core";
import { MqType, useMQ } from "../hooks/useMQ";
import { useEffect, useRef } from "react";
import { useRespStyles } from "../hooks/useRespStyles";

const Arrow = ({ color }: any) => {
	return (
		<Box
			sx={{
				display: "block",
				overflow: "hidden",
				position: "relative",
				left: "0.4vw",
				width: "2vw",
				height: "2vw",
				borderBottom: "solid 5px",
				borderRight: "solid 5px",
				borderColor: color,
				transform: "rotate(45deg)",
				marginLeft: "-1vw",
				marginRight: "1vw",
			}}
		/>
	);
};

const Sec = ({ color, mq, clp, children }: { color: string; mq: MqType; clp: any; children: any }) => {
	return (
		<Box
			sx={{
				label: "Bordr",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				textAlign: "center",
				// width: mq.max ? "170px" : "11vw",
				// height: mq.max ? "170px" : "11vw",
				width: clp("2em", "10em"),
				height: clp("2em", "10em"),

				border: "5px solid",
				borderColor: color,
				borderRadius: "50%",
				marginRight: "2vw",
			}}
		>
			{children}
		</Box>
	);
};

type FlowType = {
	title: string;
	body: string;
	color: string;
	noarrow?: boolean;
	mq?: MqType;
	clp: (_minFz: string | number, _maxFz: string | number) => string;
};

const Flow = ({ title, body, color, noarrow, mq, clp }: FlowType) => {
	//
	const titles: string[] = title.split(/\\n/g);
	const bodies = body.split(/\\n/g);

	return (
		<Flex justify="center" maw="799px" m="0 auto" mt="1em" w="90%">
			<Flex justify="center" w="100%">
				<Flex direction="column" align="center" justify="center">
					<Sec color={color} mq={mq} clp={clp}>
						{titles.map((title) => (
							<Box fz={clp("1em", "1.2em")} ta="center" key={title}>
								{title}
							</Box>
						))}
					</Sec>

					{!noarrow && <Arrow color={color} />}
				</Flex>

				<Flex align="center" w={mq.max ? "850px" : "50vw"} h={mq.max ? "170px" : "11vw"}>
					<Box mt="0.5em" fz={clp("0.8em", "1.2em")} lh={clp("2em", "3.2em")} p="0 1em">
						{bodies.map((body) => (
							<span key={body}>{body}</span>
						))}
					</Box>
				</Flex>
			</Flex>
		</Flex>
	);
};

const Flow_sp_Arrow = ({ color }: any) => {
	return (
		<Box
			sx={{
				position: "relative",
				width: "2em",
				height: "2em",
				borderBottom: "solid 5px",
				borderRight: "solid 5px",
				borderColor: color,
				transform: "rotate(45deg)",
				margin: "0 auto",
			}}
		/>
	);
};

const WorkFlowPictWrap = ({ color, children }: any) => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				margin: "0 auto",
				marginTop: "1em",
				width: "100%",
				border: "5px solid",
				borderRadius: "1em",
				borderColor: color,
				padding: "1em",
			}}
		>
			{children}
		</Box>
	);
};

const Flow_sp = ({ title, body, color, noarrow = false }: any) => {
	const titles: string[] = title.replace(/\\n/g, "");
	const bodies = body.replace(/\\n/g, "");

	return (
		<Box m="0 auto" w="90%" maw="800px">
			<WorkFlowPictWrap color={color}>
				<Box fz="max(3vw, 1em)" ta="center">
					{titles}
				</Box>
				<Box mt="0.5em" fz="0.8em" lh="2em" p="0 1em">
					{bodies}
				</Box>
			</WorkFlowPictWrap>

			{!noarrow && <Flow_sp_Arrow color={color} />}
		</Box>
	);
};

export default function Workflow() {
	//

	const containerRef = useRef<HTMLDivElement>(null);
	const { mq, clp } = useRespStyles({ ref: containerRef, min: 599, max: 799 });

	const container: CSSObject = {
		margin: "0 auto",
		marginBottom: "14vw",

		h2: {
			fontSize: "max(3vw, 1em)",
			textAlign: "center",
			marginTop: "3em",
			marginBottom: mq.sp ? "1em" : "2em",
		},
	};

	const contents = [
		{
			title: "クイック\\nスタート\\nを見る",
			body: "このwebサイトの「クイックスタート」から\\nサービスの説明を御覧ください、細かいサービスがわかる\\n内容になっています",
			color: c.orange,
		},

		{ title: "お問合わせ", body: "このwebサイトのお問合わせからご連絡ください", color: c.yellow },

		{
			title: "ヒアリング",
			body: "お客様のご希望、ご相談をお聞きします。\\nZOOM、メール、電話等でお打ち合わせいたします",
			color: c.green,
		},

		{
			title: "デザイン案",
			body: "ヒアリングでお聞きしたご依頼を元にデザイン案をお出しします。\\nその後、お客様の希望を聞き、約2回ほど修正案をご提示します",
			color: c.yellowgreen,
		},

		{
			title: "納　品",
			body: "チラシとwebサイト納品日が前後することがあります\\n納品までの期間は通常1ヶ月ほどになります",
			color: c.blue,
			noarrow: true,
		},
	];

	return (
		<Box sx={container} ref={containerRef}>
			<Title order={2} fz={clp("1em", "1.5em")} fw="normal">
				ご依頼から納品までの流れ
			</Title>
			{mq.spl ? (
				<Box>
					{contents.map((cont, id) => (
						<Flow_sp key={`flow_sp_${id}`} title={cont.title} body={cont.body} color={cont.color} noarrow={cont.noarrow || false} />
					))}
				</Box>
			) : (
				<Flex direction="column" align="center">
					{contents.map((cont, id) => (
						<Flow key={`flow_${id}`} title={cont.title} body={cont.body} color={cont.color} noarrow={cont.noarrow || false} mq={mq} clp={clp} />
					))}
				</Flex>
			)}
		</Box>
	);
}
