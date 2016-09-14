$(function(){
    chrome.storage.local.get('masterAddress', function(items){
        if(items.masterAddress != undefined){
            $('#host_name').val(items.masterAddress);
        }
    });
    $('#save').on('click', function(e){
        var v = $('#host_name').val();
        chrome.storage.local.set({'masterAddress': v}, function(){});
    });
});
