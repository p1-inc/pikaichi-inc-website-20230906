import { useState, useEffect, useRef } from "react";

import { Select, SelectItem, TextInput, Textarea, createStyles, rem } from "@mantine/core";

type CreateStylesType = { floating: boolean; borderWeight: string; borderColor: string; fontSize: string; textColor: string };

const useStylesP1TextField2 = createStyles((theme, { floating, borderWeight, borderColor, fontSize, textColor }: CreateStylesType) => ({
	root: {
		position: "relative",
	},
	label: {
		position: "absolute",
		zIndex: 2,
		top: floating ? "-1.7em" : "0.7em",
		left: theme.spacing.sm,
		pointerEvents: "none",
		color: floating ? (theme.colorScheme === "dark" ? theme.white : textColor) : theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5],
		transition: "0.2s all",
		fontSize: floating ? theme.fontSizes.xs : fontSize,
		fontWeight: floating ? 500 : 400,
	},
	required: {
		transition: "opacity 150ms ease",
		opacity: floating ? 1 : 0,
	},
	input: {
		border: `${borderWeight} solid ${borderColor}`,
		"&:focus": {
			border: `${borderWeight} solid ${borderColor}`,
		},
		"&:focus-within": {
			border: `${borderWeight} solid ${borderColor}`,
		},
		"&::placeholder": {
			transition: "color 150ms ease",
			color: !floating ? "transparent" : undefined,
		},
	},
}));

type P1TextField2Type = {
	borderWeight: string;
	borderColor: string;
	label: string;
	placeholder?: string;
	textColor: string;
	form: any;
	[key: string]: any;
};

export const P1TextField2 = ({ borderWeight, borderColor, fontSize, label, placeholder, textColor, form, ...props }: P1TextField2Type) => {
	const { value, onChange, error } = form;
	//
	const [focused, setFocused] = useState(false);

	const { classes } = useStylesP1TextField2({ floating: value.trim().length !== 0 || focused, borderWeight, borderColor, fontSize, textColor });

	return (
		<TextInput
			label={label}
			placeholder={placeholder}
			classNames={classes}
			value={value}
			onChange={onChange}
			onFocus={() => setFocused(true)}
			onBlur={() => setFocused(false)}
			mt="md"
			autoComplete="off"
			error={error}
			{...props}
		/>
	);
};

type CreateStylesP1TextAreaField2Type = { floating: boolean; borderWeight: string; borderColor: string; fontSize: string; textColor: string };

const useStylesP1TextAreaField2 = createStyles((theme, { floating, borderWeight, borderColor, fontSize, textColor }: CreateStylesP1TextAreaField2Type) => ({
	root: {
		position: "relative",
	},
	label: {
		position: "absolute",
		zIndex: 2,
		top: floating ? "-1.7em" : "0.5em",
		left: theme.spacing.sm,
		pointerEvents: "none",
		color: floating ? (theme.colorScheme === "dark" ? theme.white : textColor) : theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5],
		transition: "0.2s all",
		fontSize: floating ? theme.fontSizes.xs : fontSize,
		fontWeight: floating ? 500 : 400,
	},
	required: {
		transition: "opacity 150ms ease",
		opacity: floating ? 1 : 0,
	},
	input: {
		border: `${borderWeight} solid ${borderColor}`,
		"&:focus": {
			border: `${borderWeight} solid ${borderColor}`,
		},
		"&:focus-within": {
			border: `${borderWeight} solid ${borderColor}`,
		},
		"&::placeholder": {
			transition: "color 150ms ease",
			color: !floating ? "transparent" : undefined,
		},
	},
}));

type P1TextAreaField2Type = {
	borderWeight: string;
	borderColor: string;
	fontSize: string;
	radius: string;
	label: string;
	placeholder?: string;
	textColor: string;
	form: any;
	[key: string]: any;
};

export const P1TextAreaField2 = ({ borderWeight, borderColor, fontSize, radius, label, placeholder, textColor, form, ...props }: P1TextAreaField2Type) => {
	const { value, onChange } = form;
	//
	const [focused, setFocused] = useState(false);

	const { classes } = useStylesP1TextAreaField2({ floating: value.trim().length !== 0 || focused, borderWeight, borderColor, fontSize, textColor });

	return (
		<Textarea
			label={label}
			placeholder={placeholder}
			classNames={classes}
			value={value}
			onChange={onChange}
			onFocus={() => setFocused(true)}
			onBlur={() => setFocused(false)}
			mt="md"
			autoComplete="off"
			{...props}
		/>
	);
};

type CreateStylesP1SelectField2Type = { floating: boolean; borderWeight: string; borderColor: string; fontSize: string; textColor: string };

const useStylesP1SelectField2 = createStyles((theme, { floating, borderWeight, borderColor, fontSize, textColor }: CreateStylesP1SelectField2Type) => ({
	root: {
		position: "relative",
	},

	item: {
		"&[data-selected], &[data-selected]:hover": {
			backgroundColor: borderColor,
		},
	},

	input: {
		border: `${borderWeight} solid ${borderColor}`,
		"&:focus": {
			border: `${borderWeight} solid ${borderColor}`,
		},
		"&:focus-within": {
			border: `${borderWeight} solid ${borderColor}`,
		},
	},
}));

type P1SelectField2Type = {
	data: SelectItem[];
	borderWeight: string;
	borderColor: string;
	label: string;
	placeholder?: string;
	textColor: string;
	form: any;
	[key: string]: any;
};
export const P1SelectField2 = ({ data, borderWeight, borderColor, fontSize, label, placeholder, textColor, form, ...props }: P1SelectField2Type) => {
	const { value, onChange } = form;
	//
	const [focused, setFocused] = useState(false);

	const { classes } = useStylesP1SelectField2({ floating: value.trim().length !== 0 || focused, borderWeight, borderColor, fontSize, textColor });

	return <Select data={data} placeholder={placeholder} classNames={classes} value={value} onChange={onChange} {...props} />;
};
