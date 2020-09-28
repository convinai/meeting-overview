// eslint-disable-next-line import/no-extraneous-dependencies
const { fixBabelImports } = require('customize-cra');
const path = require('path');

module.exports = {
    require: [
        path.join(__dirname, './src/styles/main.scss'),
    ],
    dangerouslyUpdateWebpackConfig(webpackConfig) {
    // eslint-disable-next-line no-param-reassign
        webpackConfig = fixBabelImports(
            'import', { libraryName: 'antd', style: 'css' },
        )(webpackConfig);

        return webpackConfig;
    },
};
