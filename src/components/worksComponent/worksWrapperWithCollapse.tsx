import { Anchor, Box, Button, Center, Collapse, Flex, Header, Text, Title } from "@mantine/core";

import { WorksDataType, worksData } from "../../data/worksData";
import { ReactNode, useState } from "react";
import { DefaultComponent } from "./defaultComponent";
import { WorksWrapper } from "./worksWrapper";

export const WorksWrapperWithCollapse = ({ data, title, children }: { data: WorksDataType; title: string; children: ReactNode }) => {
	//
	const [detailOpened, setDetailOpened] = useState<boolean>(false);

	return (
		<WorksWrapper data={data} title={title}>
			<DefaultComponent data={data} />
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
					{"MORE DETAIL..."}
				</Button>
			</Center>

			<Collapse in={detailOpened}>{children}</Collapse>
		</WorksWrapper>
	);
};
