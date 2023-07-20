import { Box } from "@mantine/core";

export default function Price({ children }) {
	const backgroundIllustration = {
		backgroundImage: "url(/img/backgroundIllustration.png)",
		backgroundSize: "50%",
	};

	return <Box sx={backgroundIllustration}>{children}</Box>;
}
