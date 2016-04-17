import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Twit from 'twit';

import './main.html';

Template.main.helpers({
	currentTemplate() {
		return Session.get('current');
	}
});
//  ##########################################################################################################
Template.default.helpers({
	mess() {
		return Session.get('weather').list[0].weather.description;
	},
	temp() {
		return Math.round(Session.get('weather').list[0].main.temp);
	},
	hum() {
		return Session.get('weather').list[0].main.humidity;
	},
	news() {
		return Session.get('news');
	},
})
Template.stocks.helpers({
	stocks() {
		return Session.get('stocks');
	}
});

Template.twitter.helpers({
	twitter() {
		return Session.get('twitter');
	}
});

Template.weather.helpers({
	weather() {
		return Session.get('weather');
	}
});

Template.news.helpers({
	news() {
		return Session.get('news');
	}
});

//  ##########################################################################################################


Template.main.onRendered(function() {
	if (annyang) {
		console.log('adding commands');
		var weather = function(){
			$.ajax({
				url: 'http://api.openweathermap.org/data/2.5/forecast?appid=efa17477a7e8b2723afdbee014ae0fba&q=Dallas,TX&units=imperial',
				success: function(res) { Session.set('weather', res) }
			});

			Session.set('current', 'weather');
		};
		weather();
		var news = function(){
			$.ajax({
				url: 'http://api.nytimes.com/svc/topstories/v1/technology.json\?api-key\=5a1cab05d90139b444a6fea74634ecfd:8:75021317',
				success: function(res) { 
					console.log(res);
					Session.set('news', res.results.slice(1, 4)); 

				}
			});

			Session.set('current', 'news');
		};
		news();
		var gmail = function(){
			Session.set('mail', [{sender: 'lanevejulian@gmail.com', subject: 'Test Message', message: 'This is a test message'}, {sender: 'lanevejulian@gmail.com', subject: 'Test Message', message: 'This is a test message'}])
			Session.set('current', 'mail');
		};
		gmail();
		var twitter = function(){
			// var twit = new Twit({
		 //        consumer_key:         '0228FYTHKIN5AGrUVlb1x1yPD', // API key
		 //        consumer_secret:      'BVeZDSQeynuDXzYPEL1SjKS8rI572KABpo6NR0dJwH53RW38gI', // API secret
		 //        access_token:         '3283039405-xRB5POZJZ2BlLjNKRznQnzxAEjEsxv0Lqpi0Xv1', 
		 //        access_token_secret:  'eCaXUqkHPkeS94aL2Qc2Megk5b5Z2jtOhgeSCDZOJDyn6'
		 //    });

		 //    //  search twitter for all tweets containing the word 'banana'
		 //    //  since Nov. 11, 2011
		 //    twit.get('statuses/user_timeline', {
		 //    	count: 10
		 //    }, function(err, data, response) {
		 //    	console.log(data);
		 //    });


		 Session.set('current', 'twitter');
		};
		twitter();
		var stocks = function(){
		// 	historic('GOOG', new Date(2016, 4, 15), new Date(2016, 4, 17), function(err, data) {
		// 		console.log(err, data);
		// 	});
		// 	// $.ajax({
		// 	// 	url: 'http://crossorigin.me/http://finance.yahoo.com/webservice/v1/symbols/AAPL/quote?format=json',
		// 	// 	success: function(res) { console.log(res); Session.set('appleStock', res.list.resources[0].resource.fields) }
		// 	// });
		// 	// $.ajax({
		// 	// 	url: 'http://crossorigin.me/http://finance.yahoo.com/webservice/v1/symbols/GOOG/quote?format=json',
		// 	// 	success: function(res) { Session.set('googleStock', res.list.resources[0].resource.fields) }
		// 	// });
		// 	// $.ajax({
		// 	// 	url: 'http://crossorigin.me/http://finance.yahoo.com/webservice/v1/symbols/CMG/quote?format=json',
		// 	// 	success: function(res) { Session.set('chipotleStock', res.list.resources[0].resource.fields) }
		// 	// });
		// 	// Session.set('stocks', [Session.get('appleStock'), Session.get('googleStock'), Session.get('chipotleStock')]);
		Session.set('current', 'stocks');
	};

	var def = function() {
		Session.set('current', 'default');

	}
	def();
		// stocks();
		//  ##########################################################################################################

		var commands = {
			'(show me) (todays) weather': weather,
			'(show me) (todays) news': news,
			'(show me) (my) (g)(e)mail': gmail,
			'(show) (me) (my) twitter': twitter,
			'(show) (me) (my) tweets': twitter,
			'(show me) (todays) stock(s)': stocks,
			'(go) (show me) home': def,
			'(go) (show me) dashboard': def
		};

		console.log('registering annyang commands');
		annyang.debug();
		annyang.addCommands(commands);

		console.log('starting annyang');
		annyang.start();
	}
});
//  ##########################################################################################################
