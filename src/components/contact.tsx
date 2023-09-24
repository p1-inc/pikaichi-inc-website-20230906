import Image from "next/future/image";

import { Anchor, Box, CSSObject, Divider, Flex, Text } from "@mantine/core";
import { PikaichistarSVG } from "../svg/pikaichistarSVG";
import { IconMail, IconMapPin } from "@tabler/icons-react";
import { MailToSVG } from "../svg/mailtoSVG";
import { AddressSVG } from "../svg/addressSVG";

export const Contact = ({ ...props }) => {
	//
	return (
		<Flex direction="column" gap="5em">
			<Flex direction="column" align="center">
				<Anchor href="mailto:shimizu2@pikaichi-inc.com" color="none">
					<Flex direction="column" align="center">
						<MailToSVG width="6em" strokeWidth="0.1em" />
						<Box component="p" mt="0.5em">
							EMAIL
						</Box>
					</Flex>
				</Anchor>
			</Flex>
			<Flex direction="column" align="center">
				<Anchor href="https://goo.gl/maps/YsNovc3kkeBsaewt8" target="_blank" color="none" ta="center">
					<AddressSVG width="5em" strokeWidth="0.1em" />
					<Box mt="0.3em">
						<p>#1104, 2-14-6, TSUKIJI, CHUO-KU,</p>
						<p>TOKYO, 104-0045, JAPAN</p>
					</Box>
				</Anchor>
			</Flex>
		</Flex>
	);
};
