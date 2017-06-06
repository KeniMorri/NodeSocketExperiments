const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })

nightmare
  .goto('http://bato.to/comic/_/comics/rough-sketch-senpai-r20617')
	.click('div#secondary_navigation')
	.wait('#sign_in_popup_popup')
	.type('input#ips_username', 'anonjoosh')
	.type('input#ips_password', '4311')
  .click('form#login > div.ipsForm_submit.ipsForm_center.clear:nth-child(7) > input.input_submit:nth-child(1)')
	.wait('#user_link')
  .evaluate(function () {
		return document.querySelectorAll('#content .chapter_row td a')[1].href;
	})
	.end()
	.then(function (result) {
		console.log(result);
	})
	.catch(function (error) {
		console.error('Search Failed:', error);
	});

/*
nightmare
  .goto('http://bato.to/comic/_/comics/rough-sketch-senpai-r20617')
	.click('div#secondary_navigation')
	.wait('#sign_in_popup_popup')
	.type('input#ips_username', 'anonjoosh')
	.type('input#ips_password', '4311')
  .click('form#login > div.ipsForm_submit.ipsForm_center.clear:nth-child(7) > input.input_submit:nth-child(1)')
  .end()
    .then(function (result) {
      console.log(result)
    })
    .catch(function (error) {
      console.error('Error:', error);
    });
*/
