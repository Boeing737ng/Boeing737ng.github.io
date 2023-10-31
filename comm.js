var hybridApp = {
 "version":"1.1"
 ,"debugFlag":false
 /** DocumentReady 이벤트를 앱에 통보 */
 ,"documentReady": function() { 
  var urlStr = 'hybrid://SendDataToForm/{"FunctionName":"OnReceiveData","Data":"DocumentReady"}';
  if(this.debugFlag) alert(urlStr);
  document.location.href = urlStr;
 }
 /** 로그인상태를 확인 */
 ,"requestLoginState": function(callbackFuncName) { 
  var urlStr = 'hybrid://SendDataToForm/{"FunctionName":"OnReceiveData","Data":"RequestLoginState^' + callbackFuncName + '"}';
  if(this.debugFlag) alert(urlStr);
  document.location.href = urlStr;
 }
 /** @Deprecated 엡에 데이터 전달 */
 ,"sendData": function(textData) {  
  var urlStr = 'hybrid://SendDataToForm/{"FunctionName":"OnReceiveData","Data":"' + textData + '"}';
  if(this.debugFlag) alert(urlStr);
  document.location.href = urlStr;
 }
 /** 엡에 Text 데이터 전달 */
 ,"sendTextData": function(textData) {  
  var urlStr = 'hybrid://SendDataToForm/{"FunctionName":"OnReceiveData","Data":"SendText^' + textData + '"}';
  if(this.debugFlag) alert(urlStr);
  document.location.href = urlStr;
 }
 /** 엡에 Json 데이터 전달 */
 ,"sendJsonData": function(jsonTxt) {  
  var urlStr = 'hybrid://SendDataToForm/{"FunctionName":"OnReceiveData","Data":"SendJson^' + jsonTxt + '"}';
  if(this.debugFlag) alert(urlStr);
  document.location.href = urlStr;
 }
 /** 엡에 Json 데이터 전달 */
 ,"sendJsonToForm": function(jsonTxt) {  
  var urlStr = 'hybrid://SendJSONToForm/' + jsonTxt;   // jsonTxt: json 데이터 text
  if(this.debugFlag) alert(urlStr);
  document.location.href = urlStr;
 }
 /** 앱 일반화면 실행 */
 ,"openScreen": function(data) {  
  var urlStr = 'hybrid://SendDataToForm/{"FunctionName":"OnReceiveData","Data":"OpenScreen^' + data + '"}';
  if(this.debugFlag) alert(urlStr);
  document.location.href = urlStr;
 }
 /** 앱 팝업화면 실행 */
 ,"openPopup": function(data) {  
  var urlStr = 'hybrid://SendDataToForm/{"FunctionName":"OnReceiveData","Data":"OpenPopup^' + data + '"}';
  if(this.debugFlag) alert(urlStr);
  document.location.href = urlStr;
 }
 /** 앱 팝업화면 실행 모화면 닫지 않기 */
 ,"openPopupNotClose": function(data) {  
  var urlStr = 'hybrid://SendDataToForm/{"FunctionName":"OnReceiveData","Data":"OpenPopupNotClose^' + data + '"}';
  if(this.debugFlag) alert(urlStr);
  document.location.href = urlStr;
 }
 /** 앱에서 필요한 SharedData를 저장(다이나믹 링크 이후 앱 내 동작 처리용) */
 ,"setSharedData": function(data) {  
  var urlStr = 'hybrid://SendDataToForm/{"FunctionName":"OnReceiveData","Data":"SetSharedData^' + data + '"}';
  if(this.debugFlag) alert(urlStr);
  document.location.href = urlStr;
 }
 /** 화면닫기 이벤트를 앱에 통보 */
 ,"closeCurrentForm": function() {
  var urlStr = 'hybrid://SendDataToForm/{"FunctionName":"OnReceiveData","Data":"CloseCurrentForm"}';
  if(this.debugFlag) alert(urlStr);
  document.location.href = urlStr; 
 }
 /** 다이나믹 링크 호출 후 화면닫기 이벤트 앱에 통보 */
 ,"callDynLink": function(url) {
  this.closeCurrentForm();
  location.href = url;
 }
}