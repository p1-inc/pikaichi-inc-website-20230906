import path from "path";
import sizeOf from "image-size";

import { Box, Flex, Title } from "@mantine/core";
import NextImage from "next/future/image";

import { WorksDataType, worksData } from "../../data/worksData";
import { WorksWrapper } from "../../components/worksComponent/worksWrapper";
import { PageAuthWrapper } from "../../components/pageAuthWrapper";

const workId = "illust";
export default function Illust({ data }: { data: WorksDataType }) {
    //

    return (
        <PageAuthWrapper>
            <WorksWrapper data={data} title={data.titleEn}>
                <Flex direction="column" align="center" mt="2em" gap="10em">
                    <Box
                        component={NextImage}
                        src="/img/works/illust/illust_01.jpg"
                        alt="Picture of the author"
                        w="90%"
                        h="fit-content"
                        width={1920}
                        height={1080}
                        sx={{ objectFit: "contain" }}
                    />
                </Flex>
                <Flex direction="column" align="center" sx={{ fontFamily: "'Ubuntu', sans-serif" }}>
                    <Flex mt="9em" rowGap="4em" columnGap="2em" wrap="wrap" w="80%">
                        <Box
                            component={NextImage}
                            src="/img/works/illust/illust_06.jpg"
                            alt="Picture of the author"
                            w="30%"
                            h="fit-content"
                            width={1080}
                            height={1080}
                            sx={{ objectFit: "contain" }}
                        />
                        <Box
                            component={NextImage}
                            src="/img/works/illust/illust_07.jpg"
                            alt="Picture of the author"
                            w="30%"
                            h="fit-content"
                            width={1080}
                            height={1080}
                            sx={{ objectFit: "contain" }}
                        />
                        <Box
                            component={NextImage}
                            src="/img/works/illust/illust_08.jpg"
                            alt="Picture of the author"
                            w="30%"
                            h="fit-content"
                            width={1080}
                            height={1080}
                            sx={{ objectFit: "contain" }}
                        />
                        <Box
                            component={NextImage}
                            src="/img/works/illust/illust_09.jpg"
                            alt="Picture of the author"
                            w="30%"
                            h="fit-content"
                            width={1080}
                            height={1080}
                            sx={{ objectFit: "contain" }}
                        />
                        <Box
                            component={NextImage}
                            src="/img/works/illust/illust_10.jpg"
                            alt="Picture of the author"
                            w="30%"
                            h="fit-content"
                            width={1080}
                            height={1080}
                            sx={{ objectFit: "contain" }}
                        />
                        <Box
                            component={NextImage}
                            src="/img/works/illust/illust_11.jpg"
                            alt="Picture of the author"
                            w="30%"
                            h="fit-content"
                            width={1080}
                            height={1080}
                            sx={{ objectFit: "contain" }}
                        />
                        <Box
                            component={NextImage}
                            src="/img/works/illust/illust_12.jpg"
                            alt="Picture of the author"
                            w="30%"
                            h="fit-content"
                            width={1080}
                            height={1080}
                            sx={{ objectFit: "contain" }}
                        />
                        <Box
                            component={NextImage}
                            src="/img/works/illust/illust_13.jpg"
                            alt="Picture of the author"
                            w="30%"
                            h="fit-content"
                            width={1080}
                            height={1080}
                            sx={{ objectFit: "contain" }}
                        />
                    </Flex>

                    <Flex direction="column" align="center" mt="10em" gap="10em">
                        <Box
                            component={NextImage}
                            src="/img/works/illust/illust_14.jpg"
                            alt="Picture of the author"
                            w="90%"
                            h="fit-content"
                            width={1772}
                            height={1390}
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
