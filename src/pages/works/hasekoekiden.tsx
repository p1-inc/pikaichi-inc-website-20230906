import path from "path";
import sizeOf from "image-size";

import { Box, Flex, Title } from "@mantine/core";
import NextImage from "next/future/image";

import { WorksDataType, worksData } from "../../data/worksData";
import { WorksWrapperWithCollapse } from "../../components/worksComponent/worksWrapperWithCollapse";
import { PageAuthWrapper } from "../../components/pageAuthWrapper";

const workId = "hasekoekiden";
export default function Hasekoekiden({ data }: { data: WorksDataType }) {
    //

    return (
        <PageAuthWrapper>
            <WorksWrapperWithCollapse data={data} title={data.titleEn}>
                <Flex direction="column" align="center" mt="2em" gap="8em">
                    <Box
                        component={NextImage}
                        src="/img/works/hasekoekiden/hasekoekiden_03.jpg"
                        alt="Picture of the author"
                        w="75%"
                        h="fit-content"
                        width={1920}
                        height={1358}
                        sx={{ objectFit: "contain" }}
                    />
                    <Box
                        component={NextImage}
                        src="/img/works/hasekoekiden/hasekoekiden_04.jpg"
                        alt="Picture of the author"
                        w="75%"
                        h="fit-content"
                        width={1920}
                        height={1358}
                        sx={{ objectFit: "contain" }}
                    />
                    <Box
                        component={NextImage}
                        src="/img/works/hasekoekiden/hasekoekiden_05.jpg"
                        alt="Picture of the author"
                        w="75%"
                        h="fit-content"
                        width={1920}
                        height={1358}
                        sx={{ objectFit: "contain" }}
                    />
                    <Box
                        component={NextImage}
                        src="/img/works/hasekoekiden/hasekoekiden_06.jpg"
                        alt="Picture of the author"
                        w="75%"
                        h="fit-content"
                        width={1920}
                        height={1358}
                        sx={{ objectFit: "contain" }}
                    />
                    <Box
                        component={NextImage}
                        src="/img/works/hasekoekiden/hasekoekiden_07.jpg"
                        alt="Picture of the author"
                        w="75%"
                        h="fit-content"
                        width={1920}
                        height={1358}
                        sx={{ objectFit: "contain" }}
                    />
                    <Box
                        component={NextImage}
                        src="/img/works/hasekoekiden/hasekoekiden_08.jpg"
                        alt="Picture of the author"
                        w="75%"
                        h="fit-content"
                        width={1920}
                        height={1358}
                        sx={{ objectFit: "contain" }}
                    />
                </Flex>
            </WorksWrapperWithCollapse>
        </PageAuthWrapper>
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
