
"use strict";
var paytm_config = require('../paytm/paytm_config').paytm_config;
var paytm_checksum = require('../paytm/checksum');
var querystring = require('querystring');

const userRoutes = (app, fs) => {

    // CREATE
    app.post('/generate_checksum', (req, res) => {

        // readFile(data => {
        //     const newUserId = Object.keys(data).length + 1;

        //     // add the new user
        //     data[newUserId.toString()] = req.body;

        //     writeFile(JSON.stringify(data, null, 2), () => {
        //         res.status(200).send('new user added');
        //     });
        // },
        //     true);

        console.log("/generate_checksum");
			if(req.method == 'POST'){
				console.log("bidy->",req.body);
			var paramarray = {};
				paramarray['MID'] = req.body.MID; 
				paramarray['ORDER_ID'] = req.body.ORDER_ID;
				paramarray['CUST_ID'] = req.body.CUST_ID;
				paramarray['INDUSTRY_TYPE_ID'] = req.body.INDUSTRY_TYPE_ID;
				paramarray['CHANNEL_ID'] = req.body.CHANNEL_ID;
				paramarray['TXN_AMOUNT'] = req.body.TXN_AMOUNT;
				paramarray['WEBSITE'] = req.body.WEBSITE;
				paramarray['CALLBACK_URL'] = req.body.CALLBACK_URL;
				paramarray['EMAIL'] = req.body.EMAIL;
				paramarray['MOBILE_NO'] = req.body.MOBILE_NO;
					paytm_checksum.genchecksum(paramarray, paytm_config.MERCHANT_KEY, function (err, checksum) {
						console.log('Checksum: ', checksum, "\n");
						res.writeHead(200, {'Content-type' : 'text/json','Cache-Control': 'no-cache'});
						var resDic = {};
						resDic["Checksum"] = checksum;
						res.write(JSON.stringify(resDic));
						res.end();
					});
			}else{
				res.writeHead(200, {'Content-type' : 'text/json'});
				res.end();
			}
    });

    // CREATE
    app.post('/verify_checksum', (req, res) => {

        if(req.method == 'POST'){
            var fullBody = '';
            req.on('data', function(chunk) {
                fullBody += chunk.toString();
            });
            req.on('end', function() {
                var decodedBody = querystring.parse(fullBody);
                
                console.log(decodedBody);

                // get received checksum
                var checksum = decodedBody.CHECKSUMHASH;

                // remove this from body, will be passed to function as separate argument
                delete decodedBody.CHECKSUMHASH;

                res.writeHead(200, {'Content-type' : 'text/html','Cache-Control': 'no-cache'});
                if(paytm_checksum.verifychecksum(decodedBody, paytm_config.MERCHANT_KEY, checksum)) {
                    console.log("Checksum Verification => true");
                    res.write("Checksum Verification => true");
                }else{
                    console.log("Checksum Verification => false");
                    res.write("Checksum Verification => false");
                }
                 // if checksum is validated Kindly verify the amount and status 
                 // if transaction is successful 
                // kindly call Paytm Transaction Status API and verify the transaction amount and status.
                // If everything is fine then mark that transaction as successful into your DB.			
                
                res.end();
            });
        }else{
            res.writeHead(200, {'Content-type' : 'text/json'});
            res.end();
        }
    });

    
};