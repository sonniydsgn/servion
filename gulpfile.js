// Vars
const fs = require('fs')

const {src, dest} = require("gulp"),
	gulp = require("gulp"),
	browsersync = require("browser-sync").create(),
	fileinclude = require("gulp-file-include"),
	del = require("del"),
	scss = require("gulp-sass"),
	rename = require("gulp-rename"),
	autoprefixer = require("gulp-autoprefixer"),
	gcmq = require('gulp-group-css-media-queries'),
	cssnano = require("gulp-cssnano"),
	uglify = require("gulp-uglify-es").default,
	imagemin = require("gulp-imagemin"),
	ttf2woff2 = require("gulp-ttf2woff2");

// Paths
const project_folder = require("path").basename(__dirname);
const source_folder = "#src";

const path = {
	build:{
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/images/",
		fonts: project_folder + "/fonts/"
	},
	src:{
		html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
		css: source_folder + "/scss/style.scss",
		js: source_folder + "/js/app.js",
		img: source_folder + "/images/**/*.+(png|jpg|gif|ico|svg|webp)",
		fonts: source_folder + "/fonts/**/*.+(eot|woff|woff2|ttf|svg)"
	},
	watch:{
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/images/**/*.+(png|jpg|gif|ico|svg|webp)",
		fonts: source_folder + "/fonts/**/*.+(eot|woff|woff2|ttf|svg)"
	},
	clean: "./" + project_folder
}

// Reload Browser
function browserSync() {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"
		},
		port: 3000,
		notify: false
	})
}

// HTML
function html() {
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}

// CSS
function css() {
	return src(path.src.css)
		.pipe(scss())
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 5 versions'],
			cascade: true
		}))
		.pipe(gcmq())
		.pipe(cssnano({
			zindex: false,
			discardComments: {
					removeAll: true
			}
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
}

function cssWatch(){
	return src(path.src.css)
		.pipe(scss())
		.pipe(rename({suffix: '.min'}))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())		
}

// Javascript
function js() {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}

// Images
function images() {
	return src(path.src.img)
		.pipe(
			imagemin([
				imagemin.gifsicle({interlaced: true}),
				imagemin.mozjpeg({quality: 80, progressive: true}),
				imagemin.optipng({optimizationLevel: 5}),
				imagemin.svgo({
						plugins: [
								{ removeViewBox: true },
								{ cleanupIDs: false }
						]
				})
		]))
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
}

// Fonts
function fonts() {
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts))
}

// fontsStyle
function fontsStyle(cb) {
	let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
	if (file_content == '') {
		fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
				}
		})
	}
	cb()
}

// Cleaner
function clean() {
	return del(path.clean);
}

// Watcher
function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], cssWatch);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
	gulp.watch([path.watch.fonts], fonts);
}

// Exports
const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.fontsStyle = fontsStyle;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;