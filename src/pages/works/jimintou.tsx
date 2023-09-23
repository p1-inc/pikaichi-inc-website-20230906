import path from "path";
import sizeOf from "image-size";

import { Box, Flex, Title } from "@mantine/core";
import NextImage from "next/future/image";

import { WorksDataType, worksData } from "../../data/worksData";
import { WorksWrapper } from "../../components/worksComponent/worksWrapper";

const workId = "jimintou";
export default function Jimintou({ data }: { data: WorksDataType }) {
	//

	return (
		<WorksWrapper data={data} title={data.titleEn}>
			<Flex direction="column" align="center" mt="2em" gap="10em">
				<Box
					component={NextImage}
					src="/img/works/jimintou/jimintou_01.jpg"
					alt="Picture of the author"
					w="90%"
					h="fit-content"
					width={1920}
					height={1080}
					sx={{ objectFit: "contain" }}
				/>
				<Box
					component={NextImage}
					src="/img/works/jimintou/jimintou_03.jpg"
					alt="Picture of the author"
					w="90%"
					h="fit-content"
					width={1772}
					height={1390}
					sx={{ objectFit: "contain" }}
				/>
			</Flex>
		</WorksWrapper>
	);
}

export async function getStaticProps() {
	//
	const imgPath = ["public", "img", "works"];
	const imgDirectory = path.join(process.cwd(), ...imgPath);

	const nWorksData = worksData.map((d) => {
		const fullPathPC = path.join(imgDirectory, d.filePathPC);
		const fullPathSP = path.join(imgDirectory, d.filePathSP);
		const dimensionsPC = sizeOf(fullPathPC);
		const dimensionsSP = sizeOf(fullPathSP);
		return {
			...d,
			srcPC: `/${imgPath[1]}/${imgPath[2]}/${d.filePathPC}`,
			srcSP: `/${imgPath[1]}/${imgPath[2]}/${d.filePathSP}`,
			widthPC: dimensionsPC.width,
			widthSP: dimensionsSP.width,
			heightPC: dimensionsPC.height,
			heightSP: dimensionsSP.height,
		};
	});

	const data = nWorksData.find((d) => d.id === workId);
	return {
		props: { data: data },
	};
}
