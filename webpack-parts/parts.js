const webpack = require('webpack');

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
 * A helper defining setting to determine how the Webpack would bundle css files. 
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