/**
 * Created by serviestudios on 28/01/16.
 */
'use strict';
var globalModoDespligeApp = 0;
var IsyplusApp = angular.
    module('isyplus', [
        'ui.router',
        'ngMask',
        'ui.grid',
        'ui.grid.edit',
        'ui.grid.selection',
        'ui.grid.autoResize',
        'ui.grid.cellNav',
        'ui.grid.pinning',
        'ui.grid.resizeColumns',
        'ngResource',
        'ngDraggable']);
//Editado


/**
 * Created by serviestudios on 28/01/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .config(configIsyplus);

    function configIsyplus($httpProvider){
        //Se pone interceptor
        $httpProvider.interceptors.push('AnimHttpInterceptor');

        //toaster config
        toastr.options = {"timeOut": "4000","positionClass": "toast-bottom-right"};

        /*
          $provide.decorator('$exceptionHandler', ['$log', '$delegate',
          function($log, $delegate) {
            return function(exception, cause) {
              $log.debug('EEERRRR --->Default exception handler.');
              $delegate(exception, cause);
            };
          }
        ]);
        */

    }

})();
/**
 * Created by serviestudios on 28/01/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .run(onIsyplusRun);

    function onIsyplusRun($rootScope, ajaxAnimService, sideBarService){
        $rootScope.$on('loading:progress', function(){
            ajaxAnimService.show(true);
        });
        $rootScope.$on('loading:finish', function(){
            ajaxAnimService.show(false);
        });

        $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
            try{
                scrollView($("#app_bar"));
            }
            catch(e){}
        });

        function scrollView(self){
            return self.each(function () {
                $('html, body').animate({
                  scrollTop: $(self).offset().top
                }, 900);
              });
        }

        //sideBarService.setup();
    }
})();
(function () {
    'use strict';
    angular.module("isyplus")
        .controller("AutorizacionCntrl", AutorizacionCntrl);

    function AutorizacionCntrl($scope, $state, AutorizacionServ, gridService, ModalServ, ListasServ) {
        var vm = $scope;
        vm.selectedItem = {};

        vm.setupgrid = {pag: true};
        vm.setupgrid.checks = {hideColumncheck: true};

        vm.crear = crear;
        vm.listar = listar;
        vm.onRowClick = onRowClick;

        init();

        function init() {
            gridService.initGrid(vm);
            vm.gridOptions.rowTemplate = rowTemplate();
            listar();
        }

        function crear() {
            $state.go("auts_form");
        }

        function listar() {
            var res = AutorizacionServ.get(function () {
                if (res.estado === 200) {
                    vm.gridOptions.columnDefs = res.cols;
                    vm.gridOptions.data = res.items;
                }
            });
        }


        function rowTemplate() {    //custom rowtemplate to enable double click and right click menu options
            return '<div ng-dblclick="grid.appScope.rowDblClick(row)"  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>'
        }

        vm.rowDblClick = function (row) {
            vm.selectedItem = row.entity;
            showModalDetalles();
        };

        function showModalDetalles() {
            ModalServ.show('modalDetallesAuts');
        }

        function onRowClick(row, rowIndex) {
            ListasServ.limpiaMarca(vm.gridOptions.data);
            if (row.marcado) {
                row.marcado = false;
            } else {
                row.marcado = true;
            }

            var selectedItem = ListasServ.getFirstMarcado(vm.gridOptions.data);
            if (selectedItem != null) {
                vm.selectedItem = selectedItem;
            } else {
                vm.selectedItem = null;
            }
        }

    }
})();
(function () {
    'use strict';
    angular.module("isyplus")
        .config(configAutList);

    function configAutList($stateProvider) {
        $stateProvider.state('auts_list',{
            url : '/autorizacion',
            templateUrl: 'static/app/autorizacion/autorizacion.list.html?v=' + globalgsvapp,
            controller: 'AutorizacionCntrl'
        });
    }
})();
(function () {
    'use strict';
    angular.module("isyplus")
        .factory("AutorizacionServ", AutorizacionServ);

    function AutorizacionServ($resource) {
        return $resource("/rest/autorizacion/:aut_id",
            {aut_id: '@aut_id'}, {
                getForm: {
                    method: 'GET',
                    params: {
                        accion: 'form'
                    }
                },
                getFormStep: {
                    method: 'GET',
                    params: {
                        accion: 'justform'
                    }
                },


                /*
                Se debe pasar el parametro cnt_id
                 */
                getContribAuts : {
                    method: 'GET',
                    params: {
                        accion: 'contribauts'
                    }
                }
            });
    }
})();
(function () {
    'use strict';
    angular.module("isyplus")
        .controller("AutorizacionFormCntrl", AutorizacionFormCntrl);

    function AutorizacionFormCntrl($scope, $state, AutorizacionServ, NotifServ, focusService, FechasServ) {

        var vm = $scope;

        vm.form = {};
        vm.contribsel = {};
        vm.listas ={contributentes:[], tiposdoc:[]};

        vm.guardar = guardar;
        vm.cancelar = cancelar;
        vm.onContribSel = onContribSel;
        vm.onenterfecha = onEnterFecha;

        init();
        
        function init() {
            var res = AutorizacionServ.get({aut_id:0}, function(){
                if (res.estado == 200){
                    vm.form = res.form;
                    vm.listas.contributentes = res.contribs;
                    vm.listas.tiposdoc = res.tiposdoc;
                }
            });
            focusService.setFocus("contrib",500);
        }

        function guardar() {
            var res = AutorizacionServ.save(vm.form, function(){
                if (res.estado === 200){
                    NotifServ.success(res.msg);
                    $state.go("auts_list");
                }
            });
        }

        function onContribSel(contribsel){
            if (contribsel){
                vm.form.cnt_id = contribsel.cnt_id;
                focusService.setFocus("aut_estab", 100);
            }
        }

        function cancelar() {
            $state.go("auts_list");
        }

        function  onEnterFecha( ) {
            console.log("on enter fecha");
            console.log(vm.form.aut_fechaautorizacion);

            var res =  FechasServ.sumar_anios(vm.form.aut_fechaautorizacion,1);
            console.log("new fecha:");
            console.log(res);
            vm.form.aut_fechacaducidad = res;
        }
    }
})();
(function () {
    'use strict';
    angular.module("isyplus")
        .config(configAutsForm);
    function configAutsForm($stateProvider) {
        $stateProvider.state("auts_form",{
            url:'/autorizacion/form',
            templateUrl: 'static/app/autorizacion/form/autorizacion.form.html?v=' + globalgsvapp,
            controller: 'AutorizacionFormCntrl'
        });
    }

})();
(function () {
    'use strict';
    angular.module("isyplus")
        .controller("ContribCntrl", ContribCntrl);

    function ContribCntrl($scope, $state, ContribuyenteServ, gridService, ModalServ, ListasServ) {

        var vm = $scope;
        vm.selectedItem = {};

        gridService.initGrid(vm);

        vm.crear = crear;
        vm.listar = listar;
        vm.editar = editar;
        vm.showModalDetalles = showModalDetalles;

        vm.setupgrid = {pag:true};
        vm.setupgrid.checks = {hideColumncheck: true };
        vm.onRowClick = onRowClick;
        //vm.onFilaCredClick = onFilaCredClick;

        // vm.setupgrid.checks.hideColumncheck = true;

        init();

        function init() {
            vm.gridOptions.rowTemplate = rowTemplate();
            listar();
        }

        function rowTemplate() {    //custom rowtemplate to enable double click and right click menu options
            return '<div ng-dblclick="grid.appScope.rowDblClick(row)"  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>'
        }

        vm.rowDblClick = function (row) {
            vm.selectedItem = row.entity;
            showModalDetalles();
        };

        function editar(){
            $state.go("contribs_form", {cnt_id: vm.selectedItem.cnt_id});
        }

        function listar() {
            var res = ContribuyenteServ.get(function () {
                if (res.estado === 200) {
                    vm.gridOptions.columnDefs = res.cols;
                    vm.gridOptions.data = res.items;
                }
            });
        }

        function crear() {
            $state.go("contribs_form", {cnt_id: 0});
        }

        function showModalDetalles() {
            ModalServ.show('modalDetallesContrib');
        }

        function onRowClick(row,rowIndex) {
            ListasServ.limpiaMarca(vm.gridOptions.data);
            if (row.marcado){
                row.marcado =false;
            }
            else{
                row.marcado = true;
            }

            var selectedItem =  ListasServ.getFirstMarcado(vm.gridOptions.data);
            if (selectedItem != null) {
                vm.selectedItem = selectedItem;
            }
            else{
                vm.selectedItem = null;
            }
        }

        /*function onFilaCredClick(row,rowIndex) {
            console.log("onFilaCredClick");
            console.log(row);
            console.log(rowIndex);
        }*/
    }
})();
(function () {
    'use strict';
    angular.module("isyplus")
        .config(configContribs);

    function configContribs($stateProvider){
        $stateProvider.state('contribs_list',{
            url : '/contribuyentes',
            templateUrl: 'static/app/contribuyente/contribuyente.list.html?v=' + globalgsvapp,
            controller: 'ContribCntrl'
        });
    }

})();
(function () {
    'use strict';
    angular.module("isyplus")
        .factory("ContribuyenteServ", ContribuyenteServ);

    function ContribuyenteServ($resource) {
        return $resource("/rest/contribuyente/:cnt_id",
            {cnt_id: '@cnt_id'}, {

                getForm: {
                    method: 'GET',
                    params: {
                        accion: 'form'
                    }
                },

                findByRuc:{
                    method: 'GET',
                    params : {
                        accion: 'find'
                    }
                }

            });
    }

})();
(function () {
    'use strict';
    angular.module("isyplus")
        .controller("ContribFormCntrl", ContribFormCntrl);

    function ContribFormCntrl($scope, $state, $stateParams, focusService, ContribuyenteServ, NotifServ) {

        var vm = $scope;

        vm.form = {'cnt_id': 0};
        vm.tiposcontrib = [];
        vm.existeContrib = false;
        vm.isEnterPress = false;

        init();

        vm.guardar = guardar;
        vm.cancelar = cancelar;
        vm.onEnterPress = onEnterPress;
        vm.onBlurRuc = onBlurRuc;
        vm.setFocusField = setFocusField;

        vm.checkExistContrib = checkExistContrib;

        function init() {
            var res = ContribuyenteServ.getForm({cnt_id: $stateParams.cnt_id}, function () {
                if (res.estado === 200) {
                    vm.form = res.form;
                    vm.tiposcontrib = res.tiposcontrib;

                }
            });
            focusService.setFocus("cnt_ruc", 500);
        }

        function guardar() {
            var res = ContribuyenteServ.save(vm.form, function () {
                if (res.estado === 200) {
                    NotifServ.success(res.msg);
                    goToList();
                }
            });
        }

        function cancelar() {
            $state.go("contribs_list");
        }

        function goToList() {
            $state.go("contribs_list");
        }

        function onEnterPress() {
            vm.isEnterPress = true;
            checkExistContrib();
        }

        function onBlurRuc() {
            if (!vm.isEnterPress) {
                checkExistContrib();
            }
        }

        function setFocusField(inputId) {
            focusService.setFocus(inputId);
        }

        function checkExistContrib() {
            console.log("checkExistContrib-->");
            console.log(vm.form.cnt_id);
            console.log(vm.form.cnt_id > 0);

            if (vm.form.cnt_id === 0) {
                if (vm.form.cnt_ruc.length > 10) {
                    if (vm.form.cnt_id === 0) {
                        var res = ContribuyenteServ.findByRuc({ruc: vm.form.cnt_ruc}, function () {
                            if (res.estado === 200) {
                                NotifServ.warning('El contribuyente ya esta registrado');
                                vm.form = res.contrib;
                                vm.existeContrib = true;
                            }
                            else if(res.estado === 404){
                                NotifServ.info('El contribuyente no está registrado');
                                focusService.setFocus("cnt_razonsocial", 100);
                            }
                        });
                    }
                }
            }
            else{
                console.log("Ya no se chequea si contribuyetne exites--->");
            }
        }
    }

})();
(function () {
    'use strict';
    angular.module("isyplus")
        .config(configContribForm);

    function configContribForm($stateProvider){
        $stateProvider.state('contribs_form',{
            url : '/contribuyentes/form/:cnt_id',
            templateUrl: 'static/app/contribuyente/form/contribs.form.html?v=' + globalgsvapp,
            controller: 'ContribFormCntrl'
        });
    }

})();
(function () {
    'use strict';
    angular.module("isyplus")
        .config(config);
    function config($stateProvider){
        $stateProvider.state('empresa', {
            url : '/empresa/',
            templateUrl: 'static/app/empresa/empresa.html?v=' + globalgsvapp,
            controller: 'EmpresaCntrl'
        });
    }


})();
(function () {
    'use strict';
    angular.module("isyplus")
        .controller("EmpresaCntrl", EmpresaCntrl);

    function EmpresaCntrl($scope, NotifServ, EmpresaServ, $state) {

        var vm = $scope;
        vm.form ={'emp_id':0};

        vm.guardar = guardar;
        vm.canclear = cancelar;

        init();

        function guardar() {
            var res = EmpresaServ.save(vm.form, function(){
                if (res.estado === 200){
                    NotifServ.success(res.msg);
                    loadDatosEmpresa();
                }
            });
        }

        function cancelar() {
            $state.go("home");
        }

        function init() {
            loadDatosEmpresa();
        }

        function loadDatosEmpresa(){
            var res = EmpresaServ.get({emp_id:0}, function(){
                if (res.tempresa){
                    vm.form = res.tempresa;
                    if (vm.form.emp_id ===0){
                        NotifServ.warning("El establecimiento grafico, no ha sido parametrizado");
                    }
                    else{
                        NotifServ.warning("El establecimiento grafico, ya ha sido parametrizado");
                    }
                }
            });
        }
    }

})();
(function () {
    'use strict';
    angular.module("isyplus")
    .factory("EmpresaServ", EmpresaServ);

    function EmpresaServ($resource){
        return $resource("/rest/tempresa/:emp_id", {emp_id:'@emp_id'}, {

        });

    }

})();
/**
 * Created by serviestudios on 04/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .config(configLibroMayor);
    function configLibroMayor($stateProvider){
        $stateProvider.state('home', {
            url : '/home/',
            templateUrl: 'static/app/home/home.html?v=' + globalgsvapp,
            controller: 'HomeCntrl'
        });
    }
})();
(function(){
    'use strict';
    angular.module("isyplus")
        .controller("HomeCntrl", HomeCntrl);

    function HomeCntrl($scope, $state, AuthFactory, $timeout) {
        var vm = $scope;

        init();

        /*
        vm.goFormIngreso = goFormIngreso;
        vm.goUsuarios = goUsuarios;
        vm.goEmpresa = goEmpresa;
        vm.goContribs = goContribs;
        vm.goAuts = goAuts;
        vm.goJobs = goJobs;
        */

        function init(){
            console.log("HomeCntrl----->");
            console.log("valor de globalUserLogged:");
            console.log(globalUserLogged);

            AuthFactory.loadRolesUser(globalUserLogged);

            $timeout(function () {
                console.log("roles cargado son");
                var listadoUser = AuthFactory.getRolesUserList();
                console.log(listadoUser);
            }, 5000);


        }



        /*
        function goFormIngreso(){
            $state.go("login");
        }

        function goUsuarios() {
            $state.go("usuarios");
        }

        function logout(){
            console.log("logout");
        }

        function goEmpresa(){
            $state.go("empresa");
        }

        function goContribs(){
            $state.go("contribs_list");
        }

        function goAuts() {
            $state.go("auts_list");
        }

        function goJobs(){
            $state.go("job_list");
        }
        */
    }
})();


(function () {
    'use strict';
    angular.module("isyplus")
        .controller("InitCntrl", InitCntrl);

    function InitCntrl($scope, $state, LoginServ, NotifServ, AuthFactory) {

        var vm = $scope;


        vm.isUsserLogged = false;
        vm.exitApp = exitApp;
        vm.goFormIngreso = goFormIngreso;
        vm.goUsuarios = goUsuarios;
        vm.goEmpresa = goEmpresa;
        vm.goContribs = goContribs;
        vm.goAuts = goAuts;
        vm.goJobs = goJobs;
        vm.goReportes = goReportes;
        vm.goJobWizard = goJobWizard;

        init();


        function init(){
            console.log("InitCntrl ejecutado ----->");
            //$state.go("home");
        }


        function exitApp(){
            $state.go("home");
        }

        function goFormIngreso(){
            $state.go("login");
        }

        function goUsuarios() {
            $state.go("usuarios");
        }

        function logout(){
            console.log("logout");
        }

        function goEmpresa(){
            $state.go("empresa");
        }

        function goContribs(){
            $state.go("contribs_list");
        }

        function goAuts() {
            $state.go("auts_list");
        }

        function goJobs(){
            $state.go("job_list");
        }

        function goReportes() {
            $state.go("reportes_list");
            // $state.go("upload");
        }

        function goJobWizard() {
            $state.go("job_step");
        }

    }

})();
(function () {
    'use strict';
    angular.module("isyplus")
        .controller("JobFormCntrl", JobFormCntrl);
    
    function JobFormCntrl($scope, $stateParams, $state, JobService,
                          AutorizacionServ, NotifServ, focusService, ListasServ) {

         var vm = $scope;

         vm.form = {};
         vm.contribsel = {};
         vm.listas ={contributentes:[], auts:[]};
         vm.autsel = undefined;

         vm.guardar = guardar;
         vm.cancelar = cancelar;
         vm.onContribSel = onContribSel;
         vm.onAutChange = onAutChange;

         init();

         function init(){
             var jobid = $stateParams.job_id;
             var res = JobService.getForm({job_id:jobid}, function () {
                 if (res.estado === 200){
                     vm.form = res.form;
                     vm.listas.contributentes = res.contribs;
                     focusService.setFocus('ruccontrib', 500);
                 }
             });
         }

         function loadAuts(){
             var res = AutorizacionServ.getContribAuts({cnt_id:vm.contribsel.cnt_id}, function(){
                 if (res.estado == 200){
                     vm.listas.auts = res.items;
                     focusService.setFocus('aut_id', 100);
                 }
             });
         }

         function guardar(){
             var res = JobService.save(vm.form, function () {
                 if (res.estado === 200){
                     NotifServ.success(res.msg);
                     goToList();
                 }
             });
         }

         function onContribSel(contribsel){
            if (contribsel){
                vm.form.cnt_id = contribsel.cnt_id;
                focusService.setFocus("aut_estab", 100);
                vm.contribsel = contribsel;
                loadAuts();
            }
         }

         function onAutChange(){
             var autfinded = ListasServ.buscarObjeto(vm.listas.auts, 'aut_id', vm.form.aut_id);
             vm.autsel =autfinded;
         }

         function goToList() {
             $state.go("job_list");
         }

         function cancelar(){
             goToList();
         }
    }

})();
(function () {
    'use strict';
    angular.module("isyplus")
        .config(configJobForm);
    function configJobForm($stateProvider) {
        $stateProvider.state('job_form',{
            url:'/job/form/:job_id',
            templateUrl: 'static/app/job/form/job.form.html?v=' + globalgsvapp,
            controller: 'JobFormCntrl'
        });
    }

})();
(function () {
    'use strict';
    angular.module("isyplus")
        .controller("JobCntrl", JobCntrl);

    function JobCntrl($scope, JobService, gridService, $state, ModalServ, NotifServ, swalService, ReportesServ, ListasServ) {

        var vm = $scope;

        vm.selectedItem = {};
        vm.selectedReport = 0;

        vm.crear = crear;
        vm.listar = listar;
        vm.cambiarEstado = cambiarEstado;
        vm.setPlantilla = setPlantilla;
        vm.aceptarModal = aceptarModal;
        vm.imprimir = imprimir;
        vm.selectPlantilla = selectPlantilla;
        vm.selectDocToPrint = selectDocToPrint;
        vm.showModalImprmir = showModalImprmir;
        vm.reportar = reportar;
        vm.reimprimir = reimprimir;
        vm.onRowClick = onRowClick;


        vm.repgrid = {};
        vm.repgrid.selectedItem = {};

        init();

        function init() {
            gridService.initGrid(vm);
            vm.gridOptions.rowTemplate = rowTemplate();
            listar();
        }

        function crear() {
            $state.go('job_form', {job_id: 0});
        }

        var columnDefs = [
            {headerName: "Make", field: "make"},
            {headerName: "Model", field: "model"},
            {headerName: "Price", field: "price"}
        ];

        var rowData = [
            {make: "Toyota", model: "Celica", price: 35000},
            {make: "Ford", model: "Mondeo", price: 32000},
            {make: "Porsche", model: "Boxter", price: 72000}
        ];

        $scope.gridOptions2 = {
            columnDefs: columnDefs,
            rowData: rowData
        };

        function listar() {
            var res = JobService.get(function () {
                if (res.estado === 200) {
                    vm.gridOptions.columnDefs = res.cols;
                    vm.gridOptions.data = res.items;
                }
            });
        }

        function rowTemplate() {    //custom rowtemplate to enable double click and right click menu options
            return '<div ng-dblclick="grid.appScope.rowDblClick(row)"  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>'
        }

        vm.rowDblClick = function (row) {
            vm.selectedItem = row.entity;
            showModalDetalles();
        }

        function showModalDetalles() {
            ModalServ.show('modalDetallesJob');
        }

        function hideModalDetalles() {
            ModalServ.hide('modalDetallesJob');
        }

        function auxCambiarEstado(newEstado, notif) {
            var params = {
                job_id: vm.selectedItem.job_id,
                newestado: newEstado
            };
            var res = JobService.cambiarEstado(params, function () {
                if (res.estado === 200) {
                    if (notif) {
                        NotifServ.success(res.msg);
                    }
                    listar();
                }
            });
        }

        function cambiarEstado(estado) {
            swalService.confirm('¿Esta seguro?', function (confirm) {
                if (confirm) {
                    var params = {
                        job_id: vm.selectedItem.job_id,
                        newestado: estado
                    };
                    var res = JobService.cambiarEstado(params, function () {
                        if (res.estado === 200) {
                            NotifServ.success(res.msg);
                            hideModalDetalles();
                            listar();
                        }
                    });
                }
            }, 'Cambiar estado del pedido');
        }

        function setPlantilla() {
            var res = ReportesServ.get(function () {
                if (res.status === 200) {
                    $scope.repgrid.columnDefs = res.cols;
                    $scope.repgrid.data = res.items;
                }
                ModalServ.show('modalSelPlant');
            });
        }

        function selectPlantilla(plantilla) {
            vm.repgrid.selectedItem = plantilla;
        }

        function selectDocToPrint(codReport, tipocopia) {
            console.log('doc to print');
            console.log(tipocopia);
            vm.selectedReport = codReport;
            imprimir(codReport);
            auxCambiarEstado(6);
        }

        function aceptarModal() {
            console.log(vm.repgrid.selectedItem);
            var res = JobService.putPlantilla({
                job_id: vm.selectedItem.job_id,
                temp_id: vm.repgrid.selectedItem.temp_id
            }, function () {
                if (res.estado == 200) {
                    NotifServ.success(res.msg);
                    ModalServ.hide('modalSelPlant');
                }
            });
        }

        function reportar() {
            cambiarEstado(2);
        }

        function reimprimir() {
            alert('reimprimir');
        }

        function onRowClick(row, rowIndex) {
            ListasServ.limpiaMarca(vm.gridOptions.data);
            if (row.marcado) {
                row.marcado = false;
            } else {
                row.marcado = true;
            }

            var selectedItem = ListasServ.getFirstMarcado(vm.gridOptions.data);
            if (selectedItem != null) {
                vm.selectedItem = selectedItem;
            } else {
                vm.selectedItem = null;
            }
        }

        function showModalImprmir() {
            ModalServ.show('modalSelTipoPrint');
        }

        function imprimir(tipocopia) {
            var temp_id = vm.repgrid.selectedItem.temp_id;
            var desde = vm.selectedItem.aut_secuencia_ini;
            var hasta = vm.selectedItem.aut_secuencia_fin;
            var jobid = vm.selectedItem.job_id;
            var url = "http://localhost:8080/imprentas_war/ReporteServlet?desde=" + desde + "&hasta=" + hasta + "&codrep=" + temp_id + "&tipocopia=" + tipocopia + "&jobid=" + jobid;
            console.log('url-->');
            console.log(url);
            window.open(url, "mywindow", "status=1,toolbar=1");
        }


    }
})();
(function () {
    'use strict';
    angular.module("isyplus")
        .config(jobConfig);
    function jobConfig($stateProvider) {
        $stateProvider.state('job_list',{
            url : '/job',
            templateUrl: 'static/app/job/job.list.html?v=' + globalgsvapp,
            controller: 'JobCntrl'
        });
    }

})();
(function () {
    'use strict';
    angular.module("isyplus")
        .factory("JobService", JobService);

    function JobService($resource) {
        return $resource("/rest/job/:job_id",
            {job_id: '@job_id'}, {
                getForm: {
                    method: 'GET',
                    params: {
                        accion: 'form'
                    }
                },

                getJustForm: {
                    method: 'GET',
                    params: {
                        accion: 'justform'
                    }
                },


                cambiarEstado: {
                    method: 'POST',
                    params: {
                        accion: 'cambiar_estado'
                    }
                },
                putPlantilla: {
                    method: 'POST',
                    params: {
                        accion: 'put_reporte'
                    }
                }

            });
    }

})();
(function () {
    'use strict';
    angular.module("isyplus")
        .controller("JobStepsCntrl", JobStepsCntrl);

    function JobStepsCntrl($scope, JobService, gridService, $state, ModalServ, NotifServ, swalService,
                           ReportesServ, ListasServ, FechasServ, ContribuyenteServ, focusService, AutorizacionServ) {

        var vm = $scope;
        vm.currentStep = 1;
        vm.formContrib = {};
        vm.formAut = {};
        vm.formJob = {};
        vm.tiposcontrib = [];
        vm.listas ={tiposdoc:[]};
        vm.existeContrib = false;
        vm.contribFinded = false;//Indica si se busco el contribuyente

        vm.onEnterFindContrib = onEnterFindContrib;
        vm.onFocusContribRazonSocial= onFocusContribRazonSocial;
        vm.findContrib = findContrib;
        vm.guardarContrib = guardarContrib;
        vm.guardarAutorizacion = guardarAutorizacion;
        vm.guardarJob = guardarJob;
        vm.onenterfecha = onenterfecha;
        vm.anterior = anterior;

        function init() {
            console.log("init jobsteps-->");
            vm.currentStep = 1;
            initFormContrib();
        }

        function initFormContrib() {
            var res = ContribuyenteServ.getForm({cnt_id: 0}, function () {
                if (res.estado === 200) {
                    vm.formContrib = res.form;
                    vm.tiposcontrib = res.tiposcontrib;
                }
            });
            focusService.setFocus("cnt_ruc", 500);
        }

        function goToStep2(){
            initFormAut();
        }

        function goToStep3() {
            initFormJob();
        }

        function initFormAut() {
            var res =AutorizacionServ.getFormStep({aut_id:0, cnt_id: vm.formContrib.cnt_id}, function () {
                console.log("Respuesta al obtener la autorizacion");
                console.log(res);

                if (res.estado == 200){
                    vm.formAut = res.form;
                    vm.listas.tiposdoc = res.tiposdoc;
                }
            } );
        }

        function initFormJob() {
             var jobid = 0;
             var res = JobService.getJustForm({job_id:jobid}, function () {
                 if (res.estado === 200){
                     vm.formJob = res.form;
                     //focusService.setFocus('ruccontrib', 500);
                 }
             });
        }

        function onEnterFindContrib(){
            findContrib();
        }

        function onFocusContribRazonSocial(){
            console.log("on onFocusContribRazonSocial-->")
        }

        function findContrib() {
            vm.contribFinded = true;
            if (vm.formContrib.cnt_ruc.length > 10) {
                var res = ContribuyenteServ.findByRuc({ruc: vm.formContrib.cnt_ruc}, function () {
                    if (res.estado === 200) {
                        NotifServ.warning('El contribuyente ya esta registrado');
                        vm.formContrib = res.contrib;
                        vm.existeContrib = true;
                    } else if (res.estado === 404) {
                        NotifServ.info('El contribuyente no está registrado');
                        focusService.setFocus("cnt_razonsocial", 100);
                    }
                });
            }
        }

        function guardarContrib() {
            console.log("guardar contrib------->");
            var res = ContribuyenteServ.save(vm.formContrib, function () {
                if (res.estado === 200) {
                    NotifServ.success(res.msg);
                    vm.currentStep = 2;
                    goToStep2();
                }
            });
        }

        function guardarAutorizacion() {
             var res = AutorizacionServ.save(vm.formAut, function(){
                if (res.estado === 200){
                    NotifServ.success(res.msg);
                    vm.currentStep = 3;
                    goToStep3();
                }
            });
        }

        function goToJobList(){
             $state.go("job_list");
        }

        function guardarJob() {
            var res = JobService.save(vm.formJob, function () {
                 if (res.estado === 200){
                     NotifServ.success(res.msg);
                     goToJobList();
                 }
             });
        }

        function anterior() {
            NotifServ.info("back action->");
        }

         function  onenterfecha( ) {
            console.log("on enter fecha");
            console.log(vm.formAut.aut_fechaautorizacion);
            var res =  FechasServ.sumar_anios(vm.formAut.aut_fechaautorizacion,1);
            console.log("new fecha:");
            console.log(res);
            vm.formAut.aut_fechacaducidad = res;
        }

        init();
    }


})();
(function () {
    'use strict';
    angular.module("isyplus")
      .config(jobConfig);
    function jobConfig($stateProvider) {
        $stateProvider.state('job_step',{
            url : '/jobsteps',
            templateUrl: 'static/app/job/jobsteps/jobsteps.html?v=' + globalgsvapp,
            controller: 'JobStepsCntrl'
        });
    }


})();
(function () {
    'use strict';
    angular.module("isyplus")
        .factory("AuthFactory", AuthFactory);

    function AuthFactory(RolesServ) {
        var userLogged = false;
        var rolesUser = [];

        return {
            isUserLogged: isUserLogged,
            setUserLogged: setUserLogged,
            loadRolesUser: loadRolesUser,
            getRolesUserList: getRolesUserList
        }

        function isUserLogged() {
            return userLogged;
        }

        function setUserLogged(pUserLogged) {
            userLogged = pUserLogged;
        }

        function loadRolesUser(userId) {
            var res = RolesServ.getRolesUser({us_id: userId}, function () {
                console.log("valor de res es:");
                console.log(res);
                if (res.estado === 200) {
                    rolesUser = res.roles;
                }
            });
        }

        function getRolesUserList() {
            return rolesUser;
        }
    }

})();
(function () {
    'use strict';
    angular
        .module("isyplus")
        .config(configLogin);
    function configLogin($stateProvider){
        $stateProvider.state('login',{
            url : '/login',
            templateUrl: 'static/app/login/login.html?v=' + globalgsvapp,
            controller: 'LoginCntrl'
        });
    }

})();
(function () {
    'use strict';
    angular.module("isyplus")
        .controller("LoginCntrl", LoginCntrl);
    function LoginCntrl($scope, $state, LoginServ, NotifServ){
        var vm = $scope;

        vm.form = {};
        vm.autenticar = autenticar;
        vm.checkUserStatus = checkUserStatus;
        init();

        function init(){
            console.log("Init login cntrl");
            vm.form = {
                usuario:'',
                clave:''
            }
        }

        function autenticar(){
            console.log("Se ejecuta el metodo de autenticacion-->");
            var res = LoginServ.save(vm.form, function(){
                if (res.estado == 200){
                    if (res.resultado){
                        NotifServ.info("Login exitoso");
                        $state.go("home");
                    }
                    else{
                        NotifServ.error("Login fallido");
                    }
                }
            })
        }

        function checkUserStatus(){
            console.log("Se ejecuta checkUserStatus-->");
            var res = LoginServ.chkStatus(function(){
                console.log("Valor de res es:");
                console.log(res);
                if (res.userloged){
                    NotifServ.info("Usuario en sesion");
                }
                else{
                    NotifServ.error("Usuario no esta en sesion");
                }
            })

        }

    }
})();
(function () {
    'use strict';
    angular.module("isyplus")
        .factory("LoginServ", LoginServ);

    function LoginServ($resource){
        return $resource("/rest/usuarios/:us_id", {us_id:'@us_id'}, {
            chkStatus:{
                method: 'GET',
                params:{
                    accion:'chkstatus'//, editado
                }
            },
            listar:{
                method: 'GET',
                params:{
                    accion:'listar'//, editado
                }
            },
            getForm:{
                method: 'GET',
                params:{
                    accion:'form'
                }
            },
            crearUsuario: {
                method: 'POST',
                params:{
                    accion: 'crear'
                }
            },
            resetClave :{
                method: 'POST',
                params:{
                    accion: 'resetclave'
                }
            },
            cambiarEstado:{
                method: 'POST',
                params:{
                    accion: 'cestado'
                }
            }
        });
    }


})();
(function () {
    'use strict';
    angular.module("isyplus")
        .controller("ReportesCntrl", ReportesCntrl);

    function ReportesCntrl($scope, ReportesServ, gridService, $state) {

        var vm = $scope;

        vm.listar = listar;
        vm.crear = crear;
        vm.editar = editar;

        vm.selectedItem = {};

        gridService.initGrid(vm);

        init();

        function init() {
            console.log("Reportes Cntrl Init executed-->");
            listar();
        }

        function listar(){
            console.log('Se ejecuta accion listar');

            var res = ReportesServ.get(function(){
                if (res.status === 200){
                    $scope.gridOptions.columnDefs = res.cols;
                    $scope.gridOptions.data = res.items;
                }
            });

            /*var res = ReportesServ.get(function () {
                console.log("Respuesta del servidor es");
                console.log(res);
                if (res.status == 200) {
                    vm.lista = res.lista;
                }
            });*/
        }

        function crear() {
            $state.go('upload',{temp_id:0});
        }

        function editar() {
            $state.go('upload',{temp_id:vm.selectedItem.temp_id});
        }
    }

})();
(function () {
    'use strict';

    angular.module("isyplus")
        .config(jobConfig);
    function jobConfig($stateProvider) {
        $stateProvider.state('reportes_list',{
            url : '/reportes',
            templateUrl: 'static/app/reportes/reportes.list.html?v=' + globalgsvapp,
            controller: 'ReportesCntrl'
        });
    }



})();
(function () {
    'use strict';
    angular.module("isyplus")
     .factory("ReportesServ", ReportesServ);

    function ReportesServ($resource) {

        return $resource("/rest/plantillas/:temp_id", {temp_id:'@temp_id'}, {


        });
    }

})();
(function () {
    'use strict';
    angular.module("isyplus")

    .config(config);
    function config($stateProvider){
        $stateProvider.state('upload', {
            url : '/upload/:temp_id',
            templateUrl: 'static/app/uploadfile/upload.html?v=' + globalgsvapp,
            controller: 'UploadCntrl'
        });
    }

})();




(function () {
    'use strict';
    angular.module("isyplus")
        .controller("UploadCntrl", UploadCntrl);

    function UploadCntrl($scope, NotifServ, $state, $stateParams, ReportesServ) {
        var vm = $scope;
        vm.form = {nombreArchivo: 'prueba'};
        init();

        vm.cancelar = cancelar;

        function init() {
            var temp_id = $stateParams['temp_id'];
            var int_tempid = parseInt(temp_id, 10);
            console.log(int_tempid);
            if ( int_tempid == 0) {
                vm.form = {temp_id:0, temp_name: ''};
            }
            else{
                var res = ReportesServ.get({temp_id: temp_id}, function () {
                    if (res.status == 200) {
                        vm.form = res.form;
                    }
                });
            }
        }

        function cancelar() {
            // NotifServ.info('Accion cancelar ejecutado');
            $state.go("reportes_list");
        }
    }

})();
(function () {
    'use strict';
    angular.module("isyplus")
        .controller("UserFormCntrl", UserFormCntrl);

    function UserFormCntrl($scope, $state, $stateParams, NotifServ, LoginServ, focusService, RolesServ){

        var vm = $scope;

        vm.form = {us_id:0};
        vm.guardar = guardar;
        vm.cancelar = cancelar;
        vm.accion = 'c';
        vm.titulo = "Creación de usuario";
        vm.matrizRoles = [];

        init();

        function init(){
            initForm();
        }

        function initForm(){
            vm.accion = $stateParams.accion;
            switch (vm.accion) {
                case 'c': vm.titulo = "Creación de usuario";break;
                case 'e': vm.titulo = "Actualización de usuario";break;
                case 'r': vm.titulo = "Reseteo de clave";break;
                default: vm.titulo = "Creación de usuario";break;
            }

            if (parseInt($stateParams.userid)>0){
                var res = LoginServ.get({us_id:$stateParams.userid},function(){
                    if (res.estado == 200){
                        vm.form = res.user;
                    }
                });
            }
            else{
                var res = LoginServ.getForm(function(){
                    if (res.estado == 200){
                        vm.form = res.form;
                    }
                });
            }

            if (vm.accion === 'r'){
                focusService.setFocusTimeout("claveTempInput", 500);
            }
            else{
                focusService.setFocusTimeout("nomApelUser", 500);

                if (vm.accion == 'c' || vm.accion == 'e'){
                    listarRoles();
                }
            }

        }

        function guardar(){
            if (vm.form.us_id === 0){
                vm.form.roles = vm.matrizRoles;
                var res = LoginServ.crearUsuario(vm.form, function(){
                   if (res.estado == 200){
                       NotifServ.success(res.msg);
                       goToList();
                   }
                });
            }
            else{
                if (vm.accion === 'r'){
                    var res = LoginServ.resetClave(vm.form, function(){
                        if (res.estado === 200){
                            NotifServ.success(res.msg);
                            goToList();
                        }
                    });
                }
                else{
                    vm.form.roles = vm.matrizRoles;
                    var res = LoginServ.save(vm.form, function(){
                        if (res.estado === 200){
                            NotifServ.success(res.msg);
                            goToList();
                        }
                    });
                }

            }
        }

        function listarRoles() {
            vm.matrizRoles = [];
            vm.form.us_id=$stateParams.userid;
            var res = RolesServ.get(vm.form, function(){
                console.log("respuesta del servidor es:");
                if (res.estado==200){
                    vm.matrizRoles = res.matriz;
                }
            });
        }

        function goToList(){
            $state.go("usuarios");
        }

        function cancelar(){
            goToList();
        }
    }
})();
(function () {
    'use strict';
    angular.module("isyplus")
        .config(configForm);

    function configForm($stateProvider){

         $stateProvider.state('usuarios_form',{
            url : '/usuarios/:userid/:accion',
            templateUrl: 'static/app/usuarios/form/users.form.html?v=' + globalgsvapp,
            controller: 'UserFormCntrl'
        });

    }


})();
(function () {
    'use strict';
    angular.module("isyplus")
     .factory("RolesServ", RolesServ);
    
    function RolesServ($resource) {

        return $resource("/rest/userroles/:us_id", {us_id:'@us_id'}, {

             getRolesUser:{
                method: 'GET',
                params:{
                    accion:'getrolesu'//, editado
                }
            }
        });
    }

})();
(function () {
    'use strict';
    angular.module("isyplus")
        .controller("UsuariosCntrl", UsuariosCntrl);

    function UsuariosCntrl($scope, $state, $transitions, LoginServ, NotifServ, gridService){

        var vm = $scope;

        vm.items = [];
        vm.listar = listar;
        vm.crear = crear;
        vm.editar = editar;
        vm.resetearClave = resetearClave;
        vm.cambiarEstado = cambiarEstado;

        vm.selectedItem = {};

        gridService.initGrid(vm);

        init();

        function init(){
            listar();
        }

        function listar() {
            var res = LoginServ.listar(function(){
                if (res.estado === 200){
                    $scope.gridOptions.columnDefs = res.cols;
                    $scope.gridOptions.data = res.items;
                }
            });
        }

        function crear() {
            $state.go("usuarios_form", {userid:0, accion:'c'});
        }

        function editar(){
            $state.go("usuarios_form", {userid:vm.selectedItem.us_id, accion:'e'});
        }

        function resetearClave(){
            $state.go("usuarios_form", {userid:vm.selectedItem.us_id, accion:'r'});
        }

        function cambiarEstado(){
            var msg = "¿Seguro que desea dar de baja este usuario?";
            if (vm.selectedItem.us_status ===1){
                msg = "¿Seguro que desea activar este usuario?";
            }

            if (confirm(msg)){
                var res = LoginServ.cambiarEstado(vm.selectedItem, function(){
                    if (res.estado === 200){
                        NotifServ.success(res.msg);
                        listar();
                    }
                });
            }
        }
    }

})();
(function () {
    'use strict';
    angular
        .module("isyplus")
        .config(configLogin);
    function configLogin($stateProvider){
        $stateProvider.state('usuarios',{
            url : '/usuarios',
            templateUrl: 'static/app/usuarios/usuarios.html?v=' + globalgsvapp,
            controller: 'UsuariosCntrl'
        });
    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function (module) {
    'use strict';
    module.controller("BusArtDirectCntrl", BusArtDirectCntrl);

    function BusArtDirectCntrl($scope, $timeout, BaseAutocompServ, GeneralSrv, ListasServ, tseccionRest, tclaveRest) {

        var defPlaceHolder = "Digite el nombre del articulo";

        $scope.tipoArtSel = {};//El tipo de articulo seleccionado

        $scope.placeh = $scope.placeh || defPlaceHolder;

        $scope.secciones = [];//listado de secciones
        $scope.seccionSel = {};//Seccion seleccionada
        $scope.uri = "";//uri para consultas ajax

        /**
         * Establece el modo de busqueda ya sea por id (byid) o por nombre(bynom)
         * @param modo
         */
        $scope.setModuBus = function (modo) {
            $scope.uriparams.modo = modo;
            GeneralSrv.setFocusWithTimeout($scope.idprop, 100);
            $scope.placeh = modo === "byid" ? "Digite el código del artículo" : defPlaceHolder;
            reloadUri();
            saveUriParams();
        };

        $scope.changeSecCodigo = function (seccion) {
            $scope.seccionSel = seccion;
            $scope.uriparams.sec_codigo = seccion.sec_codigo;
            //$scope.uriparams.sec_desci = seccion.sec_desci;
            GeneralSrv.setFocusWithTimeout($scope.idprop, 100);
            reloadUri();
            saveUriParams();
        };


        $scope.changeTarCodigo = function (item) {
            $scope.uriparams.tar_codigo = item.tar_codigo;
            $scope.uriparams.tipo = item.tipo;
            GeneralSrv.setFocusWithTimeout($scope.idprop, 100);
            reloadUri();
            saveUriParams();
        };


        $scope.clearArtSel = function () {
            $scope.model = {};

            try {//Evaluar funcion listener
                $timeout(function () {
                    $scope.fnOnNull($scope.filtro);
                });
                GeneralSrv.setFocusWithTimeout($scope.idprop, 100);
            }
            catch (e) {
                console.error(" Error al ejecutar función ")
            }

        };

        $scope.onkeydown = function (event) {
            BaseAutocompServ.onkeydown($scope, event);
        };

        $scope.onkeyup = function (event) {
            BaseAutocompServ.onkeyup($scope, event);
        };

        $scope.sel_item = function (item) {
            BaseAutocompServ.sel_item($scope, item);
        };

        $scope.on_lost_focus = function (item) {
            BaseAutocompServ.on_lost_focus($scope);
        };

        $scope.$watch("model",
            function (newValue, oldValue) {
                BaseAutocompServ.on_model_change($scope);
            }
        );

        $scope.$watch("baseuri",
            function (newValue, oldValue) {
                BaseAutocompServ.on_uri_change($scope);
                reloadUri();
            }
        );

        $scope.$watch("uriparams.tar_codigo",
            function (newValue, oldValue) {
                console.log("watch property uriparams.tar_codigo--->", newValue);
                if (newValue) {
                    findTArtTipo();
                }
            }
        );

        $scope.$watch("uriparams.is_sec_codigo",
            function (newValue, oldValue) {
                console.log("watch property uriparams.is_sec_codigo--->", newValue);
                if (newValue) {
                    loadSecciones();
                }
            }
        );

        $scope.$watch("uriparams.tra_codigo",
            function (newValue, oldValue) {
                console.log("watch property uriparams.tra_codigo--->", newValue);
                if (newValue) {
                    loadDatosSesion();
                }
            }
        );

        $scope.$watch("uriparams.sec_codopu",
            function (newValue, oldValue) {
                if (newValue){
                    console.log("Cambia valor para uriparams.sec_codopu, nuevo valor es:", newValue);
                    reloadUri();
                }
            }
        );


        function reloadUri() {
            try {
                $scope.uri = $scope.baseuri + "&" + $.param($scope.uriparams);
                console.log("Valor para uri es");
                console.log($scope.uri);
            }
            catch (ex) {
                console.error("Error al tratar de setear uri", ex);
            }
        }


        /**
         * Si se requiere seleccion de secciones entonces se carga las secciones de la base
         */
        function loadSecciones() {
            $scope.secciones = [];
            if ($scope.uriparams && $scope.uriparams.is_sec_codigo === 1) {
                var res = tseccionRest.getAll(function () {
                    if (res.estado === 1) {
                        $scope.secciones = res.seccionesls;
                        findSeccion();
                    }
                });
            }
        }

        function findTArtTipo() {
            $scope.tipoArtSel = ListasServ.buscarObjeto($scope.tiposartlist,
                "tar_codigo",
                $scope.uriparams.tar_codigo);
        }

        function findSeccion() {
            $scope.seccionSel = ListasServ.buscarObjeto($scope.secciones,
                "sec_codigo",
                $scope.uriparams.sec_codigo);
            /*
            if ($scope.seccionSel) {
                $scope.uriparams.sec_desci = $scope.seccionSel.sec_desci;
            }
            */
        }

        function init() {
            loadSecciones();
            reloadUri();
            BaseAutocompServ.config($scope);
        }

        function loadDatosSesion(){
            var tra_codigo = $scope.uriparams['tra_codigo'];
            if (tra_codigo){
                var res = tclaveRest.getClaSesionTransac({tra_codigo:tra_codigo}, function(){
                    if (res.estado===200){
                        var cla_sesion_transac = res.cla_sesion_transac;
                        for (var prop in cla_sesion_transac){
                            $scope.uriparams[prop]=cla_sesion_transac[prop];
                        }
                        reloadUri();
                    }
                });
            }
        }

        function saveUriParams(){
            var tra_codigo = $scope.uriparams['tra_codigo'];
            if (tra_codigo){
                var res = tclaveRest.saveClaSesionTransac({tra_codigo:tra_codigo, setup:$scope.uriparams}, function(){
                  console.log("Resultado de actualizar en sesion trasac", res);
                })
            }
        }

        init();
    }
})(IsyplusApp);
/**
 * Created by serviestudios on 05/02/16.
 */
(function (module) {
    'use strict';
    module.directive("buscarArtDirect", buscarArtDirect);

    function buscarArtDirect(){
        return {
            restrict: 'EA',
            scope:{
                tipo:'@',//tipo ajax o normal x o n
                data:'=?',//lista de datos para el caso tipo normal
                model:'=',//el objeto que cambia cuando selecciona de la lista
                /**
                 * Propiedades adiciones para el autocompletado debe ser tipo
                 * {'propFiltro':'art_nomlar',
                    'propFiltroId':'art_id',
                    'idprop':'art_trn',
                    'colornull':'#FF0000',
                    'fnOnSel':on_articulo_sel,
                    'fn_detalles_art':ver_detalles_art}
                 */
                setup:'=',
                baseuri:'=',//uri rest para el caso de tipo ajax
                /**
                 * (opc)Se Agrega soporte de paso de parametros, debe ser tipo:
                 * {isSecCodigo:0, sec_codigo:0, tar_codigo:0, modo:byid o bynom }
                 */
                uriparams: '=?',

                //tarcodigo:'=',
                tiposartlist:'=',//Lista de tipos de articulos disponibles que se muestra para cambio de tipo de articulo
                disabled:'=',
                //modobus:'=',


                placeh:'@'

            },
            controller: "BusArtDirectCntrl",
            templateUrl:"static/components/articulos/buscarArtDirect/buscarArtDirect.html?v=" + globalgsvapp
        }
    }
})(IsyplusApp);
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("BusRetDirectCntrl", BusRetDirectCntrl);

    function BusRetDirectCntrl($scope, BaseAutocompServ) {
        BaseAutocompServ.config($scope);

        $scope.onkeydown = function(event){
            BaseAutocompServ.onkeydown($scope,event);
        }

        $scope.onkeyup = function(event){
            BaseAutocompServ.onkeyup($scope, event);
        }

        $scope.sel_item = function(item){
            BaseAutocompServ.sel_item($scope, item);
        }

        $scope.on_lost_focus = function(item){
            BaseAutocompServ.on_lost_focus($scope);
        }

        $scope.$watch("model",
            function( newValue, oldValue ) {
                BaseAutocompServ.on_model_change($scope);
            }
        );
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("buscarRetDirect", buscarRetDirect);

    function buscarRetDirect(){
        return {
            restrict: 'EA',
            scope:{
                tipo:'@',
                data:'=',
                model:'=',
                setup:'=',
                disabled:'='
            },
            controller:'BusRetDirectCntrl',
            templateUrl:"static/components/articulos/buscarRetDirect/buscarRetDirect.html?v=" + globalgsvapp
        }
    }
})();
/**
 * Created by serviestudios on 15/01/16.
 */
(function(module){
    'use strict';
    module.controller('ServiBuscaArtCntrl', ServiBuscaArtCntrl);

    function ServiBuscaArtCntrl($timeout, $element){
        var vm = this;

        //Atributos
        vm.uri = "";
        vm.uriParams = {};
        vm.model = {};
        vm.disabled = false;
        vm.modobus = "bynom";
        vm.tarcodigodef = 1;
        vm.tiposartlist = [
            {
              tar_codigo:1,
              tar_descri:'COMERCIAL',
              tipo:'arts'
            }
        ];

        vm.setup = {
            'propFiltro':'art_nomlar',
            'propFiltroId':'art_id',
            'idprop':vm.elementId,
            'colornull':'#FF0000',
            'fnOnSel':vm.onItemSel,
            'showClearBtn':1
        };

        //metodos
        setSetupAndUri();

        //definicion
        function setSetupAndUri(){
            //Verificar que se haya enviado como parametro valor para tracodigo
            if (!vm.tracodigo){
                vm.tracodigo = 0;
            }

            $timeout(function(){

                vm.uriParams = {
                    modo: 'bynom',
                    tra_codigo: vm.tracodigo,
                    tar_codigo: 1,
                    tra_tiplis: 0,
                    tipo:'arts'
                };

                vm.uri = "/rest/transacc/articulos?search";

                //Setear input de id con el valor indicado
                if (vm.elementId){
                    var input = $element.find("input");
                    input.attr("id",vm.elementId);
                }
            },500);
        }
    }
})(IsyplusApp);
/**
 * Created by serviestudios on 15/01/16.
 */
(function(){
    angular
        .module("isyplus")
        .directive("serviBuscaArt", serviBuscaArt);

    function serviBuscaArt(){
        var directive = {
            restrict: 'EA',
            templateUrl: 'static/components/articulos/serviBuscaArt/serviBuscaArt.html?v=' + globalgsvapp,
            scope: true,
            bindToController:{
                itemsel: '=',
                onItemSel: '=',
                tracodigo: '=',//Codigo de la transaccion que se envia a consulta de articulos para join con modelo contable
                elementId: '@'
            },
            controller: "ServiBuscaArtCntrl",
            controllerAs: 'cntrl'
        };

        return directive;
    }

})();

/**
 * Created by serviestudios on 25/01/16.
 */
(function () {
    'use strict';
    angular.module("isyplus")
        .controller("ServiConversionArtController", ServiConversionArtController);

    function ServiConversionArtController(tartuniequiv, converArtService, swalService, $scope, ModalServ){
        var self = this;

        self.form = {};
        self.parents = [];
        self.parentSel = {};
        self.infoArtParent = {};
        self.infoArtEquiv = {};

        self.loadParents = loadParents;
        self.loadInfoArtEquiv = loadInfoArtEquiv;
        self.loadInfoArtParent = loadInfoArtParent;
        self.calcularNuevoStock = calcularNuevoStock;
        self.grabar = grabar;

        init();

        $scope.$on("changeConversionArtCodigoEvent", function(event, data){
            //En el contraolador padre para cambiar el codigo del articulo de equivalencia, generar un envento changeConversionArtCodigo
            //$scope.$broadcast('changeConversionArtCodigo', articulo);
            self.artCodequiv = data;
            init();
        })

        function init(){
            if (self.artCodequiv>0){
                getForm();
                loadInfoArtEquiv();
                loadParents();
            }
            else{
                //console.log(self.artCodequiv);
            }
        }

        function getForm(){
            var res = converArtService.getForm(function(){
                if (res.estado===200){
                    self.form = res.form;
                    self.form.art_codequiv = self.artCodequiv;
                }
            });
        }

        function loadParents(){
            self.parents = tartuniequiv.listarParents({art_codequiv:self.artCodequiv}, function(){
               //console.log("parents is loaded");
            });
        }

        function loadInfoArtEquiv(){
            var res = tartuniequiv.getInfoArticulo({aue_codigo:self.artCodequiv}, function(){
                if (res.estado === 200){
                    self.infoArtEquiv = res.infoart;
                }
            });
        }

        function loadInfoArtParent(){
            var res = tartuniequiv.getInfoArticulo({aue_codigo:self.parentSel.art_codigo}, function(){
                if (res.estado === 200){
                    self.infoArtParent = res.infoart;
                    self.form.art_codigo = self.parentSel.art_codigo;
                    self.form.art_cantequiv = self.parentSel.art_cantequiv;
                    calcularNuevoStock();
                }
            });
        }

        function calcularNuevoStock(){
            //infoArtEquiv.ars_exist
            self.form.nuevoStock = 0;

            var childCantEquiv = Number(self.form.cantidad) * Number(self.parentSel.art_cantequiv);
            self.form.childCantEquiv = childCantEquiv;

            try{
                if (self.form.cantidad){
                    self.form.nuevoStock = Number(self.infoArtEquiv.ars_exist) + childCantEquiv;
                }
            }
            catch(ex){
                console.log("Error al calcular nuevo stock", ex);
            }
        }

        function grabar(){
            swalService.confirm("", function(confirm){
                if (confirm){
                    var res = converArtService.save({
                        art_codigo:0, form:self.form,
                        parent: self.infoArtParent,
                        child:self.infoArtEquiv
                    }, function(){
                        //console.log("respuesta del servidor es:", res);
                        if (res.estado === 200){
                            ModalServ.hide(self.elementid);
                            toastr.success(res.msg);
                        }
                    });
                }
            });
        }
    }
})();
/**
 * Created by serviestudios on 25/01/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("serviConversionArt", serviConversionArt);

    function serviConversionArt(){
        var directive = {
            restrict: 'EA',
            templateUrl: 'static/components/articulos/serviConversionArt/serviConversionArt.html?v='+globalgsvapp,
            scope: true,
            bindToController:{
                elementid:'@',
                artCodequiv: '='
            },
            controller: "ServiConversionArtController",
            controllerAs: "cntrl"
        };
        return directive;
    }

})();
/**
 * Created by serviestudios on 26/01/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .factory("converArtService", converArtService);

    function converArtService($resource){
        return $resource("/rest/articulos/conversion/:art_codigo", {art_codigo: "@art_codigo"},{
            getForm:{
                method: 'GET',
                params: {
                    accion: 'form'
                }
            }
        });
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("CargaArchivoCntrl", CargaArchivoCntrl);

    function CargaArchivoCntrl($scope, CustomFileReader){
        $scope.read_file = function(){
            $scope.form.progress = 0;
            $scope.form.name = $scope.file['name'];
            $scope.form.size = $scope.file['size'];
            $scope.form.type = $scope.file['type'];
            CustomFileReader.readAsDataUrl($scope.file, $scope)
                .then(function(result) {
                    $scope.form.src = result;
                });
        }
        $scope.clear_file = function(){
            $scope.form = {progress:0,
                name:'',
                size:'',
                type:'',
                src:''};
        }
    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("cargaArchivoDir", cargaArchivoDir);

    function cargaArchivoDir(){
        return {
            restrict: 'EA',
            replace:true,
            scope:{
                form:"=",
                mxsize:'@'//El maximo tamaño de el archivo que se puede subir en kb
            },
            link: function($scope, el){
                el.bind("change", function(e){
                    $scope.file = (e.srcElement || e.target).files[0];
                    var file_size = $scope.file['size'];
                    var leer_archivo = true;
                    if ($scope.form['mxsize']){
                        $scope.mxsize = $scope.form['mxsize'];
                    }
                    if ($scope.mxsize ){
                        var kbsize = file_size/1024.0;
                        if (kbsize>$scope.mxsize){
                            leer_archivo = false;
                            alert("!El tamaño del archivo (" + Math.round(kbsize)+ "kb) sobrepasa el tamaño máximo permitido ("+ $scope.mxsize+ "kb), no se puede cargar!");
                        }
                    }
                    if (leer_archivo){
                        $scope.read_file();
                    }
                    else{
                        $scope.clear_file();
                    }
                })
            },
            controller: "CargaArchivoCntrl",
            template:"<input type='file' class='subir' style='width:100%'/>"
        }
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("PropiedadAdcDirCntrl", PropiedadAdcDirCntrl);

    function PropiedadAdcDirCntrl($scope, $timeout){

        $scope.quitar_imagen = function(){
            console.log("quitar imagen");
            var aux_form = {};
            angular.copy($scope.form, aux_form);
            $scope.form = {
                progress:0,
                name:'',
                size:'',
                type:'',
                src:''
            };

            $timeout(function(){
                for(var prop in aux_form) {
                    console.log(prop);
                    if (prop === 'src'){
                        //console.log("prop is src, no se establece en form");
                    }
                    else{
                        $scope.form[prop] = aux_form[prop];
                    }
                }
            }, 400);
        }
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("propiedadAdcDir", propiedadAdcDir)
    function propiedadAdcDir(){
        return {
            restrict: 'EA',
            replace: false,
            scope:{
                form:"=",
                fnvisiblegendescri: "=",
                fndisabled: "=",
                fnchange: "="
            },
            controller: "PropiedadAdcDirCntrl",
            templateUrl:"static/components/camposadc/propiedadAdcDir/propiedadAdcDir.html?v=" + globalgsvapp
        }
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("propiedadesAdcDir", propiedadesAdcDir);


    function propiedadesAdcDir(){
        return {
            restrict: 'EA',
            replace: false,
            scope:{
                categorias:"=",
                classpanel:"=",
                fnvisible:"=",
                fndisabled: "=",
                fnchange: "="
            },

            controller: function(){


            },
            templateUrl:"static/components/camposadc/propiedadesAdcDir/propiedadesAdcDir.html?v=" + globalgsvapp
        }
    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .filter('estadoFilter', estadoFilter)

    function estadoFilter(){
        return function(prop) {
            return prop === 'T' ? 'ACTIVO' : 'INACTIVO';
        }
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .filter('gmailFechaFilter', gmailFechaFilter);

    function gmailFechaFilter(){
        return function(fecha, format){
            var momment_now = moment(moment().format('DD/MM/YYYY'), "DD/MM/YYYY");
            var tipo_fecha = moment(fecha, "ddd, DD MMM YYYY HH:mm:ss Z");
            var aux_tipo_fecha = moment(tipo_fecha.format('DD/MM/YYYY'), "DD/MM/YYYY");
            var format_hora = "HH:mm";
            var format_dia_hora = "DD MMM";
            var dif = momment_now.diff(aux_tipo_fecha, 'days');

            if (format){
                return tipo_fecha.format("DD MMM, HH:mm:ss a ");
            }
            else{
                if (dif == 0){
                    return tipo_fecha.format(format_hora);
                }
                else{
                    return tipo_fecha.format(format_dia_hora);
                }
            }
        }
    }


})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .filter('gmailFromFilter', gmailFromFilter);

    function gmailFromFilter(){
        return function(from){
            if (from){
                return from.replace(/<.+@.+>/,"");
            }
            else{
                return from;
            }
        }
    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .filter('hasValueFilter', hasValueFilter);

    function hasValueFilter(){
        return function(prop) {
            return prop === 0 ? 'NO' : 'SI';
        };
    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .filter('openFilter', openFilter);

    function openFilter(){
        return function(prop) {
            if (prop === 0) {
                return 'ABIERTO';
            } else if (prop === 1) {
                return 'CERRADO';
            } else if (prop === 2) {
                return 'BLOQUEADO';
            }
        };
    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .filter('revisadoFechaFilter', revisadoFechaFilter);

    function revisadoFechaFilter(){
        return function(fecha){
            if (!fecha){
                return fecha;
            }

            var momment_now = moment(moment().format('DD/MM/YYYY'), "DD/MM/YYYY");
            var tipo_fecha = moment(fecha, "DD/MM/YYYY HH:mm");
            var aux_tipo_fecha = moment(tipo_fecha.format('DD/MM/YYYY'), "DD/MM/YYYY");
            var format_hora = "HH:mm";
            var format_dia_hora = "DD MMM HH:mm";
            var dif = momment_now.diff(aux_tipo_fecha, 'days');
            if (dif == 0){
                tipo_fecha
                return tipo_fecha.format(format_hora);
            }
            else{
                return tipo_fecha.format(format_dia_hora);
            }
        }
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .filter('startFrom', startFrom);
    function startFrom(){ //devuelve un array nuevo de acuerdo a la variable start -> desde start hasta array.length
        return function(input, start) {
            return input.slice(start);
        }
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("ModalCelebrantesDirCntrl", ModalCelebrantesDirCntrl);

    function ModalCelebrantesDirCntrl($scope, ModalServ, ModalCelebrantesService,AlertSrv, $timeout){
        $scope.celebrantes = [];
        $scope.celebrantesselecs = [];
        $scope.filtro_celebrante = {};
        $scope.current_celb_codigo = 0;
        $scope.celb_nvo = {};
        $scope.celb_edit = {};
        $scope.estilorow = "celebrante.celb_estado===1?{'background-color': '#CCCCCC'}:'' ";

        $scope.inicializavars= function(){
            ModalCelebrantesService.getCelebrante(0,$scope)
        }

        $scope.load_celebrantes = function(){
            ModalCelebrantesService.load_celebrantes($scope);
        };
        $scope.sel_celebrante = function(celebrante) {
            if(celebrante.celb_estado === 0){
                if($scope.selecvarios ){
                    var ind = -1;
                    celebrante.sel=!celebrante.sel;
                    //verifica el indice del poryecto seleccioando
                    for(var i in $scope.celebrantesselecs) {
                        if($scope.celebrantesselecs[i].celb_codigo === celebrante.celb_codigo){
                            ind = i;
                            break;
                        }
                    };
                    //agrega o elimina segun variable sel
                    if (celebrante.sel ){
                        if(ind === -1){
                            $scope.celebrantesselecs.push(celebrante);
                        }
                    }else{
                        $scope.celebrantesselecs.splice(ind, 1);
                    }
                }else {

                    $scope.$emit("on_celebrante_sel", {celebrante: celebrante, otro: 'otro'});
                    ModalServ.hide($scope.elementid);
                }
            }else{
                AlertSrv.info('Celebrante deshabilitado', 'INFORMACIÓN');
            }
        };

        $scope.$on("show_modal_celebrante", function(event, data){
            console.log("show_modal_celebrante event----------------->");
            console.log(data)
            $('#'+$scope.elementid).off('show.bs.modal');
            $('#'+$scope.elementid).off('shown.bs.modal');
            $('#'+$scope.elementid).off('hide.bs.modal');
            $scope.current_celb_codigo = data['current']||0;
            $scope.selecvarios = data['selecvarios']||false;
            $scope.celebrantesselecs = data['celebrantesselecs']||[];
            $scope.celb_estado = data['celb_estado'];
            $scope.onhide = data['onhide']||false;
            if($scope.onhide ){
                ModalServ.onHide($scope.elementid, function(e){
                    $scope.onhide();
                });
            }
            ModalServ.onShow($scope.elementid, function(e){
                $scope.load_celebrantes();
                $scope.inicializavars();
            });

            ModalServ.onShown($scope.elementid, function(e){
                $("#celebrante_filter").focus();
            });
            ModalServ.show($scope.elementid);
        });

        $scope.cambiaEstado = function(){
            $scope.celb_estado = $scope.celb_estado === 0? 1:0;
            ModalCelebrantesService.load_celebrantes($scope)
        };

        $scope.guardarCelebrante = function(celebrante,formulario){
            if(formulario.$valid){
                ModalCelebrantesService.guardarCelebrante(celebrante.celb_codigo,celebrante).then(function(rpta){
                    if (rpta.data.estado !== 0) {
                        //AlertSrv.success(rpta.data.msg, 'ÉXITO');
                        $scope.inicializavars();
                        ModalCelebrantesService.load_celebrantes($scope);
                    }
                })
            }else{
                console.log("debe ingresar un nombre")
            }
        };

        $scope.cancelar = function(){
            $scope.inicializavars();
            //ModalCelebrantesService.load_celebrantes($scope);
        };

        $scope.limpiar = function(){
            $scope.inicializavars();
        };

        $scope.cambiarestadoCelebrante = function(item, estado){
            var estadonvo =  estado==0?'HABILITAR':'DESHABILITAR';
            AlertSrv.confirm('USTED VA A '+estadonvo+' EL CELEBRANTE: '+item.celb_nombre+" , ¿DESEA PROSEGUIR?", function(isConfirm) {
                if (isConfirm) {
                    ModalCelebrantesService.cambiarestadoCelebrante(item.celb_codigo, estado).then(function(rpta){
                        if (rpta.data.estado !== 0) {
                            ModalCelebrantesService.load_celebrantes($scope);
                        }
                    });
                }
            })
        };

        $scope.asignar_celb_edit = function(celebrante ){
            $scope.celb_edit = angular.copy(celebrante);
            $timeout(function () {
                $('#nomcelebrante').focus();
            });
        };
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("modalCelebrantesDir", modalCelebrantesDir);

    function modalCelebrantesDir(){
        return {
            restrict: 'AE',
            scope:{
                elementid:'@'
            },
            controller: "ModalCelebrantesDirCntrl",
            templateUrl:"static/components/modal/modalCelebrantesDir/modalCelebrantesDir.html?v="+globalgsvapp
        }
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .service("ModalCelebrantesService", ModalCelebrantesService);

    function ModalCelebrantesService($http){
        this.load_celebrantes = function($scope){
            console.log("carga celebrantes")
            var url = '/rest/celebrante/lsceleb';
            if ($scope.celb_estado === 0){
                url = url+'?byestado='+$scope.celb_estado;
            }
            $http.get(url).then(function(response){
                if (response.data['lstcelebrantes']){
                    $scope.celebrantes = response.data['lstcelebrantes'];
                    //marcar con check los celebrantes seleccionados
                    for (var ind in $scope.celebrantesselecs){
                        for (var ind2 in $scope.celebrantes){
                            if($scope.celebrantesselecs[ind].celb_codigo === $scope.celebrantes[ind2].celb_codigo){
                                $scope.celebrantes[ind2].sel=true;

                            }
                        }

                    }
                    //marcar con check solo un  celebrante seleccionados
                    if($scope.current_celb_codigo !=0){
                        for (var ind2 in $scope.celebrantes){
                            if($scope.celebrantes[ind2].celb_codigo===$scope.current_celb_codigo){
                                $scope.celebrantes[ind2].sel=true;
                                break;
                            }
                        }
                    }
                }
            });
        };
        this.cambiarestadoCelebrante = function(cod, estado){
            var url = '/rest/celebrante/lsceleb/'+cod+'?opc=cambiarestado&estado='+estado;
            return $http.post(url);
        };
        this.guardarCelebrante = function(id,celebrante){
            var cod = id||0;
            return $http.post("/rest/celebrante/lsceleb/"+cod,celebrante);
        };
        this.getCelebrante = function(id, $scope){
            console.log("entra obtener celebrante")
            $http.get('/rest/celebrante/lsceleb/'+id).then(function(rpta){
                $scope.celb_nvo = rpta.data.celebrante;
                $scope.celb_edit = rpta.data.celebrante;
            });
        };
    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("ModalDetallesArtCntrl", ModalDetallesArtCntrl);

    function ModalDetallesArtCntrl($scope, $http, ModalServ) {
        $scope.datos = {};
        $scope.adicionales = [];

        $scope.show_modal = function () {
            ModalServ.show($scope.elementid);
        }

        $scope.load_datos_articulo = function () {
            var self = this;
            $http.get("/rest/transacc/articulo/" + $scope.artcodigo + "?tipo=" + $scope.tipo_arts).then(function (response) {
                if (response.data['articulo']) {
                    $scope.datos = response.data['articulo'];
                    $scope.adicionales = response.data['adicionales'];
                    self.show_modal();
                }
                else {
                    alert("Error al tratar de obtener los detalles del artículo");
                }
            })
        }

        $scope.$on('show_modal_detalles_art_event', function (event, data) {
            $scope.artcodigo = data['art_codigo'];
            $scope.tipo_arts = data['tipo_arts'];
            $scope.load_datos_articulo();
        });
    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("modalDetallesArt", modalDetallesArt);

    function modalDetallesArt(){
        return {
            restrict: 'AE',
            scope:{
                elementid:'@'
            },
            controller: "ModalDetallesArtCntrl",
            templateUrl:"static/components/modal/modalDetallesArt/modalDetallesArt.html?v="+globalgsvapp
        }
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("ModalProyectosDirCntrl", ModalProyectosDirCntrl);

    function ModalProyectosDirCntrl($scope, ModalServ, ModalProyectosService){
        $scope.proyectos = [];
        $scope.proyectosselecs = [];
        $scope.filtro_proy = {};
        $scope.current_pry_codigo = 0;
        $scope.load_proyectos = function(){
            ModalProyectosService.load_proyectos($scope);
        }
        $scope.sel_proyecto = function(proyecto) {
            if($scope.selecvarios){
                var ind = -1;
                proyecto.sel=!proyecto.sel;
                //verifica el indice del poryecto seleccioando
                for(var i in $scope.proyectosselecs) {
                    if($scope.proyectosselecs[i].pry_codigo === proyecto.pry_codigo){
                        ind = i;
                        break;
                    }
                };
                //agrega o elimina segun variable sel
                if (proyecto.sel ){
                    if(ind === -1){
                        $scope.proyectosselecs.push(proyecto);
                    }
                }else{
                    $scope.proyectosselecs.splice(ind, 1);
                }
            }else {
                $scope.$emit("on_centrocosto_sel", {proyecto: proyecto, otro: 'otro'});
                ModalServ.hide($scope.elementid);
            }
        };

        $scope.$on("show_modal_centrocosto", function(event, data){
            console.log("show_modal_centrocosto event----------------->");
            console.log(data)
            $('#'+$scope.elementid).off('show.bs.modal');
            $('#'+$scope.elementid).off('shown.bs.modal');
            $('#'+$scope.elementid).off('hide.bs.modal');
            $scope.current_pry_codigo = data['current']||0;
            $scope.selecvarios = data['selecvarios']||false;
            $scope.proyectosselecs = data['proyectosselecs']||[];
            $scope.pry_estado = data['pry_estado'];
            $scope.onhide = data['onhide']||false;
            if($scope.onhide ){
                ModalServ.onHide($scope.elementid, function(e){
                    $scope.onhide();
                });
            }
            ModalServ.onShow($scope.elementid, function(e){
                $scope.load_proyectos();
            });

            ModalServ.onShown($scope.elementid, function(e){
                $("#centro_costo_filter").focus();
            });
            ModalServ.show($scope.elementid);
        });

        $scope.cambiaEstado = function(){
            $scope.pry_estado = $scope.pry_estado === 0? 1:0;
            ModalProyectosService.load_proyectos($scope)
        };
    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("modalProyectosDir", modalProyectosDir);

    function modalProyectosDir(){
        return {
            restrict: 'AE',
            scope:{
                elementid:'@'
            },
            controller: "ModalProyectosDirCntrl",
            templateUrl:"static/components/modal/modalProyectosDir/modalProyectosDir.html?v="+globalgsvapp
        }
    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .service("ModalProyectosService", ModalProyectosService);

    function ModalProyectosService($http){
        this.load_proyectos = function($scope){
            var url = '/rest/tproyectos';
            if ($scope.pry_estado === 0){
                url = url+'?byestado='+$scope.pry_estado;
            }

            $http.get(url).then(function(response){
                if (response.data['items']){
                    $scope.proyectos = response.data['items'];
                    $scope.session_pry_codigo = response.data['current_pry_codigo'];
                    for (var ind in $scope.proyectosselecs){
                        for (var ind2 in $scope.proyectos){
                            if($scope.proyectosselecs[ind].pry_codigo === $scope.proyectos[ind2].pry_codigo){
                                $scope.proyectos[ind2].sel=true;
                            }
                        }
                    }
                }
            });

            $http.get('/rest/general/0?opc=appconfig').then(function(rpta){
                if(rpta){
                    $scope.acf_nameproyecto = rpta.data['acf_nameproyecto']
                }
            });
        };
    }

})();
/**
 * Created by serviestudios on 20/04/16.
 */
(function (module) {
    'use strict';
    module.controller("ModalRetencionCntrl", ModalRetencionCntrl);

    function ModalRetencionCntrl($scope, $http, $timeout, ListasServ, NumberServ, focusService) {
        var self = this;

        self.tiposRetencion = [];
        self.artsIsLoaded = false;
        self.ttransacc = {};
        self.params = {};
        self.datosFactura = {};
        self.retencionSel = {};
        self.retencionSel.art = {};
        self.indexArtEdit = -1;//Indice de la fila del articul de retencion editado
        self.isEditando = false;
        self.formDetalles = {};
        self.formDetallesInit = {};
        self.formTotales = {};//Totales de la retencion
        self.impuestos = {};
        self.formDatos = {};
        self.formDatosInit = {};
        self.formTotalesInit= {};
        self.rep_printtype = 0;
        self.se_imprime_transacc = 0;
        self.articulos = [];

        self.onRetencionSel = onRetencionSel;
        self.editarRetencion = editarRetencion;
        self.actualizarRetencion = actualizarRetencion;
        self.quitarRetencion = quitarRetencion;
        self.agregarRetencion = agregarRetencion;
        self.setFocus = setFocus;
        self.agregarActualizarRet = agregarActualizarRet;
        self.closeModal = closeModal;

        $scope.$on("add_pagoretencion_event", onShowModalRetencionEvent);

        function init() {
            $http.get("/rest/creatransacc/"+self.params.pro_codigo+"/"+self.params.tra_codigo_ret+"/0?accion=retencion&tra_codigo_from="+self.params.tra_codigo_from).then(function(response){

                if ( response.data['ttransacc'] ) {
                    self.ttransacc = response.data['ttransacc'];
                    self.impuestos = response.data['impuestos'];
                    self.formDatos = response.data['form_datos'];
                    self.formDetalles = response.data['form_detalles'];
                    self.formTotales = response.data['form_totales'];
                    self.rep_printtype = response.data['rep_printtype'];
                    self.se_imprime_transacc = response.data['se_imprime_transacc'];

                    self.formDetallesInit = {};
                    angular.copy(self.formDetalles, self.formDetallesInit);

                    self.formTotalesInit= {};
                    angular.copy(self.formTotales, self.formTotalesInit);

                    if (response.data['articulos_disp']){
                        self.tiposRetencion = response.data['articulos_disp'];
                    }
                    if (response.data['totales_ant']){
                        self.totalesAnt = response.data['totales_ant'];
                    }
                    self.form.isRetencionLoaded = 1;
                }
            });
        }

        function setFocus(elid){
            focusService.setFocus(elid,100);
        }

        function onShowModalRetencionEvent(event, data) {
            self.params = data.params;
            self.datosFactura = data.datosFactura;//Se debe pasar el total y subtotal de la factura de la cual se desea hacer la retencion

            if (data.isRetencionLoaded){
                console.log("Los datos de la retencion ya fueron cargados se muestra modal para edicion de la retencion");
            }
            else{
                console.log("Se trae informacion de la transaccion de retencion");
                init();
            }

            focusService.setFocus("art_trn_ret", 600);
        }

        function getTotalesBaseImp() {
            var max_renta = self.datosFactura['subt'] || 0.0;
            var max_iva = self.datosFactura['ivaval'] || 0.0;

            var lista_renta = ListasServ.filtrar(self.articulos, {ret_calc: 1});
            var lista_iva = ListasServ.filtrar(self.articulos, {ret_calc: 2});

            var total_renta = ListasServ.sumarColumna(lista_renta, 'dt_precio');
            var total_iva = ListasServ.sumarColumna(lista_iva, 'dt_precio');
            return {'total_renta': total_renta, 'total_iva': total_iva, 'max_renta': max_renta, 'max_iva': max_iva};
        }

        function getTotalesBaseImpWithoutFormdet() {
            var max_renta = self.datosFactura['subt'] || 0.0;
            var max_iva = self.datosFactura['ivaval'] || 0.0;
            var lista_renta = [];
            var lista_iva = [];
            $.each(self.tiposRetencion, function (index, fila) {
                if (index !== self.indexArtEdit) {
                    if (fila['ret_calc'] === 1) {
                        lista_renta.push(fila);
                    }
                    else if (fila['ret_calc'] === 2) {
                        lista_iva.push(fila);
                    }
                }
            });
            var total_renta = ListasServ.sumarColumna(lista_renta, 'dt_precio');
            var total_iva = ListasServ.sumarColumna(lista_iva, 'dt_precio');
            return {'total_renta': total_renta, 'total_iva': total_iva, 'max_renta': max_renta, 'max_iva': max_iva};
        }

        function verifTotales() {
            var totales = getTotalesBaseImp();
            if (self.isEditando) {
                totales = getTotalesBaseImpWithoutFormdet();
            }

            if (totales.max_renta === 0.0) {
                //No validar
            }
            else {
                var maxivaval = NumberServ.redondear(totales.max_iva, 2);
                var maxsubt = NumberServ.redondear(totales.max_renta, 2);
                var total_renta = totales.total_renta;
                var total_iva = totales.total_iva;

                var valid_iva = (self.formDetalles.ret_calc === 2);
                var bimp_ingresada = self.formDetalles.dt_precio;
                if (valid_iva) {
                    var totiva = NumberServ.redondear(Number(total_iva) + Number(bimp_ingresada), 2);
                    if (NumberServ.isNumberAMayorToB(totiva, maxivaval)) {
                        alert("El monto total de base imponible (" + totiva + ") no puede sobrepasar el total de iva del comprobante (" + maxivaval + ")");
                        return false;
                    }
                }
                else {
                    var totrent = NumberServ.redondear(Number(total_renta) + Number(bimp_ingresada), 2);
                    if (NumberServ.isNumberAMayorToB(totrent, maxsubt)) {
                        alert("La monto total de base imponible (" + totrent + ") no puede sobrepasar al subtotal del comprobante (" + maxsubt + ")");
                        return false;
                    }
                }
            }
            return true;
        }

        function onRetencionSel(item) {
            //Cargar los datos del item seleccionado en el formulario
            for (var prop in item) {
                self.formDetalles[prop] = item[prop];
            }
            self.formDetalles.dt_cant = 1;

            var base_imponible = self.datosFactura['subt'] || 0.0;
            if (item['ret_calc'] === 2) {//1:renta, 2:iva
                base_imponible = self.datosFactura['ivaval'] || 0.0;
            }
            var impuesto = base_imponible * item['ret_valor'];
            self.formDetalles.dt_precio = NumberServ.redondear(base_imponible, 2);
            self.formDetalles.dt_total = NumberServ.redondear(impuesto, 2);

            focusService.setFocus("base_imponible_ret", 200);
        }

        function editarRetencion(fila) {
            self.retencionSel.art = {};
            angular.copy(fila, self.retencionSel.art);
            self.formDetalles = {};
            angular.copy(fila, self.formDetalles);
            self.isEditando = true;
            self.indexArtEdit = self.articulos.indexOf(fila);
            focusService.setFocus("base_imponible_ret", 200);
        }

        function initFormDetalles() {
            self.formDetalles = {};
            angular.copy(self.formDetallesInit, self.formDetalles);
            self.formDetalles.dt_observ = '';
        }

        function actualizarRetencion() {
            var verif_tot = verifTotales();
            if (verif_tot) {
                self.formDetalles.dt_total = NumberServ.redondear(Number(self.formDetalles.dt_precio) * Number(self.formDetalles.ret_valor), 2);
                self.articulos[self.indexArtEdit] = self.formDetalles;
                calcularTotales();
                self.retencionSel.art = {};
                initFormDetalles();
                focusService.setFocus("art_trn_ret", 100);
                self.isEditando = false;
                self.indexArtEdit = -1;
            }
            else {
                toastr.warning("No se actualizó");
            }
        }

        function agregarActualizarRet(){
            if (self.isEditando) {
                actualizarRetencion();
            }
            else {
                agregarRetencion();
            }
        }

        function quitarRetencion(fila) {
            ListasServ.removeItem(self.articulos, fila);
            calcularTotales();
        }

        function agregarRetencion(){
            var verif_tot = verifTotales();
            if (verif_tot){
                self.formDetalles.dt_total = NumberServ.redondear(Number(self.formDetalles.dt_precio) * Number(self.formDetalles.ret_valor),2);
                if ( !self.retencionSel.art['art_codigo'] > 0 ){
                    $timeout(function(){
                        alert("Seleccione la retención");
                        focusService.setFocus("art_trn_ret",100);
                    },100);
                }
                else{
                    self.articulos.push(self.formDetalles);
                    calcularTotales();
                    self.retencionSel.art = {};
                    initFormDetalles();
                    focusService.setFocus("art_trn_ret",100);
                }
            }
            else{
                toastr.warning("No se agregó");
            }
        }

        function calcularTotales(){
            var sub12 = 0;
            var sub0 = 0;
            var subise = 0;
            var totalice = 0;
            angular.forEach(self.articulos, function(value, key){
                sub0+=value['dt_total'];
            });
            var subt = sub12 + sub0;
            var ivaval = 0.0;
            var impservval = 0.0;
            var total = subt+ivaval+impservval+totalice;

            self.formTotales.sub12 = sub12;
            self.formTotales.sub0 = sub0;
            self.formTotales.subt = subt;
            self.formTotales.ivaval = ivaval;
            self.formTotales.total = total;
            self.formTotales.impservval = impservval;
            self.formTotales.totalice = totalice;

            self.form.dt_valor = NumberServ.redondear(total, 2);
        }

        function closeModal(){
            //Validar que se haya ingresado articulos de la retencion
            self.form.datos_retencion = {
                form_datos: self.formDatos,
                impuestos: self.impuestos,
                articulos: self.articulos,
                pagos: [],
                form_totales: self.formTotales,
                listapropsadc: [],
                rep_printtype: self.rep_printtype,
                se_imprime_transacc: self.se_imprime_transacc,
                tra_tippag: self.ttransacc.tra_tippag,
                tra_codigo: self.ttransacc.tra_codigo
            };

            self.fnguardar();
        }
    }
})(IsyplusApp);
/**
 * Created by serviestudios on 20/04/16.
 */
(function (module) {
    'use strict';

    module.directive("modalRetencion", modalRetencion);

    function modalRetencion(){
        return {
            restrict:'EA',
            replace: true,
            templateUrl: 'static/components/modal/modalRetencion/modalRetencion.html?v='+globalgsvapp,
            scope: true,
            bindToController:{
                elementid:'@',
                form:'=',
                fnguardar:'&'
            },
            controller: "ModalRetencionCntrl",
            controllerAs: "cntrl"
        }
    }

})(IsyplusApp);
/**
 * Created by yesica on 23/02/16.
 */

(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("ModalSeccionesDirCntrl", ModalSeccionesDirCntrl);

    function ModalSeccionesDirCntrl($scope, ModalServ, ModalSeccionesService){
        $scope.secciones = [];
        $scope.seccionesselecs = [];
        $scope.filtro_secc = {};
        $scope.session_sec_codigo  = 0;
        $scope.load_secciones = function(){
            ModalSeccionesService.load_secciones($scope);
        }
        $scope.sel_seccion = function(seccion) {
            if($scope.selecvarios){
                var ind = -1;
                seccion.sel=!seccion.sel;
                //verifica el indice del poryecto seleccioando
                for(var i in $scope.seccionesselecs) {
                    if($scope.seccionesselecs[i].pry_codigo === seccion.pry_codigo){
                        ind = i;
                        break;
                    }
                };
                //agrega o elimina segun variable sel
                if (seccion.sel ){
                    if(ind === -1){
                        $scope.seccionesselecs.push(seccion);
                    }
                }else{
                    $scope.seccionesselecs.splice(ind, 1);
                }
            }else {
                $scope.$emit("on_seccion_sel", {seccion: seccion, otro: 'otro'});
                ModalServ.hide($scope.elementid);
            }
        };


        $scope.$on("show_modal_secciones", function(event, data){
            console.log("show_modal_secciones event----------------->");
            console.log(data)
            $('#'+$scope.elementid).off('show.bs.modal');
            $('#'+$scope.elementid).off('shown.bs.modal');
            $('#'+$scope.elementid).off('hide.bs.modal');
            $scope.session_sec_codigo = data['current']||0;
            $scope.selecvarios = data['selecvarios']||false;
            $scope.seccionesselecs = data['seccionesselecs']||[];
            $scope.onhide = data['onhide']||false;
            if($scope.onhide ){
                ModalServ.onHide($scope.elementid, function(e){
                    $scope.onhide();
                });
            }
            ModalServ.onShow($scope.elementid, function(e){
                $scope.load_secciones();
            });

            ModalServ.onShown($scope.elementid, function(e){
                $("#seccion_filter").focus();
            });
            ModalServ.show($scope.elementid);
        });


    }

})();
/**
 * Created by yesica on 23/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("modalSeccionesDir", modalSeccionesDir);

    function modalSeccionesDir(){
        return {
            restrict: 'AE',
            scope:{
                elementid:'@'
            },
            controller: "ModalSeccionesDirCntrl",
            templateUrl:"static/components/modal/modalSeccionesDir/modalSeccionesDir.html?v="+globalgsvapp
        }
    }

})();
/**
 * Created by yesica on 23/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .service("ModalSeccionesService", ModalSeccionesService);

    function ModalSeccionesService($http){
        this.load_secciones = function($scope){
            var url = '/rest/tseccion?opc=allsecAndAlm';

            $http.get(url).then(function(response){
                if (response.data['estado']==1){
                    $scope.secciones = response.data['seccionesls'];
                    var ind = 0;
                    var ind2 = 0;
                    for (ind ; ind < $scope.seccionesselecs.length ; ind++){
                        ind2 = 0;
                        for (ind2 ; ind2 < $scope.secciones.length; ind2++){
                            if($scope.seccionesselecs[ind].sec_codigo === $scope.secciones[ind2].sec_codigo){
                                $scope.secciones[ind2].sel=true;
                            }
                        }
                    }
                }
            });

            $http.get('/rest/general/0?opc=appconfig').then(function(rpta){
                if(rpta){
                    $scope.acf_nameproyecto = rpta.data['acf_nameproyecto']
                }
            });
        };
    }

})();

/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("ModalPagoCreditoCntrl", ModalPagoCreditoCntrl);

    function ModalPagoCreditoCntrl($scope, TBancoServ, CreditosTransaccServ, ListasServ, NumberServ, ReferenteSrv, GeneralSrv) {
        $scope.bancos = [];
        $scope.banco_sel = {};
        $scope.cta_contable_sel = {};
        $scope.ctas_contables = [];
        $scope.show_crea_cred = 1;
        $scope.clp_codigo = 0;
        $scope.creditos = [];
        $scope.cols_creditos = [];
        //$scope.trn_codigo_fact = 0;//Se usa en retenciones si trn_codig_fact es >0 entonces se trata de una retencion
        $scope.modal_size = '';
        $scope.pago_cred_ref_disabled = false;

        var montoTotalFactura = "";//Se debe pasara desde la pantalla que use este modal el total de la factura para validacion

        $scope.$watch("cta_contable_sel", function(newValue, oldValue){
            $scope.modal_size = " ";
            if ($scope.ttransaccpago){
                var ttp_signo = $scope.form['ttp_signo'];
                var tct_codigo = $scope.ttransaccpago['tct_codigo'];
                $scope.show_crea_cred = 1;

                if ( (tct_codigo===2) && (ttp_signo===1)){//se debe hacer un registro en tasiabono-->
                    $scope.show_crea_cred = 0;
                }
                else if( (tct_codigo===1) && (ttp_signo===-1)){//se debe hacer un registro en tasiabono-->
                    $scope.show_crea_cred = 0;
                }

                if ($scope.show_crea_cred===0){
                    //Listar los creditos del referente y la cuenta seleccionada
                    $scope.load_creditos();
                    $scope.modal_size = "modal-lg";
                }
                else{
                    $scope.creditos = [];
                    $scope.cols_creditos = [];
                }
            }
        });

        $scope.onMarcaCreditoChange = function(item, val_marcado){
            ListasServ.limpiarMarcados($scope.creditos, {marcado:true}, 'marcado');//Limpia todos los marcados
            item.marcado = val_marcado;
            if (item.marcado){
                $scope.form.dt_codcre = item.dt_codigo;
                var saldo = NumberServ.redondear(item['saldo'],2);
                //var monto_total =  NumberServ.redondear($scope.$parent.form_totales['total'], 2);
                //if (saldo > monto_total){
                if (saldo > montoTotalFactura){
                    $scope.form.dt_valor = montoTotalFactura;
                }
                else{//monto total es mayor o igual al saldo
                    $scope.form.dt_valor = saldo;
                }
            }
        };

        $scope.onFilaCredClick = function(item){
            var val_marcado = item['marcado']||false;
            $scope.onMarcaCreditoChange(item, !val_marcado);
        };

        $scope.onChekClick = function(item){
            var val_marcado = item['marcado']||false;
            $scope.onMarcaCreditoChange(item, val_marcado);
        };

        $scope.load_creditos = function(){
            if ($scope.cta_contable_sel['cta_codigo']){
                var params = {
                    cta_codigo:$scope.cta_contable_sel['cta_codigo'],
                    clp_codigo:$scope.clp_codigo,
                    clc_id:$scope.ttransaccpago['clc_id']
                };
                CreditosTransaccServ.listar_creditos(params,function(response){
                    if(response.data['items']){
                        $scope.creditos = response.data['items'];
                        $scope.cols_creditos = response.data['cols'];
                    }
                });
            }
            else{
                $scope.creditos = [];
                $scope.cols_creditos = [];
            }
        };

        $scope.find_cta_contable = function(cta_codigo_def){
            /*
            console.log("find_cta_contable --->");
            console.log("cta_codigodef:", cta_codigo_def);
            console.log("$scope.ctas_contables:", $scope.ctas_contables);
            */

            $scope.form['cta_codigo'] = cta_codigo_def;
            $scope.cta_contable_sel = {};
            $.each($scope.ctas_contables, function(index, value){
                console.log($scope.form['cta_codigo'], value['cta_codigo'], $scope.form['cta_codigo'] === value['cta_codigo']);
                if ($scope.form['cta_codigo'] === value['cta_codigo']){
                    $scope.cta_contable_sel = value;
                }
            });

            if ($scope.show_crea_cred===0){
                $scope.modal_size = "modal-lg";
            }
            else{
                $scope.modal_size = " ";
            }
        };

        $scope.on_cta_contable_change = function(){
            //console.log("cta contable change------------>");
            $scope.form['cta_codigo'] = $scope.cta_contable_sel['cta_codigo'];
            $scope.form['ttp_signo'] = $scope.cta_contable_sel['ttp_signo'];
        };

        $scope.find_banco = function(){
            $.each($scope.bancos, function(index, value){
                if ($scope.form['tasicredito']['cre_codban']===value['ban_codigo']){
                    $scope.banco_sel = value;
                }
            });
        };

        $scope.on_banco_change = function(){
            $scope.find_banco();
            $scope.form['tasicredito']['ban_nombre'] = $scope.banco_sel['ban_nombre'] || '';
        };

        $scope.load_bancos = function(){
            TBancoServ.listar_por_tipo(2, function(response){
                if (response.data['items']){
                    $scope.bancos = response.data['items'];
                }
            });
        };

        $scope.load_info_ref = function() {
            console.log("Valor para clp_codigo es:");
            console.log($scope.form['clp_codigo']);
            var clp_codigo = $scope.form['clp_codigo']||0;
            if (clp_codigo != 0){
                ReferenteSrv.getReferenteNoComps(clp_codigo).then(function(res){
                    console.log('Info del referente es:');
                    if(res.data['estado']==1){
                        GeneralSrv.copyValues(res.data['ref'], $scope.form);
                    }
                });
            }
        };

        $scope.validarPago = function(){
            var cerraModal = true;
            if ($scope.show_crea_cred===0){
                if (!$scope.form.dt_codcre || $scope.form.dt_codcre===0){
                    toastr.error("Debe seleccionar el crédito");
                    cerraModal = false;
                }
            }

            if (cerraModal){
                $scope.fnguardar();
            }
        };

        $scope.$on('add_tasicredito_event', function(event, data) {
            $scope.ttransaccpago = data['forma_pago_sel'];
            var cta_codigo_def =  data['cta_codigo_def'];
            $scope.clp_codigo = data['clp_codigo'];
            $scope.ctas_contables = $scope.ttransaccpago['subitems'];
            $scope.load_bancos();
            $scope.find_cta_contable(cta_codigo_def);
            montoTotalFactura = data['totalFactura']||0.0;
        });
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("modalPagoCredito", modalPagoCredito);

    function modalPagoCredito(){

        return {
            restrict: 'AE',
            scope:{
                elementid:'@',
                form:'=',
                fnguardar:'&',
                fnlistaref:'&'
            },
            controller: "ModalPagoCreditoCntrl",
            templateUrl:"static/components/modal/pagos/modalPagoCredito/modalPagoCredito.html?v="+globalgsvapp
        }

    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("ModalPagoDocumentoCntrl", ModalPagoDocumentoCntrl);

    function ModalPagoDocumentoCntrl($scope, TTipdocServ, TBancoServ, ReferenteSrv, GeneralSrv){
        $scope.tiposdoc = [];
        $scope.bancos = [];
        $scope.tipo_doc_sel = {};
        $scope.banco_sel = {};

        $scope.find_tipo_doc = function(){
            $.each($scope.tiposdoc, function(index, value){
                if ($scope.form['tasidocum']['td_codigo']===value['td_codigo']){
                    $scope.tipo_doc_sel = value;
                }
            });
        }

        $scope.find_banco = function(){
            $.each($scope.bancos, function(index, value){
                if ($scope.form['tasidocum']['doc_codban']===value['ban_codigo']){
                    $scope.banco_sel = value;
                }
            });
        }

        $scope.$watchCollection("tiposdoc", function(newValue, oldValue){
            if (newValue && newValue.length>0){
                if ($scope.form['editando']===true){
                    $scope.find_tipo_doc();
                    $scope.on_tipo_doc_change();
                }
            }
        })

        $scope.$watchCollection("bancos", function(newValue, oldValue){
            if (newValue && newValue.length>0){
                if ($scope.form['editando']===true){
                    $scope.find_banco();
                }
            }
        })

        $scope.load_tipos_doc = function(){
            if ( $scope.ttransaccpago['ttp_coddocs'].length>0 ){
                TTipdocServ.listar_por_coddocs($scope.ttransaccpago['ttp_coddocs'], function(response){
                    if (response.data['items']){
                        $scope.tiposdoc = response.data['items'];
                    }
                });
            }else{
                console.log("no encontro ttp_coddocs es")
                console.log($scope.ttransaccpago)
                $scope.tiposdoc=[];
                $scope.bancos = [];
            }
        };
        $scope.on_tipo_doc_change = function(){
            var params = { tra_codigo:$scope.ttransacc['tra_codigo'],
                tra_tippag:$scope.ttransacc['tra_tippag'],
                td_emited:$scope.tipo_doc_sel != undefined?$scope.tipo_doc_sel['td_emited']:null ,
                clc_infadi:$scope.ttransaccpago['clc_infadi'],
                clc_codigo:$scope.ttransaccpago['clc_codigo']
            };
            $scope.form['tasidocum']['td_codigo'] = $scope.tipo_doc_sel != undefined? $scope.tipo_doc_sel['td_codigo']:null;
            $scope.form['tasidocum']['td_descri'] = $scope.tipo_doc_sel != undefined? $scope.tipo_doc_sel['td_descri']:null;

            if ($scope.ttransaccpago['clc_id'] == 'BA'){
                $scope.form['tasidocum']['doc_emited'] = 1;
            }
            else{
                $scope.form['tasidocum']['doc_emited'] = 0;
            }
            if ( $scope.ttransaccpago['ttp_coddocs'].length>0 && params.td_emited!=null ) {
                TBancoServ.listar_para_formas_pago(params, function (response) {
                    $scope.bancos = response.data['items'] || [];
                    $scope.tipo_bancos = response.data['tipo'] || 'bancos';
                    console.log("valor para tipo_bancos es: ");
                    console.log($scope.tipo_bancos);
                });
            }else{
                $scope.bancos = [];
                $scope.tipo_bancos = 'bancos';

            }
        }

        $scope.on_banco_change = function(){
            if ($scope.banco_sel!= undefined) {
                if ($scope.banco_sel['cta_codigo']) {
                    $scope.form['cta_codigo'] =  $scope.banco_sel['cta_codigo'];
                    $scope.form['ttp_signo'] = $scope.banco_sel['ttp_signo'];
                }
                $scope.form['tasidocum']['doc_codban'] = $scope.banco_sel['ban_codigo'];
                $scope.form['tasidocum']['ban_nombre'] = $scope.banco_sel['ban_nombre'];
            }
        }

        $scope.buscar_ref = function(){
            var aux_clp_cedruc = $scope.form.tasidocum.clp_cedruc;
            if (!(aux_clp_cedruc && aux_clp_cedruc.length>0)){
                alert('Ingrese el número de ci/ruc del referente');
                return;
            }
            ReferenteSrv.getReferenteByCedNoComps(aux_clp_cedruc).then(function(response){
                if(response.data['estado']>=1){
                    GeneralSrv.copyValues(response.data['ref'], $scope.form.tasidocum);
                }
                if (response.data['estado']==2){
                    toastr.warning("Referente no registrado");
                    $scope.form.tasidocum.clp_cedruc = aux_clp_cedruc;
                }
            })
        }

        $scope.$on('add_tasidocum_event', function(event, data) {
            $scope.ttransaccpago = data['forma_pago_sel'];
            $scope.load_tipos_doc();
        });
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("modalPagoDocumento", modalPagoDocumento);

    function modalPagoDocumento(){
        return {
            restrict: 'AE',
            scope:{
                elementid:'@',
                form:'=',
                ttransacc:'=',
                ttransaccpago:'=',
                fnguardar:'&'
            },
            controller: "ModalPagoDocumentoCntrl",
            templateUrl:"static/components/modal/pagos/modalPagoDocumento/modalPagoDocumento.html?v="+globalgsvapp
        }
    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("ModalPagoGeneralCntrl", ModalPagoGeneralCntrl);

    function ModalPagoGeneralCntrl($scope){
        $scope.ctas_contables = [];
        $scope.cta_contable_sel = {};

        $scope.on_cta_contable_change = function(){
            $scope.form['cta_codigo'] = $scope.cta_contable_sel['cta_codigo'];
            $scope.form['ttp_signo'] = $scope.cta_contable_sel['ttp_signo'];
        }

        $scope.find_cta_contable = function(cta_codigo_def){
            $scope.form['cta_codigo'] = cta_codigo_def;
            $scope.cta_contable_sel = {};
            $.each($scope.ctas_contables, function(index, value){
                if ($scope.form['cta_codigo'] === value['cta_codigo']){
                    $scope.cta_contable_sel = value;
                }
            });
        }

        $scope.$on('add_pagogen_event', function(event, data) {
            $scope.ttransaccpago = data['forma_pago_sel'];
            var cta_codigo_def =  data['cta_codigo_def'];
            $scope.ctas_contables = $scope.ttransaccpago['subitems'];
            $scope.find_cta_contable(cta_codigo_def);
        });
    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("modalPagoGeneral", modalPagoGeneral);

    function modalPagoGeneral(){
        return {
            restrict: 'AE',
            scope:{
                elementid:'@',
                form:'=',
                fnguardar:'&'
            },
            controller: "ModalPagoGeneralCntrl",
            templateUrl:"static/components/modal/pagos/modalPagoGeneral/modalPagoGeneral.html?v="+globalgsvapp
        }
    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("BuscarRefDirecCntrl", BuscarRefDirecCntrl);

    function BuscarRefDirecCntrl($scope, ReferenteSrv, GeneralSrv,AlertSrv, $timeout){
        $scope.valido = true;
        $scope.quitar_marca_rojo = function(){
            //$("#"+$scope.elementid).css("background-color","white");
            //$("#"+$scope.elementid).parent().removeClass("has-error");
        };

        $scope.poner_marca_rojo = function(){
            //$("#"+$scope.elementid).parent().addClass("has-error");
            //$("#"+$scope.elementid).css("background-color","#F08686");
        }

        $scope.validar_tipo_doc = function(){
            var length = ($scope.referente['clp_cedruc'] || "").length;
            if ( length >0  ){
                if ( length!==13 ){
                    if ($scope.trarefdoc===2){//Solo se permite ingresar ruc
                        AlertSrv.warning( "Ingrese un número de ruc válido", 'ADVERTENCIA');
                        return false;
                    }
                }
                else if (length!==10){
                    if ($scope.trarefdoc === 1){//Solo permite ingresar cedula
                        AlertSrv.warning( "Ingrese un numero de cédula válido", 'ADVERTENCIA');
                        return false;
                    }
                }
            }
            return true;
        }

        $scope.validar_nuevo = function(){
            var length = ($scope.referente['clp_cedruc'] || "").length;
            if ( length >0  ){
                if ( length===10 ){//Debo validar cedula
                    //Validar tipo de documento que puede ingresar
                    $scope.valido = GeneralSrv.esCedulaValida($scope.referente['clp_cedruc']);
                    $scope.referente['clp_tipoid'] = '05';
                }
                else if (length===13){
                    $scope.valido = GeneralSrv.esRucValido($scope.referente['clp_cedruc']);
                    $scope.referente['clp_tipoid'] = '04';
                }
                else{
                    $scope.valido = false;
                    $scope.referente['clp_tipoid'] = '';
                }
            }
        }

        $scope.validar_existente = function(){
            var length = ($scope.referente['clp_cedruc'] || "").length;
            if ( length >0  ){
                if ( $scope.referente['clp_tipoid'] === '05' ){
                    $scope.valido = GeneralSrv.esCedulaValida($scope.referente['clp_cedruc']);
                }
                else if ( $scope.referente['clp_tipoid'] === '04' ){
                    $scope.valido = GeneralSrv.esRucValido($scope.referente['clp_cedruc']);
                }
                else if ( $scope.referente['clp_tipoid']=='' ) {
                    $scope.valido = false;
                }
                else{
                    $scope.valido = true;
                }
            }
        }

        $scope.buscar_ref = function(){
            var aux_clp_cedruc = $scope.referente.clp_cedruc;
            if (!(aux_clp_cedruc && aux_clp_cedruc.length>0)){
                    AlertSrv.warning( 'Ingrese el número de CI/RUC del referente', 'ADVERTENCIA');
                GeneralSrv.setFocus($scope.elementid);
                return;
            }

            var continuar = $scope.validar_tipo_doc();
            if (!continuar){
                $scope.clear_referente();
                return;
            }

            ReferenteSrv.getReferenteByCedNoComps(aux_clp_cedruc).then(function(response){
                if(response.data['estado']>=1){
                    GeneralSrv.copyValues(response.data['ref'], $scope.referente);
                }
                if (response.data['estado']==1){
                    $scope.validar_existente();
                    $scope.onreffind();
                }
                else if (response.data['estado']==2){
                    toastr.warning("Referente no registrado");
                    $scope.referente.clp_cedruc = aux_clp_cedruc;
                    $scope.validar_nuevo();
                    $scope.onrefnull();
                }
            })
        }

        $scope.$watch("valido", function(newValue, oldValue){
            if (newValue===true){
                $scope.quitar_marca_rojo();
            }
            else if (newValue===false){
                $scope.poner_marca_rojo();
            }
        });

        $scope.clear_referente = function(){
            //$scope.referente['clp_tipoid']  = '';
            $scope.referente['clp_cedruc']  = '';
            $scope.referente['clp_codigo']  = 0;
            $scope.referente['clp_nombre']  = '';
            $scope.referente['clp_apelli']  = '';
            $scope.referente['clp_direcc']  = '';
            $scope.referente['clp_telefo']  = '';
            $scope.referente['clp_email']  = '';
        }

        $scope.$watch("referente", function(newValue, oldValue){
            //console.log("watch referente--->newvalue val is:");
            //console.log(newValue);
            var newclp_cedruclent = 0;
            if (newValue){
                newclp_cedruclent = (newValue['clp_cedruc']||'').length;
            }
            if (newclp_cedruclent>0){
                //console.log("verificar tipo de identificacion en funcion de trarefdoc --->");
                $timeout(function(){
                    if ( !$scope.validar_tipo_doc() ){
                        $scope.clear_referente();
                    }
                },100);
            }
        })
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("buscarRefDirec", buscarRefDirec);

    function buscarRefDirec(){
        return {
            restrict: 'AE',
            scope:{
                elementid:'@',
                referente:'=',
                onreffind:'&',
                onrefnull:'&',
                onreflista:'&',
                disabled:'=',
                trarefdoc:'=',//Permite validar el tipo de documento que se ingresa
                placeholder:'=?'
            },
            controller:"BuscarRefDirecCntrl",
            templateUrl:'static/components/referente/buscarRefDirec/buscarRefDirec.html?v='+globalgsvapp
        }
    }

})();
/**
 * Created by serviestudios on 31/03/16.
 */
(function (module) {
    'use strict';

    module.controller("BuscarefCheckCntrl", BuscarefCheckCntrl);

    function BuscarefCheckCntrl($scope, BaseAutocompServ, GeneralSrv) {

        BaseAutocompServ.config($scope);

        $scope.onkeydown = onkeydown;
        $scope.onkeyup = onkeyup;
        $scope.sel_item = sel_item;
        $scope.on_lost_focus = on_lost_focus;
        $scope.onCheckClick =  onCheckClick;

        $scope.$watch("model",
            function( newValue, oldValue ) {
                BaseAutocompServ.on_model_change($scope);
            }
        );

        init();

        function init(){
            if (!$scope.setup.labelCheck){
                $scope.setup.labelCheck = "setlabelcheck";
            }
            $scope.idbtncheck = 'btncheck_' + Math.random();//Id del input
            if ($scope.setup.idbtncheck){
                $scope.idbtncheck = $scope.setup.idbtncheck;
            }
        }

        function onCheckClick(){
            $scope.ischeck = $scope.ischeck?false:true;
            if ($scope.ischeck){
                GeneralSrv.setFocusWithTimeout($scope.setup.idprop, 100);
            }
        }

        function onkeydown(event){
            BaseAutocompServ.onkeydown($scope,event);
        }

        function onkeyup(event){
            BaseAutocompServ.onkeyup($scope, event);
        }

        function sel_item(item){
            BaseAutocompServ.sel_item($scope, item);
        }

        function on_lost_focus(item){
            BaseAutocompServ.on_lost_focus($scope);
        }
    }

})(IsyplusApp);
/**
 * Created by serviestudios on 31/03/16.
 */
(function (module) {
    'use strict';

    module.directive("serviBuscarefCheck", serviBuscarefCheck);

    function serviBuscarefCheck(){
        return {
            restrict: 'EA',
            scope:{
                tipo:'@',
                data:'=',
                model:'=',
                ischeck: '=',
                uri:'@',
                setup:'=',
                onlistaclick:'&'
            },
            controller:'BuscarefCheckCntrl',
            templateUrl:"static/components/referente/serviBuscarefCheck/serviBuscarefCheck.html?v=" + globalgsvapp
        }
    }

})(IsyplusApp);
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("anioDir", anioDir);

    function anioDir(){
        return {
            restrict: 'E',
            scope:{
                form:"=",
                setup:"=",
                disabled:"="
            },
            controller: "AnioMesDirCntrl",
            templateUrl:"static/components/rfechas/anioDir/anioDir.html?v=" + globalgsvapp
        }
    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("AnioMesDirCntrl", AnioMesDirCntrl);

    function AnioMesDirCntrl($scope, FechasServ, NumberServ){
        $scope.label_mes_desde = "";
        $scope.label_mes_hasta = "";
        $scope.idpropdesde = 'desde';
        $scope.idprophasta = 'hasta';
        $scope.anioa = "";
        $scope.aniob = "";
        $scope.mesa = "";
        $scope.mesb = "";

        $scope.auxfnenter = function(){};

        if ($scope.setup['fnondesdeenter']){
            $scope.fnondesdeenter = $scope.setup['fnondesdeenter'];
        }
        if ($scope.setup['fnonhastaenter']){
            $scope.fnonhastaenter = $scope.setup['fnonhastaenter'];
        }

        if ($scope.setup['idpropdesde']){
            $scope.idpropdesde = $scope.setup['idpropdesde'];
        }
        if ($scope.setup['idprophasta']){
            $scope.idprophasta = $scope.setup['idprophasta'];
        }

        $scope.get_label_mes = function(mes){
            var label_mes = FechasServ.getMesLargo(mes-1);
            return label_mes||'';
        }

        $scope.set_mes = function(tipo, mes){
            if (tipo == 1){
                $scope.form.mesa = mes;
                $scope.label_mes_desde = $scope.get_label_mes(mes);
            }
            else{
                $scope.form.mesb = mes;
                $scope.label_mes_hasta = $scope.get_label_mes(mes);
            }
            $scope.on_fechas_change();
        }

        $scope.on_fechas_change = function(){
            if ( (NumberServ.isNumber($scope.form.anioa)) && (NumberServ.isNumber($scope.form.aniob)) ){
                $scope.form.desde = FechasServ.change_day_month_year($scope.form.desde, 1, $scope.form.mesa, $scope.form.anioa);
                $scope.form.hasta = FechasServ.change_day_month_year($scope.form.hasta, 1, $scope.form.mesb, $scope.form.aniob);
            }
            else{
                console.log("El valor del anio es incorrecto no se cambia valor de anio--->");
            }
        }

        $scope.on_anio_change = function(){
            if ( (NumberServ.isNumber($scope.form.anioa)) && (NumberServ.isNumber($scope.form.aniob)) ){
                $scope.form.desde = FechasServ.change_day_month_year($scope.form.desde, 1,1,$scope.form.anioa);
                $scope.form.hasta = FechasServ.change_day_month_year($scope.form.hasta, 1,1,$scope.form.aniob);
            }
            else{
                console.log("El valor del anio es incorrecto no se cambia valor de anio--->");
            }
        }

        $scope.init = function() {
            $scope.anioa = $scope.form.anioa;
            $scope.aniob = $scope.form.aniob;
            $scope.mesa = $scope.form.mesa;
            $scope.mesb = $scope.form.mesb;
            $scope.label_mes_desde = $scope.get_label_mes($scope.form.mesa);
            $scope.label_mes_hasta = $scope.get_label_mes($scope.form.mesb);
        }

        $scope.init_rango_anio = function(){
            $scope.init();
            if ( (NumberServ.isNumber($scope.form.anioa)) && (NumberServ.isNumber($scope.form.aniob)) ){
                $scope.form.desde = FechasServ.change_day_month_year($scope.form.desde, 1,1,$scope.form.anioa);
                $scope.form.hasta = FechasServ.change_day_month_year($scope.form.hasta, 1,1,$scope.form.aniob);
            }
        }

        $scope.$on('init_rango_fechas', function(event, data) {
            //console.log("escuchando init event---->");
            $scope.init();
        })

        $scope.$on('init_rango_fechas_anio', function(event, data) {
            //console.log("escuchando init rango fechas event---->");
            $scope.init_rango_anio();
        })

        $scope.$watch("anioa", function(newValue, oldValue) {
            try{
                $scope.form.anioa = newValue;
                $scope.on_anio_change();
            }
            catch(e){
                console.log("Error en onfechaschange");
            }
        });
        $scope.$watch("aniob", function(newValue, oldValue) {
            try{
                $scope.form.aniob = newValue;
                $scope.on_anio_change();
            }
            catch(e){
                console.log("Error en onfechaschange");
            }
        });
        $scope.$watch("mesa", function(newValue, oldValue) {
            try{
                $scope.form.mesa = newValue;
                $scope.on_fechas_change();
            }
            catch(e){
                console.log("Error en onfechaschange");
            }
        });
        $scope.$watch("mesb", function(newValue, oldValue) {
            try{
                $scope.form.mesb = newValue;
                $scope.on_fechas_change();
            }
            catch(e){
                console.log("Error en onfechaschange");
            }
        });
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("anioMesDir", anioMesDir);

    function anioMesDir(){
        return {
            restrict: 'E',
            scope:{
                form:"=",
                setup:"=",
                disabled:"="
            },
            controller: "AnioMesDirCntrl",
            templateUrl:"static/components/rfechas/anioMesDir/anioMesDir.html?v=" + globalgsvapp
        }
    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("rangoFechasAnioCntrl", rangoFechasAnioCntrl);

    function rangoFechasAnioCntrl($scope, FechasServ, NumberServ){
        $scope.label_mes_desde = "";
        $scope.label_mes_hasta = "";
        $scope.idpropdesde = 'desde';
        $scope.idprophasta = 'hasta';
        $scope.anioa = "";
        $scope.aniob = "";
        $scope.mesa = "";
        $scope.mesb = "";

        $scope.auxfnenter = function(){};

        if ($scope.setup['fnondesdeenter']){
            $scope.fnondesdeenter = $scope.setup['fnondesdeenter'];
        }
        if ($scope.setup['fnonhastaenter']){
            $scope.fnonhastaenter = $scope.setup['fnonhastaenter'];
        }

        if ($scope.setup['idpropdesde']){
            $scope.idpropdesde = $scope.setup['idpropdesde'];
        }
        if ($scope.setup['idprophasta']){
            $scope.idprophasta = $scope.setup['idprophasta'];
        }

        $scope.get_label_mes = function(mes){
            var label_mes = FechasServ.getMesLargo(mes-1);
            return label_mes||'';
        }

        $scope.set_mes = function(tipo, mes){
            if (tipo == 1){
                $scope.form.mesa = mes;
                $scope.label_mes_desde = $scope.get_label_mes(mes);
            }
            else{
                $scope.form.mesb = mes;
                $scope.label_mes_hasta = $scope.get_label_mes(mes);
            }
            $scope.on_fechas_change();
        }

        $scope.on_fechas_change = function(){
            if ( (NumberServ.isNumber($scope.form.anioa)) && (NumberServ.isNumber($scope.form.aniob)) ){
                $scope.form.desde = FechasServ.change_day_month_year($scope.form.desde, 1, $scope.form.mesa, $scope.form.anioa);
                $scope.form.hasta = FechasServ.change_day_month_year($scope.form.hasta, 1, $scope.form.mesb, $scope.form.aniob);
            }
            else{
                console.log("El valor del anio es incorrecto no se cambia valor de anio--->");
            }
        }

        $scope.on_anio_change = function(){
            if ( (NumberServ.isNumber($scope.form.anioa)) && (NumberServ.isNumber($scope.form.aniob)) ){
                $scope.form.desde = FechasServ.change_day_month_year($scope.form.desde, 1,1,$scope.form.anioa);
                $scope.form.hasta = FechasServ.change_day_month_year($scope.form.hasta, 1,1,$scope.form.aniob);
            }
            else{
                console.log("El valor del anio es incorrecto no se cambia valor de anio--->");
            }
        }

        $scope.init = function() {
            $scope.anioa = $scope.form.anioa;
            $scope.aniob = $scope.form.aniob;
            $scope.mesa = $scope.form.mesa;
            $scope.mesb = $scope.form.mesb;
            $scope.label_mes_desde = $scope.get_label_mes($scope.form.mesa);
            $scope.label_mes_hasta = $scope.get_label_mes($scope.form.mesb);
        }

        $scope.init_rango_anio = function(){
            $scope.init();
            if ( (NumberServ.isNumber($scope.form.anioa)) && (NumberServ.isNumber($scope.form.aniob)) ){
                $scope.form.desde = FechasServ.change_day_month_year($scope.form.desde, 1,1,$scope.form.anioa);
                $scope.form.hasta = FechasServ.change_day_month_year($scope.form.hasta, 1,1,$scope.form.aniob);
            }
        }

        $scope.$on('init_rango_fechas', function(event, data) {
            //console.log("escuchando init event---->");
            $scope.init();
        })

        $scope.$on('init_rango_fechas_anio', function(event, data) {
            //console.log("escuchando init rango fechas event---->");
            $scope.init_rango_anio();
        })

        $scope.$watch("anioa", function(newValue, oldValue) {
            try{
                $scope.form.anioa = newValue;
                $scope.on_anio_change();
            }
            catch(e){
                console.log("Error en onfechaschange");
            }
        });
        $scope.$watch("aniob", function(newValue, oldValue) {
            try{
                $scope.form.aniob = newValue;
                $scope.on_anio_change();
            }
            catch(e){
                console.log("Error en onfechaschange");
            }
        });
        $scope.$watch("mesa", function(newValue, oldValue) {
            try{
                $scope.form.mesa = newValue;
                $scope.on_fechas_change();
            }
            catch(e){
                console.log("Error en onfechaschange");
            }
        });
        $scope.$watch("mesb", function(newValue, oldValue) {
            try{
                $scope.form.mesb = newValue;
                $scope.on_fechas_change();
            }
            catch(e){
                console.log("Error en onfechaschange");
            }
        });
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("rangoFechasAnio", rangoFechasAnio);

    function rangoFechasAnio(){
        return {
            restrict: 'E',
            scope:{
                form:"=",
                setup:"=",
                disabled:"="
            },
            controller: "rangoFechasAnioCntrl",
            templateUrl:"static/components/rfechas/rangoFechasAnio/rangoFechasAnio.html?v=" + globalgsvapp
        }
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("RangoFechasAnioMesCntrl", RangoFechasAnioMesCntrl);

    function RangoFechasAnioMesCntrl($scope, FechasServ, NumberServ){
        $scope.label_mes_desde = "";
        $scope.label_mes_hasta = "";
        $scope.idpropdesde = 'desde';
        $scope.idprophasta = 'hasta';
        $scope.anioa = "";
        $scope.aniob = "";
        $scope.mesa = "";
        $scope.mesb = "";

        $scope.auxfnenter = function(){};

        if ($scope.setup['fnondesdeenter']){
            $scope.fnondesdeenter = $scope.setup['fnondesdeenter'];
        }
        if ($scope.setup['fnonhastaenter']){
            $scope.fnonhastaenter = $scope.setup['fnonhastaenter'];
        }

        if ($scope.setup['idpropdesde']){
            $scope.idpropdesde = $scope.setup['idpropdesde'];
        }
        if ($scope.setup['idprophasta']){
            $scope.idprophasta = $scope.setup['idprophasta'];
        }

        $scope.get_label_mes = function(mes){
            var label_mes = FechasServ.getMesLargo(mes-1);
            return label_mes||'';
        }

        $scope.set_mes = function(tipo, mes){
            if (tipo == 1){
                $scope.form.mesa = mes;
                $scope.label_mes_desde = $scope.get_label_mes(mes);
            }
            else{
                $scope.form.mesb = mes;
                $scope.label_mes_hasta = $scope.get_label_mes(mes);
            }
            $scope.on_fechas_change();
        }

        $scope.on_fechas_change = function(){
            if ( (NumberServ.isNumber($scope.form.anioa)) && (NumberServ.isNumber($scope.form.aniob)) ){
                $scope.form.desde = FechasServ.change_day_month_year($scope.form.desde, 1, $scope.form.mesa, $scope.form.anioa);
                $scope.form.hasta = FechasServ.change_day_month_year($scope.form.hasta, 1, $scope.form.mesb, $scope.form.aniob);
            }
            else{
                console.log("El valor del anio es incorrecto no se cambia valor de anio--->");
            }
        }

        $scope.on_anio_change = function(){
            if ( (NumberServ.isNumber($scope.form.anioa)) && (NumberServ.isNumber($scope.form.aniob)) ){
                $scope.form.desde = FechasServ.change_day_month_year($scope.form.desde, 1,1,$scope.form.anioa);
                $scope.form.hasta = FechasServ.change_day_month_year($scope.form.hasta, 1,1,$scope.form.aniob);
            }
            else{
                console.log("El valor del anio es incorrecto no se cambia valor de anio--->");
            }
        }

        $scope.init = function() {
            $scope.anioa = $scope.form.anioa;
            $scope.aniob = $scope.form.aniob;
            $scope.mesa = $scope.form.mesa;
            $scope.mesb = $scope.form.mesb;
            $scope.label_mes_desde = $scope.get_label_mes($scope.form.mesa);
            $scope.label_mes_hasta = $scope.get_label_mes($scope.form.mesb);
        }

        $scope.init_rango_anio = function(){
            $scope.init();
            if ( (NumberServ.isNumber($scope.form.anioa)) && (NumberServ.isNumber($scope.form.aniob)) ){
                $scope.form.desde = FechasServ.change_day_month_year($scope.form.desde, 1,1,$scope.form.anioa);
                $scope.form.hasta = FechasServ.change_day_month_year($scope.form.hasta, 1,1,$scope.form.aniob);
            }
        }

        $scope.$on('init_rango_fechas', function(event, data) {
            //console.log("escuchando init event---->");
            $scope.init();
        })

        $scope.$on('init_rango_fechas_anio', function(event, data) {
            //console.log("escuchando init rango fechas event---->");
            $scope.init_rango_anio();
        })

        $scope.$watch("anioa", function(newValue, oldValue) {
            try{
                $scope.form.anioa = newValue;
                $scope.on_anio_change();
            }
            catch(e){
                console.log("Error en onfechaschange");
            }
        });
        $scope.$watch("aniob", function(newValue, oldValue) {
            try{
                $scope.form.aniob = newValue;
                $scope.on_anio_change();
            }
            catch(e){
                console.log("Error en onfechaschange");
            }
        });
        $scope.$watch("mesa", function(newValue, oldValue) {
            try{
                $scope.form.mesa = newValue;
                $scope.on_fechas_change();
            }
            catch(e){
                console.log("Error en onfechaschange");
            }
        });
        $scope.$watch("mesb", function(newValue, oldValue) {
            try{
                $scope.form.mesb = newValue;
                $scope.on_fechas_change();
            }
            catch(e){
                console.log("Error en onfechaschange");
            }
        });
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("rangoFechasAnioMes", rangoFechasAnioMes);

    function rangoFechasAnioMes(){
        return {
            restrict: 'E',
            scope:{
                form:"=",
                setup:"=",
                disabled:"="
            },
            controller: "RangoFechasAnioMesCntrl",
            templateUrl:"static/components/rfechas/rangoFechasAnioMes/rangoFechasAnioMes.html?v=" + globalgsvapp
        }
    }

})();
/**
 * Created by Manuel on 11/03/2015.
 */
(function(module){
    'use strict';
    module.service("AffixService", AffixService);

    function AffixService(){
        /*
        this.is_mobile_and_tablet = function(){
            var check = false;
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
            return check;
        }
        */

        function isMovil(){
            var check = false;
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
            return check;
        }
        this.setright = function(elementid, right){

            var jqelementid = "#"+elementid;
            $(jqelementid).css('right',right);
        }
        this.setleft = function(elementid, left){
            var jqelementid = "#"+elementid;
            $(jqelementid).css('left',left);
        }

        this.add_affix = function(elementid, top){
            //Verificar primero si se trata de web, si mobil no establecer affix
            var is_mobile = isMovil();
            if (!is_mobile){
                var jqelementid = "#"+elementid;
                var elementPosition = 0;
                try{
                    elementPosition = $(jqelementid).offset();
                    if (elementPosition){
                        $(window).scroll(function(){
                            var eltop = elementPosition.top;
                            if($(window).scrollTop() > eltop){
                                $(jqelementid).css('position','fixed').css('top',top||30);
                            } else {
                                $(jqelementid).css('position','static');
                            }
                        });
                    }
                    else{
                        alert("Elementid:"+elementid+", no localizado, no puedo establecer affix");
                    }
                }
                catch(e){
                    alert("Elementid:"+elementid+", no localizado, no puedo establecer affix");
                }
            }
        }
    }
})(IsyplusApp);
/**
 * Created by serviestudios on 28/01/16.
 */
(function (module) {
    'use strict';
    module.factory("ajaxAnimService", ajaxAnimService);
    function ajaxAnimService(){

        var service = {
            show: function(isShow){
                if (isShow){
                    $("#ajax_anim_fondo").height( $( document ).height() );
                    center($('#ajax_anim'));
                    $("#ajax_anim_fondo").css("visibility","visible");
                    $("#ajax_anim").css("visibility","visible");
                }
                else{
                    $("#ajax_anim_fondo").css("visibility","hidden");
                    $("#ajax_anim").css("visibility","hidden");
                }
            }
        }

        return service;
        function center(self){
            self.css("position","absolute");
            self.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
            self.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +  $(window).scrollLeft()) + "px");
            return self;
        }
    }
})(IsyplusApp);
(function(module){
    'use strict';
    module.service("AlertSrv", AlertSrv);
    /**
     * @deprecated, usar 'swalService' en su lugar
     * @constructor
     */
    function AlertSrv(){
        this.confirm = function(text, func, closeconf, closecanc){
            swal({
                title: '',
                text: text,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                closeOnConfirm: close === undefined ? true : closeconf,
                closeOnCancel: close === undefined ? true : closecanc
            },func);
        };

        this.info = function(text, title,func){
            swal({
                title: title || 'Información',
                text: text,
                type: "info"
            },func);
        };
        this.success = function(text, title, func){
            swal({
                title: title || 'Éxito',
                text: text,
                type: "success"
            },func);
        };
        this.warning = function(text, title, func,closeconf){
            swal({
                title: title || 'Advertencia',
                text: text,
                type: "warning",
                closeOnConfirm: close === undefined ? true : closeconf
            },func);
        };
        this.error = function(text, title, func){
            swal({
                title: title || 'Error',
                text: text,
                type: "error"
            },func);
        };
        this.input = function(text, title,  func){
            swal({
                title: title || 'Error',
                text: text,   type: "input",
                showCancelButton: true,
                closeOnConfirm: true,
                animation: "slide-from-top"
            }, func);
        }
    }
})(IsyplusApp);
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
/**
 * Created by serviestudios on 05/02/16.
 */
(function (module) {
    'use strict';
    module.service("BaseAutocompServ", BaseAutocompServ);

    function BaseAutocompServ($filter, $http, $timeout){

        this.config = function($scope){
            $scope.uri= '';//uri si ajax
            $scope.indexitem = -1;
            $scope.itemsel = {};
            $scope.filtro = {};
            $scope.idprop = 'autocompletado_' + Math.random();//Id del input
            $scope.csscolor = {'color':'#000000'};
            $scope.csscolornull = '#000000';
            $scope.filtrados = [];
            $scope.placeholder = "";
            $scope.auxfnsel = function(item){};
            $scope.propFiltro = "label";//La propiedad que debe filtrar el componente, y la que se muestra en el listado
            $scope.propFiltroId = "id";
            $scope.nomParamFiltroUri = "filtro";//Nombre del parametro en el uri que se agrega al hacer consulta ajax
            $scope.fnOnSel = $scope.auxfnsel; //funcion que se ejecuta cuando se selecciona el item
            $scope.fnOnNull = $scope.auxfnsel; //funcion que se ejecuta cuando el item queda desmarcado
            $scope.fnOnEnterNull = $scope.auxfnsel;//Se usa para el caso en que no haya ninguna sugerencia y se presione enter
            $scope.showClearBtn = 0;

            $scope.auxfnsel = function(itemsel){
                console.log("auxfnsel no definido, se ejectua la funcion por defecto.....!");
            }
            if ( $scope.setup['propFiltro'] ){
                $scope.propFiltro =  $scope.setup['propFiltro'];
            }
            if ( $scope.setup['propFiltroId'] ){
                $scope.propFiltroId =  $scope.setup['propFiltroId'];
            }
            if ( $scope.setup['placeholder'] ){
                $scope.placeholder =  $scope.setup['placeholder'];
            }
            if ( $scope.setup['uri'] ){
                $scope.uri = $scope.setup['uri'];
            }
            if ( $scope.setup['nomParamFiltroUri'] ){
                $scope.nomParamFiltroUri = $scope.setup['nomParamFiltroUri'];
            }
            if ( $scope.setup['fnOnSel'] ){
                $scope.fnOnSel = eval($scope.setup['fnOnSel']);
            }
            if ( $scope.setup['fnOnNull'] ){
                $scope.fnOnNull = eval($scope.setup['fnOnNull']);
            }
            if ( $scope.setup['fnOnEnterNull'] ){
                $scope.fnOnEnterNull = eval($scope.setup['fnOnEnterNull']);
            }
            if ( $scope.setup['idprop'] ){
                $scope.idprop = $scope.setup['idprop'];
            }
            if ( $scope.setup['colornull'] ){
                $scope.csscolornull= $scope.setup['colornull'];
            }
            if ( $scope.setup['showClearBtn'] ){
                $scope.showClearBtn= $scope.setup['showClearBtn'];
            }
        }

        this.nav_items_sugg = function($scope, inc){
            $scope.indexitem = $scope.indexitem+inc;
            $scope.itemsel = $scope.filtrados[$scope.indexitem];
        }

        this.onkeydown = function($scope, event){
            if (event.keyCode == 38) {//UP
                event.preventDefault();
                if ( $scope.indexitem > 0 ){
                    this.nav_items_sugg($scope, -1);
                }
            }
            else if(event.keyCode == 40) {//DOWN
                event.preventDefault();
                if ( ($scope.indexitem+1) < $scope.filtrados.length ){
                    this.nav_items_sugg($scope, +1);
                }
            }
            else if(event.keyCode == 13) {//ENTER
                event.preventDefault();
                if ($scope.itemsel[$scope.propFiltro]){
                    this.sel_item($scope, $scope.itemsel);
                }
                else {
                    try{//Evaluar funcion listener
                        $scope.fnOnEnterNull();
                    }
                    catch(e){
                        console.error(" Error al ejecutar función ");
                    }
                }
            }
            else if (event.keyCode == 27){//escape
                event.preventDefault();
                $scope.filtrados = [];
                this.logica_filtrados($scope);
            }
            else if( (event.keyCode == 46) || (event.keyCode == 8) ) {//SUPR O DELETE
                //event.preventDefault();
                //$scope.listener_null();
                if ($scope.tipo=='n'){
                    $scope.filtrados = $filter('filter')($scope.data, $scope.filtro, function (actual, expected) {
                        //return actual.toLowerCase().indexOf(expected.toLowerCase()) == 0;
                        return actual.toLowerCase().indexOf(expected.toLowerCase()) >= 0;
                    });
                    this.logica_filtrados($scope);
                }
            }
        }

        this.onkeyup = function($scope, event){
            if ( (event.keyCode >= 65 && event.keyCode <= 90) ||
                (event.keyCode >= 48 && event.keyCode <= 57) ||
                (event.keyCode >= 96 && event.keyCode <= 105) ||
                (event.keyCode == 46) || (event.keyCode == 8) ){//Teclado numerico
                //event.preventDefault();
                if ( $scope.tipo=='x' ){
                    this.do_ajax($scope);
                }
                else if ($scope.tipo=='n'){
                    $scope.filtrados = $filter('filter')($scope.data, $scope.filtro,function (actual, expected) {
                        //return (actual||'').toLowerCase().indexOf((expected||'').toLowerCase()) == 0;
                        return (actual||'').toLowerCase().indexOf((expected||'').toLowerCase()) >= 0;
                    });
                    this.logica_filtrados($scope);
                }
            }
        }

        this.sel_item = function($scope, item){
            $scope.model = item;
            try{//Evaluar funcion listener
                $timeout(function(){
                    $scope.fnOnSel(item);
                });
            }
            catch(e){
                console.error(" Error al ejecutar función ");
            }
        }

        this.do_ajax = function($scope){
            var filtro = $scope.filtro[$scope.propFiltro]||'';
            var uri = $scope.uri+"&"+$scope.nomParamFiltroUri+"="+filtro;
            var self = this;
            $http.get(uri).then(function(response){
                if (response.data['items']){
                    $scope.filtrados = response.data['items'];
                    self.logica_filtrados($scope);
                }
            });
        }
        this.do_ajax_with_fnthen = function($scope, fnthen){
            var filtro = $scope.filtro[$scope.propFiltro]||'';
            var uri = $scope.uri+"&"+$scope.nomParamFiltroUri+"="+filtro;
            $http.get(uri).then(fnthen);
        }

        this.filtro_to_model = function($scope){
            $scope.model[$scope.propFiltro] = $scope.filtro[$scope.propFiltro];
        }

        this.model_to_filtro = function($scope){
            $scope.filtro[$scope.propFiltro] = $scope.model[$scope.propFiltro];
        }

        this.on_lost_focus = function($scope){
            var self = this;
            $timeout(function(){
                self.model_to_filtro($scope);
                $scope.filtrados = [];
            }, 500);
        }

        this.logica_filtrados = function($scope){
            var nfiltrados = $scope.filtrados.length;
            if( nfiltrados >0 ){
                $scope.csscolor = {'color':'#000000'};//Se pono color de texto negro
                $scope.itemsel = $scope.filtrados[0];
                $scope.indexitem = 0;
            }
            else{
                $scope.csscolor = {'color':$scope.csscolornull};//Se pone color de texto rojo si
                this.listener_null($scope);
            }
        }

        this.listener_null = function($scope){
            $scope.model = {};
            this.filtro_to_model($scope);

            try{//Evaluar funcion listener
                $timeout(function(){
                    $scope.fnOnNull($scope.filtro);
                });
            }
            catch(e){
                console.error(" Error al ejecutar función ")
            }
        }

        this.on_model_change = function($scope){
            this.model_to_filtro($scope);
            $scope.indexitem = -1;
            $scope.itemsel = {};
            $scope.filtrados = [];
        }

        this.on_uri_change = function($scope){
            //console.log("on_uri_change->");
            //console.log($scope.uri);
        }
    }

})(IsyplusApp);
/**
 * Created by Manuel on 11/03/2015.
 */
(function (module) {
    'use strict';
    module.factory("FechasServ", FechasServ);

    function FechasServ() {

        return {
            format_momment_date: format_momment_date,
            parse_cadena: parse_cadena,
            get_fecha_actual: get_fecha_actual,
            sumar_dias: sumar_dias,
            sumar_anios: sumar_anios,
            change_year: change_year,
            change_month_year: change_month_year,
            change_day_month_year: change_day_month_year,
            change_day_month: change_day_month,
            change_day: change_day,
            getDiaSemanaCorto: getDiaSemanaCorto,
            get_ls_dias_corto: get_ls_dias_corto,
            getDiaSemanaLargo: getDiaSemanaLargo,
            get_ls_dias_largo: get_ls_dias_largo,
            getMesCorto: getMesCorto,
            get_str_mes_corto: get_str_mes_corto,
            getMesLargo: getMesLargo,
            get_str_mes_largo: get_str_mes_largo,
            getFechaLetras: getFechaLetras,
            esFechaValida: esFechaValida
        };

        function format_momment_date(DATE) {
            return DATE.format('DD/MM/YYYY');
        }

        function parse_cadena(cadena) {
            return moment(cadena, 'DD/MM/YYYY');
        }

        function get_fecha_actual() {
            var Date = moment();
            return format_momment_date(Date);
        }

        function sumar_dias(fechastr, ndias) {
            var Date = parse_cadena(fechastr);
            var DateSumado = Date.add('days', ndias);
            return format_momment_date(DateSumado);
        }

        function sumar_anios(fechastr,nanios) {
            var Date = parse_cadena(fechastr);
            var DateSumado = Date.add('year', nanios);
            return format_momment_date(DateSumado);
        }

        function change_year(fechastr, year) {
            var tipo_fecha = parse_cadena(fechastr);
            tipo_fecha.year(year);
            return format_momment_date(tipo_fecha);
        }

        function change_month_year(fechastr, month, year) {
            var tipo_fecha = parse_cadena(fechastr);
            tipo_fecha.year(year);
            tipo_fecha.month(month - 1);
            return format_momment_date(tipo_fecha);
        }

        function change_day_month_year(fechastr, day, month, year) {
            var tipo_fecha = parse_cadena(fechastr);
            tipo_fecha.date(day);
            tipo_fecha.year(year);
            tipo_fecha.month(month - 1);
            return format_momment_date(tipo_fecha);
        }

        function change_day_month(fechastr, day, month) {
            var tipo_fecha = parse_cadena(fechastr);
            tipo_fecha.date(day);
            tipo_fecha.month(month - 1);
            return format_momment_date(tipo_fecha);
        }

        function change_day(fechastr, day) {
            var tipo_fecha = parse_cadena(fechastr);
            tipo_fecha.date(day);
            return format_momment_date(tipo_fecha);
        }

        function getDiaSemanaCorto(day_int) {
            var ls = get_ls_dias_corto();
            return ls[day_int]
        }

        function get_ls_dias_corto() {
            return ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sab"]
        }

        function getDiaSemanaLargo(day_int) {
            return get_ls_dias_largo()[day_int];
        }

        function get_ls_dias_largo() {
            return ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado"]
        }

        function getMesCorto(day_int) {
            var ls = get_str_mes_corto();
            return ls[day_int]
        }

        function get_str_mes_corto() {
            return ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Agos", "Sept", "Oct", "Nov", "Dic"]
        }

        function getMesLargo(day_int) {
            var ls = get_str_mes_largo();
            return ls[day_int]
        }

        function get_str_mes_largo() {
            return ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septtiembre", "Octubre", "Noviembre", "Diciembre"]
        }

        function getFechaLetras(fecha) {
            return getDiaSemanaLargo(fecha.weekday()) + ', ' +
                fecha.get('date') + ' de ' + getMesLargo(fecha.get('month')) +
                ' del ' + fecha.get('year');
        }

        /**
         * Verifica si una cadena ingresada esta en el formato dd/mm/yyyy es una fecha valida
         * @param fecha
         * @returns {*}
         */
        function esFechaValida(fecha) {
            return moment(fecha, 'DD/MM/YYYY', true).isValid();
        }
    }
})(IsyplusApp);
/**
 * Created by serviestudios on 05/02/16.
 */
(function (module) {
    'use strict';
    module.factory("CustomFileReader", CustomFileReader);

    function CustomFileReader($q, $log) {
        var onLoad = function(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };

        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };

        var onProgress = function(reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress",
                    {
                        total: event.total,
                        loaded: event.loaded
                    });
            };
        };

        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };

        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer();

            var reader = getReader(deferred, scope);
            reader.readAsDataURL(file);

            return deferred.promise;
        };

        return {
            readAsDataUrl: readAsDataURL
        };
    };
})(IsyplusApp);
/**
 * Created by serviestudios on 22/01/16.
 */
(function (module) {
    'use strict';
    module.factory("focusService", focusService);

    function focusService($timeout){

        var service = {
            setFocus: setFocus,
            setFocusTimeout: setFocusTimeout
        };

        return service;

        /**
         * Establece el foco en un elemento dado suy id, si se pasa timeout, se establece el foco
         * despues del timeout indicado
         * @param inputid (required)
         * @param timeout (optional)
         */
        function setFocus(elementid, timeout){
            if (angular.isUndefined(timeout)){
                if (elementid){
                    $("#"+elementid).focus();
                }
            }
            else{
                setFocusTimeout(elementid, timeout);
            }
        }

        /**
         * Establece el foco en un elemento, pasado un cierto tiempo(timeout)
         * @param elementid
         * @param timeout
         */
        function setFocusTimeout(elementid, timeout){
            $timeout(function(){
                setFocus(elementid);
            }, timeout||300);
        }
    }

})(IsyplusApp);
/**
 * Created by serviestudios on 05/02/16.
 */
(function (module) {
    'use strict';
    module.factory("GeneralSrv", GeneralSrv);

    function GeneralSrv($sessionStorageSrv, $http, $timeout, $compile) {

        return {
            almdescri: almdescri,
            cambiarEstadoLista: cambiarEstadoLista,
            clearSSValue: clearSSValue,
            confirma: confirma,
            copyValues: copyValues,
            esCedulaValida: esCedulaValida,
            esCiRucValido: esCiRucValido,
            esFechaMenor: esFechaMenor,
            esFechaValida: esFechaValida,
            esRucValido: esRucValido,
            exportaArchivo: exportaArchivo,
            get_appconfig: get_appconfig,
            getClaNombre: getClaNombre,
            getCodigos: getCodigos,
            getEmprel: getEmprel,
            getEsquemaActual: getEsquemaActual,
            getImpuestos: getImpuestos,
            getnParcialView: getnParcialView,
            getNumUser: getNumUser,
            getProyectoSesion: getProyectoSesion,
            getRutaRegresa: getRutaRegresa,
            getSSValue: getSSValue,
            getTclave: getTclave,
            getValidCedRuc: getValidCedRuc,
            is_null: is_null,
            is_undefined: is_undefined,
            isNullOrUndef: isNullOrUndef,
            isScopeInSS: isScopeInSS,
            isObjVacio: isObjVacio,
            loadSSToScope: loadSSToScope,
            saveScopeToSS: saveScopeToSS,
            setFocus: setFocus,
            setFocusWithTimeout: setFocusWithTimeout,
            setRutaRegresa: setRutaRegresa,
            setSSValue: setSSValue
        };

        function getNumUser() {
            return $http.get('/rest/tusuarios/0?opc=numuser');
        }

        function getClaNombre(numus) {
            return $http.get('/rest/tusuarios/' + numus + '?opc=clanom');
        }

        function getRutaRegresa() {
            return $sessionStorageSrv.getObject('rutaRegresa', null);
        }

        function setRutaRegresa(ruta) {
            $sessionStorageSrv.setObject('rutaRegresa', ruta);
        }

        function getCodigos(form) {
            $http.get('/rest/general/0?opc=obtcod').then(function (rpta) {
                if (rpta.data.estado === 1) {
                    form.empresa = rpta.data.codemp;
                    form.almacen = rpta.data.almcod;
                    form.esquema = rpta.data.esquema;
                    form.usuario = rpta.data.usuario;
                    form.seccion = rpta.data.seccion;
                }
            });
        }

        function getImpuestos(func) {
            return $http.get('/rest/transacc/timpuestos').then(func);
        }

        function exportaArchivo(nombreServlet, params, formato) {
            var isnginx = parseInt(globalModoDespligeApp) == 2;
            var url = '/reportes/repjasper/' + nombreServlet + '?formato=' + formato + "&" + $.param(params);
            if (!isnginx) {
                url = 'http://localhost:8080/repjasper/' + nombreServlet + '?formato=' + formato + "&" + $.param(params);
            }
            window.open(url);//edit
        }

        /**
         * @deprecated No usar, usar FechasServ
         * @param fecha
         * @returns {*|boolean}
         */
        function esFechaValida(fecha) { // válido solo para fechas de formato DD/MM/YYYY
            var fechaval = moment(fecha, 'DD/MM/YYYY', true).isValid();
            var anioval = moment(fecha, 'DD/MM/YYYY', true).year() > 2000;
            return fechaval && anioval;
        }

        /**
         * @deprecated No usar, usar FechasServ
         * @param fecini
         * @param fecfin
         * @returns {*}
         */
        function esFechaMenor(fecini, fecfin) {
            var desde = moment(fecini, 'DD/MM/YYYY');
            var hasta = moment(fecfin, 'DD/MM/YYYY');
            return moment(desde).isBefore(hasta);
        }

        function esCedulaValida(cedula) {
            var total = 0;
            var lenCedula = 10;
            var coeficientes = "212121212";
            var numProviciaas = 24;
            var maxValDigitTres = 5; //el tercer digito debe ser menor o igual a 5
            var esCedulaValida = false;
            if (cedula.length == lenCedula) {
                var provincia = parseInt(cedula.substring(0, 2), 10);
                var digitoTres = parseInt(cedula[2], 10);
                var digitoVerif = parseInt(cedula[9], 10);
                if (provincia > 0 && provincia <= numProviciaas && digitoTres <= maxValDigitTres) {
                    for (var i = 0; i < coeficientes.length; i++) {
                        var valor = parseInt(coeficientes[i], 10) * parseInt(cedula[i], 10);
                        total = total + (valor > 9 ? (valor - 9) : valor);
                    }
                    var restoMod10 = total % 10;
                    if (restoMod10 === 0) {
                        esCedulaValida = digitoVerif === 0;
                    }
                    else {
                        esCedulaValida = digitoVerif === (10 - restoMod10);
                    }
                }
            }
            return esCedulaValida;
        }

        function esRucValido(ruc) {
            var lenruc = 13;
            var numProvicias = 24;
            var maxValDigitTres = 5; //el tercer digito debe ser menor o igual a 5
            var total = 0;
            var esRucValido = false;
            if (ruc.length == lenruc) {
                //Verificar si es ruc de persona natural:
                var provincia = parseInt(ruc.substring(0, 2), 10);
                var digitoTres = parseInt(ruc[2], 10);
                var ulttresdigitos = ruc.substring(10, 13);

                if ((ulttresdigitos === "001" || ulttresdigitos === "002" || ulttresdigitos === "003") && (provincia > 0 && provincia <= numProvicias)) {
                    if (digitoTres <= maxValDigitTres) {//ruc persona natural
                        esRucValido = this.esCedulaValida(ruc.substring(0, 10));
                    }
                    else if (digitoTres == 6) {//ruc publico
                        var coeficientes = "32765432";
                        var digitoVerif = parseInt(ruc[8], 10);
                        total = 0;
                        for (var i = 0; i < coeficientes.length; i++) {
                            var valor = parseInt(coeficientes[i], 10) * parseInt(ruc[i], 10);
                            total = total + valor;
                        }
                        var restoMod11 = total % 11;
                        if (restoMod11 === 0) {
                            esRucValido = digitoVerif === 0;
                        }
                        else {
                            esRucValido = digitoVerif === (11 - restoMod11);
                        }
                    }
                    else if (digitoTres == 9) {//ruc juridico o extranjero
                        var coeficientes = "432765432";
                        var digitoVerif = parseInt(ruc[9], 10);
                        total = 0;
                        for (var i = 0; i < coeficientes.length; i++) {
                            var valor = parseInt(coeficientes[i], 10) * parseInt(ruc[i], 10);
                            total = total + valor;
                        }
                        var restoMod11 = total % 11;
                        if (restoMod11 === 0) {
                            esRucValido = digitoVerif === 0;
                        }
                        else {
                            esRucValido = digitoVerif === (11 - restoMod11);
                        }
                    }
                }
            }
            return esRucValido;
        }

        function esCiRucValido(ciruc) {
            var escirucvalido = false;
            if (ciruc.length === 10) {
                escirucvalido = this.esCedulaValida(ciruc);
            }
            else if (ciruc.length === 13) {
                escirucvalido = this.esRucValido(ciruc);
            }
            return escirucvalido;
        }

        function getValidCedRuc(cedruc) {
            return $http.get('/rest/general/0?cedruc=' + cedruc + '&opc=validcedruc');
        }

        function setSSValue(key, value) {
            $sessionStorageSrv.setObject(key, value);
        }

        function getSSValue(key) {
            return $sessionStorageSrv.getObject(key, null);
        }

        function clearSSValue(key) {
            $sessionStorageSrv.delete(key);
        }

        /**
         * Verifica si el scope esta en session storage, dada la clave en sesion storage
         * @param key
         * @returns {boolean}
         */
        function isScopeInSS(key){
            var res = getSSValue(key);
            if (res){
                return true;
            }
            else{
                return false;
            }
        }


        /**
         * Graba el $scope en sessionStorage del navegador usando la clave key,
         * Util cuando se requiere navegacion entre pantallas
         * @param $scope
         * @param key
         */
        function saveScopeToSS($scope, key) {
            var scopeobject = {};
            for (var prop in $scope) {
                if (prop.indexOf("$") === 0) {
                    //console.log("no se toma en cuenta la propiedad:"+prop);
                }
                else {
                    var tipo = typeof  $scope[prop];
                    if ((tipo !== "function")) {
                        scopeobject[prop] = $scope[prop];
                    }
                }
            }
            this.setSSValue(key, scopeobject);
        }

        /**
         * Carga en el scope, el objeto registrado en sessionstorage con la key especificada
         * @param $scope, el scope donde se cargara el objeto de ss
         * @param key, la clave con que se registro el objeto en ss
         */
        function loadSSToScope($scope, key){

            var cacheData = getSSValue(key);
            if (cacheData){
                for(var prop in cacheData){
                    $scope[prop] = cacheData[prop];
                }
                clearSSValue(key);
                return true;
            }
            else{
                alert("NO HAY DATOS EN SS DEL FORM clave "+key);
            }

            return false;
        }


        /**
         * Itera por las propiedades del objeto from y los sobreescribe en el objeto to
         * @param from
         * @param to
         */
        function copyValues(from, to) {
            for (var prop in from) {
                to[prop] = from[prop];
            }
        }

        /**
         * @deprecated No usar, usar focusService
         * @param elementid
         */
        function setFocus(elementid) {
            $("#" + elementid).focus();
        }

        /**
         * @deprecated No usar, usar focusService
         * @param elementid
         * @param timeinms
         */
        function setFocusWithTimeout(elementid, timeinms) {
            $timeout(function () {
                setFocus(elementid);
            }, timeinms);
        }

        function confirma(msg, accion, $scope, tipo) {
            $('#msgConfirm').html(msg);
            $('#btnAceptConfir').replaceWith($('#btnAceptConfir'));
            $('#btnAceptConfir').attr('ng-click', accion + "('" + tipo + "');");
            $compile($('#btnAceptConfir'))($scope);
            $('#msgModalConfirm').modal('show');
        }

        function cambiarEstadoLista(estado, lista, propiedad) {
            var e, op;
            for (e in lista) {
                op = lista[e];
                op[propiedad] = estado == true ? 1 : 0;
            }
        }

        function isObjVacio(obj) {
            return Object.keys(obj).length === 0;
        }

        /**
         * Verifica si un objeto es null o undefined
         * @param obj
         * @returns {boolean}
         */
        function isNullOrUndef(obj) {
            if (!this.is_undefined(obj)) {
                return obj === null;
            }
            return true;
        }

        function is_null(obj) {//Verifica si un objeto es null o undefined
            if (!this.is_undefined(obj)) {
                return obj === null;
            }
            return false;
        }

        function is_undefined(obj) {
            return (typeof obj) === "undefined";
        }

        function get_appconfig() {
            var url = getUrlRestGen("appconfig");
            return $http.get(url);
        }

        function getProyectoSesion() {
            var url = getUrlRestGen("pry_codigo");
            return $http.get(url);
        }

        function getEmprel() {
            return $http.get('/rest/general?opc=emprel');
        }

        function getEsquemaActual() {
            var url = getUrlRestGen("esquema");
            return $http.get(url);
        }

        function almdescri() {
            var url = getUrlRestGen("almdescri");
            return $http.get(url);
        }

        function getnParcialView() {
            var url = getUrlRestGen("nparcialview");
            return $http.get(url);
        }

        function getTclave() {
            var url = getUrlRestGen("tclave");
            return $http.get(url);
        }

        function getUrlRestGen(opcion){
            return "/rest/general/0?opc="+opcion;
        }

    }
})(IsyplusApp);
/**
 * Created by serviestudios on 13/04/16.
 */
(function (module) {
    'use strict';

    module.factory("gridService", gridService);

    function gridService(ListasServ) {

        return {
            getFilasMarcadas: getFilasMarcadas,
            onRowClicSingle: onRowClicSingle,
            onRowClicMultiple: onRowClicMultiple,
            onCheckClicSingle: onCheckClicSingle,
            onCheckClicMultiple: onCheckClicMultiple,
            initGrid: initGrid
        };

        function getFilasMarcadas(theArray, filtro) {
            var filtro = filtro || {marcado: true};
            return ListasServ.filtrar(theArray, filtro);
        }

        /**
         * En este caso solo es permitido seleccion de una sola fila, debe haber solo una fila con valor marcado = true
         * @param theArray
         * @param row
         */
        function onRowClicSingle(theArray, row) {
            var currentMarca = row.marcado || false;
            ListasServ.limpiarMarcados(theArray, {marcado: true}, 'marcado');

            row.marcado = !currentMarca;
        }

        function onRowClicMultiple(theArray, row) {
            var currentMarca = row.marcado || false;
            row.marcado = !currentMarca;
        }

        function onCheckClicSingle(theArray, row) {
            var currentMarca = row.marcado || false;
            ListasServ.limpiarMarcados(theArray, {marcado: true}, 'marcado');
            row.marcado = currentMarca;
        }

        function onCheckClicMultiple(theArray, row) {
            var currentMarca = row.marcado || false;
            row.marcado = currentMarca;
        }

        function initGrid(vm) {
            vm.gridOptions = {
                enableRowSelection: true,
                enableFullRowSelection: true,
                enableSelectAll: false,
                selectionRowHeaderWidth: 40,
                rowHeight: 45,
                showGridFooter: true
            };

            vm.gridOptions.columnDefs = [];
            vm.gridOptions.multiSelect = false;

            vm.gridOptions.onRegisterApi = function (gridApi) {
                vm.gridApi = gridApi;

                gridApi.selection.on.rowSelectionChanged(vm, function (row) {
                    if (row.isSelected) {
                        vm.selectedItem = row.entity;
                    } else {
                        vm.selectedItem = {};
                    }
                });
                gridApi.selection.on.rowSelectionChangedBatch(vm, function (rows) {
                    //var msg = 'rows changed ' + rows.length;console.log(msg);
                });
            };
        }
    }

})(IsyplusApp);
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
/**
 * Created by Manuel on 11/03/2015.
 */
(function (module) {
    'use strict';
    module.factory("ListasServ", ListasServ);

    function ListasServ($filter) {

        return {
            filtrar: filtrar,
            getValoresColumna: getValoresColumna,
            limpiarMarcados: limpiarMarcados,
            getIndexOf: getIndexOf,
            removeItem: removeItem,
            buscarObjeto: buscarObjeto,
            sumarColumna: sumarColumna,
            limpiaMarca: limpiaMarca,
            getMarcados: getMarcados,
            getFirstMarcado: getFirstMarcado
        };

        /**
         * Aplica filtro de angular $filter, a un arrego, dado la expresion Ejm: {marcados:true}
         * @param array
         * @param expression
         * @returns {*}
         */
        function filtrar(array, expression) {
            return $filter('filter')(array, expression);
        }

        /**
         * //Busca en el arreglo el valor dada la pripiedad y los registra en un array,el cual es retornado
         * @param array
         * @param propiedad
         * @returns {Array}
         */
        function getValoresColumna(array, propiedad) {
            var listaData = [];
            $.each(array, function (intValue, currentElement) {
                listaData.push(currentElement[propiedad]);
            });
            return listaData;
        }

        /**
         * Utilidad para marcar como false la propiedad prop a todos los objetos de la lista
         * @param array
         * @param expression
         * @param prop
         */
        function limpiarMarcados(array, expression, prop) {
            var filtrados = this.filtrar(array, expression);
            angular.forEach(filtrados, function (value, key) {
                value[prop] = false;
            });
        }

        function limpiaMarca(array) {
            this.limpiarMarcados(array, {marcado: true}, 'marcado');
        }


        function getMarcados(array) {
            var filtrados = this.filtrar(array, {marcado: true});
            return filtrados;
        }

        function getFirstMarcado(array) {
            var filtrados = this.filtrar(array, {marcado: true});
            if (filtrados && filtrados.length > 0) {
                return filtrados[0];
            }
            return null;
        }

        function getIndexOf(array, item) {
            return array.indexOf(item);
        }

        /**
         * Eliminar un objeto de una lista, si el objeto pertenece a la lista
         * @param array
         * @param item
         */
        function removeItem(array, item) {
            var indexofitem = array.indexOf(item);
            if (indexofitem != -1) {
                array.splice(indexofitem, 1);
            }
        }

        /**
         * Busca un objeto en el arreglo dado la propiedad y el valor de la propiedad
         * @param array
         * @param propiedad
         * @param valor
         * @returns {*}
         */
        function buscarObjeto(array, propiedad, valor) {
            var obj_target;
            $.each(array, function (intValue, currentElement) {
                if (currentElement[propiedad] == valor) {
                    obj_target = currentElement;
                    return false;
                }
            });
            return obj_target;
        }

        /**
         * Itera por el array sumando la propiedad del objeto y retorna este valor
         * @param array
         * @param col
         * @returns {number}
         */
        function sumarColumna(array, col) {
            var total = 0.0;
            angular.forEach(array, function (value, key) {
                total += Number(value[col]);
            });
            return total;
        }
    }

})(IsyplusApp);
/**
 * Created by Manuel on 11/03/2015.
 */
(function(module) {
    'use strict';
    module.service("ListenerServ", ListenerServ);

    function ListenerServ($document){
        this.F1 = 112;
        this.F2 = 113;
        this.F3 = 114;
        this.F4 = 115;
        this.F5 = 116;
        this.F6 = 117;
        this.F7 = 118;
        this.F8 = 119;
        this.F9 = 120;
        this.F10 = 121;
        this.F11 = 122;
        this.F12 = 123;
        this.ESC = 27;
        this.RETROCESO = 8;
        this.TAB = 9;
        this.ENTER = 13;
        this.MAYUS = 16;
        this.CONTROL = 17;
        this.BARRA_ESPACIADORA = 32;
        this.REPAG = 33;
        this.AVPAG = 34;
        this.INICIO = 36;
        this.FIN=35;
        this.FLECHA_IZQ=37;
        this.FLECHA_DER=39;
        this.FLECHA_ARRIBA=38;
        this.FLECHA_ABAJO=40;

        this.is_procesando = function($scope){
            return $scope['procesando_key'] || false;
        }

        this.add_keydown_listener = function(keycode, $scope, fn){
            var self = this;
            $document.on("keydown", function(e){
                if(e.which == keycode) {
                    e.preventDefault();
                    if (self.is_procesando($scope)===true){
                        alert("!!!YA SE ESTA PROCESANDO ESPERE UN MOMENTO!!!");
                    }
                    else{
                        fn($scope);
                    }
                }
            });
        }

        this.remove_keydown_listener = function(){
            $document.off("keydown");
        }

        this.add_state_keydown_event = function($scope, keycode, fn){
            var self = this;
            $scope.$on("$stateChangeSuccess", function(ev, toState, toParams, fromState, fromParams){
                self.add_keydown_listener(keycode, $scope, fn);
            })
        }

        this.remove_state_keydown_event = function($scope){
            $scope.$on("$stateChangeStart", function(ev, toState, toParam, fromState, fromParams){
                //console.log(" documento of keydow------------------->");
                $document.off("keydown");
            });
        }

        this.add_action_on_state_change_start = function($scope, fn){
            $scope.$on("$stateChangeStart", function(ev, toState, toParam, fromState, fromParams){
                fn();
            });
        }
    }

})(IsyplusApp);
/**
 * Created by serviestudios on 05/02/16.
 */
(function (module) {
    'use strict';
    module.service("$localStorageSrv", localStorageSrv);

    function localStorageSrv($window) {
        this.set = function(key, value) {
            $window.localStorage[key] = value;
        };

        this.get = function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        };

        this.setObject = function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        };

        this.getObject = function(key, defaultValue) {
            if ($window.localStorage[key]){
                return JSON.parse($window.localStorage[key]);
            } else {
                return defaultValue;
            }
        };

        this.delete = function(key){
            delete $window.localStorage[key];
        };
    }
})(IsyplusApp);
/**
 * Created by Manuel on 11/03/2015.
 */
(function(module){
    'use strict';
    module.service("ModalServ", ModalServ);

    function ModalServ(){
        this.show = function(modalid){
            $("#"+modalid).modal("show");
        }
        this.hide = function(modalid){
            $("#"+modalid).modal("hide");
        }
        this.onShow = function(modalid, fn){
            $("#"+modalid).on('show.bs.modal', fn);
        }
        this.onShown = function(modalid, fn){
            $("#"+modalid).on('shown.bs.modal', fn);
        }
        this.onHide = function(modalid, fn){
            $("#"+modalid).on('hide.bs.modal', fn);
        }
        this.onHidden = function(modalid, fn){
            $("#"+modalid).on('hidden.bs.modal', fn);
        }
        this.onLoaded = function(modalid, fn){
            $("#"+modalid).on('loaded.bs.modal', fn);
        }
    }
})(IsyplusApp);
/**
 * Created by Manuel on 11/03/2015.
 */
(function(module){
    'use strict';
    module.service("NotifServ", NotifServ);

    function NotifServ(){
        this.info = function(message){
            toastr.info(message);
        }
        this.success = function(message){
            toastr.success(message);
        }
        this.warning = function(message){
            toastr.warning(message);
        }
        this.error = function(message){
            toastr.error(message);
        }
        this.erroroptions = function(message,title,options){
            toastr.error(message,title,options);
        }
        this.warningoptions = function(message,title,options){
            toastr.warning(message,title,options);
        }
        this.infooptions = function(message,title,options){
            toastr.info(message,title,options);
        }
        this.successoptions = function(message,title,options){
            toastr.success(message,title,options);
        }
    }
})(IsyplusApp);
/**
 * Created by Manuel on 11/03/2015.
 */
(function (module) {
    'use strict';
    module.factory("NumberServ", NumberServ);

    function NumberServ($filter, $locale) {
        return {
            isNumber: isNumber,
            isNumberMayorCero: isNumberMayorCero,
            isNumberAMayorToB: isNumberAMayorToB,
            isNumberAMayorIgualToB: isNumberAMayorIgualToB,
            isNumberMayorIgualCero: isNumberMayorIgualCero,
            isNumberBetween: isNumberBetween,
            redondear: redondear,
            getRandomNumber: getRandomNumber
        };


        function isNumber(value) {
            return $.isNumeric(value);
        }

        function isNumberMayorCero(value) {
            if (this.isNumber(value)) {
                return Number(value) > 0;
            }
            return false;
        }

        function isNumberAMayorToB(valueA, valueB) {
            return Number(valueA) > Number(valueB);
        }

        function isNumberAMayorIgualToB(numberA, numberB){
            return new Number(numberA)>=new Number(numberB);
        }

        function isNumberMayorIgualCero(value) {
            if ($.isNumeric(value)) {
                return Number(value) >= 0;
            }
            return false;
        }

        function isNumberBetween(value, start, end) {
            if ($.isNumeric(value)) {
                var numberValue = Number(value);
                return numberValue >= start && numberValue <= end;
            }
            return false;
        }

        function redondear(value, fractionSize) {
            var formattedValue = $filter('number')(value, fractionSize);
            var re = new RegExp("\\" + $locale.NUMBER_FORMATS.GROUP_SEP, "g");
            var replaced = formattedValue.replace(re, "");
            return Number(replaced);
        }

        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
    }
})(IsyplusApp);
/**
 * Created by serviestudios on 05/02/16.
 */
(function (module) {
    'use strict';
    module.factory("$sessionStorageSrv", sessionStorageSrv);

    /**
     * Gestiona el objeto sessionStorage de la session del navegador
     * @param $window
     * @returns {{set: set, get: get, setObject: setObject, getObject: getObject, delete: borrar, clear: clear}}
     */
    function sessionStorageSrv($window) {
        return {
            set: set,
            get: get,
            setObject: setObject,
            getObject: getObject,
            delete: borrar,
            clear: clear
        };

        function set(key, value) {
            $window.sessionStorage[key] = value;
        }

        function get(key, defaultValue) {
            return $window.sessionStorage[key] || defaultValue;
        }

        function setObject(key, value) {
            $window.sessionStorage[key] = JSON.stringify(value);
        }

        function getObject(key, defaultValue) {
            if ($window.sessionStorage[key]) {
                return JSON.parse($window.sessionStorage[key]);
            } else {
                return defaultValue;
            }
        }

        function borrar(key) {
            delete $window.sessionStorage[key];
        }

        function clear() {
            $window.sessionStorage.clear();
        }
    }
})(IsyplusApp);
/**
 * Created by serviestudios on 28/01/16.
 */
(function (module) {
    'use strict';
    module.factory("sideBarService", sideBarService);

    function sideBarService(){

        return {
            hideAppSideBar: hideAppSideBar,
            showAppSideBar: showAppSideBar,
            setup: setup,
            visible: visible,
            width: getwidth
        };
        function getwidth(){
            return $('#appMenu').width();
        }
        function visible(){
            return $('#appMenu').is(':visible')
        }
        function hideAppSideBar(){
            $("#appMenu").removeClass("col-md-2").addClass("col0");
            $("#appContainer").removeClass("col-md-10").addClass("col-md-12");
            $("#appMenu").hide();
        };

        function showAppSideBar(){
            $("#appMenu").removeClass("col0").addClass("col-md-2");
            $('#appMenu').css('visibility','visible').hide().fadeIn().removeClass('hidden');
            $("#appContainer").removeClass("col-md-12").addClass("col-md-10");
        };

        function setup(){
            $("#appBrand").on("click", function(e){
                if ( $("#appMenu").hasClass('col-md-2') ){
                    hideAppSideBar();
                }
                else{
                    showAppSideBar();
                }
            });

            if ( $("#appBarToggle").is(':visible') ){
                hideAppSideBar();
            }

            $('#sidebar > a').on('mouseover', function (e) {
                $(this).addClass("mymenulihover");
            });

            $('#sidebar > a').on('mouseout', function (e) {
                $(this).removeClass("mymenulihover");
            });

            $('#sidebar > div > a').on('mouseover',function (e) {
                $(this).addClass("mylgihover");
            });

            $('#sidebar > div > a').on('mouseout',function (e) {
                $(this).removeClass("mylgihover");
            });

            $('#sidebar > a').on('click', function (e) {
                var lastActive = $(this).closest("#sidebar").children(".mylgiclick");
                lastActive.removeClass("active");
                lastActive.removeClass("mylgiclick");
                lastActive.next('div').collapse('hide');
                var lastActiveSI = $("#sidebar > div").children(".mylgiclick");
                lastActiveSI.removeClass("mylgiclick");
                $(this).addClass("active");
                $(this).addClass("mylgiclick");
                $(this).next('div').collapse('toggle');
            });

            $('#sidebar > div > a').on('click', function (e) {
                var lastActive = $(this).closest("#sidebar > div").children(".mylgiclick");
                lastActive.removeClass("mylgiclick");
                $(this).addClass("mylgiclick");
                if ( $("#appBarToggle").is(':visible') ){
                    hideAppSideBar();
                }
            });

            $('#appBrand').popover({trigger:'hover'});
        }
    }

})(IsyplusApp);
/**
 * Created by serviestudios on 23/02/16.
 */
(function (module) {
    'use strict';
    module.factory("StringServ", StringServ);

    function StringServ(){

        return {
            limpiaEspacios: limpiaEspacios,
            limpiaRegEx: limpiaRegEx,
            soloNumLetras: soloNumLetras,
            trim: trim,
            noNuloNoVacio: noNuloNoVacio
        };

        /**
         * Quita de una cadena todos los espacios en blanco
         * @param strng
         * @returns {string}
         */
        function limpiaEspacios(string){
            return (string||'').replace(/ /g,'');
        }

        /**
         * Quita espacios al inicio y al final de una cadena
         * @param string
         * @returns {string}
         */
        function trim(string){
            return (string||'').trim();
        }

        /**
         * Quita todas las coincidencias de la expresion regular
         * @param regexp
         * @returns {string}
         */
        function limpiaRegEx(string, regexp){
            return (string||'').replace(regexp,'');
        }

        /**
         * Quita todos los caracteres especiales de una cadena (deja solo numeros y letras)
         * @param string
         * @returns {string}
         */
        function soloNumLetras(string){
            return limpiaRegEx(string, /[^0-9a-zA-Z]/gi);
        }

        /**
         * Verifica que una cadena sea distinta de null y de espacios en blanca, que una cadena tenga algo ingresado
         * @param cadena
         * @returns {boolean}
         */
        function noNuloNoVacio(cadena){
            return cadena!==undefined && cadena!==null && cadena.trim().length>0;
        }

    }

})(IsyplusApp);
/**
 * Created by serviestudios on 18/01/16.
 */
(function(module){
    'use strict';
    module.factory("swalService", swalService);

    function swalService(){
        var service  = {
            success: success,
            warning: warning,
            error: error,
            info: info,
            confirm: confirm
        };

        return service;

        function getSwalConfig(title, text, type){
            return {
                title: title||'Éxito',
                text: text||'',
                type: type
            }
        }

        function success(text, fnthen, title){
            swal(
                getSwalConfig(title||"Éxito", text, "success"),
                fnthen
            );
        }

        function warning(text, fnthen, title){
            swal(
                getSwalConfig(title||"Precaución", text, "warning"),
                fnthen
            );
        }

        function error(text, fnthen, title){
            swal(
                getSwalConfig(title||"Error", text, "error"),
                fnthen
            );
        }

        function info(text, fnthen, title){
            swal(
                getSwalConfig(title||"Información", text, "info"),
                fnthen
            );
        }

        /**
         *
         * @param title
         * @param text
         * @param fnthen debe ser function(isConfirm)
         */
        function confirm(text, fnthen, title){
            swal({
                title: title||"¿Está seguro?",
                text: text || '',
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: true,
                closeOnCancel: true
            }, fnthen);

        }
    }

})(IsyplusApp);
/**
 * Created by serviestudios on 05/02/16.
 */
(function (module) {
    'use strict';
    module.service("ValidadoresServ", ValidadoresServ);

    function ValidadoresServ(){
        this.es_decimal = function($scope, valor){
            var cadena = $scope[valor];
            var entero, lastdato, puntodec, i, j;
            for(i=cadena.length-1; i>=0; i--){
                puntodec=0;
                lastdato=cadena.charAt(i);
                entero=parseInt(lastdato);
                for(j=0; j<cadena.length; j++)
                    if (cadena.charAt(j) == '.')
                        puntodec++;
                if (isNaN(entero) && lastdato != '.' && lastdato != '-')
                    cadena = cadena.substring(0, cadena.length - 1);
                if (lastdato == '.' && puntodec > 1)
                    cadena = cadena.substring(0, cadena.length - 1);
                if (lastdato == '-' && i != 0)
                    cadena = cadena.substring(0, cadena.length - 1);
            }
            $scope[valor] = cadena;
        };

        this.es_entero = function($scope, valor){
            var cadena = $scope[valor];
            var entero, lastdato, puntodec, i, j;
            for(i=cadena.length-1; i>=0; i--){
                puntodec=0;
                lastdato=cadena.charAt(i);
                entero=parseInt(lastdato);
                for(j=0; j<cadena.length; j++)
                    if (cadena.charAt(j) == '.')
                        puntodec++;
                if (isNaN(entero) && lastdato != '.' && lastdato != '-')
                    cadena = cadena.substring(0, cadena.length - 1);
                if (lastdato == '.' && puntodec > 0)
                    cadena = cadena.substring(0, cadena.length - 1);
                if (lastdato == '-' && i != 0)
                    cadena = cadena.substring(0, cadena.length - 1);
            }
            $scope[valor] = cadena;
        };
    }
})(IsyplusApp);
/**
 * Created by serviestudios on 10/05/16.
 */
(function (module) {
    'use strict';

    module.controller("ModalCmbNombreArtCntrl", ModalCmbNombreArtCntrl);

    function ModalCmbNombreArtCntrl($scope, ModalServ, ListasServ, NotifServ, focusService) {
        var self = this;

        self.isRowMarked = false;
        self.newPrintName = "";
        self.isHeadMarked = 0;

        self.ok = ok;
        self.changeName = changeName;
        self.toggleRowMark = toggleRowMark;
        self.toggleHeadMark = toggleHeadMark;

        $scope.$watch("self.articulos", watchArticulos);
        $scope.$watch("self.isRowMarked", watchIsRowMarked);

        function watchArticulos(newValue, oldValue) {
            console.log("watch self.articulos--->", newValue);
        }

        function watchIsRowMarked(newValue, oldValue){
            if (newValue){
                focusService.setFocus("newPrintName",1500);
            }
        }

        function toggleHeadMark(){
            self.isHeadMarked = self.isHeadMarked ? 0 : 1;
            updateAllMark(self.isHeadMarked);
            updateIsRowMarked();
        }

        function updateAllMark(markValue){
            $.each(self.articulos, function(rowIndex, row){
                row.mark = markValue;
            });
        }

        function toggleRowMark(row) {
            row.mark = row.mark === 1 ? 0 : 1;
            updateIsRowMarked();
        }

        function updateIsRowMarked(){
            var marcados = getMarkedRows();
            self.isRowMarked = marcados && marcados.length>0;
        }

        function changeName(){
            if (self.newPrintName.length>0){
                var marcados = getMarkedRows();
                if (marcados && marcados.length>0){
                    $.each(marcados, function(rowIndex, row){
                        row.art_nomimp = self.newPrintName;
                    });
                }
                NotifServ.success("Nombre asignado");
                reset();
            }
        }

        function getMarkedRows(){
            return ListasServ.filtrar(self.articulos, {mark:1});
        }

        function reset() {
            self.newPrintName = "";
            self.isRowMarked = false;
            self.isHeadMarked = 0;
            updateAllMark(self.isHeadMarked);
        }

        function ok(){
            console.log("cerrar--->", self.elementid);
            ModalServ.hide(self.elementid);
        }
    }

})(IsyplusApp);
/**
 * Created by serviestudios on 10/05/16.
 */
(function (module) {
    'use strict';
    module.directive("modalCmbNombreArts", modalCmbNombreArts);

    function modalCmbNombreArts(){
        return {
            restrict:'EA',
            replace:true,
            templateUrl: "static/components/transacc/modalCmbNombreArts/modalCmbNombreArts.html?v="+globalgsvapp,
            scope:true,
            bindToController: {
                elementid:"@",
                articulos:"="
            },
            controller:"ModalCmbNombreArtCntrl",
            controllerAs: "self"
        }
    }

})(IsyplusApp);
/**
 * Created by serviestudios on 07/04/16.
 */
(function (module) {
    'use strict';

    module.controller("ServiTrnResCntrl", ServiTrnResCntrl);

    function ServiTrnResCntrl($resource, $scope){
        var self = this;
        var viewResumenRest = $resource("/rest/transacc/resumen/:trn_codigo", {trn_codigo:'@trn_codigo'},{});

        $scope.$watch("self.trncodigo", watchTrnCodigo);


        function watchTrnCodigo(newValue, oldValue){
            console.log("Cambio trn_codigo traer datos del servidor--->", newValue, oldValue);
            if ((newValue)||newValue===0){
                var res = viewResumenRest.get({trn_codigo:newValue}, function() {
                    console.log("valor para res es:");
                    console.log(res);
                });
            }
        }
    }


})(IsyplusApp);
/**
 * Created by serviestudios on 07/04/16.
 */
(function (module) {
    'use strict';

    module.directive("serviTrnResumen", serviTrnResumen);

    function serviTrnResumen(){
        return {
            restrict:'EA',
            replace: true,
            templateUrl: 'static/components/transacc/serviTrnResumen/serviTrnResumen.html?v='+ globalgsvapp,
            scope: true,
            bindToController: {
                trncodigo: '='
            },
            controller: "ServiTrnResCntrl",
            controllerAs: "self"
        }
    }

})(IsyplusApp);
(function () {
    'use strict';
    angular.module("isyplus")
    .directive('capitalize', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
          if (inputValue == undefined) inputValue = '';
          var capitalized = inputValue.toUpperCase();
          if (capitalized !== inputValue) {
            // see where the cursor is before the update so that we can set it back
            var selection = element[0].selectionStart;
            modelCtrl.$setViewValue(capitalized);
            modelCtrl.$render();
            // set back the cursor after rendering
            element[0].selectionStart = selection;
            element[0].selectionEnd = selection;
          }
          return capitalized;
        }
        modelCtrl.$parsers.push(capitalize);
        capitalize(scope[attrs.ngModel]); // capitalize initial value
      }
    };
  });

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("inputMask", inputMask);

    function inputMask(){
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, el, attrs){
                $(el).inputmask(scope.$eval(attrs.inputMask));
                el.on('click', function () {
                    this.select();
                });
            }
        }
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("NgAutocompCntrl", NgAutocompCntrl);

    function NgAutocompCntrl($scope, $element, $attrs, $filter, $http, $timeout){
        $scope.tipo='n';//1-normal, 2-ajax
        $scope.uri= '';//uri si ajax
        $scope.indexitem = -1;
        $scope.itemsel = {};
        $scope.filtro = {};
        $scope.idprop = 'autocompletado';//Id del input
        $scope.csscolor = {'color':'#000000'};
        $scope.csscolornull = '#FF0000';
        $scope.filtrados = $scope.data;
        $scope.justone = 'F';
        $scope.nomoreajax = false;

        $scope.placeholder = "";
        $scope.auxfnsel = function(item){};
        $scope.propFiltro = "label";
        $scope.fnSelItem = $scope.auxfnsel;
        $scope.fnOnNull = $scope.auxfnsel;
        $scope.fnOnEnterNull = $scope.auxfnsel;//Se usa para el caso en que no haya ninguna sugerencia y se precione enter

        if ( $scope.setup['propFiltro'] ){
            $scope.propFiltro =  $scope.setup['propFiltro'];
        }

        $scope.labelExp = "item."+$scope.propFiltro;
        if ( $scope.setup['labelExp'] ){
            $scope.labelExp = $scope.setup['labelExp'];
        }

        if ( $scope.setup['uri'] ){
            $scope.uri = $scope.setup['uri'];
        }

        if ( $scope.setup['placeholder'] ){
            $scope.placeholder = $scope.setup['placeholder'];
        }

        if ( $attrs['tipo'] ){
            $scope.tipo = $attrs['tipo'];
        }

        if ( $scope.setup['fnonsel'] ){
            $scope.fnSelItem = eval($scope.setup['fnonsel']);
        }

        if ( $scope.setup['fnonnull'] ){
            $scope.fnOnNull = eval($scope.setup['fnonnull']);
        }

        if ( $scope.setup['fnOnEnterNull'] ){
            $scope.fnOnEnterNull = eval($scope.setup['fnOnEnterNull']);
        }

        if ( $scope.setup['idprop'] ){
            $scope.idprop = $scope.setup['idprop'];
        }

        if ( $scope.setup['jo'] ){
            $scope.justone = $scope.setup['jo'];
        }

        if ( $scope.setup['colornull'] ){
            $scope.csscolornull= $scope.setup['colornull'];
        }

        $element.find(".suggestbox").hide();
        $element.find(".form-control").bind('blur', function(event) {
            $scope.filtrados = [];
        });

        $scope.modelToFiltro = function(){
            $scope.filtro[$scope.propFiltro] = $scope.model[$scope.propFiltro];
        };

        $scope.conf_posancho = function(show){
            var input = $element.find(".input-groupdd");
            var offset = input.offset();
            var altoinput = input.outerHeight();
            var anchoinput = input.css("width");
            offset['top']= offset['top']+altoinput;
            var suggest = $element.find(".suggestbox");
            suggest.offset( offset );
            suggest.css("width",  anchoinput);

            if (show){
                suggest.show();
            }
            else{
                suggest.hide();
            }
        };

        $scope.sel_item = function(item){
            $scope.csscolor = {'color':'#000000'};
            //$scope.model = {};
            $scope.model = item;
            $scope.filtrados = [];
            $scope.indexitem = -1;
            $scope.itemsel = {};
            $scope.nomoreajax = false;

            try{//Evaluar funcion listener
                $timeout(function(){
                    $scope.fnSelItem(item);
                });
            }
            catch(e){
                console.error(" Error al ejecutar función ");
            }
        };

        $scope.listener_null = function(filtro){
            $scope.indexitem = -1;
            $scope.itemsel = {};
            $scope.model = {};
            $scope.model = $scope.filtro;
            $scope.nomoreajax = false;
            try{//Evaluar funcion listener
                $timeout(function(){
                    $scope.fnOnNull(filtro);
                });
            }
            catch(e){
                console.error(" Error al ejecutar función ")
            }
        };

        $scope.logica_filtrados = function(isAjax){
            var nfiltrados = $scope.filtrados.length;
            if( nfiltrados >0 ){
                $scope.csscolor = {'color':'#000000'};
                if ( (nfiltrados == 1) && ($scope.justone=='T') ){
                    $scope.sel_item($scope.filtrados[0]);
                }
                else if ( ($scope.filtro[$scope.propFiltro]) && ($scope.filtro[$scope.propFiltro].length>0) ){
                    $scope.itemsel = $scope.filtrados[0];
                    $scope.indexitem = 0;
                }
                else{
                    $scope.indexitem = -1;
                    $scope.itemsel = {};
                }
            }
            else{
                $scope.csscolor = {'color':$scope.csscolornull};
                $scope.listener_null($scope.filtro);
                if (isAjax){
                    $scope.nomoreajax=true;
                }
            }
        };

        $scope.doAjax = function(){
            if (!$scope.nomoreajax){
                var uri = $scope.uri+"&filtro="+$scope.filtro[$scope.propFiltro];
                $http.get(uri).then(function(response){
                    if (response.data['items']){
                        $scope.filtrados = response.data['items'];
                        $scope.logica_filtrados(true);
                    }
                });
            }
            else{
                $scope.listener_null($scope.filtro);
            }
        };

        $scope.nav_items_sugg = function(inc){
            $scope.indexitem = $scope.indexitem+inc;
            $scope.itemsel = $scope.filtrados[$scope.indexitem];
        };

        $scope.evalExpress= function(item, express){
            var item = item;
            var res = '';
            try{
                res = eval(express);
            }
            catch(e){
                res = $scope.label;
            }
            return res;
        };

        $scope.onkeydown = function(event){
            $scope.conf_posancho(true);
            if (event.keyCode == 38) {//UP
                if ( $scope.indexitem > 0 ){
                    $scope.nav_items_sugg(-1);
                }
            }
            else if(event.keyCode == 40) {//DOWN
                if ( ($scope.indexitem+1) < $scope.filtrados.length ){
                    $scope.nav_items_sugg(+1);
                }
            }
            else if(event.keyCode == 13) {//ENTER
                if ($scope.itemsel[$scope.propFiltro]){
                    $scope.sel_item($scope.itemsel);
                }
                else {
                    try{//Evaluar funcion listener
                        $scope.fnOnEnterNull();
                    }
                    catch(e){
                        console.error(" Error al ejecutar función ");
                    }
                }
            }
            else if (event.keyCode == 27){//escape
                $scope.indexitem = -1;
                $scope.itemsel = {};
                $scope.filtrados = [];
            }
            else if( (event.keyCode == 46) || (event.keyCode == 8) ) {//SUPR O DELETE
                $scope.listener_null($scope.filtro);
                $scope.nomoreajax = false;
                if ($scope.tipo=='n'){
                    $scope.filtrados = $filter('filter')($scope.data, $scope.filtro, function (actual, expected) {
                        return actual.toLowerCase().indexOf(expected.toLowerCase()) == 0;
                    });
                }
            }
        };

        $scope.onkeyup = function(event){
            $scope.conf_posancho(true);
            if ( (event.keyCode >= 65 && event.keyCode <= 90) ||
                (event.keyCode >= 48 && event.keyCode <= 57) ||
                (event.keyCode >= 96 && event.keyCode <= 105) ){//Teclado numerico
                if ( $scope.tipo=='x' ){
                    $scope.doAjax();
                }
                else if ($scope.tipo=='n'){
                    $scope.filtrados = $filter('filter')($scope.data, $scope.filtro,function (actual, expected) {
                        return actual.toLowerCase().indexOf(expected.toLowerCase()) == 0;
                    });
                    $scope.logica_filtrados(false);
                }
            }
        };

        $scope.limpiar = function(){
            $scope.filtro[$scope.propFiltro] = '';
            $scope.listener_null();
            $("#"+$scope.idprop).focus();
        };
        $scope.$watch("model",
            function( newValue, oldValue ) { $scope.modelToFiltro(); }
        );

        $scope.conf_posancho(false);
    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular.module("isyplus")
        .directive("ngAutocomp", ngAutocomp);

    function ngAutocomp(){
        return {
            restrict: 'A',
            scope:{
                data:'=',
                model:'=',
                setup:'='
            },
            controller: "NgAutocompCntrl",
            templateUrl:"static/components/ui/ngAutocomp/ngAutocomtemplate.html?v=" + globalgsvapp
        }
    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("ngComplete", ngComplete);

    function ngComplete($filter, $timeout, $http){
        return {
            restrict: 'E',
            templateUrl: "static/components/ui/ngComplete/ngComplete.html?v="+ globalgsvapp,
            scope: {
                lstdatos: '=',
                model: '=',
                func: '=',
                funcchg: '=',
                required: '=',
                filtro: '@',
                url:'@',
                placeholder: '@',
                vertitle :'=',
                group: '=',
                disabled: '=',//Permite desactivar el campo de autocompletado
                elementid: '@'//input html id
            },

            link: function(scope, element, attributes){

                scope.form = {};
                scope.form.lstdatos = [];
                scope.form.lstaux = [];
                scope.form.indice = 0;
                scope.form.busqueda = '';
                scope.form.funcejec = false; // variable que indica cuando se ha ejecutado la funcion asociada
                scope.form.borrado = false; // variable que indica si se ha borrado algo en el campo de busqueda
                scope.form.tipfilt = 1 // por defecto por palabras
                scope.form.nomfilt = 'Filtro';

                setElementId();

                function setElementId(){
                    if (scope.elementid===undefined){
                        scope.elementid = "ngcomplete";
                    }
                }

                if (scope.group) {
                    if (scope.group.dropdown) {
                        scope.form.tipfilt = scope.group.dropdown[0].codigo;
                        scope.form.nomfilt = scope.group.dropdown[0].label;
                    }
                }

                scope.checkKeyDown = function(event){
                    // se ejecuta dentro de un keydown porque no siempre se ejecuta en un keyup
                    if(event.keyCode===13){ //tecla enter
                        event.preventDefault();
                        if (scope.model){
                            if (Object.keys(scope.model)){
                                if (Object.keys(scope.model).length === 0){
                                    scope.setModel(scope.form.indice);
                                }
                            }
                        }
                        /*
                        if (Object.keys(scope.model).length === 0) {
                            scope.setModel(scope.form.indice);
                        }
                        */
                    }
                }

                scope.checkKeyUp = function(event){
                    scope.form.funcejec = false;
                    scope.form.borrado = false;
                    if(event.keyCode===40){ // flecha abajo
                        event.preventDefault();
                        if(scope.form.indice+1 !== scope.form.lstaux.length){
                            scope.form.indice++;
                        }
                    } else if(event.keyCode===38){ //flecha arriba
                        event.preventDefault();
                        if(scope.form.indice -1 !== -1){
                            scope.form.indice--;
                        }
                    } else if(event.keyCode===13){ //tecla enter
                        event.preventDefault();
                        if (scope.model){
                            if (Object.keys(scope.model)){
                                if (Object.keys(scope.model).length === 0){
                                    scope.setModel(scope.form.indice);
                                }
                            }
                        }
                        /*
                        if (Object.keys(scope.model).length === 0) {
                            scope.setModel(scope.form.indice);
                        }
                        */
                    }
                    else if (scope.form.busqueda && scope.form.busqueda.length > 0) { // si el campo de busqueda no esta vacio
                        scope.getNewList();
                        if (event.keyCode === 8 || event.keyCode === 46) { // delete o backspace
                            scope.form.borrado = true;
                        }
                    } else { //para que no se muestre la lista cuando el campo de busqueda esta vacio
                        scope.resetear();
                    }
                    if (scope.funcchg) {
                        $timeout(function(){
                            scope.funcchg();
                        },0);
                    }
                };

                scope.setModel = function(i){
                    if (scope.form.lstaux.length > 0) { // si hay elementos en la lista
                        scope.model = scope.form.lstaux[i];
                        scope.form.busqueda = scope.model[scope.filtro];
                        scope.form.lstaux = [];
                        scope.form.indice = 0;
                        if (scope.func) { //si hay funcion
                            $timeout(function() { // para evitar error en consola con el $apply
                                scope.form.funcejec = true;
                                scope.func(scope.model);
                            }, 0);
                        }
                    } else if(scope.form.busqueda !== scope.model[scope.filtro]){ //si el texto de busqueda no es igual al texto de filtro
                        scope.resetear();
                    }
                };

                scope.getNewList = function(){
                    if (scope.url && scope.form.lstdatos.length === 0) {
                        $http.get(scope.url+'&filtro='+scope.form.busqueda+"&tipfilt="+scope.form.tipfilt).then(function(rpta){
                            scope.form.lstaux = rpta.data.items;
                            scope.form.indice = 0;
                        });
                    } else if (scope.form.lstdatos.length > 0){
                        scope.form.lstaux = $filter('filter')(scope.form.lstdatos, scope.form.busqueda);
                        //scope.form.lstaux = $filter('startWith')(scope.form.lstdatos, scope.form.busqueda, scope.filtro);

                        if (scope.form.indice >= scope.form.lstaux.length) {
                            scope.form.indice = 0;
                        }
                    }

                    if (scope.form.lstaux.length === 0) { // si la lista auxiliar generada es vacia
                        scope.resetear();
                    }
                    // si hay modelo asignado y el campo de busqueda no es igual al campo en el modelo que corresponde al filtro
                    if (scope.model && scope.form.busqueda !== scope.model[scope.filtro]) {
                        scope.model = {};
                    }
                };
                scope.$watchCollection(
                    "lstdatos",
                    function( newLst, oldLst) {
                        if (scope.lstdatos && newLst) {
                            scope.form.lstdatos = newLst;
                        }
                    }
                );
                scope.$watch(
                    "model",
                    function(newVal, oldVal){
                        if (newVal && oldVal && newVal[scope.filtro] !== oldVal[scope.filtro]) {
                            if (!newVal[scope.filtro] && scope.form.funcejec) { // si no hay valor en el modelo de acuerdo al filtro y se a ejecutado la funcion asociada
                                scope.form.busqueda = '';
                            }
                            // para que se limpie el campo cuando se edita en asiento
                            else if (!newVal[scope.filtro]) {
                                if (scope.form.borrado === false) {
                                    scope.form.busqueda = '';
                                }
                            }
                        }
                        if (newVal && oldVal && newVal[scope.filtro]) { // para cuando se asigna el objeto de nuevo desde el controller
                            var i = scope.existObj(newVal);
                            if (i !== -1) {
                                scope.model = scope.form.lstdatos[i];
                                scope.form.busqueda = scope.model[scope.filtro];
                                scope.form.lstaux = [];
                                scope.form.indice = 0;
                            }
                            if (scope.url) {
                                scope.form.busqueda = scope.model[scope.filtro];
                                scope.form.lstaux = [];
                                scope.form.indice = 0;
                            }
                        }
                    }
                );

                scope.existObj = function(obj){
                    if (scope.form.lstdatos && obj !== undefined) {
                        for (var i in scope.form.lstdatos) {
                            if (angular.equals(obj, scope.form.lstdatos[i])) {
                                return i;
                            }
                        }
                    }
                    return -1;
                };

                scope.resetear = function(){
                    scope.form.lstaux = [];
                    scope.model = {};
                    scope.form.indice = 0;
                };

                scope.onclickFiltro = function(lbl, cod){
                    scope.form.tipfilt = cod; // codigo del filtro para buscar en el dao
                    scope.form.nomfilt = lbl; // nombre del filtro
                };
            }
        }
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("ngEnter", ngEnter);

    function ngEnter() {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                elem.on('keydown', function(event){
                    if(event.which === 13) {
                        scope.$apply(function (){
                            scope.$eval(attrs.ngEnter);
                        });
                        event.preventDefault();
                    }
                });
            }
        }
    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("ngImgupload", ngImgupload);

    function ngImgupload($timeout){
    return {
        restrict: 'E',
        templateUrl: "static/components/ui/ngImgupload/ngImgupload.html?v="+ globalgsvapp,
        scope: {
            model: '=',
            imgsrc: '@'
        },
        link: function(scope, element, attributes){
            scope.form = {};
            scope.form.rutaimg = 'static/img/public/logo_isyplus_reducido.png';
            scope.form.imagen = document.getElementById("img");

            if (scope.model && scope.model !== '') {
                scope.form.imagen.src = scope.model;
            } else if (scope.imgsrc) {
                scope.form.imagen.src = scope.imgsrc;
            } else {
                scope.form.imagen.src = scope.form.rutaimg;
            }
            scope.setFile = function () {
                var oFReader = new FileReader();
                oFReader.readAsDataURL(document.getElementById("inputimg").files[0]);
                oFReader.onload = function (oFREvent) {
                    scope.$apply(function () {
                        scope.model = oFREvent.target.result;
                        scope.form.imagen.src = scope.model;
                    });
                };
            };
            scope.quitaImagen = function(){
                $timeout(function(){
                    scope.$apply(function () {
                        scope.model = '';
                        scope.form.imagen.src  = scope.form.rutaimg;
                    });
                },0);
            };
        }
    }
}


})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("ngOpcbusq", ngOpcbusq);

    function ngOpcbusq($timeout){
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: "static/components/ui/ngOpcbusq/ngOpcbusq.html?v=" + globalgsvapp,
            scope:{
                filtros:'=',
                listaopc:'=',
                parametros:'=',
                listatdocs:'=',
                opciondoc:'=',
                fncbusq:'=',
                ini:'=',
                funasignardoc:'=',
                funcfil:'=',
                lstitbusq:'=',
                titdoc:'@',
                fnonchangefecha:'='
            },
            link: function($scope, $elem, $attrs){
                //$scope.listatdocs= $scope.listatdocs ||[];
                $scope.titbusq="Busquedas por: ";
                $scope.opendocs = false;
                $scope.searchFilter = $scope.searchFilter || '';
                $scope.buscarDocs = $scope.buscarDocs || '';

                $scope.$watchCollection(
                    "listaopc",
                    function( newLst, oldLst ) {
                        if(newLst.length===0){//limpiar titbusq cuando lista es vacia
                            $scope.limpiartitbusq();
                        }
                    }
                );
                $scope.inicializar =function(lt){
                    for (var n=0;n<lt.length;n++ ) {
                        lt[n].sel=false;
                    }
                    $scope.opendocs = false;
                    $scope.concatTitbusq();
                };
                $scope.limpiartitbusq=function(tipo , index){
                    var ban=false;

                    if(  index ){
                        ban=true;
                        if(($scope.filtros[index].tipo==="select" ||
                            $scope.filtros[index].tipo==="find" ||
                            $scope.filtros[index].tipo==="monto" ||
                            $scope.filtros[index].tipo==="text"
                            ) &&$scope.listaopc[index]===1 ){
                            ban=false;
                        }
                    }
                    if(ban){
                        $scope.fncbusq()
                    }
                    $scope.concatTitbusq();
                }
                $scope.concatTitbusq=function(){
                    $scope.titbusq="Busquedas por : ";
                    for (var key in $scope.lstitbusq) {
                        if ($scope.lstitbusq[key]!=""){
                            $scope.titbusq=$scope.titbusq+$scope.lstitbusq[key]
                            $scope.titbusq=$scope.titbusq+" - "
                        }
                    }

                    $scope.titbusq=$scope.titbusq.substring(0, $scope.titbusq.length-3);//quitar el ultimo separador
                }

                $scope.$watchCollection(
                    "filtros.lstselect",
                    function( newLst, oldLst ) {
                    }
                );
                $scope.$watchCollection(
                    "filtros",
                    function( newLst, oldLst ) {
                    }
                );

                $scope.$watch(
                    "filtros.opcmodel",
                    function(newVal, oldVal){
                    }
                );

                $scope.$watch(
                    "parametros",
                    function(newVal, oldVal){
                    }
                );
                $scope.$watchCollection(
                    "lstitbusq",
                    function( newLst, oldLst ) {
                        $scope.concatTitbusq()
                    }
                )
                $scope.$watchCollection(
                    "listatdocs",
                    function( newLst, oldLst ) {
                        if(newLst){
                            for (var n=0;n<newLst.length;n++ ) {//seleccionar por defecto un tipo de documento
                                if(newLst[n].tra_codigo===$scope.opciondoc) {
                                    newLst[n].sel = true
                                }else{
                                    newLst[n].sel = false
                                }
                            }
                        }
                    }
                );
                $scope.foco = function(id){
                    $timeout(function() {
                        document.getElementById(id).focus();
                    });
                }
            }
        }
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("ngOpcproyecto", ngOpcproyecto);

    function ngOpcproyecto(){
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: "static/components/ui/ngOpcproyecto/ngOpcproyecto.html?v=" + globalgsvapp,
            scope:{
                params:"=",// Parametro donde seguardar la opcion de lso check si solo este local o todos
                setup:'=',
                lstproyectosselecs:'='
            },
            link: function($scope, $elem, $attrs){
                console.log("llega a ngOpcProyecto ")
                $scope.params.opclocal= $scope.params.opclocal? $scope.params.opclocal:1;
                $scope.show_modal_proyectos = function(){
                    setTimeout(function() {
                        $scope.$broadcast('show_modal_centrocosto', {selecvarios:true,
                            proyectosselecs: $scope.lstproyectosselecs,
                            pry_estado: 0,onhide: $scope.onChangeopclocal});
                        console.log("pasa show modal")
                    })
                }

                $scope.getProyectSelectCadena = function(){
                    var cad = '';
                    for (var ind in $scope.lstproyectosselecs){
                        cad= cad + $scope.lstproyectosselecs[ind].pry_codigo+',';
                    }
                    cad = cad.substring(0, (cad.length -1));
                    return cad;
                };

                $scope.$watch("params",function(newVal,oldVal){
                    if (newVal) {
                        console.log("llega new val de paramas")
                        $scope.params = newVal;
                        console.log($scope.params)
                    }
                })

                $scope.$watchCollection(
                    "lstproyectosselecs",
                    function( newLst, oldLst ) {
                        if (newLst) {
                            $scope.lstproyectosselecs = newLst;
                            $scope.params.proyectosselecs = $scope.getProyectSelectCadena();

                        }
                    }
                );
                $scope.$watch("setup",
                    function(newVal, oldVal){
                        if (newVal) {
                            if(newVal){
                                console.log("llega setup")
                                console.log(oldVal)
                                console.log(newVal)
                                $scope.setup = newVal;
                                $scope.alm_descri = newVal.alm_descri;
                                $scope.abremodal = newVal.abremodal;
                                //$scope.lstproyectosselecs = newVal.lstproyectosselecs;
                                $scope.onChangeopclocal = newVal.onChangeopclocal;
                                $scope.tituloproyecto = newVal.label;
                                $scope.params.proyectosselecs = $scope.getProyectSelectCadena();
                                if ($scope.params.acf_useproyecto ===1 && $scope.abremodal){
                                    $scope.show_modal_proyectos()
                                }if($scope.params.acf_useproyecto === 2){
                                    console.log("acf_useproyecto es 2")
                                    $scope.onChangeopclocal()
                                }
                            }
                        }
                    }
                );
            }
        }
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("NgRangoFechasCntrl", NgRangoFechasCntrl);

    function NgRangoFechasCntrl($scope){
        $scope.auxfnrango = function(rango){};
        $scope.auxfnenter = function(){};
        $scope.fnonchange = $scope.auxfnenter;
        $scope.fnondesdeenter = $scope.auxfnenter;
        $scope.fnondesdeblur= $scope.auxfnenter;
        $scope.fnonhastaenter = $scope.auxfnenter;
        $scope.fnonhastablur = $scope.auxfnenter;
        $scope.idpropdesde = 'desde';
        $scope.idprophasta = 'hasta';

        if ($scope.setup['fnonchange']){
            $scope.fnonchange= $scope.setup['fnonchange'];
        }
        if ($scope.setup['fnondesdeenter']){
            $scope.fnondesdeenter = $scope.setup['fnondesdeenter'];
        }
        if ($scope.setup['fnondesdeblur']){
            $scope.fnondesdeblur = $scope.setup['fnondesdeblur'];
        }
        if ($scope.setup['fnonhastaenter']){
            $scope.fnonhastaenter = $scope.setup['fnonhastaenter'];
        }
        if ($scope.setup['fnonhastablur']){
            $scope.fnonhastablur = $scope.setup['fnonhastablur'];
        }
        if ($scope.setup['idpropdesde']){
            $scope.idpropdesde = $scope.setup['idpropdesde'];
        }
        if ($scope.setup['idprophasta']){
            $scope.idprophasta = $scope.setup['idprophasta'];
        }

        $scope.formatMoment = function(DATE){
            return DATE.format('DD/MM/YYYY');
        }
        $scope.hoy = function(){
            var Date = moment();
            return {desde:$scope.formatMoment(Date),hasta:$scope.formatMoment(Date)};
        }
        $scope.ayer = function(){
            var Date = moment();
            var ayer = Date.add('days',-1);
            return {desde:$scope.formatMoment(ayer),hasta:$scope.formatMoment(ayer)};
        }
        $scope.semana = function(){
            var Date = moment();
            return{desde: $scope.formatMoment(Date.startOf('week').add('days',1)),
                hasta:$scope.formatMoment(Date.endOf('week').add('days',1))}
        }
        $scope.mes = function(){
            var Date = moment();
            return{desde: $scope.formatMoment(Date.startOf('month')),
                hasta:$scope.formatMoment(Date.endOf('month'))}
        }
        $scope.mesant = function(){
            var Date = moment();
            var mesant = Date.add('month',-1);
            return{desde: $scope.formatMoment(mesant.startOf('month')),
                hasta:$scope.formatMoment(mesant.endOf('month'))}
        }
        $scope.anio = function(){
            var Date = moment();
            return{desde: $scope.formatMoment(Date.startOf('year')),
                hasta:$scope.formatMoment(Date.endOf('year'))}
        }
        $scope.futuro = function(){
            var Date = moment();
            return{desde: $scope.formatMoment(Date),
                hasta:$scope.formatMoment(Date.add('year',1))}
        }
        $scope.sigsem = function(){
            var Date = moment();
            var sigsem = Date.add('week',1);
            return{desde: $scope.formatMoment(sigsem.startOf('week').add('days',1)),
                hasta:$scope.formatMoment(sigsem.endOf('week').add('days',1))}
        }

        $scope.getRangoFechas = function(tipo){
            if (tipo === 'hoy'){
                return $scope.hoy();
            }
            else if (tipo === 'ayer'){
                return $scope.ayer();
            }
            else if (tipo === 'semana'){
                return $scope.semana();
            }
            else if (tipo === 'mes'){
                return $scope.mes();
            }
            else if (tipo === 'mesant'){
                return $scope.mesant();
            }
            else if (tipo === 'anio'){
                return $scope.anio();
            }
            else if (tipo === 'futuro'){
                return $scope.futuro();
            }
            else if (tipo === 'sigsem'){
                return $scope.sigsem();
            }
        }

        $scope.cambiarFecha = function(fn){
            try{
                var rango = $scope.getRangoFechas(fn);
                $scope.form['desde'] = rango['desde'];
                $scope.form['hasta'] = rango['hasta'];
                $scope.fnonchange()
            }
            catch (e){
                console.error("Error al tratar de obtener valores de fechas");
                console.error(e);
            }
        }
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("ngRangofechas", ngRangofechas);

    function ngRangofechas(){
        return {
            restrict: 'E',
            scope:{
                form:"=",
                setup:"=",
                disabled:"="
            },
            controller: "NgRangoFechasCntrl",
            templateUrl:"static/components/ui/ngRangofechas/ngRangofechas.html?v=" + globalgsvapp
        }
    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .filter('ifNumberFormat', ifNumberFormat);

    function ifNumberFormat(){
        return function(val, fractions){
            if ( typeof val == 'number' ){
                try{
                    return val.toFixed( fractions );
                }
                catch(e){}
            }
            return val;
        }
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("NgSegridCntrl", NgSegridCntrl);

    function NgSegridCntrl($scope, $filter, $element){
        $scope.search = {};
        $scope.labelprop= 'label';
        $scope.valueprop= 'prop';
        $scope.totalprop = 'tot';
        $scope.cssrowexp = '';
        $scope.labelbtndet = 'Detalles';
        $scope.expbtndet = 'true';
        $scope.filtot = 'F';
        $scope.reverse = false;
        $scope.filtro = 'T';
        $scope.coldet = false;
        $scope.fillink = "";
        $scope.paginado = 'T';
        $scope.head='T';
        $scope.showtotal='T';

        //Propieades para botones de accion
        $scope.fnbtnsel = $scope.auxfnfila;
        $scope.fnbtnedit = $scope.auxfnfila;
        $scope.fnbtndel = $scope.auxfnfila;
        $scope.fnbtnadc = $scope.auxfnfila;

        $scope.labelbtnsel = "'Elegir'";
        $scope.labelbtnedit = "'Editar'";
        $scope.labelbtndel = "'Quitar'";
        $scope.labelbtnadc = "'Accion'";

        $scope.btnsel = false;
        $scope.btnedit = true;
        $scope.btndel = false;
        $scope.btnadc = false;

        $scope.icobtnsel = true;
        $scope.icobtnedit = true;
        $scope.icobtndel = true;

        $scope.currentdat = undefined;

        if ( $scope['colinfo'] ){
            if ( $scope['colinfo']['labelprop'] ){
                $scope.labelprop = $scope['colinfo']['labelprop'];
                $scope.valueprop = $scope['colinfo']['valueprop'];
            }

            if ( $scope.colinfo['totalprop'] ){
                $scope.totalprop = $scope.colinfo['totalprop'];
            }

            if ( $scope.colinfo['cssrowexp'] ){
                $scope.cssrowexp = $scope.colinfo['cssrowexp'];
            }

            if ( $scope.colinfo['labelbtnsel'] ){
                $scope.labelbtnsel = $scope.colinfo['labelbtnsel'];
            }

            if ( $scope.colinfo['btnsel'] ){
                $scope.btnsel = $scope.colinfo['btnsel'];
            }

            if ( $scope.colinfo['labelbtnedit'] ){
                $scope.labelbtnedit = $scope.colinfo['labelbtnedit'];
            }

            if ( $scope.colinfo['btnedit'] ){
                $scope.btnedit = $scope.colinfo['btnedit'];
            }

            if ( $scope.colinfo['labelbtndel'] ){
                $scope.labelbtndel = $scope.colinfo['labelbtndel'];
            }

            if ( $scope.colinfo['btndel'] ){
                $scope.btndel = $scope.colinfo['btndel'];
            }

            if ( $scope.colinfo['labelbtnadc'] ){
                $scope.labelbtnadc = $scope.colinfo['labelbtnadc'];
            }

            if ( $scope.colinfo['btnadc'] ){
                $scope.btnadc = $scope.colinfo['btnadc'];
            }

            if ( $scope.colinfo['filtot'] ){
                $scope.filtot = $scope.colinfo['filtot'];
            }

            if ( $scope.colinfo['filtro'] ){
                $scope.filtro = $scope.colinfo['filtro'];
            }

            if ( $scope.colinfo['head'] ){
                $scope.head = $scope.colinfo['head'];
            }

            if ( $scope.colinfo['paginado'] ){
                $scope.paginado = $scope.colinfo['paginado'];
            }

            if ( $scope.colinfo['icobtnedit'] ){
                $scope.icobtnedit = $scope.colinfo['icobtnedit'];
            }

            if ( $scope.colinfo['icobtndel'] ){
                $scope.icobtndel = $scope.colinfo['icobtndel'];
            }

            if ( $scope.colinfo['icobtnsel'] ){
                $scope.icobtnsel = $scope.colinfo['icobtnsel'];
            }
            if ( $scope.colinfo['showtotal'] ){
                $scope.showtotal= $scope.colinfo['showtotal'];
            }
        }

        $scope.colorder = '';
        $scope.reverse = false;
        $scope.pagobj = {'pagactual':0,
            'totpag':1,
            'totitems':0,
            'rto':0,
            'pagmodel':1,
            'nnfilas': $scope.filas,
            'inputpag':1};

        $scope.totales = {};

        if ($scope.colinfo['coldet']==='T'){
            $scope.coldet = true;
        }

        try{
            $scope.fnbtnsel = eval($scope.colinfo['fnbtnsel']);
        }
        catch(e){
            $scope.fnbtnsel = $scope.auxfnfila;
        }

        try{
            $scope.fnbtnedit = eval($scope.colinfo['fnbtnedit']);
        }
        catch(e){
            $scope.fnbtnedit = $scope.auxfnfila;
        }

        try{
            $scope.fnbtndel = eval($scope.colinfo['fnbtndel']);
        }
        catch(e){
            $scope.fnbtndel = $scope.auxfnfila;
        }

        try{
            $scope.fnbtnadc = eval($scope.colinfo['fnbtnadc']);
        }
        catch(e){
            $scope.fnbtnadc = $scope.auxfnfila;
        }

        try{
            $scope.fnrow = eval($scope.colinfo['fnrow']);
            if ( 'fnrow' in $scope.colinfo){
                $scope.fillink = "cursor: pointer; cursor: hand;";
            }
            else{
                $scope.fillink = "";
            }
        }
        catch(e){
            $scope.fnrow = $scope.auxfnfila;
        }

        $scope.onfilter = function(){
            var queryData = $filter('filter')($scope.datos, $scope.search);
            $scope.currentdat = queryData;
            $scope.calcularNumPag();
        };

        $scope.limpiarFiltro = function(){
            $scope.search = {};
            $scope.onfilter();
        };

        $scope.auxfnfila = function(fila){
            alert('Aux fila');
        };

        $scope.$watchCollection("datos",
            function( newValue, oldValue ) {
                $scope.search = {};
                $scope.currentdat = newValue;
                $scope.calcularNumPag();
            }
        );

        $scope.filasops = [ {'id':5, 'label':5},
            {'id':10, 'label':10},
            {'id':25, 'label':25},
            {'id':50, 'label':50},
            {'id':100, 'label':100}];

        $scope.crto = function(){
            var rto = ($scope.pagobj.pagactual+1)*$scope.pagobj.nnfilas;
            $scope.pagobj.rto =  Math.min( $scope.pagobj.totitems,  rto);
            $scope.pagobj.inputpag = ( $scope.pagobj.pagactual+1 );
        };

        $scope.calcularNumPag= function(){
            var datos = $scope.currentdat;
            var totpag = 1;

            if ($scope.paginado=='F'){
                if (datos){
                    $scope.pagobj.nnfilas = datos.length;
                }
            }

            if ( datos ){
                totpag = Math.ceil( datos.length/ $scope.pagobj.nnfilas );
            }

            if ($scope.paginado=='T'){
                $scope.pagobj.totpag = totpag;
            }
            else{
                $scope.pagobj.totpag = 1;
            }

            $scope.pagobj.pagactual = 0;
            $scope.pagobj.totitems = datos.length;

            $scope.crto();
        };

        $scope.setColOrder= function(col){
            $scope.colorder = col;
            $scope.reverse = !$scope.reverse;
        };

        $scope.pfirst = function(){
            $scope.pagobj.pagactual = 0;
            $scope.crto();
        };

        $scope.plast = function(){
            $scope.pagobj.pagactual = $scope.pagobj.totpag-1;
            $scope.crto();
        };

        $scope.pnext = function(){
            if ( $scope.pagobj.pagactual < $scope.pagobj.totpag-1 ) {
                $scope.pagobj.pagactual = $scope.pagobj.pagactual + 1;
                $scope.crto();
                $('html, body').animate({
                    scrollTop: $element.offset().top
                }, 250);
            }
        };

        $scope.pback = function(){
            if ( $scope.pagobj.pagactual > 0 ){
                $scope.pagobj.pagactual = $scope.pagobj.pagactual-1;
                $scope.crto();
                $('html, body').animate({
                    scrollTop: $element.offset().top
                }, 250);
            }
        };

        $scope.setNumPag = function(){
            try{
                if ( $scope.pagobj.inputpag>0 && $scope.pagobj.inputpag<=$scope.pagobj.totpag ){
                    $scope.pagobj.pagactual = ($scope.pagobj.inputpag-1);
                }
                else{
                    alert("Valor incorrecto");
                }
            }
            catch(e){
                console.log("Error al setear pagina");
                console.log(e);
            }
        };

        $scope.evalExpress= function(fil, express){
            var fil = fil;
            var res = '';
            try{
                res = eval(express);
            }
            catch(e){
                res = express;
            }
            return res;
        };

        $scope.get_col_align = function(col_value){
            var return_val = "text-left";
            if ($.isNumeric(col_value) ){
                return_val = "text-right";
            }
            return return_val;
        }
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("ngSegrid", ngSegrid);

    function ngSegrid(){
        return {
            restrict: 'A',
            scope:{
                cols:'=',
                datos:'=',
                titulo:'@',
                filas:'=',
                colinfo:'='
            },
            controller: "NgSegridCntrl",
            templateUrl: "static/components/ui/ngSegrid/ngSegridtemplate.html?v=" + globalgsvapp,
            link: function(scope, element, attrs){

            }
        }
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .filter('paginarFiltro', paginarFiltro);
    function paginarFiltro(){
        return function(items, pag, nfilas){
            if (!items){
                return items;
            }
            //pag debe iniciar en cero
            return items.slice(parseInt(pag * nfilas), parseInt((pag + 1) * nfilas + 1) - 1);
        }
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .filter("totArrayFilter", totArrayFilter);

    function totArrayFilter(){
        return function(data, key) {
            try{
                if (typeof(data) === 'undefined' || typeof(key) === 'undefined') {
                    return 0;
                }

                var sum = 0;
                for (var i = data.length - 1; i >= 0; i--) {
                    sum += parseFloat(data[i][key]);
                }

                return sum;
            }
            catch(e){
                return 0;
            }
        }
    }

})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular.module("isyplus")
        .directive("ngTable", ngTable);

    function ngTable($filter, $anchorScroll, $location){
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: "static/components/ui/ngTable/ngTable.html?v="+ globalgsvapp,
            scope: {
                ocultacab:'@', // no mostrar cabecera de tabla
                titulo: '@', // titulo de la tabla
                id:'@', // id de la tabla
                clspnl: '@', // clase para el panel Ej: primary, warning, default
                busq:'@',  // si se muestra o no dialogo de busq
                pag:'@', // si se muestra texto de pagina nro de nrototal Ej: Pagina 1 de 10
                ordenar: '@', // si se permite ordenar por columnas o no
                filterby:'@', // para asignar la columna por la cual se filtrara en el campo de busqueda
                onclickcolheader: '=',
                txthead:'=', // texto que irá en la cabecera
                scroll: '=', // si la tabla se expande y se muestra el scroll
                numdatos: '=', // numero de datos en caso de que no correspondan al numero de filas
                lstdatos: '=', // lista de datos a poner en la tabla
                lstcols: '=', // columnas para los datos de la tabla
                rowopc: '=', // opciones aplicables a una fila de la tabla
                colopc: '=', // opciones aplicables a las columnas de una tabla
                checks: '=', // opciones para los checkbox en la tabla
                lstopcchecks: '=', //lista de opciones de check
                botones: '=', // botones a incluir en la tabla
                filtros: '=', // para busqueda con dropdown de filtros
                selectgen: '=', //para seelct en la cabecera
                totales:'=', // en caso de necesitar incluir totales, se envian en un array
                funcchg:'=', // funcion que se ejecutará al escribir en el campo de busqueda
                modelfilt: '=', // variable donde se guardara el texto al escribir en el campo de busqueda
                paginacion: '=', // asigna la paginacion en multiplos de 10
                funcpag:'=', // funcion al hacer click en un boton de siguiente o anterior
                striped:'=', // si la tabla tendrá la clase table-striped
                drpdwnhead: '=', // dropdown en la cabecera de una columna de la tabla
                funccombo: '=', // funcion que se activara al hacer click en un item de un combobox embebido en una celda
                footopc: '=',
                botongeneral:'=',//boton general a lado de busqueda
                funcbtncol: '=', // funcion para la columna que tenga un boton
                objetodevolver: '=' // devolver valores de la directiva
            },
            link: function(scope, elem, attrs){
                scope.busqueda = {};
                scope.form = {};
                scope.form.titulo = 'Resultados';
                scope.form.id = ''; //por defecto vacio en caso de que no se especifique id
                scope.form.clspnl = 'panel-primary';
                scope.form.numdatos = 0;
                scope.form.currentPage = 0;
                scope.form.nroPags = 1;
                scope.form.pageSize = 30;
                scope.form.optpags = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
                scope.form.rowopc = {};
                scope.form.colopc = {};
                scope.form.txthead = {};
                scope.form.checks = null;
                scope.form.lstopcchecks = null;
                scope.form.filtros = null;
                scope.form.selectgen = null;
                scope.form.botongeneral = null;
                scope.form.botones = null;
                scope.form.totales = [];
                scope.form.busq = true;
                scope.form.pag = true;
                scope.form.selec = 0; // para indicar el item seleccionado en el dropdown
                scope.form.scroll = null;
                scope.form.reverse = false;
                scope.form.predicate = '';
                scope.form.ordenar = true;
                scope.form.cont = 0;
                scope.form.filterby = '$'; // para que se filtre por todas las columnas
                scope.fecha = moment().format('DD/MM/YYYY');


                if (scope.titulo) { // cambiar el texto de Resultados
                    scope.form.titulo = scope.titulo;
                }
                if (scope.id) { // cambiar el id de la tabla
                    scope.form.id = scope.id;
                }
                if (scope.clspnl) {
                    scope.form.clspnl = scope.clspnl;
                }
                if (scope.rowopc) { // opciones de fila
                    scope.form.rowopc = scope.rowopc;
                }
                if (scope.colopc) { // opciones de columna
                    scope.form.colopc = scope.colopc;
                }
                if (scope.checks) { //opciones de checkbox
                    scope.form.checks = scope.checks;
                }
                if (scope.lstopcchecks) { //opciones de checkbox
                    scope.form.lstopcchecks = scope.lstopcchecks;
                }
                if (scope.botones) { //opciones de botones
                    scope.form.botones = scope.botones;
                }
                if (scope.botongeneral) { //botongeneral
                    scope.form.botongeneral = scope.botongeneral;
                }
                if (scope.filtros) { //dropdowns de filtros
                    console.log("llega filtros")
                    console.log(scope.filtros)
                    scope.form.filtros = scope.filtros;
                }
                if (scope.selectgen) {
                    console.log("llega selectgen")
                    console.log(scope.selectgen)
                    scope.form.selectgen = scope.selectgen;
                }
                if (scope.busq) { //para mostrar o no el dialogo de busqueda
                    scope.form.busq = scope.busq;
                }
                if (scope.pag) { //para mostrar o no el texto de pagina desde - hasta
                    scope.form.pag = scope.pag;
                }
                if (scope.scroll) { // para mostrar o no el scroll
                    scope.form.scroll = scope.scroll;
                }
                if (scope.ordenar) { //para hacer q las columnas se ordenen o no
                    scope.form.ordenar = scope.ordenar;
                }
                if (scope.paginacion) { // asigna paginacion
                    if (scope.paginacion % 10 === 0) {
                        scope.form.pageSize = scope.paginacion;
                    }
                }
                if (scope.filterby) { // para especificar columna a filtrar en la tabla
                    scope.form.filterby = scope.filterby;
                }
                if (scope.txthead) { // texto en la cabecera de la tablas
                    scope.form.txthead = scope.txthead;
                }



                scope.$watchCollection(
                    "lstcols",
                    function( newLst, oldLst ) {
                        if (scope.lstcols && newLst) {
                            scope.form.lstcols = newLst;
                        }
                    }
                );

                scope.$watchCollection(
                    "lstdatos",
                    function( newLst, oldLst) {
                        if (scope.lstdatos && newLst) {
                            scope.form.lstdatos = newLst;
                            scope.form.currentPage = 0;
                            scope.numberOfPages();
                            if (!scope.numdatos) {
                                scope.form.numdatos = scope.form.lstdatos.length;
                            }
                        }
                    }
                );

                scope.$watchCollection(
                    "totales",
                    function( newLst, oldLst ) {
                        if (scope.totales && newLst) {
                            scope.form.totales = newLst;
                        }
                    }
                );

                scope.$watch(
                    "numdatos",
                    function(newVal, oldVal){
                        if (scope.numdatos) {
                            scope.form.numdatos = newVal;
                        }
                    }
                );
                scope.$watch(
                    "titulo",
                    function(newVal, oldVal){
                        if (scope.titulo) {
                            scope.form.titulo = newVal;
                        }
                    }
                );
                scope.$watch(
                    "objetodevolver",
                    function(newVal, oldVal){
                        if (scope.objetodevolver) {
                            scope.form.objetodevolver = newVal;
                        }
                    }
                );

                scope.$watchCollection(
                    "selectgen.lstselect",
                    function( newLst, oldLst ) {
                        if(scope.form.selectgen){
                            scope.form.selectgen.lstselect = newLst;
                        }

                    }
                );
                scope.$watch( // para q se actualize el modelfilt si se cambia desde el controlador
                    "modelfilt",
                    function(newVal, oldVal){
                        if (newVal != undefined) {
                            scope.busqueda[scope.form.filterby] = newVal;
                        }
                    }
                );
                scope.$watch("checks.chkAll",
                    function(newVal, oldVal){
                        if (scope.form.checks) {
                            scope.form.checks.chkAll = newVal ;
                        }
                    }
                );

                scope.numberOfPages = function() {
                    scope.form.nroPags = Math.ceil(scope.form.lstdatos.length / scope.form.pageSize);
                };

                scope.setCurrentPage = function(nro) {
                    scope.form.currentPage = nro;
                };

                scope.setSelec = function(i){
                    scope.form.selec = i;
                    if(scope.form.selectgen){
                        scope.form.selectgen.model='';
                    }
                };

                scope.onChgBusqueda = function(txt){ // para enviar lo escrito en el campo de busqueda
                    if (scope.modelfilt !== undefined) {
                        scope.modelfilt = txt; //se envia el texto de busqueda
                    }
                    if (scope.funcchg) {
                        scope.funcchg();
                    }
                };

                scope.setOrder = function(val){
                    scope.form.reverse = !scope.form.reverse;
                    scope.form.predicate = val;
                    if(scope.objetodevolver){
                        scope.objetodevolver.reverse = scope.form.reverse;
                        scope.objetodevolver.predicate = scope.form.predicate;
                        console.log(scope.objetodevolver)
                    }

                    if (scope.form.ordenar === true) {
                        scope.form.lstdatos = $filter('orderBy')(scope.form.lstdatos, scope.form.predicate, scope.form.reverse);
                    }
                };
                scope.fnTrackBy = function(item, index){ // para poder enviar el index en los botones
                    item.$index_row = index;
                    return item.$index_row;
                };
                scope.filtrar = function(filtro, valor){ // para asignar filtro a lo asignado en la celda
                    var fil = filtro.split(':');
                    if (filtro==='$') {
                        return filtro + valor;
                    } else if (filtro==='%') {
                        return valor + filtro;
                    } else if (fil.length === 1){
                        return $filter(fil[0])(valor);
                    } else if (fil.length === 2) {
                        return $filter(fil[0])(valor, fil[1]);
                    } else if (fil.length === 3) {
                        return $filter(fil[0])(valor, fil[1], fil[2]);
                    }
                };
                scope.setIdCol = function(indexrow, indexcol){
                    return scope.form.id+'c'+indexrow+''+indexcol;
                };
                scope.onKeyUpColEdit = function(idxrow, idxcol, type, value){
                    //var idcol = 'c'+idxrow+''+idxcol;
                    //var elem = document.getElementById(idcol);
                    //if (value && type === 'number' && !NumberServ.isNumber(value)) {
                    //    //elem.style.border = "2px dashed red";
                    //} else {
                    //    //elem.style.border = "transparent";
                    //}
                };
                scope.onKeyDownColEdit = function(event, idxrow, idxcol, value){

                    var self = document.getElementById(scope.form.id+'c'+idxrow+''+idxcol);
                    var pos = self.selectionStart;

                    if (event.keyCode === 13) { // tecla enter
                        if (scope.form.colopc.funckeyenter) {
                            scope.form.colopc.funckeyenter();
                            document.activeElement.blur();// se remueve el foco
                        }
                    }  else if (event.keyCode === 37){ // flecha izquierda
                        if (idxcol > 0) {
                            if (pos === 0) {
                                var idcolnew = scope.form.id+'c'+idxrow+''+(idxcol-1);
                                var elem = document.getElementById(idcolnew);
                                if (elem) {
                                    event.preventDefault();
                                    elem.focus();
                                }
                            }

                        }
                    } else if (event.keyCode === 38) { // flecha arriba
                        event.preventDefault();
                        if (idxrow > 0) {
                            var idrownew = scope.form.id+'c'+(idxrow-1)+''+idxcol;
                            var elem = document.getElementById(idrownew);
                            if (elem) {
                                elem.focus();
                            }
                        }
                    } else if (event.keyCode === 39) { // flecha derecha
                        if (idxcol < scope.form.lstcols.length) {
                            if (pos === value.toString().length) {
                                var idcolnew = scope.form.id+'c'+idxrow+''+(idxcol+1);
                                var elem = document.getElementById(idcolnew);
                                if (elem) {
                                    event.preventDefault();
                                    elem.focus();
                                }
                            }

                        }
                    } else if (event.keyCode === 40 ) { //flecha abajo
                        event.preventDefault();
                        if (idxrow < scope.form.pageSize) {
                            var idrownew = scope.form.id+'c'+(idxrow+1)+''+idxcol;
                            var elem = document.getElementById(idrownew);
                            if (elem) {
                                elem.focus();
                            }
                        }
                    }
                };
                scope.gotoUp = function(){
                    $('html, body').animate({
                        scrollTop: elem.offset().top
                    }, 250);
                };

                scope.setOtrStyle = function(c){ // estilos con condicion que no van ni en style ni en ng-style
                    var style = '';
                    style += c.width && !scope.form.scroll?'width: '+c.width: '';
                    style += scope.form.scroll?'white-space: nowrap':'';
                    return style;
                };
                scope.onchecklista = function(lt,o){
                    for (var n=0;n<lt.length;n++ ) {
                        if(o.valor!=lt[n].valor){
                            lt[n].sel=false;
                        }
                    }
                    o.sel= !o.sel
                }
                scope.asiganachecksprop = function(col) {
                    console.log("entra asiganachecksprop")
                    var i=0;
                    col.check.selectall = !col.check.selectall || false;
                    if(col.check.selectall){
                        for (i; i<scope.form.lstdatos.length;i++){
                            scope.form.lstdatos[i][col.prop]= col.check.valuecheck;
                        }
                    }else{
                        for (i; i<scope.form.lstdatos.length;i++){
                            scope.form.lstdatos[i][col.prop]= col.check.valuenocheck;
                        }
                    }

                }
                scope.clickcolheader = function(campo){
                    if(scope.onclickcolheader){
                        scope.onclickcolheader(campo);
                    }else{
                        console.log("no se ha declarado la funcion onclickcolheader")
                    }
                }
                scope.cambiaCheck = function(i,c){
                    c.check.selectall = false;
                    if(i[c.prop] === c.check.valuecheck){
                        i[c.prop] = c.check.valuenocheck;
                        console.log("Info en check:prop valuechech valuenochek-->");
                        console.log(c.prop);
                        console.log(c.check.valuecheck);
                        console.log(c.check.valuenocheck);
                    }else{
                        i[c.prop] = c.check.valuecheck;
                    }
                }
            }
        }
    }
})();
/**
 * Created by root on 11/04/16.
 */
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular.module("isyplus")
        .directive("ngTablescrollv", ngTablescrollv);
    function ngTablescrollv($filter, $anchorScroll, $location){
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: "static/components/ui/ngTablescrollv/ngTablescrollv.html?v="+ globalgsvapp,
            scope: {
                ocultacab:'@', // no mostrar cabecera de tabla
                titulo: '@', // titulo de la tabla
                id:'@', // id de la tabla
                clspnl: '@', // clase para el panel Ej: primary, warning, default
                busq:'@',  // si se muestra o no dialogo de busq
                ordenar: '@', // si se permite ordenar por columnas o no
                filterby:'@', // para asignar la columna por la cual se filtrara en el campo de busqueda
                onclickcolheader: '=',
                txthead:'=', // texto que irá en la cabecera
                numdatos: '=', // numero de datos en caso de que no correspondan al numero de filas
                lstdatos: '=', // lista de datos a poner en la tabla
                lstcols: '=', // columnas para los datos de la tabla
                rowopc: '=', // opciones aplicables a una fila de la tabla
                colopc: '=', // opciones aplicables a las columnas de una tabla
                checks: '=', // opciones para los checkbox en la tabla
                lstopcchecks: '=', //lista de opciones de check
                botones: '=', // botones a incluir en la tabla
                filtros: '=', // para busqueda con dropdown de filtros
                selectgen: '=', //para seelct en la cabecera
                totales:'=', // en caso de necesitar incluir totales, se envian en un array
                funcchg:'=', // funcion que se ejecutará al escribir en el campo de busqueda
                modelfilt: '=', // variable donde se guardara el texto al escribir en el campo de busqueda
                striped:'=', // si la tabla tendrá la clase table-striped
                drpdwnhead: '=', // dropdown en la cabecera de una columna de la tabla
                funccombo: '=', // funcion que se activara al hacer click en un item de un combobox embebido en una celda
                footopc: '=',
                botongeneral:'=',//boton general a lado de busqueda
                btndropdown:'=',
                funcbtncol: '=', // funcion para la columna que tenga un boton
                objetodevolver: '=', // devolver valores de la directiva
                maxheight:'='
            },
            link: function(scope, elem, attrs){
                scope.busqueda = {};
                scope.form = {};
                scope.form.titulo = 'Resultados';
                scope.form.id = ''; //por defecto vacio en caso de que no se especifique id
                scope.form.clspnl = 'panel-primary';
                scope.form.numdatos = 0;
                scope.form.rowopc = {};
                scope.form.colopc = {};
                scope.form.txthead = {};
                scope.form.checks = null;
                scope.form.lstopcchecks = null;
                scope.form.filtros = null;
                scope.form.selectgen = null;
                scope.form.botongeneral = null;
                scope.form.btndropdown = null;
                scope.form.botones = null;
                scope.form.totales = [];
                scope.form.busq = true;
                scope.form.selec = 0; // para indicar el item seleccionado en el dropdown
                scope.form.reverse = false;
                scope.form.predicate = '';
                scope.form.ordenar = true;
                scope.form.cont = 0;
                scope.form.filterby = '$'; // para que se filtre por todas las columnas
                scope.form.maxheight ='300'
                scope.fecha = moment().format('DD/MM/YYYY');


                if (scope.titulo) { // cambiar el texto de Resultados
                    scope.form.titulo = scope.titulo;
                }
                if (scope.id) { // cambiar el id de la tabla
                    scope.form.id = scope.id;
                }
                if (scope.clspnl) {
                    scope.form.clspnl = scope.clspnl;
                }
                if (scope.rowopc) { // opciones de fila
                    scope.form.rowopc = scope.rowopc;
                }
                if (scope.colopc) { // opciones de columna
                    scope.form.colopc = scope.colopc;
                }
                if (scope.checks) { //opciones de checkbox
                    scope.form.checks = scope.checks;
                }
                if (scope.lstopcchecks) { //opciones de checkbox
                    scope.form.lstopcchecks = scope.lstopcchecks;
                }
                if (scope.botones) { //opciones de botones
                    scope.form.botones = scope.botones;
                }
                if (scope.botongeneral) { //botongeneral
                    scope.form.botongeneral = scope.botongeneral;
                }
                console.log("scope.btndropdown")
                console.log(scope.btndropdown)
                if (scope.btndropdown) { //btndropdown

                    scope.form.btndropdown = scope.btndropdown;
                }
                if (scope.filtros) { //dropdowns de filtros
                    console.log("llega filtros")
                    console.log(scope.filtros)
                    scope.form.filtros = scope.filtros;
                }
                if (scope.selectgen) {
                    console.log("llega selectgen")
                    console.log(scope.selectgen)
                    scope.form.selectgen = scope.selectgen;
                }
                if (scope.busq) { //para mostrar o no el dialogo de busqueda
                    scope.form.busq = scope.busq;
                }
                if (scope.ordenar) { //para hacer q las columnas se ordenen o no
                    scope.form.ordenar = scope.ordenar;
                }

                if (scope.filterby) { // para especificar columna a filtrar en la tabla
                    scope.form.filterby = scope.filterby;
                }
                if (scope.txthead) { // texto en la cabecera de la tablas
                    scope.form.txthead = scope.txthead;
                }
                if (scope.maxheight){
                    scope.form.maxheight = scope.maxheight;
                }




                scope.$watchCollection(
                    "lstcols",
                    function( newLst, oldLst ) {
                        if (scope.lstcols && newLst) {
                            scope.form.lstcols = newLst;
                        }
                    }
                );

                scope.$watchCollection(
                    "lstdatos",
                    function( newLst, oldLst) {
                        if (scope.lstdatos && newLst) {
                            scope.form.lstdatos = newLst;
                            if (!scope.numdatos) {
                                scope.form.numdatos = scope.form.lstdatos.length;
                            }
                            var obj =document.getElementById('clscroll-column-headers-tra').style
                            console.log("cambia padding")
                            obj.paddingRight= '0px';
                        }
                    }
                );

                scope.$watchCollection(
                    "totales",
                    function( newLst, oldLst ) {
                        if (scope.totales && newLst) {
                            scope.form.totales = newLst;
                        }
                    }
                );

                scope.$watch(
                    "numdatos",
                    function(newVal, oldVal){
                        if (scope.numdatos) {
                            scope.form.numdatos = newVal;
                        }
                    }
                );
                scope.$watch(
                    "titulo",
                    function(newVal, oldVal){
                        if (scope.titulo) {
                            scope.form.titulo = newVal;
                        }
                    }
                );
                scope.$watch(
                    "objetodevolver",
                    function(newVal, oldVal){
                        if (scope.objetodevolver) {
                            scope.form.objetodevolver = newVal;
                        }
                    }
                );

                scope.$watchCollection(
                    "selectgen.lstselect",
                    function( newLst, oldLst ) {
                        if(scope.form.selectgen){
                            scope.form.selectgen.lstselect = newLst;
                        }

                    }
                );
                scope.$watch( // para q se actualize el modelfilt si se cambia desde el controlador
                    "modelfilt",
                    function(newVal, oldVal){
                        if (newVal != undefined) {
                            scope.busqueda[scope.form.filterby] = newVal;
                        }
                    }
                );
                scope.$watch("checks.chkAll",
                    function(newVal, oldVal){
                        if (scope.form.checks) {
                            scope.form.checks.chkAll = newVal ;
                        }
                    }
                );




                scope.setSelec = function(i){
                    scope.form.selec = i;
                    if(scope.form.selectgen){
                        scope.form.selectgen.model='';
                    }
                };

                scope.onChgBusqueda = function(txt){ // para enviar lo escrito en el campo de busqueda
                    if (scope.modelfilt !== undefined) {
                        scope.modelfilt = txt; //se envia el texto de busqueda
                    }
                    if (scope.funcchg) {
                        scope.funcchg();
                    }
                };

                scope.setOrder = function(val){
                    scope.form.reverse = !scope.form.reverse;
                    scope.form.predicate = val;
                    if(scope.objetodevolver){
                        scope.objetodevolver.reverse = scope.form.reverse;
                        scope.objetodevolver.predicate = scope.form.predicate;
                        console.log(scope.objetodevolver)
                    }

                    if (scope.form.ordenar === true) {
                        scope.form.lstdatos = $filter('orderBy')(scope.form.lstdatos, scope.form.predicate, scope.form.reverse);
                    }
                };
                scope.fnTrackBy = function(item, index){ // para poder enviar el index en los botones
                    item.$index_row = index;
                    return item.$index_row;
                };
                scope.filtrar = function(filtro, valor){ // para asignar filtro a lo asignado en la celda
                    var fil = filtro.split(':');
                    if (filtro==='$') {
                        return filtro + valor;
                    } else if (filtro==='%') {
                        return valor + filtro;
                    } else if (fil.length === 1){
                        return $filter(fil[0])(valor);
                    } else if (fil.length === 2) {
                        return $filter(fil[0])(valor, fil[1]);
                    } else if (fil.length === 3) {
                        return $filter(fil[0])(valor, fil[1], fil[2]);
                    }
                };
                scope.setIdCol = function(indexrow, indexcol){
                    return scope.form.id+'c'+indexrow+''+indexcol;
                };
                scope.onKeyUpColEdit = function(idxrow, idxcol, type, value){
                    //var idcol = 'c'+idxrow+''+idxcol;
                    //var elem = document.getElementById(idcol);
                    //if (value && type === 'number' && !NumberServ.isNumber(value)) {
                    //    //elem.style.border = "2px dashed red";
                    //} else {
                    //    //elem.style.border = "transparent";
                    //}
                };

                scope.gotoUp = function(){
                    $('html, body').animate({
                        scrollTop: elem.offset().top
                    }, 250);
                };


                scope.onchecklista = function(lt,o){
                    for (var n=0;n<lt.length;n++ ) {
                        if(o.valor!=lt[n].valor){
                            lt[n].sel=false;
                        }
                    }
                    o.sel= !o.sel
                }
                scope.asiganachecksprop = function(col) {
                    console.log("entra asiganachecksprop")
                    var i=0;
                    col.check.selectall = !col.check.selectall || false;
                    if(col.check.selectall){
                        for (i; i<scope.form.lstdatos.length;i++){
                            scope.form.lstdatos[i][col.prop]= col.check.valuecheck;
                        }
                    }else{
                        for (i; i<scope.form.lstdatos.length;i++){
                            scope.form.lstdatos[i][col.prop]= col.check.valuenocheck;
                        }
                    }

                }
                scope.clickcolheader = function(campo){
                    if(scope.onclickcolheader){
                        scope.onclickcolheader(campo);
                    }else{
                        console.log("no se ha declarado la funcion onclickcolheader")
                    }
                }
                scope.cambiaCheck = function(i,c){
                    c.check.selectall = false;
                    if(i[c.prop] === c.check.valuecheck){
                        i[c.prop] = c.check.valuenocheck;
                    }else{
                        i[c.prop] = c.check.valuecheck;
                    }
                }

                 $("#clscroll-content-tra").scroll(function() {
                    var obj =document.getElementById('clscroll-column-headers-tra').style
                    obj.paddingRight= '15px';
                });
            }
        }
    }
})();
/**
 * Created by serviestudios on 26/02/16.
 */
(function (module) {
    'use strict';
    module.directive("serviRender", rerender);
    function rerender(){
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'static/components/ui/rerender/rerender.html?v='+ globalgsvapp,
            scope:true,
            bindToController: {
                tituloss:'=',
                print :'=',
                probj :'='
            },
            link: link,
            controller: controller,
            controllerAs: "cntrl"
        }

        function link(scope, elment, attrs){

                console.log("entra a link valor para attrs es:");
                console.log(attrs);

            }

        function controller($scope){
                var self = this;
                init();

                self.onAttribChange = onAttribChange;

                function init(){
                    console.log("init controller-->", self.tituloss);
                    //self.tituloss = {text:'asdfasdfasdfasd'};
                }

                function onAttribChange(){
                    console.log("on attrib change-->");
                }

                $scope.$watch("cntrl.tituloss", function(newValue, oldValue){
                    console.log("watch cntrl.titulo");
                    console.log("newValue,",newValue, oldValue);
                });

            $scope.$watch("cntrl.print", function(newValue, oldValue){
                    console.log("watch cntrl.print");
                    console.log("newValue,",newValue, oldValue);
                });

            $scope.$watch("cntrl.probj.text", function(newValue, oldValue){
                    console.log("watch cntrl.probj.text");
                    console.log("newValue,",newValue, oldValue);
                });
            }
    }

})(IsyplusApp);
/**
 * Created by serviestudios on 01/02/16.
 */

(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("serviFecha", serviFecha);

    function serviFecha(){
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'static/components/ui/serviFecha/serviFecha.html?v='+ globalgsvapp,
            link: link,
            scope: true,
            bindToController: {
                model: '=',
                disabled: '=',
                required: '=',
                pattern: '=',
                classinput:'@',
                classinputgroup: '@',
                elementid: '@'
            },
            controller: controller,
            controllerAs: "cntrl"
        }


        function link(scope, element, attrs){
            /*
            element.datetimepicker({
                format: 'DD/MM/YYYY',
                defaultDate: moment(),
                showTodayButton: true,
                locale:'es'
            });
            */
        }

        function controller($element, $timeout, $scope, $attrs, FechasServ){
            var self = this;

            self.onEnter = onEnter;
            setupDatepickerChange();

            function setupDatepickerChange(){
                //Cuando se crea el componente
                var defaultDate = moment();
                $element.datetimepicker({
                    format: 'DD/MM/YYYY',
                    defaultDate: defaultDate,
                    showTodayButton: true,
                    locale:'es'
                });

                $element.on("dp.change", function (e) {
                    $timeout(function(){
                        try{
                            var fecha = e.date.format('DD/MM/YYYY');
                            self.model = fecha;
                            onEnter();
                        }
                        catch(ex){
                            self.model = '';
                        }
                    });
                });
            }

            function onEnter() {
                $timeout(function(){
                    try{
                        $scope.$eval($attrs.onenter);
                    }
                    catch (ex){
                        console.error("Error en val $attrs.onenter");
                        console.error(ex);
                    }
                });
            }
        }
    }
})();
/**
 * Created by serviestudios on 02/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("serviFocusSelect", serviFocusSelect);

    /**
     * Selecciona todo el texto de un campo cuando este obtiene el foco
     * @returns {{restrict: string, link: Function}}
     */
    function serviFocusSelect(){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                 element.focus(function() {
                     try{
                         $(this).select();
                     }
                     catch(ex){
                         console.log("Error en focus event select", ex);
                     }
                 } );
            }
        }
    }

})();
/**
 * Created by serviestudios on 24/02/16.
 */
(function (module) {
    'use strict';
    module.directive("serviMes", serviMes);

    /**
     * Un Dropdown menu para seleccion de mes
     * @returns {{restrict: string, replace: boolean, templateUrl: string, scope: boolean, bindToController: {form: string, formProp: string, elementid: string}, controller: controller, controllerAs: string}}
     */

    function serviMes(){
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'static/components/ui/serviMes/serviMes.html?v='+ globalgsvapp,
            scope: true,
            bindToController: {
                form: '=?',//El formulario donde se pasa el codigo del mes (1:Enero, 2:Febrero, 3:Marzo....)
                onchange: '&?',
                disabled: '=?',//Indica si el componente esta desactivado
                formProp: '@?',//Nombre de la propiead del formulario por defecto mes (form.mes)
                elementid: '@?'//id del
            },
            controller: controller,
            controllerAs: "cntrl"
        }
    }

    function controller(FechasServ, $scope){
        var self = this;
        self.labelMes = '';
        self.setMes = setMes;

        init();

        $scope.$watch("self.form", function(newValue, oldValue){
            console.log("Watch self.form serviMes:", self.form);
            if (self.form){
                init();
            }
        });

        function setMes(mes){
            self.form[self.formProp] = mes;
            setLabelMes();
            try{
                self.onchange();
            }
            catch(ex){
                console.error("Error->");
            }
        }

        function getSelectedMes(){
            return self.form[self.formProp];
        }

        function setLabelMes(){
            var mes = getSelectedMes()||1;
            self.labelMes = FechasServ.getMesLargo(mes-1);
        }

        function init(){
            console.log("init servi-mes-->");
            if (self.form){
                if (!self.formProp){
                    self.formProp= 'mes';
                }
                setLabelMes();
            }
        }
    }
})(IsyplusApp);
/**
 * Created by serviestudios on 15/01/16.
 */
(function(){
    'use strict';
    angular
        .module("isyplus")
        .directive("serviPageHeader", serviPageHeader);

    function serviPageHeader(){

        var directive = {
            restrict: 'EA',
            transclude: true,
            replace: true,
            templateUrl: 'static/components/ui/serviPageHeader/serviPageHeader.html?v='+ globalgsvapp
        }

        return directive;
    }

})();
/**
 * Created by serviestudios on 20/01/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("serviPane", serviPane);

    function serviPane(){
        var directive = {
            restrict: 'EA',
            replace: true,
            templateUrl: 'static/components/ui/serviPanel/serviPanel.html?v='+ globalgsvapp,
            transclude:{
                "titleSlot":"?paneTitle",//La vista que use esta directiva debe crear <pane-title> </pane-title> para el titulo
                "bodySlot":"?paneBody"//La vista que use esta directiva debe crear <pane-body> </pane-body> que ira al body del panel
            },
            scope:true,
            bindToController: {
                type: "@",
                showHeader: "@",
                showBody: "@"
            },
            controller: function(){
                //Si no ha sido especificaco showHeader, showBody, se define por defecto que si se muestren
                if (angular.isUndefined(this.showHeader)){
                    this.showHeader="true";
                }
                if (angular.isUndefined(this.showBody)){
                    this.showBody="true";
                }
            },
            controllerAs: "cntrl"
        }
        return directive;
    }
})();
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("tooltip", tooltip);

    function tooltip(){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                var opciones = scope.$eval(attrs.tooltip);
                var defaultops = {placement:'top',title:'definir'};
                for (var op in opciones){
                    defaultops[op]= opciones[op];
                }
                $(element).tooltip(defaultops);
                $(element).hover(function(){
                    $(element).tooltip('show');
                }, function(){
                    $(element).tooltip('hide');
                });
                $(element).click(function(){
                    $(element).tooltip('hide');
                });
            }
        }
    }
})();