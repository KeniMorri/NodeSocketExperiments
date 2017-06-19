var Nightmare = require('nightmare');
var mangaDB = require('../config/mangaDB.js')

var setupNightmare = function() {
	var nightmare = Nightmare({
		show: true,
		typeInterval: 20,
		openDevTools: {
    mode: 'detach'
  	},
		webPreferences: {
        images: false
    }
	})
	return nightmare;
}

var login = function(callback) {
	var nightmare = setupNightmare();
	nightmare
		.goto('https://bato.to/forums/index.php?app=core&module=global&section=login')
		.wait('input#ips_username')
		.type('input#ips_username', 'anonjoosh')
		.type('input#ips_password', '4311')
		.click('form#login > fieldset.submit:nth-child(5) > input.input_submit:nth-child(1)')
		.wait('#user_link')
		.evaluate(function () {
		})
		.then(function(result) {
			console.log("Leaving");
			return nightmare;
		})
		.catch(function (error) {
			console.error('Search failed: ', error);
	});
	return nightmare;
}

var getChapters = function(mangaUrl) {
	var nightmare = login();
	nightmare
		.wait(5000)
		.wait('#user_link')
		.goto(mangaUrl)
		.wait('h3.maintitle')
		.exists('tr.lang_English')
		.evaluate(function() {
			var returnValue = {};
			var altnames = document.querySelectorAll('table.ipb_table')[0].querySelectorAll('td')[1].innerText;
			var author = document.querySelectorAll('table.ipb_table')[0].querySelectorAll('td')[3].innerText;
			var artist = document.querySelectorAll('table.ipb_table')[0].querySelectorAll('td')[5].innerText;
			var genre = document.querySelectorAll('table.ipb_table')[0].querySelectorAll('td')[7].innerText;
			genre = genre.split(' ');
			genre.shift();
			var desc = document.querySelectorAll('table.ipb_table')[0].querySelectorAll('td')[13].innerText;

			returnValue['mangaInfo'] = {altnames: altnames, author: author, artist: artist, genre: genre, desc: desc};

			var fullList = document.querySelectorAll('tr.lang_English');
			for(var i = 0; i < fullList.length; i++) {
				var chapters = fullList[i];
				var href = chapters.querySelectorAll('td')[0].querySelector('a').href;
				var cName = chapters.querySelectorAll('td')[0].querySelector('a').innerText;
				cName = cName.trim();
				var sort = chapters.querySelectorAll('td')[0].querySelector('a').title.split('|')[1].split(':')[1].split(' ')[1];
				var date = chapters.querySelectorAll('td')[4].innerText;
				//Insert Date parsing here
				returnValue[i] = {url: href, cName: cName, sort: sort, date: date};
			};
			return returnValue;
		})
		.then(function(result) {
			console.log(result)
		})
		.catch(function (error) {
			console.error('Search Failed: ', error);
		});
}
//asdf
var getMangaDatabase = function() {
	console.log('starting getMangaDatabase batoto');
	var nightmare = setupNightmare();
	nightmare
		.goto('https://bato.to/forums/index.php?app=core&module=global&section=login')
		.wait('input#ips_username')
		.type('input#ips_username', 'anonjoosh')
  	.type('input#ips_password', '4311')
  	.click('form#login > fieldset.submit:nth-child(5) > input.input_submit:nth-child(1)')
		.wait('#user_link')
		.evaluate(function () {
		})
		.then(function(result) {
			var page = 183;
			getMangas(nightmare,'https://bato.to/search?&p=', page);
		})
		.catch(function (error) {
			console.error('Search failed: ', error);
		});

};

var getMangas = function(nightmare, mangaListUrl,  page) {
	console.log("Running for Page: " + page);
	nightmare
		.goto(mangaListUrl + page)
		.wait('#comic_search_results table tbody tr')
		.evaluate(function () {
			var returnValue = {};
			var fullList = document.querySelectorAll('#comic_search_results table tbody tr');
			for(var i = 0; i < (fullList.length - 1);i++) {
				if(i % 2) {
					var mangaTitle= fullList[i].querySelectorAll('td')[0].querySelectorAll('a')[1].innerText;
					var href = fullList[i].querySelectorAll('td')[0].querySelectorAll('a')[1].href;
					var auth = fullList[i].querySelectorAll('td')[1].innerText;
					var date = fullList[i].querySelectorAll('td')[5].innerText;
					returnValue[href] = {mName: mangaTitle, author: auth, date: date};
				}
			}
			return returnValue;
		})
		.then(function(result) {
			console.log("Running for Page: " + page);
			var mangalist = [];
			for (var key in result) {
				var url = key;
				var tmp = result[key];
				var mName = tmp['mName'];
				var mName = mName.trim();
				//console.log("MangaName: " , mName);
				var author = tmp['author'];
				var date = tmp['date'];
				//console.log("Date:" + date);
				if(date != '--') {
					var split = date.split(' ');
					var day = split[0];
					if(day[0] == 0) day = day[1];
					//console.log("Day:" + day);
					var month = split[1];
					if(month == 'January') month = 0;
					else if(month == 'February') month = 1;
					else if(month == 'March') month = 2;
					else if(month == 'April') month = 3;
					else if(month == 'May') month = 4;
					else if(month == 'June') month = 5;
					else if(month == 'July') month = 6;
					else if(month == 'August') month = 7;
					else if(month == 'September') month = 8;
					else if(month == 'October') month = 9;
					else if(month == 'November') month = 10;
					else if(month == 'December') month = 11;
					//console.log("Month:" + month);
					var year = split[2];
					//console.log("Year:" + year);
					var time = split[4].split(':');
					var hour = time[0];
					if(hour[0] == 0) hour = hour[1];
					//console.log("Hour:" + hour);
					var minute = time[1];
					if(minute[0] == 0) minute = minute[1];
					//console.log("Minute:" + minute);
					var ampm = split[5];
					if(ampm == 'PM') {
						if(hour != 12)	hour = parseInt(hour) + 12;
					}
					//console.log("Hour:" + hour);
					date = new Date(year, month, day, hour, minute)
					/*
					console.log("Final Date No mod: " + date);
					console.log("Final Date Asking for it json: " + date.toJSON());
					console.log("Final Date Asking for it gmt: " + date.toGMTString());
					console.log("Final Date Asking for it to string: " + date.toLocaleDateString());
					console.log("Final Date Asking for it utc: " + date.toUTCString());*/
					mangalist.push( { mangaUrl: key, mangaName: mName, author: author , lastUpdated: date});
				}
				else mangalist.push( { mangaUrl: key, mangaName: mName, author: author });
			}
			//console.log(mangalist);
			mangaDB.newMangaEntry(mangalist);
			getMangas(nightmare, mangaListUrl, ++page);
		})
		.catch(function (error) {
			nightmareEnd(nightmare);
			console.error('Search failed: ', error);
		});
}

var nightmareEnd = function(nightmare) {
	nightmare
		.end();
}



var getMangaChapterPages = function(mangaChapterUrl) {
	var nightmare = setupNightmare();
	nightmare
		.goto(mangaChapterUrl)
		.wait('select#selectReadType')
		.select('select#selectReadType', 1)
		.wait('div#divImage > p:nth-child(2) > img:nth-child(1)')
		.evaluate(function() {
			var returnValue = {};
			var len = document.querySelectorAll('#divImage p img').length;
			for(var i = 0; i< len; i++) {
				var href = document.querySelectorAll('#divImage p img')[i].src;
				returnValue[i] = { link: href};
			}
			return returnValue;
		})
		.then(function(result) {
			console.log(result);
			getChapters('http://kissmanga.com/Manga/Rough-Sketch-Senpai');
		})
		.catch(function (error) {
			console.error('Search Failed: ', error);
		});
}

exports.getChapters = getChapters;
exports.getMangaDatabase = getMangaDatabase;
exports.getMangaChapterPages = getMangaChapterPages;
