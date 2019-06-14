var fs = require('fs'),
    gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    critical = require('critical'),
    axios = require('axios')
    ENVIRONMENT = 'live',
    DEST = '.';

/* gulp.task('build-clean-js', function() {
  return gulp.src('build/js/*.js', {read: false}).pipe(clean());
});
gulp.task('build-clean-css', function() {
  return gulp.src('build/css/*.css', {read: false}).pipe(clean());
}); */

function getCssFileHome() {
  return new Promise((resolve, reject) => {
    fs.readdir('./public/assets/distributions/', function (err, files) {
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      }
      //listing all files using forEach
      var regex = /application-.*?\.css/;

      files.forEach(function (file) {
        // Do whatever you want to do with the file
        var f = regex.test(file);

        if (f) {
          resolve(file)
          return file
        }
      });

      reject('No file found.')
    });
  });
}

function getCssFileHotels() {
  return new Promise((resolve, reject) => {
    fs.readdir('./public/assets/distributions/hotels', function (err, files) {
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      }
      //listing all files using forEach
      var regex = /application-.*?\.css/;

      files.forEach(function (file) {
        // Do whatever you want to do with the file
        var f = regex.test(file);

        if (f) {
          resolve(file)
          return file
        }
      });

      reject('No file found.')
    });
  });
}

var buildHome =  async function() {
  try {
    var stylesName = await getCssFileHome()
    console.log(stylesName)
    var content = await axios.get('https://ayendarooms.com/');
    var html = content.data.replace(/"\/assets\//g, '"https://ayendarooms.com/assets/')
    fs.writeFileSync('application.html', html)

    critical.generate({
      base: './',
      src: 'application.html',
      css: ['./public/assets/distributions/' + stylesName],
      dimensions: [{
        width: 320,
        height: 480
      },{
        width: 768,
        height: 1024
      },{
        width: 1280,
        height: 960
      }],
      dest: './app/assets/stylesheets/distributions/application_minimal.css',
      minify: true,
      inline: false,
    });

    console.log('Critical success!')

    // return gulp.src('./application.html')
    //       .pipe(critical({
    //         base: '/',
    //         minify: true,
    //         inline: false,
    //         css: ['./public/assets/distributions/' + stylesName]}))
    //       .on('error', function(err) { console.error('ERROR:',err.message); })
    //       .pipe(gulp.dest(DEST+'/app/assets/stylesheets/distributions/')
    //       )
  } catch (error) {
    console.error(error)
    return error
  }
}

var buildHotels =  async function() {
  try {
    var stylesName = await getCssFileHotels()
    console.log(stylesName)
    var content = await axios.get('https://ayendarooms.com/hoteles/barranquilla');
    var html = content.data.replace(/"\/assets\//g, 'https://ayendarooms.com/assets/')
    fs.writeFileSync('application.html', html)

    return gulp.src('./application.html')
          .pipe(critical({
            base: '/',
            minify: true,
            inline: false,
            css: ['./public/assets/distributions/hotels/' + stylesName]}))
          .on('error', function(err) { console.error('ERROR:',err.message); })
          // .pipe(htmlmin({collapseWhitespace: true}))
          .pipe(gulp.dest(DEST+'/'));
  } catch (error) {
    console.error(error)
    return error
  }
}



gulp.task('build-home', buildHome);
gulp.task('build-hotels', buildHotels);
gulp.task('build-hotel', buildHotel)


// gulp.task('watch', function() {
//   ENVIRONMENT = 'dev';
//   // Watch .html files
//   gulp.watch('src/*.html', browserSync.reload);
//   // Watch .js files
//   gulp.watch('src/js/*.js', ['scripts']);
//   // Watch .css files
//   gulp.watch(['src/css/*.css', 'src/css/**/*.css'], ['css-minify']);

//   buildJS();
//   buildCSS();
// });

