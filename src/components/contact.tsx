import Image from "next/future/image";

import { Anchor, Box, CSSObject, Divider, Flex, Text } from "@mantine/core";
import { PikaichistarSVG } from "../svg/pikaichistarSVG";
import { IconMail, IconMapPin } from "@tabler/icons-react";

export const Contact = ({ ...props }) => {
	//

	return (
		<Flex direction="column" gap="5em">
			<Flex direction="column" align="center">
				<Anchor href="mailto:shimizu2@pikaichi-inc.com" color="none">
					<Flex direction="column" align="center">
						<IconMail width="8em" height="7em" strokeWidth="0.02em" />
						<Box component="p" mt="-0.6em">
							EMAIL
						</Box>
					</Flex>
				</Anchor>
			</Flex>
			<Flex direction="column" align="center">
				<Anchor href="https://goo.gl/maps/YsNovc3kkeBsaewt8" target="_blank" color="none" ta="center">
					<IconMapPin width="8em" height="7em" strokeWidth="0.02em" />
					<p>#1104, 2-14-6, TSUKIJI, CHUO-KU,</p>
					<p>TOKYO, 104-0045, JAPAN</p>
				</Anchor>
			</Flex>
		</Flex>
	);
};
