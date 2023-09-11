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
			<Flex direction="column" mt="2em">
				{data.stuff.map((data, index) => {
					const d = Object.entries(data)[0];
					return (
						<Flex key={`stuff-${index}`}>
							<Text w="2.5em" align="right" mr="0.5em">
								{d[0]}
							</Text>
							<Text w="1em" align="center">
								|
							</Text>
							<Text ml="0.5em">{d[1]}</Text>
						</Flex>
					);
				})}
			</Flex>
			<Text mt="5em" fz="10px">
				スタッフ記号/CD:クリエイティブディレクター、AD:アートディレクター、D:デザイナー、CMP:CMプランナー、I:イラストレーター
			</Text>

			<Anchor href="/" mt="5em" fz="10px">
				HOME
			</Anchor>
			<Footer />
		</Flex>
	);
};
