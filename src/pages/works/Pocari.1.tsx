import { Box, Flex, Title } from "@mantine/core";
import NextImage from "next/future/image";
import { WorksDataType } from "../../data/worksData";

export default function Pocari({ data }: { data: WorksDataType }) {
	//
	return (
		// <WorksWrapper data={data}>
		<WorksWrapperWithCollapse data={data} title={data.titleEn}>
			<Flex direction="column" align="center" sx={{ fontFamily: "'Ubuntu', sans-serif" }}>
				<Title weight="normal" fz="1.5em">
					{data.titleEn}
				</Title>
				<Flex direction="column" align="center" mt="2em" gap="8em">
					<Box
						component={NextImage}
						src="/img/works/pocari/pocari_03.jpg"
						alt="Picture of the author"
						w="90%"
						h="fit-content"
						width={1080}
						height={382}
						sx={{ objectFit: "contain" }}
					/>

					<Box
						component={NextImage}
						src="/img/works/pocari/pocari_04.jpg"
						alt="Picture of the author"
						w="90%"
						h="fit-content"
						width={1080}
						height={382}
						sx={{ objectFit: "contain" }}
					/>
					<Box
						component={NextImage}
						src="/img/works/pocari/pocari_05.jpg"
						alt="Picture of the author"
						w="90%"
						h="fit-content"
						width={1080}
						height={382}
						sx={{ objectFit: "contain" }}
					/>
					<Box
						component={NextImage}
						src="/img/works/pocari/pocari_06.jpg"
						alt="Picture of the author"
						w="90%"
						h="fit-content"
						width={1080}
						height={382}
						sx={{ objectFit: "contain" }}
					/>
				</Flex>
			</Flex>
		</WorksWrapperWithCollapse>

		// </WorksWrapper>
	);
}
