// 1. Declare references to node.js path & html-webpack-plugin libraries
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 4. Add webpack-merge dependency, to help us splitting the configuration into multiple.
const merge = require('webpack-merge');

// 6. Add webpack-validator dependency, to validate settings that we put into our configuration object.  
const validate = require('webpack-validator');
// 8. Add reference to webpack config part
const parts = require('./webpack-parts/parts');

// 2. Define path to source & build directories
const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build'),
};

// 3. Define webpack's parameters: entry, output & plugins
const common = {
    entry: {
        app: PATHS.app
    },
    output: {
        path: PATHS.build,
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack demo'
        })
    ]
};

var config; 

// 5. Splitting configuration's decision is determined by an environment variable
//    Additional settings are merged into configuration object based on this variable.   
switch(process.env.npm_lifecycle_event){
    case 'build':
        config = merge(common, {}); 
        break;
    default: config = merge(common, parts.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT        
    })); 
}

// 7. Validate the configuration object before we let webpack read it.
module.exports = validate(config);