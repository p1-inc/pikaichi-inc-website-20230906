import { c } from "../styles/eStyle";

import { Box, CSSObject, Title } from "@mantine/core";
import { useMQ } from "../hooks/useMQ";
import { useRespStyles } from "../hooks/useRespStyles";
import { useRef } from "react";

export default function Message2() {
	const containerRef = useRef<HTMLDivElement>(null);
	const { mq, clp } = useRespStyles({ ref: containerRef, min: 599, max: 1024 });

	const body: CSSObject = {
		margin: "0 auto",
		marginTop: "3em",
		width: "90%",
		maxWidth: "800px",
		backgroundColor: c.orange,
		padding: "2em",
		borderRadius: "1em",
		span: {
			color: "#fff",
			textAlign: "left",
			fontSize: clp("0.6em", "0.9em"),
			lineHeight: "2em",
		},

		textAlign: mq.sp ? "left" : "initial",
	};

	return (
		<Box mb="5em">
			<Title order={2} sx={body} ref={containerRef}>
				<span>基本的な制作費は</span> <span>すべて基本料金に含まれます。</span>
				<span> また、追加で費用が発生する場合は、</span>
				<span>事前にお客様にご連絡し、</span> <span>了承を得てから制作進行しますので、</span>
				<span>納品後に「こんなにかかるなんて知らなかった」なんてことがありません。</span>
			</Title>
		</Box>
	);
}
