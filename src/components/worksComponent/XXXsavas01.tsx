import { Anchor, Box, Flex, Header, Text, Title } from "@mantine/core";
import NextImage from "next/future/image";

import { WorksDataType } from "../../data/worksData";

export const Savas01 = ({ data }: { data: WorksDataType }) => {
	//

	return (
		<Flex direction="column" align="center">
			<Title weight="normal" fz="1.5em">
				Meiji Savas
			</Title>
			<Flex direction="column" align="center" mt="2em" gap="10em">
				<Box
					component={NextImage}
					src="/img/works/savas/savas01_04.jpg"
					alt="Picture of the author"
					w="90%"
					h="fit-content"
					width={1080}
					height={382}
					sx={{ objectFit: "contain" }}
				/>
				<Box
					component={NextImage}
					src="/img/works/savas/savas01_05.jpg"
					alt="Picture of the author"
					w="90%"
					h="fit-content"
					width={1080}
					height={382}
					sx={{ objectFit: "contain" }}
				/>
				<Box
					component={NextImage}
					src="/img/works/savas/savas01_06.jpg"
					alt="Picture of the author"
					w="90%"
					h="fit-content"
					width={1080}
					height={382}
					sx={{ objectFit: "contain" }}
				/>
				<Box
					component={NextImage}
					src="/img/works/savas/savas01_03.jpg"
					alt="Picture of the author"
					w="50%"
					h="fit-content"
					width={595}
					height={842}
					sx={{ objectFit: "contain" }}
				/>
			</Flex>
		</Flex>
	);
};
