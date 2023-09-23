import path from "path";
import sizeOf from "image-size";

import { Box, Flex, Title } from "@mantine/core";
import NextImage from "next/future/image";

import { WorksDataType, worksData } from "../../data/worksData";
import { WorksWrapper } from "../../components/worksComponent/worksWrapper";
import { WorksWrapperWithCollapse } from "../../components/worksComponent/worksWrapperWithCollapse";

const workId = "hm_arimura_kinme";
export default function Hm_arimura_kinme({ data }: { data: WorksDataType }) {
	//

	return (
		<WorksWrapperWithCollapse data={data} title={data.titleEn}>
			<Flex direction="column" align="center" mt="5em" gap="5em" sx={{ fontFamily: "'Ubuntu', sans-serif" }}>
				<Box
					component={NextImage}
					src="/img/works/hm_arimura_kinme/hm_arimura_kinme_03.jpg"
					alt="Picture of the author"
					w="50%"
					h="fit-content"
					width={693}
					height={980}
					sx={{ objectFit: "contain" }}
				/>
				<Box
					component={NextImage}
					src="/img/works/hm_arimura_kinme/hm_arimura_kinme_04.jpg"
					alt="Picture of the author"
					w="50%"
					h="fit-content"
					width={693}
					height={980}
					sx={{ objectFit: "contain" }}
				/>
				<Box
					component={NextImage}
					src="/img/works/hm_arimura_kinme/hm_arimura_kinme_05.jpg"
					alt="Picture of the author"
					w="50%"
					h="fit-content"
					width={693}
					height={980}
					sx={{ objectFit: "contain" }}
				/>
				<Box
					component={NextImage}
					src="/img/works/hm_arimura_kinme/hm_arimura_kinme_06.jpg"
					alt="Picture of the author"
					w="90%"
					h="fit-content"
					width={2160}
					height={1390}
					sx={{ objectFit: "contain" }}
				/>
			</Flex>
		</WorksWrapperWithCollapse>
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
