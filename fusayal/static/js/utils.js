//Funcion para limpiar session storage, se usa en cada uno de los enlaces
function limpiaSessionStorage(){
    for (var k in window.sessionStorage){
        if (window.sessionStorage.hasOwnProperty(k)) {
            var item = window.sessionStorage[k];
            if ((item === null || item === 'null') || (k !== 'refopc' && k !== 'artopc' && k !== 'artdefpre')) {
                delete window.sessionStorage[k];
            }
        }
    }
};

//Configuracion para jquery
function setupJQuery(){
    $.ajaxSetup ({
        cache: false
    });
    if($("#msgModalBody").children().length > 0) {
        $('#msgModal').modal('show');
    }
}
