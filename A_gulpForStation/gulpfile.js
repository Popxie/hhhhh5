const gulp = require('gulp'), //本地安装gulp所用到的地方
    less = require('gulp-less'),        // 编译less
    watch = require('gulp-watch'),      // 用来监视文件的变化，当文件发生变化后，我们可以利用它来执行相应的任务。
    htmlmin = require('gulp-htmlmin'),  // 压缩html文件
    minifycss = require('gulp-minify-css'), // 压缩css
    // concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),        // js压缩插件
    imagemin = require('gulp-imagemin'),    // 压缩图片
    rev = require('gulp-rev'),              // 对文件名加MD5后缀 (更改版本名字)
    revCollector = require('gulp-rev-collector'),    // gulp-rev的插件 用于html模板更改引用路径
    del = require('del'),                   // del替代了 gulp-clean
    rename = require('gulp-rename'),        // 重命名
    runSequence = require('run-sequence');   // 顺序执行


/*静态文件地址*/
const paths = {
    views: 'src/views/',
    stationLess:'src/views/Station/less/',
    stationHtml: 'src/views/Station/*.html',
    build: 'dist/'
};

const outPaths = {
    css: 'dist/css/',
    js: 'dist/js/',
    common: 'dist/commonJs/',
    build: 'dist/',
    icon: 'dist/css/font_icon/'
};


// 删除dist文件夹
gulp.task('delDist', function () {
    return del ([
        outPaths.build
    ])
});

// less编译
gulp.task('less', function () {
    return watch(paths.stationLess + '*.less', function() { // 时刻监控less文件的变化
        gulp.src([paths.stationLess + '*.less',`!${paths.stationLess}basic.less`]) //该任务针对的文件
            .pipe(less()) //该任务调用的模块
            .pipe(gulp.dest(paths.views+'Station/css')); //将会在下生成xxx.css
    });
});

gulp.task('outFontIconForStation', function () {
    gulp.src([paths.views+'Station/css/font_icon/'+'*.**'])
        .pipe(gulp.dest(outPaths.build+'views/Station/css/font_icon'))
});

gulp.task('outImgForStation', function () {
    gulp.src([paths.views+'Station/img/'+'*.**'])
        .pipe(gulp.dest(outPaths.build+'views/Station/img'))
});

// 输出Station模块不需要编译的js
gulp.task('outJsForStation', function () {
    gulp.src([paths.views+'Station/commonJs/'+'*.js'])
        .pipe(gulp.dest(outPaths.build+'views/Station/commonJs'))
});
// 压缩css
gulp.task('minifycssForStation', function () {
    return gulp.src(paths.views+'Station/css/*.css')
        .pipe(minifycss())
        .pipe(rev())
        .pipe(gulp.dest(outPaths.build + 'views/Station/css'))
        .pipe(rev.manifest('css-rev.json'))
        .pipe(gulp.dest(outPaths.build + 'rev'))
});
// 压缩js
gulp.task('minifyjsForStation', function () {
    return gulp.src([paths.views + 'Station/js/*.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(outPaths.build + 'views/Station/js'))
        .pipe(rev.manifest('js-rev.json'))
        .pipe(gulp.dest(outPaths.build + 'rev'))
});

// 压缩html
gulp.task('minifyhtmlStation', function () {
    const options = {
        collapseWhitespace:true,
        collapseBooleanAttributes:true,
        removeComments:true,
        removeEmptyAttributes:true,
        removeScriptTypeAttributes:true,
        removeStyleLinkTypeAttributes:true,
        minifyJS:true,
        minifyCSS:true
    };
    return gulp.src([outPaths.build + 'rev/*.json', paths.stationHtml])
        .pipe(revCollector({replaceReved: true}))
        .pipe(htmlmin(options))
        .pipe(gulp.dest(outPaths.build+'views/Station'))
});

gulp.task('default', function (done) {
    runSequence(
        'delDist',
        'outImgForStation',
        'outFontIconForStation',
        'outJsForStation',
        'minifycssForStation',
        'minifyjsForStation',
        'minifyhtmlStation',
        done
    )
});
