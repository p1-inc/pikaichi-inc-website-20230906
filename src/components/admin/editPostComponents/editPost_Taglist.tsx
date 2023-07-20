import { useState, useEffect, Dispatch, SetStateAction } from "react";

import { c } from "../../../styles/eStyle";

import { TagType } from "../../../types/types";
import { Box, Flex, UnstyledButton } from "@mantine/core";
import { TagstateType } from "./editPost";

type EditPost_Taglist = {
	tagState: TagstateType[];
	setTagState: Dispatch<SetStateAction<TagstateType[]>>;
	tagList: TagType[];
};
export const EditPost_Taglist = ({ tagState, setTagState, tagList }: EditPost_Taglist) => {
	//
	const [tag, setTag] = useState<TagType[]>([]);

	useEffect(() => {
		const nArr = [...tagList];
		nArr.sort((a, b) => (a.priority > b.priority ? 1 : -1));
		setTag(nArr);
	}, [tagList]);

	const handleClick = (tag: TagType) => {
		//
		let isExist = false;
		const nTagState = tagState.filter((t) => {
			if (t.id === tag.id) {
				isExist = true;
				return false;
			} else {
				return true;
			}
		});

		const nTag = {
			id: tag.id,
			name: tag.name,
		};
		if (!isExist) {
			nTagState.push(nTag);
		}

		setTagState(nTagState);
	};

	const isActive = (id: string): boolean => {
		const isExist = tagState.find((t) => (t.id === id ? true : false));
		return Boolean(isExist);
	};

	return (
		<Box h="5em" mt="0.5em">
			<Flex wrap="wrap" w="90%" m="0 auto">
				{tag.map((tag) => (
					<Box key={tag.priority}>
						<UnstyledButton
							sx={{
								fontSize: "max(0.7em,10px)",
								padding: "0.1em 0.8em",
								margin: "0.1em 0.2em",
								backgroundColor: isActive(tag.id) ? c.defaultBlue : "#FFF",
								color: isActive(tag.id) ? "#FFF" : c.defaultBlue,
								border: isActive(tag.id) ? "1px solid #FFF" : `1px solid ${c.defaultBlue}`,
								borderRadius: "9999px",
								cursor: "pointer",
								userSelect: "none",
								"&:hover": {
									opacity: "0.5",
									transition: "0.5s",
								},
							}}
							onClick={() => {
								handleClick(tag);
							}}
						>
							{tag.name}
						</UnstyledButton>
					</Box>
				))}
			</Flex>
		</Box>
	);
};
