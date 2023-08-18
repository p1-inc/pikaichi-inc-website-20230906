import { ServerResponse } from "http";
import { getfilteredPostDataByCanPublic } from "../firebase/firebase";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat"; // dayjsのプラグインをインポート

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

dayjs.tz.setDefault("Asia/Tokyo");

const generateSiteMap = (posts: { id: string; lastmod: string }[]) => {
	const today = dayjs().toISOString();
	return `<?xml version="1.0" encoding="UTF-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
		<url>
		<loc>${process.env.NEXT_PUBLIC_SITE_URL}</loc>
		<lastmod>${today}</lastmod>
		<priority>1.0</priority>
		
		</url>
		<url>
		<loc>${process.env.NEXT_PUBLIC_SITE_URL}/posts/postIndex</loc>
		<lastmod>${today}</lastmod>
		
		</url>
		${posts
			.map((post) => {
				return `
					<url>
					<loc>${process.env.NEXT_PUBLIC_SITE_URL}/posts/${post.id}</loc>
					<lastmod>${post.lastmod}</lastmod>
					</url>
					`;
			})
			.join("")}
				</urlset>
				`;
};

function SiteMap() {
	// getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }: { res: ServerResponse }) {
	const postData = await getfilteredPostDataByCanPublic();
	// console.log("postData: ", postData);

	const posts = postData.map((post) => {
		const lm = post.updatedAt.split("-");
		const date = dayjs(post.updatedAt, "YYYY-MM-DD-HH-mm-ss");
		const isoString = date.toISOString();
		return { id: post.id, lastmod: isoString };
	});

	// We make an API call to gather the URLs for our site
	// const request = await fetch(EXTERNAL_DATA_URL);
	// const posts = await request.json();

	// We generate the XML sitemap with the posts data
	const sitemap = generateSiteMap(posts);

	res.setHeader("Content-Type", "text/xml");
	// we send the XML to the browser
	res.write(sitemap);
	res.end();

	return {
		props: {},
	};
}

export default SiteMap;
