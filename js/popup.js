$(function(){
    var setAlarm = function(){
        chrome.alarms.create('notification', {'periodInMinutes': 1});
    };
    var clearAlarm = function(){
        chrome.alarms.clear('notification');
    };

    $("#openner").on('click', function(){
        $("#hide").toggle();
    });

    var masterAddress = '';
    var notificationList = [];

    var resultDiv = $('#content');
    var getDoorStatus = function() {
        if(masterAddress === '') {
            resultDiv.html("ホスト名が設定されていません");
            return;
        }
        $.ajax({
            type: 'GET',
            url: masterAddress + '/heavensdoor/showall',
            dataType: 'json'
        }).done(function(json, textStatus, jqXHR){
            var len = json.length;
            var html = [];
            html.push('<table>');
            if(len <= 0) {
                html.push('ドアの情報がありません');
            }
            for(var i = 0; i < len; i++){
                html.push('<tr>');
                html.push('<td>');
                if(notificationList.indexOf(json[i].label) >= 0){
                    html.push('<input class="nc" type="checkbox" value="' + json[i].label + '" checked="checked" />');
                } else {
                    html.push('<input class="nc" type="checkbox" value="' + json[i].label + '" />');
                }
                html.push('</td>');
                html.push('<td>');
                if(json[i].alias){
                    html.push(json[i].alias);
                } else {
                    html.push(json[i].label);
                }
                html.push('</td>');
                html.push('<td>');
                if(json[i].value){
                    html.push('<div class="door open"></div>');
                } else {
                    html.push('<div class="door close"></div>');
                }
                html.push('</td>');
                html.push('<td>');
                html.push(diffFromNow(moment(json[i].updatetime)));
                html.push('</td>');
                html.push('</tr>');
            }
            html.push('</table>');
            resultDiv.html(html.join(''));
            $('input.nc').on('change', function(){
                var notificationList = [];
                var list = $(this);
                for(var i = 0; i < list.length; i++) {
                    if($(list[i]).prop('checked')){
                        notificationList.push($(list[i]).val());
                    }
                }
                if(notificationList.length <= 0){
                    console.log('clear');
                    clearAlarm();
                } else {
                    console.log('set');
                    setAlarm();
                }
                chrome.storage.local.set({'notificationList': notificationList}, function(){});
            });
        }).fail(function(){
            resultDiv.html('通信に失敗しました');
        });

        function diffFromNow(d) {
            var now = moment();
            var years = now.diff(d, 'years');
            if(years > 0){ return years + '年前'; }
            var months = now.diff(d, 'months');
            if(months > 0){ return months + 'ヶ月前'; }
            var days = now.diff(d, 'days');
            if(days > 0){ return days + '日前'; }
            var hours = now.diff(d, 'hours');
            if(hours > 0){ return hours + '時間前'; }
            var minutes = now.diff(d, 'minutes');
            if(minutes > 0){ return minutes + '分前'; }
            var seconds = now.diff(d, 'seconds');
            if(seconds > 0){ return seconds + '秒前'; }
        }
    };

    chrome.storage.local.get('masterAddress', function(items){
        if(items.masterAddress != undefined){
            masterAddress = items.masterAddress;
            chrome.storage.local.get('notificationList', function(items){
                if(items.notificationList != undefined){
                    notificationList = items.notificationList;
                    getDoorStatus();
                }
            });
        }
    });

    $('#reflesh').on('click', getDoorStatus);


});
