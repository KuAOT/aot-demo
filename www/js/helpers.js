
var shortnessThaiMonth = [
    {monthValue:'01',monthName:'ม.ค.'},
    {monthValue:'02',monthName:'ก.พ.'},
    {monthValue:'03',monthName:'มี.ค.'},
    {monthValue:'04',monthName:'เม.ย.'},
    {monthValue:'05',monthName:'พ.ค.'},
    {monthValue:'06',monthName:'มิ.ย.'},
    {monthValue:'07',monthName:'ก.ค.'},
    {monthValue:'08',monthName:'ส.ค.'},
    {monthValue:'09',monthName:'ก.ย.'},
    {monthValue:'10',monthName:'ต.ค.'},
    {monthValue:'11',monthName:'พ.ย.'},
    {monthValue:'12',monthName:'ธ.ค.'},
];

var shortnessEngMonth = [
    {monthValue:'01',monthName:'Jan'},
    {monthValue:'02',monthName:'Feb'},
    {monthValue:'03',monthName:'Mar'},
    {monthValue:'04',monthName:'Apr'},
    {monthValue:'05',monthName:'May'},
    {monthValue:'06',monthName:'Jun'},
    {monthValue:'07',monthName:'Jul'},
    {monthValue:'08',monthName:'Aug'},
    {monthValue:'09',monthName:'Sep'},
    {monthValue:'10',monthName:'Oct'},
    {monthValue:'11',monthName:'Nov'},
    {monthValue:'12',monthName:'Dec'},
];

var _MS_PER_DAY = 1000 * 60 * 60 * 24;

 function GetCurrentDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10) dd='0'+dd
    if(mm<10) mm='0'+mm
    today = dd+'/'+mm+'/'+yyyy;
    return today;
};

function GetFiscalDate(){
	var today = new Date();
	var day = today.getDate();
	var month = today.getMonth()+1;
	var year = today.getFullYear();
	if(month > 10) return '0110' + year;
	else return '0110' + (year - 1);
};

function GetThaiDateByDate($filter,inputDate){
  var currentMonth = $filter('filter')(shortnessThaiMonth, { monthValue: inputDate.substring(2,4) });
  return inputDate.substring(0,2) + ' ' + currentMonth[0].monthName + ' ' + (parseInt(inputDate.substring(4,8)) + 543);
};

//05072016161000
function GetThaiDateTimeByDate ($filter,inputDate) {
  if(inputDate == null) return;
  var result = GetThaiDateByDate($filter,inputDate);
  result = result + ' เวลา ' + inputDate.substring(8,10) + '.' + inputDate.substring(10,12);
  return result;
};

//change date format from such as '04.02.2016 07:48:48' to '04022016'
function TransformDateToddMMyyyyFormat(inputDate){
    if(!inputDate || inputDate.length == 0) return;
    return inputDate.substring(0,10).replace(/\./g,'');
};

//change date format from '15062016' to 15/06/2016
function TransformDateHasSlashFormat (inputDate) {
    if(!inputDate || inputDate.length == 0) return;
    return inputDate.substring(0,2) + '/' + inputDate.substring(2,4) + '/' + inputDate.substring(4,8);
};

function ConvertDateObjToSlashFormat (date) {
  if(date == null) return null;
  var day = date.getDate().toString();
  day = (day.length == 1 ? '0' + day : day);
  var month = (date.getUTCMonth() + 1).toString();
  month = (month.length == 1 ? '0' + month : month);
  var year = date.getFullYear();
  var inputDate = day + month + year;
  return TransformDateHasSlashFormat(inputDate);
};

function GetThaiMonthNameByMonth($filter,monthVal){
    if(!monthVal || monthVal.length == 0) return;
    var currentMonth = $filter('filter')(shortnessThaiMonth, { monthValue: monthVal });
    return currentMonth[0].monthName;
};

function GetStringNumber2Digits(n){
    return n > 9 ? "" + n: "0" + n;
};

function GetTimeByStampTime(stampTime){
    if(!stampTime || stampTime.length == 0) return;
    return stampTime.substring(11,16);
};

function ConvertQueryResultToArray(data){
    var newArr = [];
    for (var i = 0; i <= data.rows.length - 1; i++) {
        newArr.push(data.rows.item(i));
    };
    return newArr;
};

function GetCurrentTime(){
    var currentdate = new Date(); 
    var datetime = currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    return datetime;
};

function GetCurrentTimeWithoutMillisecond(){
    var currentdate = new Date(); 
    var datetime = currentdate.getHours() + ":" + currentdate.getMinutes();
    return datetime;  
};

function CheckNeedToReload($rootScope,checkedURL){
    $rootScope.$on( "$stateChangeSuccess", function(event, next, current) {
        if(next.url == checkedURL){
            if(needReload){
                needReload = false;
                window.location.reload();
            }
        };
    });
};

//eg. '31032016152800' -> '31/03/2016 15:28'
function TransformServerTSToDateTimeStr(ts){
    if(!ts || ts.length == 0) return '';
    var result = '';
    if(ts.length == 13) return result = ts.substring(0,1) + '/' + ts.substring(1,3) + '/' + ts.substring(3,7) + ' ' + ts.substring(7,9) + ':' + ts.substring(9,11);
    else return result = ts.substring(0,2) + '/' + ts.substring(2,4) + '/' + ts.substring(4,8) + ' ' + ts.substring(8,10) + ':' + ts.substring(10,12);
};

//eg. '31032016152800' -> '31/032016'
function TransformServerTSToDateStr(ts) {
    if(!ts || ts.length == 0) return '';
    var result = '';
    if(ts.length == 13) return result = ts.substring(0,1) + '/' + ts.substring(1,3) + '/' + ts.substring(3,7);
    else return result = ts.substring(0,2) + '/' + ts.substring(2,4) + '/' + ts.substring(4,8);  
};

//eg. '31032016152800' -> '15:28'
function TransformServerTSToTimeStr(ts) {
    if(!ts || ts.length == 0) return '';
    var result = '';
    if(ts.length == 13) return result = ts.substring(7,9) + ':' + ts.substring(9,11);
    else return result = ts.substring(8,10) + ':' + ts.substring(10,12); 
};

function GeneratedGUID(){
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

function CheckNetwork($cordovaNetwork){
    if (window.cordova){
        if($cordovaNetwork.getNetwork() == 'none' || $cordovaNetwork.isOffline()) return false;
        else return true;    
    }
    else return true;
};

function OpenIonicAlertPopup($ionicPopup,title,content){
    $ionicPopup.alert({
        title: title,
        content: content
    });
};

function ConvertImgPNGToBase64(url,callback,outputFormat){
    url = 'http://' + url //url.replace('10.74.29.166/','http://eservice2.airportthai.co.th/');
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null; 
    };
    img.src = url;
};

function GetCurrentTSAPIFormat(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10) dd='0'+dd
    if(mm<10) mm='0'+mm
    today = dd.toString() + mm.toString() + yyyy.toString();

    var currentdate = new Date(); 
    var h = (currentdate.getHours() < 10) ? '0' + currentdate.getHours().toString() : currentdate.getHours().toString();
    var mm = (currentdate.getMinutes() < 10) ? '0' + currentdate.getMinutes().toString() : currentdate.getMinutes().toString();
    var s = (currentdate.getSeconds() < 10) ? '0' + currentdate.getSeconds().toString() : currentdate.getSeconds().toString();
    var datetime = h + mm + s;
    
    return today + datetime;
};

function GetPicThumbBase64($q,APIService,empId) {
    return $q(function(resolve,reject){
        var directoryURL = APIService.hostname() + '/ContactDirectory/viewContactPaging';
        var directoryData = {keyword:empId,start:1,retrieve:1};
        APIService.httpPost(directoryURL,directoryData,
           function(response){
                if(response != null && response.data != null){
                      var result = response.data[0];
                      //convert picthumb to base64
                      ConvertImgPNGToBase64(result.PictureThumb,function(base64){
                          if(base64 && base64.length > 0) resolve(base64);
                          else resolve(null);
                      });
                };
           },function(error){console.log(error);reject(error);});
    });
};

function PadString(str,prefix) {
    return prefix.substring(0,prefix.length - str.length) + str;
};

function OpenConfirmDialog($ionicPopup,$scope,titleTxt,contentTxt,OKCB,CancelCB) {
    var confirmPopup = $ionicPopup.confirm({
     title: titleTxt,
     template: contentTxt,
     scope: $scope,
   });

   confirmPopup.then(function(res) {
     if(res) OKCB();
     else CancelCB();
   });
};

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
};

function DisplayPDF($cordovaFile,$cordovaFileOpener2,APIService,url,data,fileName) {
    APIService.ShowLoading();
    APIService.httpPost(url,data,function(response){
        if(response != null && response.data != null){
          var extension = response.data[0].ContentType;
          var base64Str = response.data[0].ContentData;
          var contentType = GetContentTypeByExtension(extension);
          fileName = fileName + '.' + extension;
          var blob = b64toBlob(base64Str, contentType);
          if(!window.cordova){
            //pc process
            var blobURL = URL.createObjectURL(blob);
            window.open(blobURL,'_blank');
            APIService.HideLoading();
          }
          else{
            //mobile process
            var pathFile = '';
            if (ionic.Platform.isIOS()) pathFile = cordova.file.documentsDirectory
            else pathFile = cordova.file.externalDataDirectory
            $cordovaFile.writeFile(pathFile, fileName, blob, true).then(function(success){
                $cordovaFileOpener2.open(
                    pathFile + fileName,
                    contentType
                  ).then(function() {
                    APIService.HideLoading();
                    console.log('file opened successfully');
                  });
            }, function(error) {APIService.HideLoading();console.log(error);});
          }
        }
        else APIService.HideLoading();
    },function(error){APIService.HideLoading();console.log(error);alert('ไม่พบข้อมูล');});
};

function RemovePDFFiles($cordovaFile) {
  if(!window.cordova) return;
  var pathFile = '';
  if (ionic.Platform.isIOS()) pathFile = cordova.file.documentsDirectory
  else pathFile = cordova.file.externalDataDirectory
  var arrFiles = ['Tax_91.pdf','Tax_50.pdf','AOTNews.pdf','circular-letter.pdf'];
  for (var i = 0; i <= arrFiles.length - 1; i++) {
    RemoveFile($cordovaFile,pathFile,arrFiles[i]);
  };
};

function RemoveFile($cordovaFile,pathFile,fileName) {
  $cordovaFile.removeFile(pathFile,fileName)
      .then(function (success) {
        console.log('remove_file ' + fileName + ' - success');
        return true;
      }, function (error) {
        console.log(error);
        return false;
      });
};

function GetContentTypeByExtension (extension) {
  switch(extension) {
    case 'jpg':
        return 'image/jpeg';
        break;
    case 'pdf':
        return 'application/pdf';
        break;
  };
};

function RedirectAndReloadView(url){
    window.location = url;
    window.location.reload();
};

function LogInAPI(AUTH_EVENTS,APIService,$http,$q,$cordovaNetwork, $ionicPopup){
  return $q(function(resolve){
    //if already has token, return;
    if(window.localStorage.getItem('yourTokenKey') != null && window.localStorage.getItem('yourTokenKey').length > 0){
      console.log('have-token');
      SetAuthorizationHeader($http,window.localStorage.getItem('yourTokenKey'));
      resolve();
    } 
    else{
      console.log('no-token');
      var data = {grant_type:'password',username:'epayment@airportthai.co.th',password:'aotP@ssw0rd'};
      var url = APIService.hostname() + '/Token';
      APIService.httpPost(url,data,
        function(response){
          var result = angular.fromJson(response.data);
          //get token_type("bearer") + one white space and token
          var token = result.token_type + ' ' + result.access_token;
          console.log(token);
          window.localStorage.setItem(AUTH_EVENTS.LOCAL_TOKEN_KEY, token);
          //set header
          SetAuthorizationHeader($http,token);
          resolve();
        },
        function(error){console.log(error);resolve(error);});    
    }
  });
};

function SetAuthorizationHeader($http,value) {
  console.log('set-header');
  //set header
  $http.defaults.headers.common['Authorization'] = value;
};

function DateDiff (date1) {
  var date2 = new Date();
  var utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  var utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

function CheckSessionIsExpire(APIService,$q){
  return $q(function(resolve){
    if(window.localStorage.getItem('lastLogInDate') == null) return resolve(false);
    var lastLogInDate = new Date(parseInt(window.localStorage.getItem('lastLogInDate')));
    var diffDay = DateDiff(lastLogInDate);
    //get number of expire day from api
    var url = APIService.hostname() + '/AOTLiveConfig/AOTLive';
    var data = {ConfigKeys:'Timeout'};
    APIService.httpPost(url,data,
      function(response){
        console.log(diffDay);
        if(response != null && response.data != null){
          var numberOfExpireDay = +response.data;
          if(diffDay >= numberOfExpireDay) resolve(true);
          else resolve(false);
        }
        else resolve(false);
      },
      function(error){console.log(error);resolve(false);});
  });
};

function CheckDeviceIsValid (APIService,$q,registerId) {
  return $q(function(resolve){
    var url = APIService.hostname() + '/DeviceRegistered/ValidateDevice';
    var data = {RegisterID:registerId};
    APIService.ShowLoading();
    APIService.httpPost(url,data,function(response){
      APIService.HideLoading();
      resolve(response);
    },
      function(error){console.log(error);APIService.HideLoading();resolve(null);});
  });
};