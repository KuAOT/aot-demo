angular.module('starter').service('XMPPApiService',function($http,$httpParamSerializerJQLike,$q){

	var service = this;
	var xmppApiServiceConfig = {};
	xmppApiServiceConfig.headers = {'Authorization' : 'IhJpIsSTFXSkXkAn','Content-Type': 'application/json'};
	var xmppApiServiceURLDetails = {domain:'http://' + xmppURLDetails.domain,port:':9090',apiPrefix:'/plugins/restapi/v1'};
	var xmppApiServiceFullUrl = xmppApiServiceURLDetails.domain + xmppApiServiceURLDetails.port + xmppApiServiceURLDetails.apiPrefix;

	this.httpPost = function(url,data){
		return $q(function(resolve, reject) {
			$http.post(url,data,xmppApiServiceConfig).then(function(response){resolve(response);},function(response){reject(response);});
		});
	};

	this.httpGet = function(url){
		console.log(url);
		return $q(function(resolve, reject) {
		 	$http.get(url, xmppApiServiceConfig).then(function(response){resolve(response);}, function(response){reject(response);});
		});
	};

	this.CheckAndCreateUserIfNotExist = function(userDatas){
		return $q(function(resolve,reject){
			service.CheckUserIsExist(userDatas.username).then(function(response){
				if(!response){
					console.log('create user');
					service.CreateUser(userDatas).then(function(response){
						resolve(response);
					});
				}
				else{
					console.log('user exist');
					resolve(true);	
				} 
			});	
		});
	};

	this.CheckUserIsExist = function(username){
		return $q(function(resolve,reject){
			var url = xmppApiServiceFullUrl + '/users/' + username;
			service.httpGet(url).then(
				function(response){
					resolve(true);
				},
				function(response){
					resolve(false);
				});
		});
	};

	this.CreateUser = function(userDatas){
		console.log(userDatas);
		return $q(function(resolve,reject){
			var url = xmppApiServiceFullUrl + '/users';
			service.httpPost(url,userDatas).then(
				function(response){
					resolve(true);
				},
				function(response){
					reject(false);
				});
		});
	};

	this.CreateChatRoom = function(data){
		var payload = {roomName:data.roomName,naturalName:data.naturalName,description:data.description,
			registrationEnabled:"true",persistent:"true",canChangeNickname:"true",logEnabled:"true",publicRoom:"true",maxUsers:"30",
			owners:data.owners,members:data.members};
		return $q(function(resolve,reject){
			var url = xmppApiServiceFullUrl + '/chatrooms';
			service.httpPost(url,payload).then(
				function(response){resolve(true)},
				function(response){resolve(false)})
		})
	};

});