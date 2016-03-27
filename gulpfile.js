const gulp = require('gulp');
const getMtgJson = require('mtg-json');
const webpack = require('webpack-stream');
const CommonsChunkPlugin = require('webpack').optimize.CommonsChunkPlugin;

const webpackConfig = {
    devtool: 'source-map',
    output: {
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.json?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'json' // 'babel-loader' is also a legal name to reference
            }
        ]
    }
};

gulp.task('build', function () {

    //Downloads mtg-json
    return getMtgJson('cards', __dirname + '/src')

    //Pipes through webpack
        .then(()=>
            gulp.src('src/app.jsx')
                .pipe(webpack(webpackConfig))
                .pipe(gulp.dest('dist/'))
        )
});

gulp.task('watch', function () {

    //Downloads mtg-json
    return getMtgJson('cards', __dirname + '/src')

    //Pipes through webpack
        .then(()=>
            gulp.src('src/app.jsx')
                .pipe(webpack(Object.assign(webpackConfig, {watch: true})))
                .pipe(gulp.dest('dist/'))
        )
});