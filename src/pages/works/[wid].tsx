import { Anchor, Box, Flex, Header, Text } from "@mantine/core";
import NextImage from "next/future/image";

import path from "path";
import sizeOf from "image-size";

import { WorksDataType, worksData } from "../../data/worksData";
import { HeaderArea } from "../../components/headerArea";
import Footer from "../../components/Footer";

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
		</Box>
	);
}

export async function getStaticPaths() {
	//
	const paths = worksData.map((data) => ({ params: { wid: data.id } }));
	return {
		paths: paths,
		fallback: false,
	};
}

export async function getStaticProps({ params }: { params: { wid: string } }) {
	//
	const imgPath = ["public", "img", "works"];
	const imgDirectory = path.join(process.cwd(), ...imgPath);

	const nWorksData = worksData.map((d) => {
		const fullPath = path.join(imgDirectory, d.fileName);
		const dimensions = sizeOf(fullPath);
		const type = dimensions.type;
		return {
			...d,
			src: `/${imgPath[1]}/${imgPath[2]}/${d.fileName}`,
			width: dimensions.width,
			height: dimensions.height,
		};
	});

	const data = nWorksData.find((d) => d.id === params.wid);
	return {
		props: { data: data },
	};
}
