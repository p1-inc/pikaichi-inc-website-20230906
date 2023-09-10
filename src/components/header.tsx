import NextImage from "next/future/image";

import { Anchor, Box, Flex } from "@mantine/core";

export const HeaderArea = () => {
	return (
		<Anchor href="/">
			<Box
				component={NextImage}
				src="/img/pikaichi-logo-01.svg"
				alt="Picture of the author"
				w="15em"
				h="fit-content"
				width="86"
				height="14"
				sx={{ objectFit: "contain" }}
			/>
		</Anchor>
	);
};
