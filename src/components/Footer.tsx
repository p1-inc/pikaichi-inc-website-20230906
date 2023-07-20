import Image from "next/future/image";

import { Box } from "@mantine/core";

export default function Footer() {
	return (
		<Box ta="center" fz="0.8em" mt="10em" pb="4em">
			<Box m="0 auto " mt="1em" mb="2em" w="10em">
				<Box component={Image} src="/img/logo_pickyoga_typeH.svg" width={236} height={40} w="100%" alt="ロゴpickyoga" />
			</Box>
			<p>Copyright © 2021 pick-yoga.com All Rights Reserved.</p>
		</Box>
	);
}
