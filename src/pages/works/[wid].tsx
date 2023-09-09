import { Box } from "@mantine/core";
import worksData from "../../data/worksData.json";

export default function Post({ data }: { data: any }) {
	console.log("props: ", data);
	//

	return <Box>AAA</Box>;
}

export async function getStaticPaths() {
	//
	const paths = worksData.map((data) => ({ params: { wid: data.id } }));

	return {
		paths: paths,
		fallback: false,
	};
}

export async function getStaticProps({ params }: { params: { wid: string } }) {
	//

	const data = worksData.find((d) => d.id === params.wid);
	return {
		props: { data: data },
	};
}
