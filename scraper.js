var accountSid = 'yourkeyhere';
var authToken  = 'yourtokenhere';

var fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    client = require('twilio')(accountSid, authToken);

url = 'http://www.apple.com/shop/browse/home/specialdeals/mac/macbook_pro/13';
request(url, function(error, response, html) {
    var price;
    var json = {
        price: ""
    };
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);

		var product = $('body').find('.product').first();
		var price = product.find("span[itemprop='price']");

        price.each(function(i, element) {
		    var el = $(this);
	        var price = el.text();
	        json.price = price;
			fs.readFile('price.json', function(err, data) {
			    if (err) throw err;
			    var obj = JSON.parse(data);
			    if (obj.price != price) {
			        console.log('Price has changed.');
			        fs.writeFile('price.json', JSON.stringify(json, null, 4), function(err) {
			            console.log('Price saved in price.json file');
			        });
			    }

				if (obj.price != price) {
				    console.log('Price has changed sending text!');

				    client.messages.create({
				    from: 'num', //Your Twilio number
				    to: 'num', //Your phone number
				    body: "The price has changed to: " + price + " from " + obj.price
				    });

				    fs.writeFile('price.json', JSON.stringify(json, null, 4), function(err) {
				    console.log('Price saved in price.json file');
				    });
				}
			})
        })
    }
});


