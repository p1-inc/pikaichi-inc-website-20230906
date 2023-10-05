import path from "path";
import sizeOf from "image-size";

import { Box, Flex, Title } from "@mantine/core";
import NextImage from "next/future/image";

import { WorksDataType, worksData } from "../../data/worksData";
import { WorksWrapper } from "../../components/worksComponent/worksWrapper";
import { PageAuthWrapper } from "../../components/pageAuthWrapper";

const workId = "hm_arimura_katsudon";
export default function Hm_arimura_katsudon({ data }: { data: WorksDataType }) {
    //

    return (
        <PageAuthWrapper>
            <WorksWrapper data={data} title={data.titleEn}>
                <Flex direction="column" align="center" sx={{ fontFamily: "'Ubuntu', sans-serif" }}>
                    <Box
                        component={NextImage}
                        src="/img/works/hm_arimura_katsudon/hm_arimura_katsudon_01.jpg"
                        alt="Picture of the author"
                        w="90%"
                        h="fit-content"
                        width={1080}
                        height={382}
                        sx={{ objectFit: "contain" }}
                    />
                    <Flex direction="column" align="center" mt="10em" gap="10em">
                        <Box
                            component={NextImage}
                            src="/img/works/hm_arimura_katsudon/hm_arimura_katsudon_03.jpg"
                            alt="Picture of the author"
                            w="50%"
                            h="fit-content"
                            width={764}
                            height={1080}
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
