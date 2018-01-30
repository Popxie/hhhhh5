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
    protalLess: 'src/views/Protal/less/',
    protalHtml: 'src/views/Protal/*.html',
    build: 'dist/',
};

const outPaths = {
    build: 'dist/',
    icon: 'dist/css/font_icon/'
};


// 删除dist文件夹
gulp.task('delDist', function () {
    return del ([
        outPaths.build
    ])
});

// 输出Protal模块 不需要编译的js
gulp.task('outJsForProtal', function () {
    gulp.src([paths.views+'Protal/commonJs/'+'*.js'])
        .pipe(gulp.dest(outPaths.build+'views/Protal/commonJs'))
});

gulp.task('outImgForProtal', function () {
    gulp.src([paths.views+'Protal/img/'+'*.**'])
        .pipe(gulp.dest(outPaths.build+'views/Protal/img'))
});

gulp.task('outFontIconForProtal', function () {
    gulp.src([paths.views+'Protal/css/font_icon/'+'*.**'])
        .pipe(gulp.dest(outPaths.build+'views/Protal/css/font_icon'))
});
gulp.task('minifycssForProtal', function () {
    return gulp.src(paths.views+'Protal/css/*.css')
        .pipe(minifycss())
        .pipe(rev())
        .pipe(gulp.dest(outPaths.build + 'views/Protal/css'))
        .pipe(rev.manifest('css-rev.json'))
        .pipe(gulp.dest(outPaths.build + 'rev'))
});

gulp.task('minifyjsForProtal', function () {
    return gulp.src([paths.views + 'Protal/js/*.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(outPaths.build + 'views/Protal/js'))
        .pipe(rev.manifest('js-rev.json'))
        .pipe(gulp.dest(outPaths.build + 'rev'))
});
// less编译
gulp.task('less', function () {
    return watch(paths.protalLess + '*.less', function() { // 时刻监控less文件的变化
        gulp.src([paths.protalLess + '*.less',`!${paths.protalLess}basic.less`]) //该任务针对的文件
            .pipe(less()) //该任务调用的模块
            .pipe(gulp.dest(paths.views+'Protal/css')); //将会在下生成xxx.css
    });
});

gulp.task('minifyhtmlProtal', function () {
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
    return gulp.src([outPaths.build + 'rev/*.json', paths.protalHtml])
        .pipe(revCollector({replaceReved: true}))
        .pipe(htmlmin(options))
        .pipe(gulp.dest(outPaths.build+'views/Protal'))
});

gulp.task('default', function (done) {
    runSequence(
        'delDist',
        'outImgForProtal',
        'outFontIconForProtal',
        'outJsForProtal',
        'minifycssForProtal',
        'minifyjsForProtal',
        'minifyhtmlProtal',
        done
    )
});
