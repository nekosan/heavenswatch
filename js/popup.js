$(function(){
    var masterAddress = '';
    
    var setMasterAddress = function() {
        chrome.storage.local.get('masterAddress', function(items){
            if(items.masterAddress != undefined){
                $('#host_name').val(items.masterAddress);
                masterAddress = items.masterAddress;
            }
        });
    }();

    $('#host_name').on('change', function(e){
        var v = $(this).val();
        masterAddress = v;
        chrome.storage.local.set({'masterAddress': v}, function(){});
    });

    var resultDiv = $('#content');
    var getDoorStatus = function() {
        console.log(resultDiv);
        console.log(masterAddress);
        $.ajax({
            type: 'GET',
            url: masterAddress + '/heavensdoor/showall',
            dataType: 'json'
        }).done(function(json, textStatus, jqXHR){
            console.log(json);
            var len = json.length;
            var html = [];
            html.push('<table>');
            if(len <= 0) {
                html.push('ドアの情報がありません');
            }
            for(var i = 0; i < len; i++){
                html.push('<tr>');
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

    window.setTimeout(getDoorStatus, 500);

    $('#reflesh').on('click', getDoorStatus);

});
