import { Anchor, Box, CSSObject, Flex, Text, ThemeIcon } from "@mantine/core";
import { c } from "../../styles/eStyle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

type CategoryType_2 = {
	category: {
		name: string;
		color: string;
	};
};

export function CategoryUI({ category }: CategoryType_2) {
	//

	//TODO　カテゴリの表記は最小フォント数にひっかかってしまうので、画像化する？
	const categoryStyle: CSSObject = {
		label: "categoryStyle",
		width: "fit-content",
		border: `0.1em solid ${category.color}`,
		fontFamily: "Arial, Helvetica, sans-serif",
		fontWeight: "bold",
		fontSize: "0.2em",
		padding: "0.5em 2em 0.5em 2em",
		color: category.color,
	};

	return (
		<Box>
			{category.name && (
				<Flex align="center" justify="center" sx={categoryStyle}>
					{category.name}
				</Flex>
			)}
		</Box>
	);
}

export function UpdatedAtUI({ updatedAt = "", mt = "0px", mb = "0px", fullDate = false }: { updatedAt: string; mt?: string; mb?: string; fullDate?: boolean }) {
	const updatedAtArr: string[] = updatedAt.split("-");

	const yyyymmdd = updatedAtArr.slice(0, 3).join("-");
	const hhmmss = updatedAtArr.slice(3).join(":");

	let updatedAtStr: string;

	if (fullDate) {
		updatedAtStr = `${yyyymmdd} ${hhmmss}`;
	} else {
		updatedAtStr = yyyymmdd;
	}

	const iconStyle = {
		label: "iconStyle",
		width: "0.6em",
		height: "0.6em",
	};

	const timeStyle: CSSObject = {
		label: "timeStyle",
		fontSize: "0.5em",
		fontFamily: "Arial, Helvetica, sans-serif",
		marginLeft: "0.3em",
		letterSpacing: 0,
	};

	return (
		<Box>
			{updatedAtStr && (
				<Flex align="center" mt={mt} mb={mb}>
					<AccessTimeIcon sx={iconStyle} />
					<Box component="time" sx={timeStyle} dateTime={updatedAtStr}>
						{updatedAtStr}
					</Box>
				</Flex>
			)}
		</Box>
	);
}
