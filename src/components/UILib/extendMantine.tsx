import { Anchor, Box, Flex, Button, ButtonProps } from "@mantine/core";
import { c } from "../../styles/eStyle";
import { FC, MouseEventHandler, ReactNode } from "react";

import { IconChevronRight } from "@tabler/icons-react";

export const ExMenuParent: FC<ButtonProps> = ({ children, ...props }) => {
	//
	return (
		<Button px="0.8em" w="100%" variant="subtle" styles={{ label: { width: "100%", color: c.mainBlack } }} {...props}>
			<Flex w="100%" align="center" justify="space-between">
				{children}
				<IconChevronRight size="1em" />
			</Flex>
		</Button>
	);
};

interface ExMenuChildProps extends ButtonProps {
	onClick?: MouseEventHandler<HTMLButtonElement>;
	children: ReactNode;
}

export const ExMenuChild: FC<ExMenuChildProps> = ({ onClick, children, ...props }) => {
	//
	return (
		<Button px="0.8em" w="100%" variant="subtle" styles={{ label: { width: "100%", color: c.mainBlack } }} {...props} onClick={onClick}>
			<Flex w="100%" align="center">
				{children}
			</Flex>
		</Button>
	);
};

export const ExButton = ({ bc = "#AAA", children, ...props }: { bc?: string; children: React.ReactNode; [key: string]: any }) => {
	//

	const rgb = {
		r: parseInt(bc.slice(1, 3), 16),
		g: parseInt(bc.slice(3, 5), 16),
		b: parseInt(bc.slice(5, 7), 16),
	};

	// RGBの各要素の値を50%減らす
	const decreasedRgb = {
		r: Math.floor(rgb.r * 0.9),
		g: Math.floor(rgb.g * 0.9),
		b: Math.floor(rgb.b * 0.9),
	};

	// RGBをHEXに変換
	const decreasedColor = `#${((1 << 24) | (decreasedRgb.r << 16) | (decreasedRgb.g << 8) | decreasedRgb.b).toString(16).slice(1)}`;

	return (
		<Button {...props} styles={{ root: { backgroundColor: bc, "&:hover": { backgroundColor: decreasedColor } } }}>
			{children}
		</Button>
	);
};
