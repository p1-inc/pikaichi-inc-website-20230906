import path from "path";
import sizeOf from "image-size";

import { Box, Button, Center, Collapse, Divider, Flex, Title, UnstyledButton } from "@mantine/core";
import NextImage from "next/future/image";

import { WorksDataType, worksData } from "../../data/worksData";
import { WorksWrapper } from "../../components/worksComponent/worksWrapper";
import { DefaultComponent } from "../../components/worksComponent/defaultComponent";
import { useState } from "react";
import { WorksWrapperWithCollapse } from "../../components/worksComponent/worksWrapperWithCollapse";

const workId = "milkdaizu";
export default function Milkdaizu({ data }: { data: WorksDataType }) {
	//

	return (
		<WorksWrapperWithCollapse data={data} title={data.titleEn}>
			<Flex direction="column" align="center" mt="2em" gap="10em">
				<Box
					component={NextImage}
					src="/img/works/milkdaizu/milkdaizu_03.jpg"
					alt="Picture of the author"
					w="50%"
					h="fit-content"
					width={769}
					height={1086}
					sx={{ objectFit: "contain" }}
				/>
				<Box
					component={NextImage}
					src="/img/works/milkdaizu/milkdaizu_04.jpg"
					alt="Picture of the author"
					w="50%"
					h="fit-content"
					width={815}
					height={1083}
					sx={{ objectFit: "contain" }}
				/>
				<Box
					component={NextImage}
					src="/img/works/milkdaizu/milkdaizu_05.jpg"
					alt="Picture of the author"
					w="50%"
					h="fit-content"
					width={817}
					height={1084}
					sx={{ objectFit: "contain" }}
				/>
				<Box
					component={NextImage}
					src="/img/works/milkdaizu/milkdaizu_06.jpg"
					alt="Picture of the author"
					w="80%"
					h="fit-content"
					width={1080}
					height={764}
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
