// scripts/watch.js

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config');

function cleanDist() {
    const distPath = path.resolve(__dirname, '../dist');
    if (fs.existsSync(distPath)) {
        fs.rmSync(distPath, { recursive: true, force: true });
    }
    fs.mkdirSync(distPath);
}

function copyStaticFiles() {
    const publicDir = path.resolve(__dirname, '../public');
    const distDir = path.resolve(__dirname, '../dist');

    fs.readdirSync(publicDir).forEach(file => {
        const srcFile = path.join(publicDir, file);
        const destFile = path.join(distDir, file);
        fs.copyFileSync(srcFile, destFile);
    });
}

function startWatch() {
    cleanDist();
    
    const compiler = webpack(webpackConfig);
    
    compiler.watch({}, (err, stats) => {
        if (err) {
            console.error('Webpack watch encountered an error:', err);
            return;
        }
        
        console.log('Webpack build completed successfully.');
        console.log(stats.toString({
            chunks: false,
            colors: true
        }));

        copyStaticFiles();
        console.log('Static files copied to dist folder.');
    });
}

startWatch();
