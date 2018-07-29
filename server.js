var NetSuite = require('./netsuite-request');

for(var i=0; i<5; i++) {

    var url = "/app/site/hosting/restlet.nl?script=123&deploy=1&id=999999";

    NetSuite.get(url, false, function(err, body) {

        if(err) {
            console.log('error: ' + err)
        } else {
            // Do Something with the response
        }
    });

    url = "/app/site/hosting/restlet.nl?script=456&deploy=1";

    NetSuite.post(url, {internalId: "1234"}, false, function(err, body) {

        if(err) {
            console.log('error: ' + err)
        } else {
            // Do Something with the response
        }
    });

}