import Image from "next/future/image";

import { Box } from "@mantine/core";

export default function Price() {
	//
	return (
		<Box ta="center" mt="4em" mb="6em">
			<Box
				component={Image}
				w="50%"
				h="auto"
				miw="20em"
				maw="30em"
				src="/img/copy_01.svg"
				width={332}
				height={351}
				alt="webサイト*チラシ制作 月々４,980円〜初回19,980円〜"
			/>
		</Box>
	);
}
