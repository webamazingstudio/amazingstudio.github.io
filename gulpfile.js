'use strict';

const gulp = require('gulp');
const less = require('gulp-less');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker'); //Для сортировки медиа запросов.
const minify = require('gulp-csso');
const rename = require('gulp-rename'); //Для перемеинования CSS файла.
const imagemin = require('gulp-imagemin');
const svgmin = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');
const del = require('del');
const uglify = require('gulp-uglify');
const fileinclude = require('gulp-file-include');
const jsinclude = require('gulp-include');
const newer = require('gulp-newer');
const replace = require('gulp-replace');
const server = require('browser-sync');
const run = require('run-sequence'); //Для запуска build

gulp.task('clean', function () {
    return del('build');
});

gulp.task('copy', function () {
    return gulp.src([
            'src/image/**',
            'src/js/**',
            'src/fonts/**/*.{woff, woff2}',
            'src/*.html'
        ], {
            base: 'src' //Родительский каталог откуда копировать
        })
        .pipe(gulp.dest('build'))
});

gulp.task('clean-icons-folder', function () {
    return del('build/image/icons');
});

gulp.task('style', function () {
    gulp.src('src/less/style.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(postcss([
            autoprefixer({
                browsers: [
                    'last 1 version',
                    'last 2 Chrome versions',
                    'last 2 Firefox versions',
                    'last 2 Opera versions',
                    'last 2 Edge versions'
                ]
            }),
            mqpacker({
                sort: true
            })
        ]))
        .pipe(gulp.dest('build/css'))
        .pipe(minify())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('build/css'))
        .pipe(server.stream());
});

gulp.task('html-watch', function () {
    return gulp.src(['src/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: true
        }))
        .pipe(replace(/\n\s*<!--DEV[\s\S]+?-->/gm, ''))
        .pipe(gulp.dest('build'));
});

gulp.task('watch-js', function () {
    gulp.src('src/js/script.js')
        .pipe(jsinclude())
        .pipe(uglify())
        .pipe(rename('script.min.js'))
        .pipe(gulp.dest('build/js'))
});

gulp.task('uglifyjs', function () {
    gulp.src('build/js/script.js')
        .pipe(uglify())
        .pipe(rename('script.min.js'))
        .pipe(gulp.dest('build/js'))
});

gulp.task('images', function () {
    console.log('--------------Оптимизирую изображения');
    return gulp.src('build/image/**/*.{png,jpg,gif}')
        .pipe(newer('build/image'))
        .pipe(imagemin([
            imagemin.optipng({
                optimizationlevel: 3
            }),
            imagemin.jpegtran({
                progressive: true
            })
        ]))
        .pipe(gulp.dest('build/image'));
});

gulp.task('svg-min', function () {
    return gulp.src('build/image/*.svg')
        .pipe(newer('build/image'))
        .pipe(svgmin())
        .pipe(gulp.dest('build/image'));
});

gulp.task('symbols', function () {
    return gulp.src('build/image/icons/*.svg')
        .pipe(newer('build/image'))
        .pipe(svgmin())
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename('symbols.svg'))
        .pipe(gulp.dest('build/image'));
});

gulp.task('html', function () {
    console.log('---------- сборка HTML');
    return gulp.src(['src/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: true
        }))
        .pipe(replace(/\n\s*<!--DEV[\s\S]+?-->/gm, ''))
        .pipe(gulp.dest('build'));
});

gulp.task('jsincl', function() {
    console.log('---------- Сборка JS');
    return gulp.src(['src/js/**/*.js'])
        .pipe(jsinclude())
        .on('error', console.log)
        .pipe(gulp.dest('build/js'));
});

gulp.task('serve', function () {
    server.init({
        server: 'build'
    });

    gulp.watch('src/**/**/*.less', ['style']);
    gulp.watch('src/**/**/*.js', ['watch-js']);
    gulp.watch('src/**/**/*.html', ['html-watch']).on('change', server.reload);
});

gulp.task('build', function (fn) {
    run(
        'clean',
        'copy',
        'html',
        'jsincl',
        'style',
        'images',
        'svg-min',
        'symbols',
        'clean-icons-folder',
        'uglifyjs',
        fn
    );
});