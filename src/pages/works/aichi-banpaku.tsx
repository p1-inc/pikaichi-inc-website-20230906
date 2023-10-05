import path from "path";
import sizeOf from "image-size";

import { Box, Flex, Title } from "@mantine/core";
import NextImage from "next/future/image";

import { WorksDataType, worksData } from "../../data/worksData";
import { WorksWrapperWithCollapse } from "../../components/worksComponent/worksWrapperWithCollapse";
import { PageAuthWrapper } from "../../components/pageAuthWrapper";

const workId = "aichi-banpaku";
export default function AichiBanpaku({ data }: { data: WorksDataType }) {
    //

    return (
        <PageAuthWrapper>
            <WorksWrapperWithCollapse data={data} title={data.titleEn}>
                <Flex direction="column" align="center" mt="2em" gap="8em">
                    <Box
                        component={NextImage}
                        src="/img/works/aichi-banpaku/aichi-banpaku_04.jpg"
                        alt="Picture of the author"
                        w="75%"
                        h="fit-content"
                        width={1080}
                        height={765}
                        sx={{ objectFit: "contain" }}
                    />
                    <Box
                        component={NextImage}
                        src="/img/works/aichi-banpaku/aichi-banpaku_05.jpg"
                        alt="Picture of the author"
                        w="75%"
                        h="fit-content"
                        width={1080}
                        height={765}
                        sx={{ objectFit: "contain" }}
                    />
                    <Box
                        component={NextImage}
                        src="/img/works/aichi-banpaku/aichi-banpaku_06.jpg"
                        alt="Picture of the author"
                        w="75%"
                        h="fit-content"
                        width={1080}
                        height={765}
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
