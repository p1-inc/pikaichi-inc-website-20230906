const withInterceptStdout = require("next-intercept-stdout");

module.exports = withInterceptStdout(
	{
		reactStrictMode: false,
		images: {
			domains: ["storage.googleapis.com", "firebasestorage.googleapis.com"],
			dangerouslyAllowSVG: true,
		},
	},
	(text) => (text.includes("Duplicate atom key") ? "" : text),
);
