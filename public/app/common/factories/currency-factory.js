'use strict';

/* @ngInject */
var CurrencyFactory = function ($http, $log, endpoints, dnbStorageFactory) {


    var exchangeList = ['USD', 'GBP', 'EUR', 'CAD'];
    var sessionObj = {};
    var currencyPreference;
    var targetEndpoint = endpoints.currency.dailyExchangeRate;

    function getExchangeRate(base, desired) {
        if(dnbStorageFactory.sessionGet('rates') !== null){
            return;
        }else{

            if(desired.constructor === Array){
                for(var i = 0; i < desired.length; i++){
                    if(i === 0){
                        targetEndpoint = targetEndpoint.replace(':base', base).replace(':desired', desired[i]);
                    }else{
                        targetEndpoint = targetEndpoint.concat('&to=' + desired[i]);
                    }
                }
            }else{
                targetEndpoint = targetEndpoint.replace(':base', base).replace(':desired', desired);
            }

            return $http.get(targetEndpoint).then(function(result){
            if(result.data.length === 0){
                return;
            }else{
                for(var obj in result.data){
                    if(dnbStorageFactory.sessionGet(result.data[obj].to.toUpperCase()) === null){
                        sessionObj[result.data[obj].to.toUpperCase()] =  1 / result.data[obj].exhchangeRate;
                    }
                }
                dnbStorageFactory.sessionSet('rates', sessionObj);
                return result.data;
            }
        },function(error){
            $log.error(error);
            return;
        });
        }
    }

    function setExchangeRate(code, amount){
        if(code === null || amount === null){
            return;
        }else{
            if(dnbStorageFactory.sessionGet(code) === null){
                dnbStorageFactory.sessionSet(code, amount);
            }else if(dnbStorageFactory.sessionGet(code) !== amount){
                dnbStorageFactory.sessionSet(code, amount);
            }
            return;
        }
    }

    var init = function(){
        currencyPreference = dnbStorageFactory.localGet('geo-details').currency_code;
        var index = 0;
        var tempArray = exchangeList.slice(0);
        while(index < tempArray.length){
            if(dnbStorageFactory.sessionGet(exchangeList[index]) !== null){
                tempArray.splice(index,1);
            }else{
                index++;
            }
        }
        getExchangeRate(currencyPreference, tempArray);
    };

    var applyRates = function(){
        if(dnbStorageFactory.sessionGet('rates') === null){
            init();
        }
        return;
    };

    return {
        getExchangeRate : getExchangeRate,
        currencyPreference : currencyPreference,
        setExchangeRate : setExchangeRate,
        applyRates : applyRates
    };
};

module.exports = CurrencyFactory;


