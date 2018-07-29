var needle   = require('needle');
var queue = require('queue');


var baseRestURL = "https://rest.netsuite.com";

var options = {
    headers: {
        'Authorization': 'NLAuth nlauth_account=myaccount,nlauth_email=my@email.com,nlauth_signature=mypassword,nlauth_role=3',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

var q = queue({
    concurrency: 1,
    autostart: true
});


function post(url, data, prioritize, cb) {

    addToQueue('post', url, data, prioritize, cb);
}

function get(url, prioritize, cb) {

    addToQueue('get', url, {}, prioritize, cb);
}

function addToQueue(method, url, data, prioritize, cb) {

    if (prioritize) {
        q.unshift(function (qNext) {
            sendRequest(method, url, data, cb, qNext);
        });
    }
    else {
        q.push(function (qNext) {
            sendRequest(method, url, data, cb, qNext);
        });
    }
}


function sendRequest(method, url, data, cb, qNext) {

    console.log('Request sent to NetSuite');

    var fullUrl = baseRestURL + url;

    needle(method, fullUrl, data, options)
        .then(function (response) {

            console.log('Response received from NetSuite');

            if (qNext) {
                qNext();
            }

            if (response.statusCode != 200) {
                var error = new Error("Unexpected Error (Needle): " + response.statusCode);
                error.status = response.statusCode;
                return cb(error)
            } else {
                return cb(null, response.body);
            }

        })
        .catch(function (err) {
            return cb(err)
        });
}


module.exports = {
    post: post,
    get: get
};