const commonPaths = require('./paths');

module.exports = {
    entry: commonPaths.entryPath,
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true, // This is important!
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(scss)$/,
                issuer: {
                    exclude: /\.less$/,
                },
                loader: 'style-loader!css-loader!sass-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.scss'],
    },
    externals: [{
        react: 'react',
        'react-dom': 'react-dom',
        'prop-types': 'prop-types',
    },
    // Taken from https://github.com/lzszone/antd-cropper/blob/master/webpack.config.js.
    // Make antd library AND styles to be external to current project
    /^antd[.]*/,
    ],
    plugins: [
        // new BundleAnalyzerPlugin(),
    ],
};
