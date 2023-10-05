import path from "path";
import sizeOf from "image-size";

import { Box, Button, Center, Collapse, Flex, Title } from "@mantine/core";
import NextImage from "next/future/image";

import { WorksDataType, worksData } from "../../data/worksData";
import { WorksWrapper } from "../../components/worksComponent/worksWrapper";
import { useState } from "react";
import { PageAuthWrapper } from "../../components/pageAuthWrapper";

const workId = "ajinomoto";
export default function Ajinomoto({ data }: { data: WorksDataType }) {
    //
    const [detailOpened, setDetailOpened] = useState<boolean>(false);

    return (
        <PageAuthWrapper>
            <WorksWrapper data={data} title={data.titleEn}>
                <Flex direction="row" align="center" justify="center" mt="2em" gap="2vw">
                    <Box
                        component={NextImage}
                        src="/img/works/ajinomoto/ajinomoto_03.jpg"
                        alt="Picture of the author"
                        w="30%"
                        h="fit-content"
                        width={1486}
                        height={2102}
                        sx={{ objectFit: "contain" }}
                    />
                    <Box
                        component={NextImage}
                        src="/img/works/ajinomoto/ajinomoto_04.jpg"
                        alt="Picture of the author"
                        w="30%"
                        h="fit-content"
                        width={1486}
                        height={2102}
                        sx={{ objectFit: "contain" }}
                    />
                    <Box
                        component={NextImage}
                        src="/img/works/ajinomoto/ajinomoto_05.jpg"
                        alt="Picture of the author"
                        w="30%"
                        h="fit-content"
                        width={1486}
                        height={2102}
                        sx={{ objectFit: "contain" }}
                    />
                </Flex>

                <Center>
                    <Button
                        w="20em"
                        mt="2em"
                        variant="outline"
                        color="gray"
                        radius="xl"
                        compact
                        onClick={() => {
                            setDetailOpened(!detailOpened);
                        }}
                    >
                        {"DETAIL"}
                    </Button>
                </Center>

                <Collapse in={detailOpened}>
                    <Flex direction="column" align="center" justify="center" mt="5em" gap="2vw">
                        <Box
                            component={NextImage}
                            src="/img/works/ajinomoto/ajinomoto_06.jpg"
                            alt="Picture of the author"
                            w="80%"
                            h="fit-content"
                            width={1486}
                            height={2102}
                            sx={{ objectFit: "contain" }}
                        />
                        <Box
                            component={NextImage}
                            src="/img/works/ajinomoto/ajinomoto_07.jpg"
                            alt="Picture of the author"
                            w="80%"
                            h="fit-content"
                            width={1486}
                            height={2102}
                            sx={{ objectFit: "contain" }}
                        />
                        <Box
                            component={NextImage}
                            src="/img/works/ajinomoto/ajinomoto_08.jpg"
                            alt="Picture of the author"
                            w="80%"
                            h="fit-content"
                            width={1486}
                            height={2102}
                            sx={{ objectFit: "contain" }}
                        />
                    </Flex>
                </Collapse>
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
