import Image from "next/future/image";

import { Anchor, Box, CSSObject, Divider, Flex, Text } from "@mantine/core";
import { PikaichistarSVG } from "../svg/pikaichistarSVG";

export const Company = ({ ...props }) => {
	//
	const leftContentStyle: CSSObject = {
		width: "10em",
		paddingRight: "1em",
		borderRight: "1px solid gray",
		textAlignLast: "justify",
	};
	return (
		<Box m="0 auto" fz="1em" pb="4em" {...props}>
			<Flex direction="column" align="center" mt="1em" mb="2em">
				<PikaichistarSVG width="2em" />
				<Box>company</Box>
			</Flex>

			<Flex>
				<Box sx={leftContentStyle}>創業</Box>
				<Box ml="1em">
					<p>2012年7月</p>
					<br />
				</Box>
			</Flex>

			<Flex>
				<Box sx={leftContentStyle}>名称</Box>
				<Box ml="1em">
					<p>株式会社ピカイチ</p>
					<br />
				</Box>
			</Flex>

			<Flex>
				<Box sx={leftContentStyle}>代表取締役</Box>
				<Box ml="1em">
					<p>清水 光</p>
					<br />
				</Box>
			</Flex>

			<Flex>
				<Box sx={leftContentStyle}>資本金</Box>
				<Box ml="1em">
					<p>300万円</p>
					<br />
				</Box>
			</Flex>

			<Flex>
				<Box sx={leftContentStyle}>所在地</Box>
				<Box ml="1em">
					<p>東京都中央区築地2-14-6</p>
					<br />
				</Box>
			</Flex>

			<Flex>
				<Box pr="1em" sx={leftContentStyle}>
					お問合わせ
				</Box>
				<Box ml="1em">
					<Anchor href="mailto:shimizu2@pikaichi-inc.com">
						<p>shimizu2@pikaichi-inc.com</p>
					</Anchor>
					<br />
				</Box>
			</Flex>

			<Flex sx={{ flexShrink: 0 }}>
				<Box pr="1em" sx={leftContentStyle}>
					主なクライアント
				</Box>
				<Box ml="1em" w="50em" fz="0.8em">
					<p>
						明治HD、日清食品HD、明星食品、キリンHD、大塚HD、バスクリン、カルビー、プレナス、長谷工コーポレーション、
						富士通、シャープ、三菱地所、三井不動産、明治安田生命、コナミHD、カプコン、楽天グループ、ローソン銀行、
						SUBARU、JA新潟、読売新聞、東映、ダリヤ、自民党、他
					</p>
					<br />
				</Box>
			</Flex>
		</Box>
	);
};
