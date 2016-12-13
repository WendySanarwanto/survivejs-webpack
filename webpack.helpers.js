const webpack = require('webpack');
const CleanWebPackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack-plugin');

/**
 * A helper for defining Webpack's development server's settings
 */
exports.devServer = function(options) {
  return {
    watchOptions: {
      // Delay the rebuild after the first change
      aggregateTimeout: 300,
      // Poll using interval (in ms, accepts boolean too)
      poll: 1000        
    },
    devServer: {
      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      // Unlike the cli flag, this doesn't set
      // HotModuleReplacementPlugin!
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
      host: options.host, // Defaults to `localhost`
      port: options.port // Defaults to 8080
    },
    plugins: [
      // Enable multi-pass compilation for enhanced performance
      // in larger projects. Good default.
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ]
  };
}

/**
 * A helper defining setting to pick application's css files and then bundle them with the bundled js file. 
 */
exports.setupCSS = function(paths){
    return {
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loaders: ['style', 'css'],
                    include: paths
                }
            ]
        }
    };
}

/**
 * A helper defining setting to pick application's scss files, transpile them as css files and then bundle them with the bundled js file. 
 */
exports.setupSCSS = function(paths){
  return {
    module: {
      loaders: [{
          test: /\.scss$/,
          loaders: ['style', 'css', 'sass'],
          include: paths
        }]
    }
  }
}

/**
 * A helper for defining setting of how the Webpack would bundle css files. 
 */
exports.setupSourceMap = function(){
  return {
    dev: {
      devtool: 'eval-source-map', 
      output: { 
        sourceMapFilename: '[file].map' 
      }
    }
  };
}

/**
 * A helper for defining the setting of how the Webpack would minify the bundled JS file. 
 */
exports.minify = function(args = {}){
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        // Set true to enable for neater output
        beautify: args.beautify || false,
        // Eliminate comments ?
        comments: args.comments || false,
        // Compression specific options        
        compress: {
          warnings: args.compress_warnings || false,
          // Drop console statement ?
          drop_console: args.compress_drop_console || false
        },
        // Mangling specific options
        mangle: {
          // Don't mangle $
          except: args.mangle_exception || ['$', 'webpackJsonp'],

          // Don't care about IE8
          screw_ie8: args.mangle_screw_ie8 || true,

          // Don't mangle function names
          keep_fnames: args.mangle_fnames || true
        }
      })
    ]
  };
}

/**
 * A helper for defining a webpack setting to optimise the bundled JS file
 */
exports.setFreeVariable = function(key, value){
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  };
};

/**
 * Extract Bundle - Separate the dependency JS Files from the bundled application js file.
 */
exports.extractBundle = function(options){
  const entry = {};
  entry[options.name] = options.entries;

  return {
    // Define an entry point needed for splitting
    entry: entry,
    plugins: [
      // Extract bundle and manifest files. Manifest is
      // needed for reliable caching.
      new webpack.optimize.CommonsChunkPlugin({
        names: [options.name, 'manifest']
      })      
    ]
  };
}

/**
 * Clean build's artefact'
 */
exports.clean = function(path){
  return {
    plugins: [
      new CleanWebPackPlugin([path], {
        // Without `root` CleanWebpackPlugin won't point to our
        // project and will fail to work.
        root: process.cwd()
      })
    ]
  };
}

/**
 * Extract CSS files from the bundled js files.
 */
exports.extractCSS = function(paths){
    return {
      module: {
        loaders: [
          // Extract CSS during build
          { 
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style', 'css'),
            include: paths 
          }
        ]
      },
      plugins: [
        // Output extracted css to a file
        new ExtractTextPlugin('[name].[chunkhash].css')
      ]
    };
}

/**
 * Extract scss files from the bundled js files
 */
exports.extractSCSS = function(paths){
  return {
    module: {
      loaders: [{
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
      }]
    },
    plugins: [
      new ExtractTextPlugin('[name].[chunkhash].css', { allChunks: true })
    ]
  };
}

/**
 * Eliminate portions of CSS files that are unused by application
 */
exports.purifyCSS = function(paths){
  return {
    plugins:[ new PurifyCSSPlugin({
      basePath: process.cwd(),
      // `paths` is used to point PurifyCSS to files not
      // visible to Webpack. You can pass glob patterns
      // to it.
      paths: paths      
    })]
  };
}

/**
 * Load image assets
 */
exports.setupImages = function(paths){
  return {
    module: {
      loaders: [{
        test: /\.(jpg|png|gif)$/,
        loader: 'file?name=[path][name].[hash].[ext]',
        include: paths
      }]
    }
  }
}

/**
 * Load fonts 
 */
exports.setupFonts = function(paths){
  return {
    module: {
      loaders: [{
        test: /\.ttf$/,
        loader: 'file',
        include: paths
      }]
    }
  }
}