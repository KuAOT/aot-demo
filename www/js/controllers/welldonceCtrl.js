angular.module('starter')

.config(function($stateProvider) {
	$stateProvider

	.state('app.welldonecard', {
        url: '/welldonecard',
        views: {
          'menuContent': {
            templateUrl: 'templates/welldonecard/welldonecard_menu.html',
            controller:'WelldoneCardCtrl'
          }
        }
    })
	.state('app.welldonecard_sendwc',{
	    url: '/welldonecardsendwc',
	        views: {
	        	'menuContent': {
	            templateUrl: 'templates/welldonecard/welldonecard_sendwc.html',
	            controller:'WelldoneCardSendWCCtrl'
	        }
	    }
	})
	.state('app.welldonecard_history',{
	    url: '/welldonecardhistory',
	        views: {
	        	'menuContent': {
	            templateUrl: 'templates/welldonecard/welldonecard_history.html',
	            controller:'WelldoneCardHistoryCtrl'
	        }
	    }
	})
	.state('app.welldonecard_stat',{
	    url: '/welldonecardstat',
	        views: {
	        	'menuContent': {
	            templateUrl: 'templates/welldonecard/welldonecard_stat.html',
	            controller:'WelldoneCardStatCtrl'
	        }
	    }
	})
 //  .state('app.help_pinsetting',{
 //      url: '/helppinsetting',
 //        views: {
 //          'menuContent': {
 //            templateUrl: 'templates/help/help_pinsetting.html',
 //            controller:'HelpPINSettingCtrl'
 //          }
 //      }
 //  })
 //  .state('app.help_activedevices',{
 //      url: '/helpactivedevices',
 //        views: {
 //          'menuContent': {
 //            templateUrl: 'templates/help/help_activedevices.html',
 //            controller:'HelpActiveDevicesCtrl'
 //          }
 //      }
 //  })
	// .state('app.help_notification', {
	//     url: '/helpnotification',
	//     views: {
	//       'menuContent': {
	//         templateUrl: 'templates/help/help_notification.html',
	//         controller:'HelpNotificationCtrl'
	//       }
	//     }
	// })
 //  .state('app.help_theme', {
 //      url: '/helptheme',
 //      views: {
 //        'menuContent': {
 //          templateUrl: 'templates/help/help_theme.html',
 //          controller:'HelpThemeCtrl'
 //        }
 //      }
 //  })
 //  .state('app.help_resetpassword', {
 //      url: '/helpresetpassword',
 //      views: {
 //        'menuContent': {
 //          templateUrl: 'templates/help/help_resetpassword.html',
 //          controller:'HelpResetPasswordCtrl'
 //        }
 //      }
 //  })
})
 
.controller('WelldoneCardCtrl',function($scope,$cordovaNetwork,$ionicPopup,$ionicPlatform){
	$ionicPlatform.ready(function() {

		$scope.noInternet = false;
      	//if no internet connection
      	if(!CheckNetwork($cordovaNetwork)){
        	$scope.noInternet = true;
        	OpenIonicAlertPopup($ionicPopup,'ไม่มีสัญญานอินเตอร์เนท','ไม่สามารถใช้งานส่วนนี้ได้เนื่องจากไม่ได้เชื่อมต่ออินเตอร์เนท');
     	}

	});
})

.controller('WelldoneCardSendWCCtrl',function($scope,APIService,$cordovaNetwork,$ionicPopup,AuthService,$ionicPlatform,$q,$cordovaFile,$cordovaCamera){
	$ionicPlatform.ready(function() {

		$scope.sendwc = {imageData: '', satisfactionID: 3, message: ''};

		$scope.noInternet = false;
      	//if no internet connection
      	if(!CheckNetwork($cordovaNetwork)){
        	$scope.noInternet = true;
        	OpenIonicAlertPopup($ionicPopup,'ไม่มีสัญญานอินเตอร์เนท','ไม่สามารถใช้งานส่วนนี้ได้เนื่องจากไม่ได้เชื่อมต่ออินเตอร์เนท');
     	}

     	//AutoComplete//
     	$scope.searchEmp = {searchTxt:'',result:''};
		$scope.autoCompleteDatas
		//read employee master data from file
		ReadEmployeeMasterData($q,APIService,$cordovaFile).then(function(response){
			if(response != null) $scope.autoCompleteDatas = response;
		});

		$scope.getEmployees = function (query) {
			if(query){
				return {items:filterEmployees($scope.autoCompleteDatas,query)};
			}
			return {items:[]};
		};
		//AutoComplete//

		$scope.UploadImage = function() {
			var options = { 
    			destinationType: Camera.DestinationType.DATA_URL,
    			sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
    			encodingType: Camera.EncodingType.JPEG,
		      	targetWidth: 100,
		      	targetHeight: 100,
    		}

			$cordovaCamera.getPicture(options).then(function(imageData) {
				$scope.sendwc.imageData = imageData;
		    }, function(err) {
		      	console.log(err);
		    });
		}

		$scope.doSendWC = function(){
			if(CheckValidate()){
				if($scope.noInternet) return;
				//search emp again for confirm before create welldone card
				$scope.searchEmployee().then(function(response){
					var url = APIService.hostname() + '/WellDone/SaveCard';
			        var data = {EmpID_Sender:window.localStorage.getItem('CurrentUserName') ,EmpID_Receive:$scope.searchEmp.searchTxt, 
			        			Message:$scope.sendwc.message, SatisfactionID:$scope.sendwc.satisfactionID, Image:$scope.sendwc.imageData};
			        APIService.ShowLoading();
			        APIService.httpPost(url,data,function(response){
			        APIService.HideLoading();
			        if(response != null && response.data != null){
			        	OpenIonicAlertPopup($ionicPopup,'ส่งคำชม','ส่งคำชมเรียบร้อยแล้ว');
			        	window.location = '#/app/welldonecard';
			        }
			        },function(error){APIService.HideLoading();console.log(error);});
				});
			}
		};

		function CheckValidate() {
			//emplcode
			if($scope.searchEmp.searchTxt == null || $scope.searchEmp.searchTxt.length == 0)	{
				OpenIonicAlertPopup($ionicPopup,'ข้อมูลไม่ถูกต้อง','ต้องเลือกพนักงานก่อน');
				return false;
			}
			//check emplcode must not same with current emplcode
			if($scope.searchEmp.searchTxt == window.localStorage.getItem('CurrentUserName')){
				OpenIonicAlertPopup($ionicPopup,'ข้อมูลไม่ถูกต้อง','ต้องเลือกรหักพนักงานที่ไม่ใช่ของตัวเอง');
				return false;
			}
			return true;
		};

		$scope.searchEmployee = function(){
			return $q(function(resolve){
				APIService.searchEmployee($scope.searchEmp.searchTxt).then(function(response){
					if(response != null){
						$scope.searchEmp.result = response;
						resolve(true);
					} 
					else{
						$scope.searchEmp.result = '';	
						resolve(false);
					} 
				});
			})
		};

	});
})

.controller('WelldoneCardHistoryCtrl',function($scope,APIService,$cordovaNetwork,$ionicPopup,$ionicPlatform,$ionicModal,$cordovaDevice,$q,$cordovaFile){
	$ionicPlatform.ready(function() {

		InitialModalImage($scope,$ionicModal,$cordovaDevice);

		$scope.noInternet = false;
		$scope.emplData;
		$scope.currentEmpl = window.localStorage.getItem('CurrentUserName');
		//read employee master data from file
		ReadEmployeeMasterData($q,APIService,$cordovaFile).then(function(response){
			if(response != null) {
				$scope.emplData = response;
				$scope.InitialWelldoneCardHistory();
			}
			else OpenIonicAlertPopup($ionicPopup,'เกิดข้อผิดพลาด','ไม่พบข้อมูลพนักงาน');
		});
      	//if no internet connection
      	if(!CheckNetwork($cordovaNetwork)){
        	$scope.noInternet = true;
        	OpenIonicAlertPopup($ionicPopup,'ไม่มีสัญญานอินเตอร์เนท','ไม่สามารถใช้งานส่วนนี้ได้เนื่องจากไม่ได้เชื่อมต่ออินเตอร์เนท');
     	}

     	$scope.InitialWelldoneCardHistory = function(){
     		if($scope.noInternet) return;
     		var url = APIService.hostname() + '/WellDone/CardHistory';
	        var data = {EmpID:$scope.currentEmpl};
	        APIService.ShowLoading();
	        APIService.httpPost(url,data,function(response){
	        	APIService.HideLoading();
		        if(response != null && response.data != null){
		        	InitialWelldoneHistoryObject(response.data);
		        }
	        },function(error){APIService.HideLoading();console.log(error);});
     	};

     	function InitialWelldoneHistoryObject(data) {
     		//declare signature array for stored base64str for image popup
	    	$scope.signatureArr = [];
	    	$scope.wcHistory = [];
     		for (var i = 0; i <= data.length - 1; i++) {
				var currentReceiveEmpl = {items:filterEmployees($scope.emplData,data[i].EmpID_Receive)}
				var currentSenderEmpl = {items:filterEmployees($scope.emplData,data[i].EmpID_Sender)}
     			$scope.wcHistory.push({Emp_Receive:currentReceiveEmpl != null ? currentReceiveEmpl.items[0].NM : data[i].EmpID_Receive, 
     								   Emp_Sender:currentSenderEmpl != null ? currentSenderEmpl.items[0].NM : data[i].EmpID_Sender, 
     								   Message:data[i].Message, Satisfaction:data[i].Satisfaction, SignatureObject:data[i].Image, Index:i,
     								   Class: $scope.currentEmpl == data[i].EmpID_Sender ? 'sender' : 'receive',
     								   CreateDate: data[i].CreateDate});
     			$scope.signatureArr.push(data[i].Image);
     		};
     	}

	});
})

.controller('WelldoneCardStatCtrl',function($scope,APIService,$cordovaNetwork,$ionicPopup,$ionicPlatform,$ionicModal,$cordovaDevice,$q,$cordovaFile){
	$ionicPlatform.ready(function() {

		$scope.noInternet = false;
		$scope.CurrentDateTime = 'วันที่ ' + GetCurrentDate() + ' เวลา ' + GetCurrentTime();
		$scope.emplData;
		//if no internet connection
      	if(!CheckNetwork($cordovaNetwork)){
        	$scope.noInternet = true;
        	OpenIonicAlertPopup($ionicPopup,'ไม่มีสัญญานอินเตอร์เนท','ไม่สามารถใช้งานส่วนนี้ได้เนื่องจากไม่ได้เชื่อมต่ออินเตอร์เนท');
     	}

     	//read employee master data from file
     	APIService.ShowLoading();
		ReadEmployeeMasterData($q,APIService,$cordovaFile).then(function(response){
			if(response != null) {
				$scope.emplData = response;
				InitialWelldoneStat();
			}
			else OpenIonicAlertPopup($ionicPopup,'เกิดข้อผิดพลาด','ไม่พบข้อมูลพนักงาน');
		});

     	function InitialWelldoneStat(){
     		if($scope.noInternet) return;
     		var url = APIService.hostname() + '/WellDone/Dashboard';
	        APIService.httpPost(url,null,function(response){
	        	APIService.HideLoading();
		        if(response != null && response.data != null){
		        	InitialWelldoneStatObject(response.data);
		        }
	        },function(error){APIService.HideLoading();console.log(error);});
     	};

     	function InitialWelldoneStatObject(data){
     		$scope.wcStats = [];
     		for (var i = 0; i <= data.length - 1; i++) {
				var currentEmpl = {items:filterEmployees($scope.emplData,data[i].EmpID_Receive)}
     			$scope.wcStats.push({Empl:currentEmpl != null ? currentEmpl.items[0].NM : data[i].EmpID_Receive, Satisfaction1:data[i].Satisfaction1,
     								 Satisfaction2:data[i].Satisfaction2, Satisfaction3:data[i].Satisfaction3, Satisfaction4:data[i].Satisfaction4, Satisfaction5:data[i].Satisfaction5});
     		};
     	}

	});
})