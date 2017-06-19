// load up the user model
var Manga           = require('../app/models/manga');


var newMangaEntry = function(newManga) {
  console.log('Trying to insert ' + newManga.length + ' mangas');
  Manga.insertMany(newManga, function(error, docs) {});

  /*
  Manga.findOne({ 'mangaUrl' : newManga.mangaUrl}, function(err, manga) {
    if(err)
      return false;
    if(manga) {
      console.log("Tried adding entry that already existed");
      return false;
    }
    else {
      //console.log('Trying to add new entry');
      //console.log(newManga.mangaUrl);
      //console.log(newManga.mangaName);
      var newMangaEntry = new Manga();
      newMangaEntry.mangaUrl = newManga.mangaUrl;
      newMangaEntry.mangaName = newManga.mangaName;

      newMangaEntry.save(function(err) {
        if(err)
          throw err;
        return true;
      })
    }
  })
  */
};

exports.newMangaEntry = newMangaEntry;
