import path from "path";
import sizeOf from "image-size";

import { Box, Flex, Title } from "@mantine/core";
import NextImage from "next/future/image";

import { WorksDataType, worksData } from "../../data/worksData";
import { WorksWrapperWithCollapse } from "../../components/worksComponent/worksWrapperWithCollapse";
import { PageAuthWrapper } from "../../components/pageAuthWrapper";

const workId = "boys-and-men";
export default function BoysAndMen({ data }: { data: WorksDataType }) {
    //

    return (
        <PageAuthWrapper>
            <WorksWrapperWithCollapse data={data} title={data.titleEn}>
                <Flex direction="column" align="center" sx={{ fontFamily: "'Ubuntu', sans-serif" }}>
                    <Flex direction="column" align="center" mt="2em" gap="10em">
                        <Flex align="center" mt="2em" gap="2em" w="90%">
                            <Flex sx={{ flexShrink: 1 }}>
                                <Box
                                    component={NextImage}
                                    src="/img/works/boys-and-men/boys-and-men_03.jpg"
                                    alt="Picture of the author"
                                    w="100%"
                                    h="fit-content"
                                    width={422}
                                    height={381}
                                    sx={{ objectFit: "contain" }}
                                />
                            </Flex>
                            <Flex sx={{ flexShrink: 1 }}>
                                <Box
                                    component={NextImage}
                                    src="/img/works/boys-and-men/boys-and-men_04.jpg"
                                    alt="Picture of the author"
                                    w="100%"
                                    h="fit-content"
                                    width={422}
                                    height={381}
                                    sx={{ objectFit: "contain" }}
                                />
                            </Flex>
                            <Flex sx={{ flexShrink: 1 }}>
                                <Box
                                    component={NextImage}
                                    src="/img/works/boys-and-men/boys-and-men_05.jpg"
                                    alt="Picture of the author"
                                    w="100%"
                                    h="fit-content"
                                    width={422}
                                    height={381}
                                    sx={{ objectFit: "contain" }}
                                />
                            </Flex>
                        </Flex>
                        <Flex direction="column" align="center" mt="2em" gap="10em">
                            <Box
                                component={NextImage}
                                src="/img/works/boys-and-men/boys-and-men_06.jpg"
                                alt="Picture of the author"
                                w="90%"
                                h="fit-content"
                                width={4320}
                                height={1080}
                                sx={{ objectFit: "contain" }}
                            />
                        </Flex>
                    </Flex>
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
