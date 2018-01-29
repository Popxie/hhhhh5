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
    css: 'src/css/',
    less: 'src/static/less/',
    scripts: 'src/js/',
    common: 'src/commonJs/',
    images: 'src/img/',
    avtivityLess:'src/views/Activity/less/',
    stationLess:'src/views/Station/less/',
    activityHtml: 'src/views/Activity/*.html',
    stationHtml: 'src/views/Station/*.html',
    protalHtml: 'src/views/Protal/*.html',
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

// ------------------------------------ js ----------------------------------------------------

// 输出不编译的 commonJs文件下的所有js  因为 vue  axios 经过编译以后无法使用会报错





// ------------------------------------ Activity --------------------------------------------------
gulp.task('outFontIconForActivity', function () {
    gulp.src([paths.views+'Activity/css/font_icon/'+'*.**'])
        .pipe(gulp.dest(outPaths.build+'views/Activity/css/font_icon'))
});

gulp.task('outImgForActivity', function () {
    gulp.src([paths.views+'Activity/img/'+'*.**'])
        .pipe(gulp.dest(outPaths.build+'views/Activity/img'))
});

// 输出Activity模块 不需要编译的js
gulp.task('outJsForActivity', function () {
    gulp.src([paths.views+'Activity/commonJs/'+'*.js'])
        .pipe(gulp.dest(outPaths.build+'views/Activity/commonJs'))
});

gulp.task('minifycssForActivity', function () {
    return gulp.src(paths.views+'Activity/css/*.css')        // 压缩的文件
        .pipe(minifycss())               // 压缩css
        .pipe(rev())                     // 添加md5签名   set hash key
        .pipe(gulp.dest(outPaths.build + 'views/Activity/css'))       // 输出文件夹    ！！一定要写输出 然后在生成json
        .pipe(rev.manifest('css-rev.json'))         // 生成一个rev-manifest.json
        .pipe(gulp.dest(outPaths.build + 'rev'))       // 将 rev-manifest.json 保存到 rev 目录内
});

gulp.task('minifyjsForActivity', function () {
    return gulp.src([paths.views + 'Activity/js/*.js'])
        .pipe(babel({
            presets: ['es2015']
        }))                     // 编译es6 => es5   需要（npm install --save-dev gulp-babel babel-preset-es2015）
        .pipe(uglify())         // 压缩js
        .pipe(rev())            // 添加md5签名  set hash key
        .pipe(gulp.dest(outPaths.build + 'views/Activity/js')) // 输出
        .pipe(rev.manifest('js-rev.json')) // set hash key json
        .pipe(gulp.dest(outPaths.build + 'rev'))   // 将 rev-manifest.json 保存到 rev 目录内
});

gulp.task('minifyhtmlActivity', function () {
    const options = {
        collapseWhitespace:true,                // 从字面意思应该可以看出来，清除空格，压缩html，这一条比较重要，作用比较大，引起的改变压缩量也特别大。
        collapseBooleanAttributes:true,         // 省略布尔属性的值，比如：<input checked="checked"/>,那么设置这个属性后，就会变成 <input checked/>。
        removeComments:true,                    // 清除html中注释的部分，我们应该减少html页面中的注释。
        removeEmptyAttributes:true,             // 清除所有的空属性。
        removeScriptTypeAttributes:true,        // 清除所有script标签中的type="text/javascript"属性。
        removeStyleLinkTypeAttributes:true,     // 清楚所有Link标签上的type属性。
        minifyJS:true,                          // 压缩html中的javascript代码。
        minifyCSS:true                          // 压缩html中的css代码。
    };
    return gulp.src([outPaths.build + 'rev/*.json', paths.activityHtml])
        .pipe(revCollector({replaceReved: true}))  // 一定要加上这一句( { replaceReved:true } )，不然不会替换掉上一次的值
        .pipe(htmlmin(options))                   // 压缩所有的html
        .pipe(gulp.dest(outPaths.build+'views/Activity'))     // 将压缩后的html导出到 dist文件下
});


// ------------------------------------ Station ----------------------------------------------------

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
// ------------------------------------ Protal --------------------------------------------------
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





// 当执行gulp default或gulp将会调用default任务里的所有任务[‘xxx’,’yyy’]。

// gulp.task('default', function (done) {
//     runSequence(            // 这里默认的不需要执行 less编译  因为需要的是less编译后的css  所以如果把less写进来的话就会一个 处于 starting less……

//         'delDist',          // 删除整个dist
//         'outImgForActivity',
//         'outFontIconForActivity',  // 字体图标 (输出&不压缩)
//         'outJsForActivity',     // js (输出&不压缩)
//         'minifycssForActivity',     // 压缩 css
//         'minifyjsForActivity',   // 压缩js
//         'minifyhtmlActivity',       // html (输出&压缩)
//         done
//     )
// });
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
// gulp.task('default', function (done) {
//     runSequence(
//         'delDist',
//         'outImgForProtal',
//         'outFontIconForProtal',
//         'outJsForProtal',
//         'minifycssForProtal',
//         'minifyjsForProtal',
//         'minifyhtmlProtal',
//         done
//     )
// });
