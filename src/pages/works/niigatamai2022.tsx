import path from "path";
import sizeOf from "image-size";

import { Box, Button, Center, Collapse, Divider, Flex, Title, UnstyledButton } from "@mantine/core";
import NextImage from "next/future/image";

import { WorksDataType, worksData } from "../../data/worksData";
import { WorksWrapperWithCollapse } from "../../components/worksComponent/worksWrapperWithCollapse";
import { PageAuthWrapper } from "../../components/pageAuthWrapper";

const workId = "niigatamai2022";
export default function niigatamai2022({ data }: { data: WorksDataType }) {
    //

    return (
        <PageAuthWrapper>
            <WorksWrapperWithCollapse data={data} title={data.titleEn}>
                <Flex direction="column" align="center" mt="2em" gap="10em">
                    <Box
                        component={NextImage}
                        src="/img/works/niigatamai2022/niigatamai2022_03.jpg"
                        alt="Picture of the author"
                        w="50%"
                        h="fit-content"
                        width={1080}
                        height={764}
                        sx={{ objectFit: "contain" }}
                    />
                    <Box
                        component={NextImage}
                        src="/img/works/niigatamai2022/niigatamai2022_04.jpg"
                        alt="Picture of the author"
                        w="50%"
                        h="fit-content"
                        width={1081}
                        height={771}
                        sx={{ objectFit: "contain" }}
                    />
                    <Box
                        component={NextImage}
                        src="/img/works/niigatamai2022/niigatamai2022_05.jpg"
                        alt="Picture of the author"
                        w="50%"
                        h="fit-content"
                        width={1081}
                        height={771}
                        sx={{ objectFit: "contain" }}
                    />
                    <Box
                        component={NextImage}
                        src="/img/works/niigatamai2022/niigatamai2022_06.jpg"
                        alt="Picture of the author"
                        w="50%"
                        h="fit-content"
                        width={1081}
                        height={771}
                        sx={{ objectFit: "contain" }}
                    />
                    <Box
                        component={NextImage}
                        src="/img/works/niigatamai2022/niigatamai2022_07.jpg"
                        alt="Picture of the author"
                        w="50%"
                        h="fit-content"
                        width={1081}
                        height={771}
                        sx={{ objectFit: "contain" }}
                    />
                    <Box
                        component={NextImage}
                        src="/img/works/niigatamai2022/niigatamai2022_08.jpg"
                        alt="Picture of the author"
                        w="50%"
                        h="fit-content"
                        width={1081}
                        height={771}
                        sx={{ objectFit: "contain" }}
                    />
                    <Box
                        component={NextImage}
                        src="/img/works/niigatamai2022/niigatamai2022_09.jpg"
                        alt="Picture of the author"
                        w="50%"
                        h="fit-content"
                        width={1081}
                        height={771}
                        sx={{ objectFit: "contain" }}
                    />
                    <Box
                        component={NextImage}
                        src="/img/works/niigatamai2022/niigatamai2022_10.jpg"
                        alt="Picture of the author"
                        w="50%"
                        h="fit-content"
                        width={1081}
                        height={771}
                        sx={{ objectFit: "contain" }}
                    />
                    <Box
                        component={NextImage}
                        src="/img/works/niigatamai2022/niigatamai2022_11.jpg"
                        alt="Picture of the author"
                        w="50%"
                        h="fit-content"
                        width={1081}
                        height={771}
                        sx={{ objectFit: "contain" }}
                    />
                    <Box
                        component={NextImage}
                        src="/img/works/niigatamai2022/niigatamai2022_12.jpg"
                        alt="Picture of the author"
                        w="50%"
                        h="fit-content"
                        width={1081}
                        height={771}
                        sx={{ objectFit: "contain" }}
                    />
                </Flex>
                <Flex direction="column" align="center" mt="10em" gap="10em">
                    <Box
                        component={NextImage}
                        src="/img/works/niigatamai2022/niigatamai2022_13.jpg"
                        alt="Picture of the author"
                        w="40%"
                        h="fit-content"
                        width={764}
                        height={1080}
                        sx={{ objectFit: "contain" }}
                    />
                    <Box
                        component={NextImage}
                        src="/img/works/niigatamai2022/niigatamai2022_14.jpg"
                        alt="Picture of the author"
                        w="90%"
                        h="fit-content"
                        width={2296}
                        height={510}
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
