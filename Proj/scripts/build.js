// scripts/build.js

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config');

// Function to clean the dist folder
function cleanDist() {
    const distPath = path.resolve(__dirname, '../dist');
    if (fs.existsSync(distPath)) {
        fs.rmSync(distPath, { recursive: true, force: true });
    }
    fs.mkdirSync(distPath);
}

// Function to copy static files
async function copyStaticFiles() {
    const publicDir = path.resolve(__dirname, '../public');
    const distDir = path.resolve(__dirname, '../dist');

    // Read the files in the public directory
    const files = fs.readdirSync(publicDir);
    
    for (const file of files) {
        const srcFile = path.join(publicDir, file);
        const destFile = path.join(distDir, file);

        // Check if the source is a directory or a file
        const stats = fs.statSync(srcFile);
        if (stats.isDirectory()) {
            // If it's a directory, create it in the destination and copy its contents
            fs.mkdirSync(destFile, { recursive: true });
            await copyDir(srcFile, destFile);
        } else {
            // If it's a file, copy it normally
            fs.copyFileSync(srcFile, destFile);
        }
    }
}

// Function to copy directories recursively
function copyDir(src, dest) {
    const files = fs.readdirSync(src);
    
    files.forEach(file => {
        const srcFile = path.join(src, file);
        const destFile = path.join(dest, file);
        const stats = fs.statSync(srcFile);
        
        if (stats.isDirectory()) {
            fs.mkdirSync(destFile, { recursive: true });
            copyDir(srcFile, destFile); // Recursively copy subdirectory
        } else {
            fs.copyFileSync(srcFile, destFile); // Copy the file
        }
    });
}

// Function to build the extension
function buildExtension() {
    cleanDist();

    webpack(webpackConfig, (err, stats) => {
        if (err) {
            console.error('Webpack build failed:', err);
            process.exit(1);
        }

        console.log('Webpack build completed successfully.');
        console.log(stats.toString({
            chunks: false,
            colors: true
        }));

        copyStaticFiles().then(() => {
            console.log('Static files copied to dist folder.');
        }).catch(error => {
            console.error('Error copying static files:', error);
        });
    });
}

// Start the build process
buildExtension();
