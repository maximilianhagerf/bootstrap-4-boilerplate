const gulp = require('gulp');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const htmlmin = require('gulp-htmlmin');
const cssmin = require('gulp-cssmin');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const jsImport = require('gulp-js-import');
const sourcemaps = require('gulp-sourcemaps');
const htmlPartial = require('gulp-html-partial');
const clean = require('gulp-clean');
const isProd = process.env.NODE_ENV === 'prod';
const embedSvg = require('gulp-embed-svg');
const inject = require('gulp-inject');
const inlineimg = require('gulp-inline-image-html');
const gulpRemoveHtml = require('gulp-remove-html');
const filter = require('gulp-filter');
const ghPages = require('gulp-gh-pages');
const file = require('gulp-file');
const cssBase64 = require('gulp-css-base64');
// const favicon = require('gulp-base64-favicon');

const htmlFile = [
    'src/*.html'
]

function html() {
    return gulp.src(htmlFile)
        .pipe(htmlPartial({
            basePath: 'src/partials/'
        }))
        .pipe(embedSvg({
            root: 'src/'
        }))
        .pipe(gulpIf(isProd, htmlmin({
            collapseWhitespace: true
        })))
        .pipe(gulpIf(isProd, inject(gulp.src(['docs/js/all.js']), {
            starttag: '//SCRIPTS',
            endtag: '//END SCRIPTS',
            transform: function (filePath, file) {
                return file.contents.toString('utf8')
            }
        })))
        .pipe(gulpIf(isProd, inject(gulp.src(['docs/css/style.css']), {
            starttag: '/*STYLES*/',
            endtag: '/*END STYLES*/',
            transform: function (filePath, file) {
                return file.contents.toString('utf8')
            }
        })))
        .pipe(gulpIf(isProd, inlineimg('docs')))
        .pipe(gulpIf(isProd, gulpRemoveHtml()))
        // .pipe(favicon())
        .pipe(gulp.dest('docs'));
}

function css() {
    return gulp.src('src/sass/style.scss')
        .pipe(gulpIf(!isProd, sourcemaps.init()))
        .pipe(sass({
            includePaths: ['node_modules']
        }).on('error', sass.logError))
        .pipe(gulpIf(!isProd, sourcemaps.write()))
        .pipe(gulpIf(isProd, cssmin()))
        .pipe(gulpIf(isProd, cssBase64()))
        // .pipe(cssBase64())
        .pipe(gulp.dest('docs/css/'));
}

function js() {
    return gulp.src('src/js/*.js')
        .pipe(jsImport({
            hideConsole: true
        }))
        .pipe(concat('all.js'))
        .pipe(gulpIf(isProd, uglify()))
        .pipe(gulp.dest('docs/js'));
}

function img() {
    return gulp.src('src/img/**/*')
        .pipe(gulpIf(isProd, imagemin()))
        .pipe(gulp.dest('docs/img/'));
}

function serve() {
    browserSync.init({
        open: true,
        server: './docs'
    });
}

function browserSyncReload(done) {
    browserSync.reload();
    done();
}


function watchFiles() {
    gulp.watch('src/**/*.html', gulp.series(html, browserSyncReload));
    gulp.watch('src/**/*.scss', gulp.series(css, browserSyncReload));
    gulp.watch('src/**/*.js', gulp.series(js, browserSyncReload));
    gulp.watch('src/img/**/*.*', gulp.series(img));

    return;
}

function del() {
    return gulp.src('docs/*', {
            read: false
        })
        .pipe(clean());
}

function postDel() {
    return gulp.src('docs/*')
        .pipe(filter(['*', '!index.html', '!img']))
        .pipe(clean());
}

function deploy() {
    return gulp.src('docs/**/*')
        .pipe(file('CNAME', 'www.hagerf.se'))
        .pipe(ghPages({
            remoteUrl : 'https://github.com/maximilianhagerf/maximilianhagerf.github.io.git',
            branch : 'master',
            // cacheDir: './',
            push: true,
            force: false,
            // message: "Update [timestamp]"
        }));
}

exports.css = css;
exports.html = html;
exports.js = js;
exports.del = del;
exports.serve = gulp.parallel(html, css, js, img, watchFiles, html, serve);
exports.default = gulp.series(del, css, js, img, html, postDel);
exports.deploy = gulp.series(deploy);