var kissManga = require('./kissMangaV2.js');
var batoto = require('./batoto.js');
var mangaDB = require('../config/mangaDB.js');

// app/routes.js
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });
    app.get('/test', function(req, res) {
        //kissManga.getChapters('http://kissmanga.com/Manga/Rough-Sketch-Senpai');
        //kissManga.getMangaChapterPages('http://kissmanga.com/Manga/Rough-Sketch-Senpai/Vol-001-Ch-001--Why-Does-It-Have-to-Be-Me-?id=344254');
        //kissManga.getMangaDatabase('http://kissmanga.com/MangaList?page=');
        //batoto.getMangaDatabase('');
        batoto.getChapters('http://bato.to/comic/_/comics/tsugumomo-r4271');
        /*
        var tmp = {
          mangaUrl : 'ahttp://kissmanga.com/Manga/Grand-Blue/Vol-002-Ch-008--Boycon?id=315193',
          mangaName: 'aGrand-Blue'
        };
        mangaDB.newMangaEntry(tmp);
        */
        res.render('test.ejs'); // load the index.ejs file
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
