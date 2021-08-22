$(document).ready(function(){
    $("form#websnippet").on('submit', function(e){
        e.preventDefault();
        var data = $('textarea[name=snippet]').val();
        $.ajax({
            type: 'post',
            url: '/conf/parse',
            data: {snippet : data},
            dataType: 'text'
        })
        .done(function(data){
            console.log(data);
            var quo = JSON.parse(data);
            //$('h1').html(quo.snippet);
            $('#organizationId').val(quo.organizationId);
            $('#buttonId').val(quo.buttonId);
            $('#deploymentId').val(quo.deploymentId);
            $('#endpointUrl').val(quo.endpointUrl);
            document.getElementById("confdetails").classList.remove('ishidden');
            document.getElementById("websnippet").classList.add('ishidden');
            
        });
    });
    $("form#botidform").on('submit', function(e){
        e.preventDefault();
        var data = $('input[name=botid]').val();
        $.ajax({
            type: 'post',
            url: '/conf/findbotid',
            data: {botid : data},
            dataType: 'text'
        })
        .done(function(data){
            console.log(data);
            var quo = JSON.parse(data);
            $('h1').html(quo.botid);
            $('#botid').val(quo.botid);
            $('#organizationId').val(quo.conf.organizationId);
            $('#buttonId').val(quo.conf.buttonId);
            $('#deploymentId').val(quo.conf.deploymentId);
            $('#endpointUrl').val(quo.conf.endpointUrl);
            //$('div.botconfig').removeClass("hideform");
            //$('div.rightconf').removeClass("hideform");
            document.getElementById("botsetup").removeAttribute("disabled"); 
            document.getElementById("botsetup").parentElement.classList.add('slds-is-open');
            document.getElementById("botfind").parentElement.classList.remove('slds-is-open');
            
        });
    });
});