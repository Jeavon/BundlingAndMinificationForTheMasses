//used for the media picker dialog
angular.module("umbraco").controller("Umbraco.Dialogs.ContentPickerController",
	function ($scope, eventsService, entityResource, searchService, $log) {	
	var dialogOptions = $scope.$parent.dialogOptions;
	$scope.dialogTreeEventHandler = $({});
	$scope.results = [];

	$scope.selectResult = function(result){
		entityResource.getById(result.id, "Document").then(function(ent){
			if(dialogOptions && dialogOptions.multipicker){
				
				$scope.showSearch = false;
				$scope.results = [];
				$scope.term = "";
				$scope.oldTerm = undefined;

				$scope.select(ent);
			}else{
				$scope.submit(ent);
			}
		});
	};

	$scope.performSearch = function(){
		if($scope.term){
			if($scope.oldTerm !== $scope.term){
				$scope.results = [];
				searchService.searchContent({term: $scope.term, results: $scope.results});
				$scope.showSearch = true;
				$scope.oldTerm = $scope.term;
			}
		}else{
			$scope.oldTerm = "";
			$scope.showSearch = false;
			$scope.results = [];
		}
	};


	$scope.dialogTreeEventHandler.bind("treeNodeSelect", function(ev, args){
		args.event.preventDefault();
		args.event.stopPropagation();

		eventsService.publish("Umbraco.Dialogs.ContentPickerController.Select", args).then(function(args){
			if(dialogOptions && dialogOptions.multipicker){
				
				var c = $(args.event.target.parentElement);
				if(!args.node.selected){
					args.node.selected = true;
					c.find("i.umb-tree-icon").hide()
					.after("<i class='icon umb-tree-icon sprTree icon-check blue temporary'></i>");
				}else{
					args.node.selected = false;
					c.find(".temporary").remove();
					c.find("i.umb-tree-icon").show();
				}

				$scope.select(args.node);

			}else{
				$scope.submit(args.node);					
			}
			
		});

	});
});