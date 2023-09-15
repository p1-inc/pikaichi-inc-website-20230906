import { Anchor, Box, Flex, Header, Text } from "@mantine/core";
import NextImage from "next/future/image";

import path from "path";
import sizeOf from "image-size";

import { WorksDataType, worksData } from "../../data/worksData";
import { HeaderArea } from "../../components/headerArea";
import Footer from "../../components/Footer";
import { ReactNode } from "react";

export const WorksWrapper = ({ data, children }: { data: WorksDataType; children: ReactNode }) => {
	//
	return (
		<Box>
			<Flex w="90%" m="0 auto" mt="3em" mb="4em">
				<HeaderArea logoWidth="10em" />
			</Flex>

			<Box sx={{ backgroundColor: "#f5f5f5" }} pt="10em">
				{children}
				<Flex direction="column" align="center">
					<Flex direction="column" mt="8em" fz="0.8em">
						{data.stuff.map((data, index) => {
							const d = Object.entries(data)[0];
							return (
								<Flex key={`stuff-${index}`}>
									<Text w="4em" align="right" mr="0.5em">
										{d[0]}
									</Text>
									<Text w="1em" align="center">
										|
									</Text>
									<Text ml="0.5em" sx={{ whiteSpace: "pre-wrap" }}>
										{d[1]}
									</Text>
								</Flex>
							);
						})}
					</Flex>
					<Text mt="10em" fz="10px">
						スタッフ記号/CD:クリエイティブディレクター、AD:アートディレクター、D:デザイナー、CMP:CMプランナー、Dir:演出、
						Photo:カメラマン、St:スタイリスト、Hm:ヘアメイク、Art:美術、I:イラストレーター
					</Text>

					<Anchor href="/" mt="5em" fz="10px">
						HOME
					</Anchor>
					<Footer />
				</Flex>
			</Box>
		</Box>
	);
};
