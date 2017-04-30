'use strict';
const json = require('./package.json');
const dirs = json.config.directories;

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
const notify = require('gulp-notify');
const fileinclude = require('gulp-file-include');
const concat = require('gulp-concat');
const newer = require('gulp-newer');
const replace = require('gulp-replace');
const server = require('browser-sync');
const run = require('run-sequence'); //Для запуска build


gulp.task('style', function () {
    console.log('Компилирую LESS');
    gulp.src(dirs.source + '/less/style.less')
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
            mqpacker()
        ]))
        .pipe(gulp.dest(dirs.build + '/css'))
        .pipe(minify())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest(dirs.build + '/css'))
        .pipe(server.stream());
});

gulp.task('clean', function () {
    console.log('Очистка build')
    return del(dirs.build);
});

gulp.task('copy', function () {
    console.log('Копирование файлов')
    return gulp.src([
            dirs.source + '/image/**',            
            dirs.source + '/fonts/**/*.{woff, woff2}',
            dirs.source + '/*.html',
            dirs.source + '/*.php',            
            dirs.source + '/*.json',            
            dirs.source + '/*.xml'            
        ], {
            base: dirs.source
        })        
        .pipe(gulp.dest(dirs.build))    
});


gulp.task('clean-icons-folder', function () {
    console.log('Удаляем папку icons')
    return del(dirs.build + '/image/icons');
});

gulp.task('jshandler', function() {
    console.log('Обработка JS')
    return gulp.src([ dirs.node + '/jquery/dist/jquery.js',dirs.node + '/slick-carousel/slick/slick.js', dirs.source + '/blocks/**/*.js'])
        .pipe(concat('script.min.js'))
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest(dirs.build + '/js'))
})


gulp.task('images', function () {
    console.log('Оптимизизация изображений');
    return gulp.src(dirs.build + '/image/**/*.{png,jpg,gif}')
        .pipe(newer( dirs.build + '/image'))
        .pipe(imagemin([
            imagemin.optipng({
                optimizationlevel: 3
            }),
            imagemin.jpegtran({
                progressive: true
            })
        ]))
        .pipe(gulp.dest(dirs.build + '/image'));
});

gulp.task('svg-min', function () {
    return gulp.src( dirs.build + '/image/*.svg')
        .pipe(newer( dirs.build + '/image'))
        .pipe(svgmin())
        .pipe(gulp.dest( dirs.build + '/image'));
});

gulp.task('symbols', function () {
    return gulp.src( dirs.build + '/image/icons/*.svg')
        .pipe(newer( dirs.build + '/image'))
        .pipe(svgmin())
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename('symbols.svg'))
        .pipe(gulp.dest( dirs.build + '/image'));
});

gulp.task('html', function () {
    console.log('Компиляция HTML');
    return gulp.src([ dirs.source + '/*.html'])
        .pipe(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: 'HTML compilation error',
                    message: err.message
                })(err);
                this.emit('end');
            }
        }))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: true
        }))
        .pipe(replace(/\n\s*<!--DEV[\s\S]+?-->/gm, ''))
        .pipe(gulp.dest(dirs.build));
});

gulp.task('serve', function () {
    server.init({
        server: 'build'
    });

    gulp.watch(dirs.source + '/**/*.less', ['style']);
    gulp.watch(dirs.source + '/**/*.js', ['jshandler']);
    gulp.watch(dirs.source + '/**/*.html', ['html']).on('change', server.reload);
});

gulp.task('build', function (fn) {
    run(
        'clean',
        'copy',        
        'html',        
        'style',
        'images',
        'svg-min',
        'symbols',
        'clean-icons-folder',
        'jshandler',
        fn
    );
});


