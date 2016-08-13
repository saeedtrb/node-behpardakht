# node-behpardakht
this is a JavaScript Class for work with BehPardakht API
```javascript
var behPardakht = new require("beh-pardakht");
behPardakht.bpPayRequest( transactionId , amountCharge , desc , function( err , refId ){
	if( err ){
		/*
			err.message  is exception message or bank answer when payment is not success
			err.statusCode    500 is server error 406 is behPardakht error
			err.resCode 	  behpardakht answer code
		*/
		return next( err );
	}else{
		// redirect to bank with refId
	}
});
````
