// webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development', // Change to 'production' for production builds
    entry: {
        background: './src/background/background.js',
        content: './src/content/content.js',
        popup: './src/popup/popup.js'
    },
    output: {
        filename: '[name].bundle.js', // Use the entry name as the output filename
        path: path.resolve(__dirname, 'dist'), // Output directory
        clean: true, // Clean the output directory before emit
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Apply this rule to JavaScript files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Use Babel to transpile JavaScript
                    options: {
                        presets: ['@babel/preset-env'], // Use the env preset for compatibility
                    }
                }
            },
            {
                test: /\.css$/, // Apply this rule to CSS files
                use: ['style-loader', 'css-loader'], // Use style-loader and css-loader
            },
            {
                test: /\.(png|jpg|gif|svg)$/, // Apply this rule to image files
                type: 'asset/resource', // Use asset modules to manage image files
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/popup/popup.html', // Template for generating the popup HTML
            filename: 'popup.html',
            chunks: ['popup'], // Include the popup script
        }),
    ],
    devtool: 'source-map', // Generate source maps for easier debugging
    resolve: {
        extensions: ['.js'], // Resolve these extensions
    },
};
