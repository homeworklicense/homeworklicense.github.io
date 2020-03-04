module.exports = ({ env }) => ({
	plugins: {
		autoprefixer: {},
		cssnano: env !== "production" ? { safe: true } : false,
	},
});
//{
// 	plugins: {
// 		autoprefixer: {},
// 		// "postcss-import": {},
// 		// "postcss-preset-env": {},
// 		cssnano: process.env.NODE_ENV === "production" ? { safe: true } : false,
// 	},
// };
