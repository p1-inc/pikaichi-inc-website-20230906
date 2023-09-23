import { Dispatch, SetStateAction, useState } from "react";
import { Box, createStyles, NumberInput, PasswordInput, Select, Tooltip, Checkbox, UnstyledButton, Flex, CSSObject } from "@mantine/core";

import { Input, TextInput, Textarea } from "@mantine/core";
import { IconAsterisk, IconLock } from "@tabler/icons-react";

import { c } from "../../styles/eStyle";
import { MediaLib } from "../../types/types";
// import { SelGeneralImageComp } from "../admin/selGeneralImageComp";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

type FormTextFieldComponentType = {
	title: string;
	placeholder?: string;
	require?: boolean;
	width?: string;
	titleWidth?: string;
	unit?: string;
	helperText?: string;
	tooltip?: string;
	formProps?: any;
	readOnly?: boolean;
	rows?: number;
	value?: string;
	precision?: number;
	step?: number;
	displayHint?: boolean;
	setDisplayHint?: Dispatch<SetStateAction<boolean>>;
	name?: string;
	[key: string]: any;
};

const getRightIcon = (props: { require: boolean; readOnly: boolean }) => {
	if (props?.require) {
		return <IconAsterisk size="0.5em" color="red" />;
	}
	if (props?.readOnly) {
		return <IconLock size="1em" />;
	}
	return false;
};

const getdefaultValue = (value: any, formProps: any) => {
	if (value) {
		return value;
	} else if (formProps?.value !== undefined) {
		return formProps?.value;
	} else {
		return "";
	}
};

const titleStyle = (width: string): CSSObject => ({
	label: "titleStyle",
	width: width,
	fontSize: "0.8em",
	color: c.mainBlack,
	marginRight: "1em",
	overflow: "hidden",
	whiteSpace: "nowrap",
	flexShrink: 0,
});

export const FormTextFieldComponent = ({
	title = "",
	placeholder = "",
	require = false,
	width = "80%",
	titleWidth = "7em",
	unit = "",
	helperText = "",
	tooltip = "",
	formProps,
	readOnly = false,
	value,
	displayHint,
	setDisplayHint,
	name = "",
	...props
}: FormTextFieldComponentType) => {
	//
	const readOnlyStyle: CSSObject = {
		width: width,
		border: "0.0625rem solid #ced4da",
		paddingLeft: "calc(2.25rem / 3)",
		height: "1.875rem",
		lineHeight: "calc(1.875rem - 0.125rem)",
		borderRadius: "0.25rem",
		fontSize: "0.75rem",
	};
	return (
		<Flex align="center" mb="0.9em">
			<Box sx={titleStyle(titleWidth)}>
				{title}
				{displayHint !== undefined && (
					<UnstyledButton
						onClick={() => {
							setDisplayHint(!displayHint);
						}}
					>
						<HelpOutlineIcon />
					</UnstyledButton>
				)}
			</Box>
			<Flex direction="column">
				<Flex align="center">
					<Tooltip label={tooltip} disabled={Boolean(!tooltip)} color="gray" openDelay={500}>
						<Box>
							{!readOnly && (
								<TextInput
									size="xs"
									w={width}
									{...formProps}
									placeholder={placeholder}
									rightSection={getRightIcon({ require: require, readOnly: readOnly })}
									value={getdefaultValue(value, formProps) || ""}
									onChange={formProps?.onChange}
									name={name}
									{...props}
								/>
							)}
							{readOnly && <Box sx={readOnlyStyle}>{getdefaultValue(value, formProps)}</Box>}
						</Box>
					</Tooltip>
					{unit && (
						<Box component="p" ml="0.5em" fz="1em">
							{unit}
						</Box>
					)}
				</Flex>
				{helperText && (
					<Box component="p" ml="0.5em" mt="0.1em" fz="0.7em">
						{helperText}
					</Box>
				)}
			</Flex>
		</Flex>
	);
};

// editShopInfo用
export const FormTextFieldComponentWithCheckBtn = ({
	title = "",
	placeholder = "",
	require = false,
	width = "80%",
	titleWidth = "7em",
	unit = "",
	helperText = "",
	tooltip = "",
	formProps,
	readOnly = false,
	value,
	checkbox,
	displayHint,
	setDisplayHint,
	...props
}: FormTextFieldComponentType & {
	checkbox: { formProps: any; label?: string };
}) => {
	//

	return (
		<Flex align="center" mb="0.9em">
			<Flex align="center" sx={titleStyle(titleWidth)}>
				{title}
				{displayHint !== undefined && (
					<UnstyledButton
						onClick={() => {
							setDisplayHint(!displayHint);
						}}
					>
						<HelpOutlineIcon />
					</UnstyledButton>
				)}
			</Flex>

			<Flex direction="column">
				<Flex align="center">
					<Tooltip label={tooltip} disabled={Boolean(!tooltip)} color="gray" openDelay={500}>
						<TextInput
							size="xs"
							w={width}
							{...formProps}
							placeholder={placeholder}
							rightSection={getRightIcon({ require: require, readOnly: readOnly })}
							value={getdefaultValue(value, formProps) || ""}
							onChange={readOnly ? null : formProps?.onChange}
							{...props}
						/>
					</Tooltip>
					{checkbox && <Checkbox ml="1em" labelPosition="left" label={checkbox.label} checked={checkbox.formProps.value} {...checkbox.formProps} />}
					{unit && (
						<Box component="p" ml="1em" fz="1em">
							{unit}
						</Box>
					)}
				</Flex>
				{helperText && (
					<Box component="p" ml="0.5em" mt="0.1em" fz="0.7em">
						{helperText}
					</Box>
				)}
			</Flex>
		</Flex>
	);
};

export const FormNumberFieldComponent = ({
	title,
	placeholder = "",
	require = false,
	width = "80%",
	titleWidth = "7em",
	unit = "",
	helperText = "",
	tooltip = "",
	formProps,
	readOnly = false,
	value,
	displayHint,
	setDisplayHint,
	precision = 0,
	step = 1,
	...props
}: FormTextFieldComponentType) => {
	//
	return (
		<>
			<Flex align="center" mb="0.9em">
				<Box sx={titleStyle(titleWidth)}>
					{title}
					{displayHint !== undefined && (
						<UnstyledButton
							onClick={() => {
								setDisplayHint(!displayHint);
							}}
						>
							<HelpOutlineIcon />
						</UnstyledButton>
					)}
				</Box>
				<Flex direction="column">
					<Flex align="center">
						<Tooltip label={tooltip} disabled={Boolean(!tooltip)} color="gray" openDelay={500}>
							<NumberInput
								size="xs"
								w={width}
								{...formProps}
								placeholder={placeholder}
								rightSection={getRightIcon({ require: require, readOnly: readOnly })}
								value={getdefaultValue(value, formProps)}
								onChange={readOnly ? () => {} : formProps?.onChange}
								precision={precision}
								step={step}
								{...props}
							/>
						</Tooltip>
						{unit && (
							<Box component="p" ml="1em" fz="1em">
								{unit}
							</Box>
						)}
					</Flex>
					{helperText && (
						<Box component="p" ml="0.5em" mt="0.1em" fz="0.7em">
							{helperText}
						</Box>
					)}
				</Flex>
			</Flex>
		</>
	);
};

export const FormTextAreaComponent = ({
	title,
	placeholder = "",
	require = false,
	rows = 4,
	width = "80%",
	titleWidth = "7em",
	unit = "",
	helperText = "",
	tooltip = "",
	formProps,
	readOnly = false,
	value,
	displayHint,
	setDisplayHint,
	...props
}: FormTextFieldComponentType) => {
	//
	return (
		<Flex align="center" mb="0.9em">
			<Box sx={titleStyle(titleWidth)}>
				{title}
				{displayHint !== undefined && (
					<UnstyledButton
						onClick={() => {
							setDisplayHint(!displayHint);
						}}
					>
						<HelpOutlineIcon />
					</UnstyledButton>
				)}
			</Box>
			<Flex direction="column">
				<Flex align="center">
					<Tooltip label={tooltip} disabled={Boolean(!tooltip)} color="gray" openDelay={500}>
						<Textarea
							size="xs"
							w={width}
							maw="90%"
							{...formProps}
							autosize
							minRows={rows}
							placeholder={placeholder}
							value={getdefaultValue(value, formProps)}
							onChange={readOnly ? null : formProps.onChange}
							rightSection={require && <IconAsterisk size="0.5em" color="red" />}
							{...props}
						/>
					</Tooltip>
					{unit && (
						<Box component="p" ml="1em" fz="1em">
							{unit}
						</Box>
					)}
				</Flex>
				{helperText && (
					<Box component="p" ml="0.5em" mt="0.1em" fz="0.7em">
						{helperText}
					</Box>
				)}
			</Flex>
		</Flex>
	);
};

type FormSelectFieldComponentType = FormTextFieldComponentType & {
	data: { value: string; label: string }[];
	itemComponent: any;
	icon?: any;
	[key: string]: any;
};
export const FormSelectFieldComponent = ({
	title,
	placeholder = "",
	require = false,
	rows = 4,
	width = "80%",
	titleWidth = "7em",
	unit = "",
	helperText = "",
	tooltip = "",
	formProps,
	readOnly = false,
	value,
	displayHint,
	setDisplayHint,
	data,
	itemComponent,
	icon,
	...props
}: FormSelectFieldComponentType) => {
	return (
		<Flex align="center" mb="0.9em">
			<Box sx={titleStyle(titleWidth)}>
				{title}
				{displayHint !== undefined && (
					<UnstyledButton
						onClick={() => {
							setDisplayHint(!displayHint);
						}}
					>
						<HelpOutlineIcon />
					</UnstyledButton>
				)}
			</Box>
			<Flex direction="column">
				<Flex align="center">
					<Tooltip label={tooltip} disabled={Boolean(!tooltip)} color="gray" openDelay={500}>
						<Select
							size="xs"
							w={width}
							{...formProps}
							placeholder={placeholder}
							data={data}
							itemComponent={itemComponent}
							// value={value}
							value={getdefaultValue(value, formProps)}
							icon={icon}
							{...props}
						/>
					</Tooltip>
					{unit && (
						<Box component="p" ml="1em" fz="1em">
							{unit}
						</Box>
					)}
				</Flex>
				{helperText && (
					<Box component="p" ml="0.5em" mt="0.1em" fz="0.7em">
						{helperText}
					</Box>
				)}
			</Flex>
		</Flex>
	);
};

// type FormImageFieldComponentType = {
// 	title: string;
// 	placeholder?: string;
// 	require?: boolean;
// 	width?: string;
// 	height?: string;
// 	titleWidth?: string;
// 	unit?: string;
// 	helperText?: string;
// 	image: MediaLib;
// 	setImage: Dispatch<SetStateAction<MediaLib>>;
// 	mediaLib: MediaLib[];
// 	setMediaLib: Dispatch<SetStateAction<MediaLib[]>>;
// 	type?: string;
// 	trimCircle?: boolean;
// 	displayHint?: boolean;
// 	setDisplayHint?: Dispatch<SetStateAction<boolean>>;
// };
// export const FormImageFieldComponent = ({
// 	title = "",
// 	placeholder = "",
// 	require = false,
// 	width = "80%",
// 	height = "80%",
// 	titleWidth = "7em",
// 	unit = "",
// 	helperText = "",
// 	image,
// 	setImage,
// 	mediaLib,
// 	setMediaLib,
// 	type = "pict",
// 	trimCircle = false,
// 	displayHint,
// 	setDisplayHint,
// }: FormImageFieldComponentType) => {
// 	//
// 	return (
// 		<Flex align="center" mb="0.9em">
// 			<Box sx={titleStyle(titleWidth)}>
// 				{title}
// 				{displayHint !== undefined && (
// 					<UnstyledButton
// 						onClick={() => {
// 							setDisplayHint(!displayHint);
// 						}}
// 					>
// 						<HelpOutlineIcon />
// 					</UnstyledButton>
// 				)}
// 			</Box>
// 			<Flex direction="column">
// 				<Flex align="center">
// 					<SelGeneralImageComp
// 						image={image}
// 						setImage={setImage}
// 						mediaLib={mediaLib}
// 						setMediaLib={setMediaLib}
// 						width={width}
// 						height={height}
// 						type={type}
// 						trimCircle={trimCircle}
// 					/>
// 				</Flex>
// 				{helperText && (
// 					<Box component="p" ml="0.5em" mt="0.1em" fz="0.7em">
// 						{helperText}
// 					</Box>
// 				)}
// 			</Flex>
// 		</Flex>
// 	);
// };

type FloatingLabelInputType = {
	id?: string;
	label?: string;
	withAsterisk?: boolean;
	placeholder?: string;
	required?: boolean;
	autoComplete?: "on" | "off";
	size?: "xs" | "sm" | "md" | "lg" | "xl" | "";
	type?: "likeMui" | ""; //"likeMui"or ""
	form: any;
	color?: string;
	w?: any;
	h?: any;
	m?: any;
	mt?: any;
	mb?: any;
	dataAutofocus?: boolean;
};
export function FloatingLabelInput({
	id = "",
	label = "",
	withAsterisk = false,
	placeholder = "",
	required = false,
	autoComplete = "on",
	size = "sm",
	type = "", //"likeMui"or ""
	form,
	color = "",
	w = "initial",
	h = "initial",
	m = "initial",
	mt = "initial",
	mb = "initial",
}: FloatingLabelInputType) {
	const [focused, setFocused] = useState(false);
	// const { classes } = useStyles({
	// 	floating: form.values[id].trim().length !== 0 || focused,
	// 	type: type,
	// 	color: color,
	// });
	return (
		<TextInput
			name={id}
			label={label}
			placeholder={placeholder}
			required={required}
			// classNames={classes}
			withAsterisk={withAsterisk}
			color={color}
			w={w}
			h={h}
			m={m}
			mt={mt}
			mb={mb}
			size={size}
			autoComplete={autoComplete}
			{...form.getInputProps(id)}
			onFocus={() => setFocused(true)}
			onBlur={() => setFocused(false)}
		/>
	);
}

export function FloatingLabelInputForPassWord({
	id = "",
	label = "",
	withAsterisk = false,
	placeholder = "",
	required = false,
	autoComplete = "on",
	size = "sm",
	type = "", //"likeMui"or ""
	form,
	color = "",
	w = "initial",
	h = "initial",
	m = "initial",
	mt = "initial",
	mb = "initial",
	dataAutofocus = false,
}: FloatingLabelInputType) {
	const [focused, setFocused] = useState(false);
	// const { classes } = useStyles({
	// 	floating: form.values[id].trim().length !== 0 || focused,
	// 	type: type,
	// 	color: color,
	// });

	return (
		<PasswordInput
			name={id}
			label={label}
			placeholder={placeholder}
			required={required}
			// classNames={classes}
			withAsterisk={withAsterisk}
			w={w}
			h={h}
			m={m}
			mt={mt}
			mb={mb}
			size={size}
			autoComplete={autoComplete}
			{...form.getInputProps(id)}
			onFocus={() => setFocused(true)}
			onBlur={() => setFocused(false)}
			data-autofocus={dataAutofocus}
		/>
	);
}
