module.exports = {
    mode: process.env.NODE_ENV ? "production" : "development",
    entry: {
        background: "./src/background.ts",
        main: "./src/main.ts",
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    output: {
        path: `${__dirname}/public/js`,
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    devtool: "inline-source-map",
    watchOptions: {
        ignored: /node_modules/,
    },
};
