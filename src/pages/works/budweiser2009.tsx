import path from "path";
import sizeOf from "image-size";

import { Box, Flex, Title } from "@mantine/core";
import NextImage from "next/future/image";

import { WorksDataType, worksData } from "../../data/worksData";
import { WorksWrapper } from "../../components/worksComponent/worksWrapper";
import { PageAuthWrapper } from "../../components/pageAuthWrapper";

const workId = "budweiser2009";
export default function Budweiser2009({ data }: { data: WorksDataType }) {
    //

    return (
        <PageAuthWrapper>
            <WorksWrapper data={data} title={data.titleEn}>
                <Flex direction="column" align="center" sx={{ fontFamily: "'Ubuntu', sans-serif" }}>
                    <Flex direction="column" align="center" mt="2em" gap="8em">
                        <Box
                            component={NextImage}
                            src="/img/works/budweiser2009/budweiser2009_03.jpg"
                            alt="Picture of the author"
                            w="90%"
                            h="fit-content"
                            width={5199}
                            height={7705}
                            sx={{ objectFit: "contain" }}
                        />

                        <Box
                            component={NextImage}
                            src="/img/works/budweiser2009/budweiser2009_04.jpg"
                            alt="Picture of the author"
                            w="60%"
                            h="fit-content"
                            width={1081}
                            height={765}
                            sx={{ objectFit: "contain" }}
                        />
                    </Flex>
                </Flex>
            </WorksWrapper>
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
