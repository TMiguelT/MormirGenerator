const gulp = require('gulp');
const getMtgJson = require('mtg-json');
const webpack = require('webpack-stream');
const CommonsChunkPlugin = require('webpack').optimize.CommonsChunkPlugin;
const _ = require('lodash');
var fsp = require('fs-promise');

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

function process(watch){
    //Downloads mtg-json
    return getMtgJson('cards', __dirname,  {extras: true})

    //Pipes through webpack
        .then((cards)=>
           _.chain(cards)
                .filter(card =>
                    'types' in card
                    && card.types.indexOf('Creature') != -1 //Ensure they're all creatures
                    && _.intersection(card.printings, ['UGL', 'UNH']).length == 0 //Ensure they're not from Un-sets
                )
                .groupBy('cmc')
                .value()
        ).then(filtered =>
            fsp.writeFile('src/filtered.json', JSON.stringify(filtered))
        ).then(() =>
            gulp.src('src/app.jsx')
                .pipe(webpack(Object.assign(webpackConfig, {watch: watch})))
                .pipe(gulp.dest('dist/'))
        )
}

gulp.task('build', function () {
    return process(false);
});

gulp.task('watch', function () {
    return process(true);
});