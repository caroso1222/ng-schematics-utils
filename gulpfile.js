const gulp = require('gulp'),
      tsc = require('gulp-typescript').createProject('tsconfig.json');

/**
 * Source dir where all the schematics are located
 */
const srcDir = 'src';      
    
/**
 * Files being watched in ./ to be copied to /dist
 */
const rootFiles = [
  'package.json',
  'README.md',
  'LICENCE.md'
];

/**
 * Globs to select all files but .ts
 */
const allButTsGlob = [`${srcDir}/**/*`, `!${srcDir}/**/*.ts`];

/**
 * Run TypeScript compiler
 */
gulp.task('tsc', function() {
  gulp.src([`${srcDir}/**/*.ts`])
    .pipe(tsc())
    .pipe(gulp.dest('dist/'));
});

/**
 * Copy ./src into ./dist, but ignore .ts files
 */
gulp.task('copy:src', function() {
  gulp.src(allButTsGlob)
    .pipe(gulp.dest('dist/'));
});

/**
 * Copy files in 'rootFiles' into ./dist
 */
gulp.task('copy:root', function() {
  gulp.src(rootFiles)
    .pipe(gulp.dest('dist/'));
});

/**
 * Watch changes and run 
 */
gulp.task('watch', function() {
  gulp.watch('src/**/*.ts', ['tsc']);
  gulp.watch(allButTsGlob, ['copy:src']);
  gulp.watch(rootFiles, ['copy:root']);
});

gulp.task('build', ['tsc', 'copy:src', 'copy:root']);

gulp.task('default', ['build', 'watch']);
