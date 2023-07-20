import { EditTableMenuBtn } from "./editTableMenuBtn";

import { styleMenuItems, formatMenuItems } from "./editTableMenuItems";
import { Flex, Group } from "@mantine/core";
import { UseEditTableStateType } from "../hooks/useEditTableState";

export const EditTableMenu = ({ editTableState }: { editTableState: UseEditTableStateType }) => {
	//

	return (
		<Flex w="100%" p="0.5em 1em " sx={{ backgroundColor: "#FFF", border: "1px solid #ababab" }} gap="2em">
			<Flex gap="0.5em">
				{styleMenuItems.map((item, index) => (
					<div key={item.name}>
						<EditTableMenuBtn type="style" item={item} editTableState={editTableState} />
					</div>
				))}
			</Flex>

			<Flex>
				{formatMenuItems.map((item) => (
					<div key={item.name}>
						<EditTableMenuBtn type="format" key={item.name} item={item} editTableState={editTableState} />
					</div>
				))}
			</Flex>
		</Flex>
	);
};
