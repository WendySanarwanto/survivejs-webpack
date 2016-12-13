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
const stylesDirPath = path.join(__dirname, 'styles'); 
let PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build'),
    style: path.join(stylesDirPath, 'style.scss'),
    styleDeps: [ path.join(__dirname, 'node_modules', 'purecss', 'pure.css') ],
    assets: [ path.join(__dirname, 'assets') ]         
};

PATHS.appStyles = [ stylesDirPath, PATHS.app, PATHS.style ]; 
PATHS.styles = [ ...PATHS.appStyles, ...PATHS.styleDeps ];

// 3. Define webpack's parameters: entry, output & plugins
const common = {
    entry: {
        app: [ PATHS.app ],
        style: [ PATHS.app, PATHS.style, ...PATHS.styleDeps ]
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

// Detect how npm is run and branch based on that
const npmLifecycleEvent = process.env.npm_lifecycle_event; 
const isBuildingWithStats = npmLifecycleEvent.includes('stats');
const deployPublicPath = 'survivejs-webpack';
const shouldBeDeployed = npmLifecycleEvent.includes('deploy');

if (shouldBeDeployed){    
    config.output.publicPath = deployPublicPath;
    console.log('[DEBUG-WebpackConfig] - deploy option is selected. config = ',config);
}

// 9. Merge devServer, css setup config parts, defined in webpack-parts.js file.
if (npmLifecycleEvent === 'build' || npmLifecycleEvent === 'buildProd'){
    config = merge(config, helpers.extractSCSS(PATHS.appStyles),
                            helpers.extractCSS(PATHS.styleDeps),
                            //helpers.purifyCSS(PATHS.styles), // we put call to purifyCss helper after call extractCss helper.The order is important. 
                            helpers.clean(config.output.path) );    
}

// Setup fonts
config = merge(config, helpers.setupFonts(PATHS.assets));

switch(npmLifecycleEvent){
    case 'build':
        if (!isBuildingWithStats) console.log('[INFO-webpack.config] - \'buildDev\' config is picked.');
        config.output.path += '/dev';
        config = merge(config, helpers.setupSourceMap().dev); 
        break;
    // 10. Merge 'FreeVariable' settings which does setting NODE_ENV variable to 'production'' programmatically, 
    //     as a way to tell webpack to optimise the build into smaller size.         
    case 'buildProd':
        if (!isBuildingWithStats) console.log('[INFO-webpack.config] - \'buildProd\' config is picked.');
        config.output.path += '/prod';
        config = merge(config, helpers.setFreeVariable('process.env.NODE_ENV', 'production'));
        break;
    default:
        if (!isBuildingWithStats) console.log('[INFO-webpack.config] - default config is picked.');
        config.output.filename = '[name].[hash].js'; 
        config = merge(config,  helpers.setupSCSS(PATHS.appStyles),
                                helpers.setupCSS(PATHS.styleDeps),
                                // helpers.setupCSS(PATHS.appStyles),                                
                                helpers.setupSourceMap().dev,
                                helpers.devServer({
                                    host: process.env.HOST,
                                    port: process.env.PORT                          
                                }));
}

// 7. Validate the configuration object before we let webpack read it.
module.exports = validate(config, {quiet: isBuildingWithStats});