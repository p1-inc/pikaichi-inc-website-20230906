import Image from "next/future/image";

import { Anchor, Box, CSSObject, Divider, Flex, Text } from "@mantine/core";
import { PikaichistarSVG } from "../svg/pikaichistarSVG";
import { useRespStyles } from "../hooks/useRespStyles";
import { useRef } from "react";

const contentCompany = {
	establishment: { key: "創業", content: ["2012年7月"] },
	companyName: { key: "名称", content: ["株式会社ピカイチ"] },
	ceo: { key: "代表取締役", content: ["清水 光"] },
	capital: { key: "資本金", content: ["300万円"] },
	address: { key: "所在地", content: ["東京都中央区築地2-14-6"] },
	contact: { key: "お問合わせ", content: ["info@pikaichi-inc.com"] },
	cliant: {
		key: "主なクライアント",
		content: [
			"明治HD、日清食品HD、明星食品、キリンHD、大塚HD、バスクリン、カルビー、プレナス、長谷工コーポレーション、富士通、シャープ、三菱地所、三井不動産、明治安田生命、コナミHD、カプコン、楽天グループ、ローソン銀行、SUBARU、JA新潟、読売新聞、東映、ダリヤ、自民党、他",
		],
	},
};

export const Company = ({ ...props }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const { mq, clp } = useRespStyles({ ref: containerRef, min: 599, max: 1024 });

	const leftContentStyle: CSSObject = {
		width: mq.sp ? "5em" : "10em",
		paddingRight: "1em",
		borderRight: "1px solid gray",
		textAlignLast: "justify",
	};
	return (
		<Box m="0 auto" fz={mq.sp ? "0.8em" : "1em"} pb="4em" {...props} ref={containerRef}>
			<Flex direction="column" align="center" mt="1em" mb="2em">
				<PikaichistarSVG width="2em" />
				<Box>company</Box>
			</Flex>

			<Flex>
				<Box sx={leftContentStyle}>{contentCompany.establishment.key}</Box>
				<Box ml="1em">
					{contentCompany.establishment.content.map((d) => (
						<p>{d}</p>
					))}
					<br />
				</Box>
			</Flex>

			<Flex>
				<Box sx={leftContentStyle}>{contentCompany.companyName.key}</Box>
				<Box ml="1em">
					{contentCompany.companyName.content.map((d) => (
						<p>{d}</p>
					))}
					<br />
				</Box>
			</Flex>

			<Flex>
				<Box sx={leftContentStyle}>{contentCompany.ceo.key}</Box>
				<Box ml="1em">
					{contentCompany.ceo.content.map((d) => (
						<p>{d}</p>
					))}
					<br />
				</Box>
			</Flex>

			<Flex>
				<Box sx={leftContentStyle}>{contentCompany.capital.key}</Box>
				<Box ml="1em">
					{contentCompany.capital.content.map((d) => (
						<p>{d}</p>
					))}
					<br />
				</Box>
			</Flex>

			<Flex>
				<Box sx={leftContentStyle}>{contentCompany.address.key}</Box>
				<Box ml="1em">
					{contentCompany.address.content.map((d) => (
						<p>{d}</p>
					))}
					<br />
				</Box>
			</Flex>

			<Flex>
				<Box sx={leftContentStyle}>{contentCompany.contact.key}</Box>
				<Box ml="1em">
					<Anchor href={`mailto:${contentCompany.contact.content[0]}`}>
						<p>{contentCompany.contact.content[0]}</p>
					</Anchor>
					<br />
				</Box>
			</Flex>

			<Flex>
				<Box sx={leftContentStyle}>{contentCompany.cliant.key}</Box>
				<Box w={mq.sp ? "30em" : "50em"} ml="1em" fz="0.8em">
					{contentCompany.cliant.content.map((d) => (
						<p>{d}</p>
					))}
					<br />
				</Box>
			</Flex>
		</Box>
	);
};
