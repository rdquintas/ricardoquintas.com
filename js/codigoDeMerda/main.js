// define AboutMe as a global variable to avoid circular dependencies between the app and its modules
var AboutMe;

require(['globals'],
function(g) {
	'use strict';

	var reqs = [];

	//add common
	reqs.push('compiled/common');

	if (g.PAGE !== 'user') {
		reqs.push('compiled/nonprofile');
		// TODO can we get rid of this?
		define('data/user',function() {
			return {
				Settings: {}
			};
		});
	}

	// console.log(reqs);
	// load compiled dependencies & then load the app
	require(reqs, function() {
		require(['app']);
	});

});
