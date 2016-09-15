(function(){
    var setAlarm = function(){
        chrome.alarms.create('notification', {'periodInMinutes': 1});
    };
    var clearAlarm = function(){
        chrome.alarms.clear('notification');
    };

    chrome.alarms.onAlarm.addListener(function(alarm) {
        if(!alarm){ return; }
        if(alarm.name == 'notification'){
            var masterAddress = '';
            var notificationList = [];
            chrome.storage.local.get('masterAddress', function(items){
                if(items.masterAddress != undefined){
                    masterAddress = items.masterAddress;
                    chrome.storage.local.get('notificationList', function(items){
                        if(items.notificationList != undefined){
                            notificationList = items.notificationList;
                            showNotification();
                        }
                    });
                }
            });

            function showNotification() {
                if(!masterAddress || notificationList.length <= 0) {
                    clearAlarm();
                    return;
                }
                $.ajax({
                    type: 'GET',
                    url: masterAddress + '/heavensdoor/showall',
                    dataType: 'json'
                }).done(function(json, textStatus, jqXHR){
                    var len = json.length;
                    var openList = [];
                    var closeList = [];
                    for(var i = 0; i < len; i++){
                        if(notificationList.indexOf(json[i].label)>= 0){
                            if(json[i].value){
                                openList.push(json[i].alias);
                            } else {
                                closeList.push(json[i].label);
                            }
                        }
                    }
                    chrome.storage.local.set({'notificationList': closeList}, function(){});
                    chrome.notifications.create('doorNotification', {
                        type: 'basic',
                        iconUrl: 'img/icon_128.png',
                        title: 'Open sesame...',
                        message: openList.join(', ')
                     }, function(notificationId) {});
                }).fail(function(){
                });
            }
        }
    });
})();
