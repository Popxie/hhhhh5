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
    css: 'src/css/',
    less: 'src/static/less/',
    scripts: 'src/js/',
    common: 'src/commonJs/',
    images: 'src/img/',
    activity: 'src/views/Activity/*.html',
    station: 'src/views/Station/*.html',
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
gulp.task('del', function () {
    return del ([
        outPaths.css+'*.css',
        outPaths.js+'*.js',
    ])
});

// 输出不编译的 commonJs文件下的所有js  因为 vue  axios 经过编译以后无法使用会报错
gulp.task('out', function () {
    gulp.src([paths.common+'*.js'])
        .pipe(gulp.dest(outPaths.common))
});
gulp.task('outFontIcon', function () {
    gulp.src([paths.css+'font_icon/'+'*.**'])
        .pipe(gulp.dest(outPaths.build+'css/font_icon'))
});

// less编译
gulp.task('less', function () {
    return watch(paths.less + '*.less', function() { // 时刻监控less文件的变化
        gulp.src([paths.less + '*.less',`!${paths.less}basic.less`]) //该任务针对的文件
            .pipe(less()) //该任务调用的模块
            .pipe(gulp.dest('src/css')); //将会在src/css下生成xxx.css
    });
});

// 压缩图片
gulp.task('minifyimg', function () {
    return gulp.src([paths.images + '*'])
        .pipe(imagemin({
            optimizationLevel: 7,   // 类型：Number  默认：0  取值范围：0-7（优化等级）
            progressive: true,      // 类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true,       // 类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true         // 类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest(outPaths.build + 'img'))
});

/*压缩css*/
gulp.task('minifycss', function () {
    return gulp.src(paths.css + '*.css')        // 压缩的文件
        .pipe(minifycss())               // 压缩css
        // .pipe(rename(function (path) {
        //     path.basename += '.min';
        //     path.extname = '.css'
        // }))
        .pipe(rev())                     // 添加md5签名   set hash key
        .pipe(gulp.dest(outPaths.build + 'css'))       // 输出文件夹    ！！一定要写输出 然后在生成json
        .pipe(rev.manifest('css-rev.json'))         // 生成一个rev-manifest.json
        .pipe(gulp.dest(outPaths.build + 'rev'))       // 将 rev-manifest.json 保存到 rev 目录内
});

// 压缩js
gulp.task('minifyjs', function () {
    return gulp.src([paths.scripts + '**/*.js'])
        .pipe(babel({
            presets: ['es2015']
        }))                     // 编译es6 => es5   需要（npm install --save-dev gulp-babel babel-preset-es2015）
        .pipe(uglify())         // 压缩js
        .pipe(rev())            // 添加md5签名  set hash key
        .pipe(gulp.dest(paths.build + 'js')) // 输出
        .pipe(rev.manifest('js-rev.json')) // set hash key json
        .pipe(gulp.dest(outPaths.build + 'rev'))   // 将 rev-manifest.json 保存到 rev 目录内
});


// !!!!  由于使用了gulp-rename导致无法完成静态资源路径替换  ！！！！！
// 1、你看一下你在用gulp-rev的时候生成的rev-manifest.json文件中的文件名是否和你在html中要替换的那个文件名一致，
// 我在替换过程中，由于使用了gulp-rename，所以生成的文件名为index-XXX.min.css,而在html中我自己写的引用文件名为index.css，
// 并没有.min，所以在于json匹配的时候无法匹配到导致无法替换，你需要除了哈希值以外的其他所有文件名都一致才可以匹配替换。
// 所以可以 在link标签或者script标签添加上 xxx.min.css 或者 xxx.min.js  但是一单这样做 当前的html引入的link和script会失效，但是编译后的文件就是正常的

// 压缩html （活动）
gulp.task('minifyhtml', function () {
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
    return gulp.src([outPaths.build + 'rev/*.json', paths.activity])
        .pipe(revCollector({replaceReved: true}))  // 一定要加上这一句( { replaceReved:true } )，不然不会替换掉上一次的值
        .pipe(htmlmin(options))                   // 压缩所有的html
        .pipe(gulp.dest(outPaths.build+'views/Activity'))     // 将压缩后的html导出到 dist文件下
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
    return gulp.src([outPaths.build + 'rev/*.json', paths.station])
        .pipe(revCollector({replaceReved: true}))
        .pipe(htmlmin(options))
        .pipe(gulp.dest(outPaths.build+'views/Station'))
});

// 当执行gulp default或gulp将会调用default任务里的所有任务[‘xxx’,’yyy’]。
gulp.task('default', function (done) {
    runSequence(            // 这里默认的不需要执行 less编译  因为需要的是less编译后的css  所以如果把less写进来的话就会一个 处于 starting less……
        'del',
        'minifycss',
        'minifyjs',
        'minifyimg', // 图片占时就不用gulp压缩了，在其他地方压缩就好了
        'out',
        'outFontIcon',
        'minifyhtml',
        'minifyhtmlStation',
        done
    )
});
