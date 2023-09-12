import { Anchor, Box, Flex, Header, Text, Title } from "@mantine/core";
import NextImage from "next/future/image";

import { WorksDataType } from "../../data/worksData";

export const Bathclin = ({ data }: { data: WorksDataType }) => {
	//

	return (
		<Flex direction="column" align="center" sx={{ fontFamily: "'Ubuntu', sans-serif" }}>
			<Title weight="normal" fz="1.5em">
				Bathclin Kikiyu
			</Title>
			<Flex direction="column" align="center" mt="2em" gap="10em">
				<Box
					component={NextImage}
					src="/img/works/bathclin/bathclin_03.jpg"
					alt="Picture of the author"
					w="90%"
					h="fit-content"
					width={1080}
					height={382}
					sx={{ objectFit: "contain" }}
				/>
			</Flex>
		</Flex>
	);
};
