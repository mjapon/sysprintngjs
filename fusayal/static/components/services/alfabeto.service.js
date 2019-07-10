/**
 * Created by serviestudios on 04/12/15.
 */
(function(module){
    'use strict';
    module.service("AlfabetoServ", AlfabetoServ);

    function AlfabetoServ(){
        this.abecedario = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
        this.get_letra = function(number){
            //Retorna dado un numero su representacion en alfabeto
            if (number>27){
                return "";
                //TODO: Implementar logica para retornas A1 A2...si se sobrepasa el numero maximo del alfabeto
            }
            else{
                return this.abecedario[number-1];
            }
        }
    }

})(IsyplusApp);