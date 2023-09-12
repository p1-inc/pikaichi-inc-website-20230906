import { Anchor, Box, Flex, Header, Text } from "@mantine/core";
import NextImage from "next/future/image";

import path from "path";
import sizeOf from "image-size";

import { WorksDataType, worksData } from "../../data/worksData";
import { HeaderArea } from "../../components/headerArea";
import Footer from "../../components/Footer";

export const DefaultComponent = ({ data }: { data: WorksDataType }) => {
	//

	return (
		<Flex direction="column" align="center">
			<Box
				component={NextImage}
				src={data.srcPC}
				alt="Picture of the author"
				w="90%"
				h="fit-content"
				width={data.widthPC}
				height={data.heightPC}
				sx={{ objectFit: "contain" }}
			/>
		</Flex>
	);
};
