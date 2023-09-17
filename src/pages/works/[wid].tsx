import { Anchor, Box, Flex, Header, Text } from "@mantine/core";
import NextImage from "next/future/image";

import path from "path";
import sizeOf from "image-size";

import { WorksDataType, worksData } from "../../data/worksData";
import { WorksWrapper } from "../../components/worksComponent/worksWrapper";
import { DefaultComponent } from "../../components/worksComponent/defaultComponent";

export default function Works({ data }: { data: WorksDataType }) {
	//
	return (
		<WorksWrapper data={data}>
			<DefaultComponent data={data} />
		</WorksWrapper>
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

	const data = nWorksData.find((d) => d.id === params.wid);
	return {
		props: { data: data },
	};
}
