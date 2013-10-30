angular.module("umbraco").controller("Umbraco.PropertyEditors.DatepickerController",
    function ($scope, notificationsService, assetsService) {

        //setup the default config
        var config = {
            pickDate: true,
            pickTime: true,
            format: "yyyy-MM-dd HH:mm:ss"
        };
        //map the user config
        angular.extend(config, $scope.model.config);
        //map back to the model
        $scope.model.config = config;

        function applyDate(e){
                // when a date is changed, update the model
                if (e.localDate) {
                    if ($scope.model.config.format == "yyyy-MM-dd HH:mm:ss") {
                        $scope.$apply(function(){
                            $scope.model.value = e.localDate.toIsoDateTimeString();
                        });
                    }else{
                        $scope.model.value = e.localDate.toIsoDateString();
                    }
                }
        }

        assetsService.loadJs(
                'views/propertyeditors/datepicker/bootstrap-datetimepicker.min.js'
            ).then(
            function () {
                //The Datepicker js and css files are available and all components are ready to use.

                // Get the id of the datepicker button that was clicked
                var pickerId = $scope.model.alias;
                // Open the datepicker and add a changeDate eventlistener
                $("#" + pickerId)
                    .datetimepicker($scope.model.config)
                    .on("changeDate", applyDate)
                    .on("hide", applyDate);

            });


        assetsService.loadCss(
                'views/propertyeditors/datepicker/bootstrap-datetimepicker.min.css'
            );
    });
