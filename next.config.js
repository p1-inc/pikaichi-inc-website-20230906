const withInterceptStdout = require("next-intercept-stdout");

module.exports = withInterceptStdout(
	{
		reactStrictMode: true,
		images: {
			domains: ["storage.googleapis.com", "firebasestorage.googleapis.com"],
			dangerouslyAllowSVG: true,
		},
	},
	(text) => (text.includes("Duplicate atom key") ? "" : text),
);
