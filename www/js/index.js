
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        
        var push = PushNotification.init({
                                         "android": {
                                         "senderID": "854147033450",
                                         "icon": "fit_icon",
                                         // "iconColor": "#4a4354"
                                         },
                                         "ios":
                                         {"alert": "true",
                                         "badge": "true",
                                         "sound": "true",
                                         "clearBadge": "true"
                                         },
                                         "windows": {}
                                         });   //End of push Initialization

        push.on('registration', function(data) {  // called for registering device for getting token for push notification

                localStorage.setItem('deviceToken',data.registrationId); 


                var serviceUrl = localStorage.getItem("serverUrl");
                var userId = localStorage.getItem('userId');
                var deviceToken = localStorage.getItem("deviceToken");
                var deviceType =  localStorage.getItem('deviceType');
                var deviceTokenStatus = localStorage.getItem("deviceTokenStatus");
                var jdata = JSON.stringify({"user_id":userId,"device_token":deviceToken,"device_type":deviceType});
                // alert(deviceToken);
                // console.log('deviceTokenkey'+deviceToken);
                if(deviceTokenStatus!="true")
                {                
                
                    $.ajax({
                           url:serviceUrl+'updateDeviceToken',
                           contentType: "application/json; charset=utf-8",
                           type:'POST',
                           data:jdata,
                           async: false,
                           dataType:'json',
                           error:function(jqXHR,text_status,strError){
                                // alert('error');
                           },
                           success:function(data)
                           {
                                if(data.STATUS=="Success"){
                                    localStorage.setItem('deviceTokenStatus',"true");
                                }                                
                           }
                        });                
                }
                //              Nativealert(data.registrationId,"Device Token");
                }); //End of Push Registration.
        
        push.on('notification', function(data) {   //called when push notification received

                var userType = data.additionalData.userType;
                
                var url1 = location.href.split('#')[0];     
                
                if(userType=="Customer"){                    
                    location.href = '#order-history';
                }
                if(userType=="Vendor"){                
                    location.href = '#orders';
                }
                
                push.finish(function () {
                            console.log('finish successfully called');
                            }); // End of Pus On Finish
                });   // End of Push On Notification
        
        push.on('error', function(e) {
                console.log("push error");
                });  // End of Push On Error
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

 function Nativealert(msg, title) {
               navigator.notification.alert(msg, null, title, "Close");
           }
// function Nativealert() {
//    var message = "";
//    var title = "";
//    var buttonName =jqXHR "";
    
//    navigator.notification.alert(message, alertCallback, title, buttonName);

//    function alertCallback() {
//       console.log("Alert is Dismissed!");
//    }
    
// }

function dialogConfirm() {
   var message = "Am I Confirm Dialog?";
   var title = "CONFIRM";
   var buttonLabels = "YES,NO";
    
   navigator.notification.confirm(message, confirmCallback, title, buttonLabels);

   function confirmCallback(buttonIndex) {
      console.log("You clicked " + buttonIndex + " button!");
   }
    
}


function dialogPrompt() {
   var message = "Am I Prompt Dialog?";
   var title = "PROMPT";
   var buttonLabels = ["YES","NO"];
   var defaultText = "Default"
    
   navigator.notification.prompt(message, promptCallback, title, buttonLabels, defaultText);

   function promptCallback(result) {
      console.log("You clicked " + result.buttonIndex + " button! \n" + 
         "You entered " +  result.input1);
   }
    
}

function dialogBeep() {
   var times = 2;
   navigator.notification.beep(times);
}
app.initialize();
