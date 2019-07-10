/**
 * Created by serviestudios on 05/02/16.
 */
(function (module) {

    'use strict';
    module.factory("AnimHttpInterceptor", AnimHttpInterceptor);

    function AnimHttpInterceptor($q, $rootScope) {
        var numRequests = 0;
        return {
            request : function(config) {
                if(++numRequests > 0) $rootScope.$broadcast('loading:progress');
                if (config.url.indexOf("/rest")==0){
                    config.url = (parseInt(globalModoDespligeApp)==2? "/v2":"") +config.url;
                }
                return config || $q.when(config);
            },
            requestError : function(rejection) {
                return $q.reject(rejection);
            },
            response : function(response) {
                if(--numRequests === 0) $rootScope.$broadcast('loading:finish');
                return response || $q.when(response);
            },
            responseError : function(rejection) {
                if(--numRequests === 0) $rootScope.$broadcast('loading:finish');
                //var msg_error = "[ERROR]:VERIFIQUE SU CONEXIÓN A INTERNET";
                var ss_expirada = 0;
                var error_code = 0;
                var msg = "VERIFIQUE SU CONEXIÓN A INTERNET";
                if (rejection.data){

                    console.log("rejection.data--->", rejection.data);

                    ss_expirada = rejection.data['ss_expirada']||0;
                    error_code = rejection.data['error_code']||'';
                    msg = rejection.data['msg']||'';
                    //msg_error = "[ERROR]:" + msg + "\n[CÓDIGO]:"+error_code;
                    if (rejection.data['inputid']){
                        try{
                            var selector = "#"+rejection.data['inputid'];
                            $(selector).focus().blur(function(){
                                $(selector).parent().removeClass("has-error");
                            }).parent().addClass("has-error");
                        }
                        catch(e){}
                    }
                }
                if (ss_expirada===0){

                    //Verificar si se debe mostrar mensaje con sweet alert
                    var level = "error";
                    if (error_code===100){
                        level = "info";
                    }
                    else if (error_code===101){
                        level = "warning";
                    }
                    else if (error_code===102){
                        level = "error";
                    }
                    //alert(msg_error);

                    setTimeout(function(){
                        try{
                            swal({title:"",
                            text:msg,
                            type:level});
                            console.log("swal mostrado--->");
                        }
                        catch(ex){
                            console.log("Error al mostrar swal", ex);
                            alert(msg);
                        }
                    }, 600);
                }
                else{
                    try{
                        swal({title:"Sessión expirada!",
                            text:"Tu sesión ha expirado por favor ingresa de nuevo al sistema!",
                            type:"error"},
                            function(){
                                var uri=parseInt(globalModoDespligeApp) == 2 ? '/v2' : '/';
                                window.location = uri;
                            }
                        );
                    }
                    catch(e){
                        alert("Tu sesión ha expirado por favor ingresa de nuevo al sistema");
                    }
                }
                return $q.reject(rejection);
            }
        };
    }
})(IsyplusApp);