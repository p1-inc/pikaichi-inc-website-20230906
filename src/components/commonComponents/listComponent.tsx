import { Dispatch, SetStateAction, useState } from "react";
import { c, cArr } from "../../styles/eStyle";

import {
	Box,
	createStyles,
	NumberInput,
	PasswordInput,
	Select,
	Tooltip,
	Checkbox,
	UnstyledButton,
	Flex,
	CSSObject,
	Table,
	ScrollArea,
	Group,
} from "@mantine/core";

import { Input, TextInput, Textarea, Text, Center } from "@mantine/core";

import { IconSelector, IconChevronDown, IconChevronUp } from "@tabler/icons-react";

const controlStyle = {
	label: "controlStyle",
	width: "100%",
	padding: " 0.6em 0em 0.6em 1em",

	"&:hover": {
		backgroundColor: cArr.gray[0],
	},
};

const iconStyle = {
	label: "iconStyle",
	width: 21,
	height: 21,
	borderRadius: 21,
};

interface ThProps {
	children: React.ReactNode;
	reversed: boolean;
	sorted: boolean;
	onSort(): void;
	width: string;
	hint?: string;
}

export const ThComponent = ({ children, reversed, sorted, onSort, width, hint }: ThProps) => {
	const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
	return (
		<Box component="th" p="0 !important" w={width}>
			<UnstyledButton onClick={onSort} sx={controlStyle}>
				<Group spacing={0} position="apart">
					<Tooltip disabled={hint ? false : true} label={hint}>
						<Text weight={500} size="sm">
							{children}
						</Text>
					</Tooltip>
					<Center sx={iconStyle}>
						<Icon size={14} stroke={1.5} />
					</Center>
				</Group>
			</UnstyledButton>
		</Box>
	);
};
