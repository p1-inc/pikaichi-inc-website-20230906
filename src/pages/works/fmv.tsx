import path from "path";
import sizeOf from "image-size";

import { Box, Flex, Title } from "@mantine/core";
import NextImage from "next/future/image";

import { WorksDataType, worksData } from "../../data/worksData";
import { WorksWrapperWithCollapse } from "../../components/worksComponent/worksWrapperWithCollapse";
import { PageAuthWrapper } from "../../components/pageAuthWrapper";

const workId = "fmv";
export default function Fmv({ data }: { data: WorksDataType }) {
    //

    return (
        <PageAuthWrapper>
            <WorksWrapperWithCollapse data={data} title={data.titleEn}>
                <Flex direction="column" align="center" sx={{ fontFamily: "'Ubuntu', sans-serif" }}>
                    <Flex direction="column" align="center" mt="9em" gap="8em">
                        <Box
                            component={NextImage}
                            src="/img/works/fmv/fmv_03.jpg"
                            alt="Picture of the author"
                            w="80%"
                            h="fit-content"
                            width={2064}
                            height={730}
                            sx={{ objectFit: "contain" }}
                        />
                        <Box
                            component={NextImage}
                            src="/img/works/fmv/fmv_04.jpg"
                            alt="Picture of the author"
                            w="80%"
                            h="fit-content"
                            width={2064}
                            height={730}
                            sx={{ objectFit: "contain" }}
                        />
                        <Box
                            component={NextImage}
                            src="/img/works/fmv/fmv_05.jpg"
                            alt="Picture of the author"
                            w="70%"
                            h="fit-content"
                            width={1081}
                            height={771}
                            sx={{ objectFit: "contain" }}
                        />
                    </Flex>
                    <Flex justify="space-between" mt="9em" rowGap="10em" columnGap="2em" wrap="wrap" w="80%">
                        <Box
                            component={NextImage}
                            src="/img/works/fmv/fmv_06.jpg"
                            alt="Picture of the author"
                            w="30%"
                            h="fit-content"
                            width={595}
                            height={842}
                            sx={{ objectFit: "contain" }}
                        />
                        <Box
                            component={NextImage}
                            src="/img/works/fmv/fmv_07.jpg"
                            alt="Picture of the author"
                            w="30%"
                            h="fit-content"
                            width={595}
                            height={842}
                            sx={{ objectFit: "contain" }}
                        />
                        <Box
                            component={NextImage}
                            src="/img/works/fmv/fmv_08.jpg"
                            alt="Picture of the author"
                            w="30%"
                            h="fit-content"
                            width={595}
                            height={842}
                            sx={{ objectFit: "contain" }}
                        />
                        <Box
                            component={NextImage}
                            src="/img/works/fmv/fmv_09.jpg"
                            alt="Picture of the author"
                            w="30%"
                            h="fit-content"
                            width={595}
                            height={842}
                            sx={{ objectFit: "contain" }}
                        />
                        <Box
                            component={NextImage}
                            src="/img/works/fmv/fmv_10.jpg"
                            alt="Picture of the author"
                            w="30%"
                            h="fit-content"
                            width={595}
                            height={842}
                            sx={{ objectFit: "contain" }}
                        />
                        <Box
                            component={NextImage}
                            src="/img/works/fmv/fmv_11.jpg"
                            alt="Picture of the author"
                            w="30%"
                            h="fit-content"
                            width={595}
                            height={842}
                            sx={{ objectFit: "contain" }}
                        />
                        <Box
                            component={NextImage}
                            src="/img/works/fmv/fmv_12.jpg"
                            alt="Picture of the author"
                            w="30%"
                            h="fit-content"
                            width={595}
                            height={842}
                            sx={{ objectFit: "contain" }}
                        />
                    </Flex>
                </Flex>
            </WorksWrapperWithCollapse>
        </PageAuthWrapper>

        // </WorksWrapper>
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
