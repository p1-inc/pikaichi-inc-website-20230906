import path from "path";
import sizeOf from "image-size";

import { Box, Flex, Text } from "@mantine/core";
import NextImage from "next/future/image";

import { WorksDataType, worksData } from "../../data/worksData";
import { WorksWrapperWithCollapse } from "../../components/worksComponent/worksWrapperWithCollapse";
import { WorksWrapper } from "../../components/worksComponent/worksWrapper";

const workId = "yamakumiso";
export default function yamakumiso({ data }: { data: WorksDataType }) {
	//
	return (
		<>
			<WorksWrapper data={data} title={data.titleEn}>
				<Flex direction="column" align="center" mt="2em">
					<Box
						component={NextImage}
						src="/img/works/yamakumiso/yamakumiso_01.jpg"
						alt="Picture of the author"
						w="90%"
						h="fit-content"
						width={2161}
						height={1390}
						sx={{ objectFit: "contain" }}
					/>
					<Text w="80%" lh="1.8em" mt="2em">
						ヤマク食品株式会社は徳島県にある老舗の味噌会社。新しい味噌の食文化を創造するために、和食にも洋食にも合う全く新しい味噌の形を求め、フリーズドライにした味噌調味料「809MISO」を開発。弊社では、パッケージ・ロゴデザイン、ネーミング、webサイト制作まで、809MISOのブランディング全般に携わっています。
					</Text>

					<Flex direction="column" align="center" mt="5em" gap="8em">
						<Box
							component={NextImage}
							src="/img/works/yamakumiso/yamakumiso_03.jpg"
							alt="Picture of the author"
							w="60%"
							h="fit-content"
							width={2161}
							height={1390}
							sx={{ objectFit: "contain" }}
						/>
						<Box
							component={NextImage}
							src="/img/works/yamakumiso/yamakumiso_04.jpg"
							alt="Picture of the author"
							w="60%"
							h="fit-content"
							width={2161}
							height={1390}
							sx={{ objectFit: "contain" }}
						/>
						<Box
							component={NextImage}
							src="/img/works/yamakumiso/yamakumiso_05.jpg"
							alt="Picture of the author"
							w="60%"
							h="fit-content"
							width={2161}
							height={1390}
							sx={{ objectFit: "contain" }}
						/>
						<Box
							component={NextImage}
							src="/img/works/yamakumiso/yamakumiso_06.jpg"
							alt="Picture of the author"
							w="40%"
							h="fit-content"
							width={1301}
							height={4515}
							sx={{ objectFit: "contain" }}
						/>
					</Flex>
				</Flex>
			</WorksWrapper>

			<WorksWrapperWithCollapse data={data} title={data.titleEn}>
				<Flex direction="column" align="center">
					<Flex direction="column" align="center" mt="5em" gap="5em">
						<Box
							component={NextImage}
							src="/img/works/yamakumiso/yamakumiso_03.jpg"
							alt="Picture of the author"
							w="60%"
							h="fit-content"
							width={2161}
							height={1390}
							sx={{ objectFit: "contain" }}
						/>
						<Box
							component={NextImage}
							src="/img/works/yamakumiso/yamakumiso_04.jpg"
							alt="Picture of the author"
							w="60%"
							h="fit-content"
							width={2161}
							height={1390}
							sx={{ objectFit: "contain" }}
						/>
						<Box
							component={NextImage}
							src="/img/works/yamakumiso/yamakumiso_05.jpg"
							alt="Picture of the author"
							w="60%"
							h="fit-content"
							width={2161}
							height={1390}
							sx={{ objectFit: "contain" }}
						/>
						<Box
							component={NextImage}
							src="/img/works/yamakumiso/yamakumiso_06.jpg"
							alt="Picture of the author"
							w="40%"
							h="fit-content"
							width={1301}
							height={4515}
							sx={{ objectFit: "contain" }}
						/>
					</Flex>
				</Flex>
			</WorksWrapperWithCollapse>
		</>
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
