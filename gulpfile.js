const gulp = require('gulp')
		, nodemon = require('gulp-nodemon')
		, browserSync = require('browser-sync')
		, reload = browserSync.reload

gulp.task('default', () => {
	browserSync.init({
		proxy: 'localhost:3004'
	})
	gulp.watch(['index.html', 'js/*.*', 'css/*.*'], reload)
	gulp.watch(['app/**/*.*'], reload)

	nodemon({
		script: 'server.js',
		env: {
			'NODE_ENV': 'development'
		},
		ignore: [ './js', './app/js' ]
	})
})