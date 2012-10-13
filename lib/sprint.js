var Trello = require('node-trello'),
	moment = require('moment');


var tick = function() { process.stdout.write('.') };

var getsprints = function(api_key, api_token, board_id, callback) {
    var api = new Trello(api_key, api_token);

    api.get('/1/board/' + board_id + '/lists/open', {'cards':'open'}, function(err, lists) {
    	console.log('err' , err)
    	if(err) { 
    		callback(err);
    	} else {
			console.log('Found ' + lists.length + ' lists');
			try {
				var dates = findSprintRange(lists);
				callback(null, {title: 'a title', 'days': dates});
			} catch(err) {
				callback(err);
			} 
    	}
    });
}

var findSprintRange = function(lists) {
	var start;
	var end;
	lists.forEach(function(list) {
		var regx = list.name.match(/Released: (\d{4})-(\d{2})-(\d{2})--(\d{4})-(\d{2})-(\d{2}).*$/);
		if(regx) {
			start = new Date(regx[1], regx[2]-1, regx[3], 12);
			end = new Date(regx[4], regx[5]-1, regx[6], 12);
		}
	});
	if(!start) throw new Error('Couldnt extract sprintrange.');

	var dates = [];
	var s = moment(start).clone().minutes(0).seconds(0).milliseconds(0);
	var f = moment(end).minutes(0).seconds(0).milliseconds(0);
	while(s.unix() != f.unix()) {
		dates.push( {'date': moment(s).clone().toDate(), 'totalpoints':10 , 'donepoints':0 });
		s.add('days', 1);
	}

	return dates;
}

exports.getsprints = getsprints;