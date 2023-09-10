import Image from "next/future/image";

import { Box } from "@mantine/core";

export default function Footer({ ...props }) {
	return (
		<Box ta="center" fz="10px" pb="4em" {...props}>
			<p>© PIKAICHI INC, ALL RIGHTS RESERVED.</p>
		</Box>
	);
}
