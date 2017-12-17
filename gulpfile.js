const gulp = require('gulp'),
      tsc = require('gulp-typescript').createProject('tsconfig.json'),
      jeditor  = require('gulp-json-editor'),
      del = require("del");

/**
 * Source dir where all the schematics are located
 */
const srcDir = 'src';      

/**
 * Folder for compiled files
 */
const distDir = 'dist';
    
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
    .pipe(gulp.dest(`${distDir}/`));
});

/**
 * Copy ./src into ./dist, but ignore .ts files
 */
gulp.task('copy:src', function() {
  gulp.src(allButTsGlob)
    .pipe(gulp.dest(`${distDir}/`));
});

/**
 * Copy files in 'rootFiles' into ./dist
 */
gulp.task('copy:root', function() {
  gulp.src(rootFiles)
    .pipe(gulp.dest(`${distDir}/`));
});

/**
 * Set 'private' to false when moving the manifest to dist
 * so that it becomes publishable
 */
gulp.task('edit:manifest', function() {
  gulp.src('package.json')
    .pipe(jeditor({
      'private': false
    }))
    .pipe(gulp.dest(`${distDir}/`));
});

/**
 * Clean dist directory
 */
gulp.task('clean', function() {
  return del.sync([distDir]);
});

/**
 * Watch changes and run relevant tasks
 */
gulp.task('watch', function() {
  gulp.watch(`${srcDir}/**/*.ts`, ['tsc']);
  gulp.watch(allButTsGlob, ['copy:src']);
  gulp.watch(rootFiles, ['copy:root', 'edit:manifest']);
});

gulp.task('build', ['tsc', 'copy:src', 'copy:root', 'edit:manifest']);

gulp.task('default', ['clean', 'build', 'watch']);
