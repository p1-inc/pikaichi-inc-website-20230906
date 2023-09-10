import { Anchor, Box, Flex, Text } from "@mantine/core";
import NextImage from "next/future/image";
import { WorksDataType } from "../../data/worksData";
import { HeaderArea } from "../../components/header";

export default function Post({ data }: { data: WorksDataType }) {
	//
	return (
		<Box>
			<Flex w="90%" m="0 auto" my="1em">
				<HeaderArea />
			</Flex>
			<Flex direction="column" align="center">
				<Box
					component={NextImage}
					src={data.src}
					alt="Picture of the author"
					w="90%"
					h="fit-content"
					width={data.width}
					height={data.height}
					sx={{ objectFit: "contain" }}
				/>
				<Flex direction="column" mt="2em">
					{data.stuff.map((data) => {
						const d = Object.entries(data)[0];
						return (
							<Flex>
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
			</Flex>
			<Footer />
		</Box>
	);
}
