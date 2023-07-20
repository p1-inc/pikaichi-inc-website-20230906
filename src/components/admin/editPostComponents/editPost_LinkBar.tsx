import { useState, useEffect, Dispatch, SetStateAction } from "react";

import { c, cArr } from "../../../styles/eStyle";

import { Box, Flex, Group, UnstyledButton, Text, CSSObject, Button, CopyButton } from "@mantine/core";

import InsertLinkIcon from "@mui/icons-material/InsertLink";

type EditPost_LinkBarType = {
	link: string;
};
export const EditPost_LinkBar = ({ link }: EditPost_LinkBarType) => {
	//

	const linkBox: CSSObject = {
		fontSize: "0.7em",
		backgroundColor: "#FFF",
		padding: "0.2em 0.6em",
		marginLeft: "1em",
	};
	return (
		<Flex w="100%" h="2em" align="center" sx={{ borderBottom: "1px solid #ababab", backgroundColor: cArr.gray[2] }}>
			<Flex
				w="90%"
				m="0 auto"
				align="center"
				sx={{
					overflow: "auto",
				}}
			>
				<InsertLinkIcon />
				<Text fz="0.8em">リンク</Text>
				<Box sx={linkBox}>{link}</Box>
				<CopyButton value={link}>
					{({ copied, copy }) => (
						<Button w="8em" h="1.6em" ml="1em" variant="white" color={copied ? "teal" : "blue"} onClick={copy}>
							{copied ? "コピー済" : "コピー"}
						</Button>
					)}
				</CopyButton>
			</Flex>
		</Flex>
	);
};
