var kissManga = require('./kissMangaV2.js');
var batoto = require('./batoto.js');
var mangaDB = require('../config/mangaDB.js');
var mangaUserDB = require('../config/mangaUserDB')

var Q = require('q');

//batoto.login();
//batoto.getChapters('http://bato.to/comic/_/rough-sketch-senpai-r20617');
// app/routes.js
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });
    app.get('/batoto/manga/:mangaName', function(req,res) {
      //console.log('User Accessed: ' + req.params.mangaName);

      if(req.query.fav == 'true') {
        console.log("Current UserID: " + req.user.google.id);
        console.log("Trying to add manga: " + req.params.mangaName)
        var tmp = { userID : req.user.google.id, mangaName : req.params.mangaName}
        mangaUserDB.addNewManga(tmp)
        .then(function(manga) {
          if(manga === null) throw new Error('No manga was found');
          res.redirect('/batoto/manga/' + req.params.mangaName);
        })
        .catch(function(err) {
          console.error('Something went wrong: ' + err);
          res.send('404 Error URL does not exist', 404);
        })
        .done(function(manga) {
          console.log('Finished sending request');
        })
      }
      else {
        mangaDB.getManga(req.params.mangaName)
        .then(function(manga) {
          if(manga === null) throw new Error('No manga was found');
          return manga;
        })
        .then(function(manga) {
          if(manga.genres.length > 0) {
            //console.log('Sending this Manga to client: ' + manga);
            res.render('mangaPage.ejs', {
              manga : manga,
              user : req.user
            });
          }
          else {
            batoto.getMangaInfoAndChaptersLive('http://bato.to/comic/_/' + req.params.mangaName, function(manga) {
              //console.log("Send this manga to client LIVE: " + manga);
              res.render('mangaPage.ejs', {
                manga : manga,
                user : req.user
              });
            })
          }
        })
        .catch(function(err) {
          console.error('Something went wrong: ' + err);
          res.send('404 Error URL does not exist', 404);
        })
        .done(function(manga) {
          console.log('Finished sending request');
        })
        //batoto.getChapters('http://bato.to/comic/_/' + req.params.mangaName);
      }
    });

    app.get('/batoto/manga/:mangaName/:chapterUrl', function(req,res) {
      console.log('User Accessed: ' + req.params.mangaName + ' ' + req.params.chapterUrl);
      batoto.getMangaChapterPages(req.params.chapterUrl, function(data) {
        res.render('mangaChapterPage.ejs', {
          data : data
        })
      });
      /*
      Q.fcall(batoto.getMangaChapterPages(req.params.chapterUrl))
      .then(function (data) {
        console.log('then');
        console.log(data);
        return data;
      })
      .catch(function(err) {

      })
      .done(function(data) {
        res.render('mangaChapterPage.ejs', {
          data : data
        });
      });*/
    });

    app.get('/batoto/favorites', isLoggedIn, function(req,res) {
      mangaUserDB.getUserDB(req.user.google.id)
      .then(function(mangas) {
        console.log(mangas);
        mangas[0].mangas.forEach(function(item) {
          console.log(item);
        })
        res.render('favorites.ejs', {
          mangas : mangas[0].mangas
        });
      });
    })

    app.get('/batoto/mangalisting', function(req, res) {
        mangaDB.getMangas()
        .then(function(mangas) {
          console.log(mangas);
          return mangas;
        })
        .catch(function(err) {
          console.error('Something went wrong: ' + err);
        })
        .done(function(manga) {
          res.render('mangaListing.ejs', {
              manga : manga // get the user out of session and pass to template
          });
        });
    });

    app.get('/batoto/searchResults', function(req, res) {
      console.log("Search Results: " + req.query.searchKeyword);
      if(req.query.searchKeyword == '') {
        res.render('mangaSearchResults.ejs', {
          manga : [{}]
        });
      }
      else {
        mangaDB.getMangas(req.query.searchKeyword)
        .then(function(mangas) {
          console.log(mangas);
          return mangas;
        })
        .catch(function(err) {
          console.error('Something went wrong: ' + err);
        })
        .done(function(manga) {
          res.render('mangaSearchResults.ejs', {
              manga : manga // get the user out of session and pass to template
          });
        });
      }
    });

    app.get('/test', function(req, res) {
      Q.fcall(batoto.getMangaChapterPages('2e0b4adca36fa1ff'))
      .then(function (data) {

      })
      .catch(function(err) {

      })
      .done(function() {
        res.render('test.ejs');
      });

        //kissManga.getChapters('http://kissmanga.com/Manga/Rough-Sketch-Senpai');
        //kissManga.getMangaChapterPages('http://kissmanga.com/Manga/Rough-Sketch-Senpai/Vol-001-Ch-001--Why-Does-It-Have-to-Be-Me-?id=344254');
        //kissManga.getMangaDatabase('http://kissmanga.com/MangaList?page=');
        //batoto.getMangaDatabase('');
        //batoto.getChapters('http://bato.to/comic/_/comics/tsugumomo-r4271');
        /*
        mangaDB.getMangas()
        .then(function(mangas) {
          console.log(mangas);
          return mangas;
        })
        .catch(function(err) {
          console.error('Something went wrong: ' + err);
        })
        .done(function(manga) {
          res.render('mangaListing.ejs', {
              manga : manga // get the user out of session and pass to template
          });
          //mongoose.disconnect();
        });

        /*
        Q.fcall(function () {
          console.log('Stage 1');
        })
        .then(mangaDB.getAllManga())
        .then(function (value) {
          console.log('Stage 2');
          return value;
        })
        .then(function(value) {
          console.log('Finally: ');
          return value;
        })
        .catch(function (error) {

        })
        .done(function (value) {
          console.log("Done" + value);
          console.log("Done2");
          res.render('test.ejs'); // load the index.ejs file
        });
        console.log('When');

        /*
        var tmp = {
          mangaUrl : 'ahttp://kissmanga.com/Manga/Grand-Blue/Vol-002-Ch-008--Boycon?id=315193',
          mangaName: 'aGrand-Blue'
        };
        mangaDB.newMangaEntry(tmp);
        */

    });

    app.get('/ereader', function(req, res) {
        res.render('ereader.ejs'); // load the index.ejs file
    });

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
