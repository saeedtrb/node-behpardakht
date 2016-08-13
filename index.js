/*=========== In The Name Of Allah =============
 * Version: 1.0.0
 * Date Create: 16/08/2015
 * Author : Saeed Torabi <saeed_trb@yahoo.com>
 ===============================================*/
var soap    = require('soap'),
	_       = require('underscore'),
    moment  = require("moment-jalaali");

function BehPardakht( options ){
    this.options = _.extend({
        test        		: true ,
        callbackURL         : "",
        testServer  		: "https://pgwstest.bpm.bankmellat.ir/pgwchannel/services/pgw?wsdl",
        testPaymentGeteway 	: "https://pgwtest.bpm.bankmellat.ir/pgwchannel/startpay.mellat",
        mainServer  		: "https://pgws.bpm.bankmellat.ir/pgwchannel/services/pgw?wsdl",
        mainPaymentGeteway  : "https://pgw.bpm.bankmellat.ir/pgwchannel/illegaloperation.mellat",
        terminalId 			: 123355 , 	// type long
        userName    		: '' 	,  	// type string 
        userPassword    	: '' 		// type string 
    }, options );

    this.initialize();
}
BehPardakht.prototype = {
    /*--------------------------------------------------------------------------------------------
     ---------------------------------------- Error Section --------------------------------------
     --------------------------------------------------------------------------------------------*/
    errorCode : {
        0   : "تراكنش با موفقيت انجام شد" ,
        11  : "شماره كارت نامعتبر است" ,
        12  : "موجودي كافي نيست" ,
        13  : "رمز نادرست است" ,
        14  : "تعداد دفعات وارد كردن رمز بيش از حد مجاز است" ,
        15  : "كارت نامعتبر است" ,
        16  : "دفعات برداشت وجه بيش از حد مجاز است" ,
        17  : "كاربر از انجام تراكنش منصرف شده است" ,
        18  : "تاريخ انقضاي كارت گذشته است" ,
        19  : "مبلغ برداشت وجه بيش از حد مجاز است" ,
        21  : "پذيرنده نامعتبر است" ,
        23  : "خطاي امنيتي رخ داده است" ,
        24  : "اطلاعات كاربري پذيرنده نامعتبر است" ,
        25  : "مبلغ نامعتبر است" ,
        31  : "پاسخ نامعتبر است" ,
        32  : "فرمت اطلاعات وارد شده صحيح نمي باشد" ,
        33  : "حساب نامعتبر است" ,
        34  : "خطاي سيستمي" ,
        35  : "تاريخ نامعتبر است" ,
        41  : "شماره درخواست تكراري است" ,
        42  : "تراكنش Sale يافت نشد" ,
        43  : "قبلا درخواست Verify داده شده است" ,
        44  : "درخواست Verfiy يافت نشد" ,
        45  : "تراكنش Settle شده است" ,
        46  : "تراكنش Settle نشده است",
        47  : "تراكنش Settle يافت نشد" ,
        48  : "تراكنش Reverse شده است" ,
        49  : "تراكنش Refund يافت نشد" ,
        51  : "تراكنش تكراري است" ,
        54  : "تراكنش مرجع موجود نيست" ,
        55  : "تراكنش نامعتبر است" ,
        61  : "خطا در واريز" ,
        111 : "صادر كننده كارت نامعتبر است" ,
        112 : "خطاي سوييچ صادر كننده كارت" ,
        113 : "پاسخي از صادر كننده كارت دريافت نشد" ,
        114 : "دارنده كارت مجاز به انجام اين تراكنش نيست" ,
        412 : "شناسه قبض نادرست است" ,
        413 : "شناسه پرداخت نادرست است" ,
        414 : "سازمان صادر كننده قبض نامعتبر است" ,
        415 : "زمان جلسه كاري به پايان رسيده است" ,
        416 : "خطا در ثبت اطلاعات" ,
        417 : "شناسه پرداخت كننده نامعتبر است" ,
        418 : "اشكال در تعريف اطلاعات مشتري" ,
        419 : "تعداد دفعات ورود اطلاعات از حد مجاز گذشته است" ,
        421 : "IPنامعتبر است",
        500 : "خطای داخلی برنامه"
    },
    /**
     * Send message to a number
     *
     * @param   string          phoneNumber
     * @param   string|false    text
     * @return  true || false
     */
    getErrorText : function( errorCode ){
        return this.errorCode[errorCode] || null
    },
    initialize : function(){},
    /**
     * Send message to a number
     * @return  Server URL
     */
    getServiceURL : function(){
    	return this.options.test ? this.options.testServer : this.options.mainServer;
    },
    /*--------------------------------------------------------------------------------------------
     --------------------------------- SOAP Working ----------------------------------------------
     --------------------------------------------------------------------------------------------*/
     /**
     * call soap method
     *
     * @param   string          phoneNumber
     * @param   string|false    text
     * @return  true || false
     */
    call        : function(  method , params , callback ){
    	callback        = callback || function(){};
    	var serviceURL 	= this.getServiceURL(),
    		self     	= this;

		params = _.extend( params , {
			terminalId 			: this.options.terminalId ,
			userName    		: this.options.userName, 
			userPassword    	: this.options.userPassword	
		})
        try{
            soap.createClient( serviceURL , function( err, client ) {
                if( err )
                    return callback( err );
                try{
                    var fn = client[method] || null;
                    if( _.isFunction( fn ) ){
                        return fn( function( err , result ){
                            if( err )
                                return callback( err );
                            return callback( null , result.return );
                        });
                    }else{
                        return callback( this.createError( "Method not found" , 404 ) );
                    }
                }catch( err ){
                    return callback( this.createError( err.message , 500 ) );
                }
            });
        }catch( err ){
            return callback( this.createError( err.message , 500 ) );
        }
		
    },
    createError   : function( message , statusCode , resCode ){
        if( _.isNumber( message ) ){
            statusCode = message;
            message    = null;
        }
        var BehPardakhtError = function() {
            this.name 		    = 'BehPardakht';
            this.message 		= message    || 'Rquest is not valid';
            this.statusCode     = statusCode || 500;
            this.resCode 	    = resCode    || null;
            this.stack          = (new Error()).stack;
        }

        BehPardakhtError.prototype 				= Object.create(Error.prototype);
        BehPardakhtError.prototype.constructor 	= BehPardakhtError;
        return new BehPardakhtError;
    },
    /*--------------------------------------------------------------------------------------------
	 --------------------------------- API Beh Pardakht ------------------------------------------
	 --------------------------------------------------------------------------------------------*/
	/**
	* call soap method
	*
	* @param   long  			orderId
	* @param   long  			amount
	* @param   string  			localDate
	* @param   string  			localTime
	* @param   string  			additionalData 	maxLength 1000 char
	* @param   string  			callBackUrl
	* @param   long  			payerId
	* --------------------------------------------------------------
	* @return  string 			ResCode,RefId	// ResCode is status code :: 0 is ok when 0 < ResCode this.errorCode[ResCode] || RefId type Hashcode for transform client to Payment gateway
	*/
	bpPayRequest : function( orderId , amount , desc , callback ){
        if( _.isFunction( desc ) ){
            callback = desc;
            desc     = "";
        }

		var self    = this,
            params  = {
                orderId         : orderId,
                amount          : amount ,
                additionalData  : desc,
                localDate       : moment().format('YYYYMMD') ,
                localTime       : moment().format('HHmmss') ,
                callBackUrl     : this.options.callbackURL ,
                payerId         : 0  
            };
		return this.call( "bpPayRequest" , params , function( err , result ){
            if( err )
                return callback( err );

            try{
                var response = result.split(",");
                if( response[0] > 0 ){ // response has error
                    return callback( self.createError( self.getErrorText( response[0] ) , 406 , response[0] ) );
                }else
                    return callback( null , response[1] );
            }catch( err ){
                return callback( self.createError( err.message , 500 ) );
            }
		})
	},
	/**
	* call soap method
	*
	* @param   long  			orderId
	* @param   long  			saleOrderId
	* @param   long  			saleReferenceId
	* --------------------------------------------------------------
	* @return  string 			ResCode :: when 0 then transaction is success when 0 < ResCode this.errorCode[ResCode]
	*/
	bpVerifyRequest : function( params , callback ){
		return this.call( "bpVerifyRequest" , params , callback )
	},
	/**
	* call soap method
	*
	* @param   long  			orderId
	* @param   long  			saleOrderId
	* @param   long  			saleReferenceId
	* --------------------------------------------------------------
	* @return  string 			ResCode :: when 0 then transaction is success when 0 < ResCode this.errorCode[ResCode]
	*/
	bpSettleRequest : function( params , callback ){
		return this.call( "bpSettleRequest" , params , callback )
	},
	/**
	* call soap method
	*
	* @param   long  			orderId
	* @param   long  			saleOrderId
	* @param   long  			saleReferenceId
	* --------------------------------------------------------------
	* @return  string 			ResCode :: when 0 then transaction is success when 0 < ResCode this.errorCode[ResCode]
	*/
	bpInquiryRequest : function( params , callback ){
		return this.call( "bpInquiryRequest" , callback )
	},
	/**
	* call soap method
	*
	* @param   long  			orderId
	* @param   long  			saleOrderId
	* @param   long  			saleReferenceId
	* --------------------------------------------------------------
	* @return  string 			ResCode :: when 0 then transaction is success when 0 < ResCode this.errorCode[ResCode]
	*/
	bpReversalRequest : function(  params , callback ){
		return this.call( "bpInquiryRequest" ,params , callback );
	},
}
module.exports = BehPardakht;
