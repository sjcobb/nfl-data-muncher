var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function (){
    gulp.src(['./sass/*.scss'])
        .pipe(sass({
            includePaths: ['./sass'],
            outputStyle: 'expanded'
        }))
        .pipe(gulp.dest('./css'))
});

gulp.task('default', function(){

    gulp.watch("./sass/**/*.scss", function(event){
        gulp.run('sass');
    });
    
});