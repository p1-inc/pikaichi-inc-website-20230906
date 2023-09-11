import path from "path";
import sizeOf from "image-size";

import Head from "next/head";

import { WorksDataType, worksData } from "../data/worksData";

import { Home } from "../components/home";

export default function App({ workImageData }: { workImageData: WorksDataType[] }) {
	//

	return (
		<div>
			<Head>
				<title>Pikaichi inc.</title>
				<meta name="viewport" content="width=device-width,initial-scale=1.0" />
				<meta name="description" content="Pikaichi inc." />
				<meta property="og:url" content="https://pikaichi-inc.com" />
				<meta property="og:title" content="Pikaichi inc." />
				<meta property="og:site_name" content="Pikaichi inc." />
				<meta property="og:description" content="Pikaichi inc." />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://pikaichi-inc.com/img/ogpImage.png" />
				<meta name="twitter:card" content="summary_large_image" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Home workImageData={workImageData} />
		</div>
	);
}

export async function getStaticProps() {
	const imgPath = ["public", "img", "works"];
	const imgDirectory = path.join(process.cwd(), ...imgPath);

	const nWorksData = worksData.map((d) => {
		const fullPathPC = path.join(imgDirectory, d.filePathPC);
		const fullPathSP = path.join(imgDirectory, d.filePathSP);
		const dimensionsPC = sizeOf(fullPathPC);
		const dimensionsSP = sizeOf(fullPathSP);

		return {
			...d,
			srcPC: `/${imgPath[1]}/${imgPath[2]}/${d.filePathPC}`,
			srcSP: `/${imgPath[1]}/${imgPath[2]}/${d.filePathSP}`,
			widthPC: dimensionsPC.width,
			widthSP: dimensionsSP.width,
			heightPC: dimensionsPC.height,
			heightSP: dimensionsSP.height,
		};
	});

	return {
		props: {
			workImageData: nWorksData,
		},
	};
}
