import path from "path";
import sizeOf from "image-size";

import { Box, Flex, Title } from "@mantine/core";
import NextImage from "next/future/image";

import { WorksDataType, worksData } from "../../data/worksData";
import { WorksWrapper } from "../../components/worksComponent/worksWrapper";

const workId = "henshu-techou";
export default function HenshuTechou({ data }: { data: WorksDataType }) {
	//

	return (
		<WorksWrapper data={data}>
			<Flex direction="column" align="center" sx={{ fontFamily: "'Ubuntu', sans-serif" }}>
				<Title weight="normal" fz="1.5em">
					{data.titleEn}
				</Title>
				<Flex direction="column" align="center" mt="1em" mb="8em">
					<Box
						component={NextImage}
						src={data.srcPC}
						alt="Picture of the author"
						w="70%"
						h="fit-content"
						width={data.widthPC}
						height={data.heightPC}
						sx={{ objectFit: "contain" }}
					/>
				</Flex>

				<Flex direction="column" align="center" mt="2em" gap="8em">
					<Box
						component={NextImage}
						src="/img/works/henshu-techou/henshu-techou_03.jpg"
						alt="Picture of the author"
						w="70%"
						h="fit-content"
						width={1080}
						height={382}
						sx={{ objectFit: "contain" }}
					/>

					<Box
						component={NextImage}
						src="/img/works/henshu-techou/henshu-techou_04.jpg"
						alt="Picture of the author"
						w="70%"
						h="fit-content"
						width={1080}
						height={382}
						sx={{ objectFit: "contain" }}
					/>
					<Box
						component={NextImage}
						src="/img/works/henshu-techou/henshu-techou_05.jpg"
						alt="Picture of the author"
						w="70%"
						h="fit-content"
						width={1080}
						height={382}
						sx={{ objectFit: "contain" }}
					/>
					<Box
						component={NextImage}
						src="/img/works/henshu-techou/henshu-techou_06.jpg"
						alt="Picture of the author"
						w="70%"
						h="fit-content"
						width={1080}
						height={382}
						sx={{ objectFit: "contain" }}
					/>
					<Box
						component={NextImage}
						src="/img/works/henshu-techou/henshu-techou_07.jpg"
						alt="Picture of the author"
						w="70%"
						h="fit-content"
						width={1080}
						height={382}
						sx={{ objectFit: "contain" }}
					/>
					<Box
						component={NextImage}
						src="/img/works/henshu-techou/henshu-techou_08.jpg"
						alt="Picture of the author"
						w="70%"
						h="fit-content"
						width={1080}
						height={382}
						sx={{ objectFit: "contain" }}
					/>
					<Box
						component={NextImage}
						src="/img/works/henshu-techou/henshu-techou_09.jpg"
						alt="Picture of the author"
						w="70%"
						h="fit-content"
						width={1080}
						height={382}
						sx={{ objectFit: "contain" }}
					/>
					<Box
						component={NextImage}
						src="/img/works/henshu-techou/henshu-techou_10.jpg"
						alt="Picture of the author"
						w="70%"
						h="fit-content"
						width={1080}
						height={382}
						sx={{ objectFit: "contain" }}
					/>
					<Box
						component={NextImage}
						src="/img/works/henshu-techou/henshu-techou_11.jpg"
						alt="Picture of the author"
						w="70%"
						h="fit-content"
						width={1080}
						height={382}
						sx={{ objectFit: "contain" }}
					/>
					<Box
						component={NextImage}
						src="/img/works/henshu-techou/henshu-techou_12.jpg"
						alt="Picture of the author"
						w="70%"
						h="fit-content"
						width={1080}
						height={382}
						sx={{ objectFit: "contain" }}
					/>
				</Flex>
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
