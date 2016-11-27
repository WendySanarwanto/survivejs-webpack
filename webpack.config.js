// 1. Declare references to node.js path & html-webpack-plugin libraries
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 4. Add webpack-merge dependency, to help us splitting the configuration into multiple.
const merge = require('webpack-merge');

// 6. Add webpack-validator dependency, to validate settings that we put into our configuration object.  
const validate = require('webpack-validator');
// 8. Add reference to webpack config's helpers
const helpers = require('./webpack.helpers');

// 2. Define path to source & build directories
let PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build'),
    style: path.join(__dirname, 'styles', 'style.css')
};

PATHS.styles = [ path.join(__dirname, 'styles'), PATHS.app ];

// 3. Define webpack's parameters: entry, output & plugins
const common = {
    entry: {
        app: PATHS.app,
        style: PATHS.style
    },
    output: {
        path: PATHS.build,
        filename: '[name].[chunkhash].js',
        chunkFilename: '[chunkhash].js'
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

// Default config merges minify & setup css configs   
config = merge(common, helpers.extractBundle({ name:'vendor', entries: ['react'] }),                   
                helpers.minify()); 

switch(process.env.npm_lifecycle_event){
    // 9. Merge devServer, css setup config parts, defined in webpack-parts.js file.
    case 'build':
        console.log('[INFO-webpack.config] - \'buildDev\' config is picked.');
        config.output.path += '/dev';
        config = merge(config, helpers.extractCSS(PATHS.styles),
                               helpers.clean(config.output.path),
                               helpers.setupSourceMap().dev); 
        break;
    // 10. Merge 'FreeVariable' settings which does setting NODE_ENV variable to 'production'' programmatically, 
    //     as a way to tell webpack to optimise the build into smaller size.         
    case 'buildProd':
        console.log('[INFO-webpack.config] - \'buildProd\' config is picked.');
        config.output.path += '/prod';
        config = merge(config, helpers.extractCSS(PATHS.styles),
                               helpers.clean(config.output.path),
                               helpers.setFreeVariable('process.env.NODE_ENV', 'production'));
        break;
    default:
        console.log('[INFO-webpack.config] - default config is picked.');
        config.output.filename = '[name].[hash].js'; 
        config = merge(config,  helpers.setupCSS(PATHS.styles),
                                helpers.setupSourceMap().dev,
                                helpers.devServer({
                                    host: process.env.HOST,
                                    port: process.env.PORT                          
                                }));
}

// 7. Validate the configuration object before we let webpack read it.
module.exports = validate(config);