import { Box, Button, Text } from "@mantine/core";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { MutableRefObject } from "react";

export default function ImportImageComp({ fileInputElement }: { fileInputElement: MutableRefObject<any> }) {
	//

	return (
		<div key="importImage">
			<Box
				sx={{ display: "flex", flexDirection: "column", mr: "1.5em", mb: "1.5em" }}
				onClick={() => {
					fileInputElement.current.click();
				}}
			>
				<Box>
					<Button
						sx={{
							width: "10em",
							height: "10em",
							border: "1px solid",
							borderRadius: "1em",
						}}
						variant="outline"
					>
						<UploadFileIcon />
						<Text fz="0.8em"> 画像を追加</Text>
					</Button>
				</Box>
			</Box>
		</div>
	);
}
