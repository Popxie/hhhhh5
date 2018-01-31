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
    passengerLess: 'src/views/Passenger/less/',
    passengerHtml: 'src/views/Passenger/*.html',
    build: 'dist/'
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

// less编译
gulp.task('less', function () {
    return watch(paths.passengerLess + '*.less', function() { // 时刻监控less文件的变化
        gulp.src([paths.passengerLess + '*.less',`!${paths.passengerLess}basic.less`]) //该任务针对的文件
            .pipe(less()) //该任务调用的模块
            .pipe(gulp.dest(paths.views+'Passenger/css')); //将会在下生成xxx.css
    });
});

gulp.task('outFontIconForPassenger', function () {
    gulp.src([paths.views+'Passenger/css/font_icon/'+'*.**'])
        .pipe(gulp.dest(outPaths.build+'views/Passenger/css/font_icon'))
});

gulp.task('outImgForPassenger', function () {
    gulp.src([paths.views+'Passenger/img/'+'*.**'])
        .pipe(gulp.dest(outPaths.build+'views/Passenger/img'))
});

// 输出Station模块不需要编译的js
gulp.task('outJsForPassenger', function () {
    gulp.src([paths.views+'Passenger/commonJs/'+'*.js'])
        .pipe(gulp.dest(outPaths.build+'views/Passenger/commonJs'))
});
// 压缩css
gulp.task('minifycssForPassenger', function () {
    return gulp.src(paths.views+'Passenger/css/*.css')
        .pipe(minifycss())
        .pipe(rev())
        .pipe(gulp.dest(outPaths.build + 'views/Passenger/css'))
        .pipe(rev.manifest('css-rev.json'))
        .pipe(gulp.dest(outPaths.build + 'rev'))
});
// 压缩js
gulp.task('minifyjsForPassenger', function () {
    return gulp.src([paths.views + 'Passenger/js/*.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(outPaths.build + 'views/Passenger/js'))
        .pipe(rev.manifest('js-rev.json'))
        .pipe(gulp.dest(outPaths.build + 'rev'))
});

// 压缩html
gulp.task('minifyhtmlPassenger', function () {
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
        .pipe(gulp.dest(outPaths.build+'views/Passenger'))
});

gulp.task('default', function (done) {
    runSequence(
        'delDist',
        'outImgForPassenger',
        'outFontIconForPassenger',
        'outJsForPassenger',
        'minifycssForPassenger',
        'minifyjsForPassenger',
        'minifyhtmlPassenger',
        done
    )
});
