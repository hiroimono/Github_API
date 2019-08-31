// console.log('sanity check!');
(function(){
    initHandlebars();

    var username, password, userToSearch;
    var owner_id = [];
    var repo = [];
    var endPoint = [];
    var baseUrl = 'https://api.github.com';

    $('#go-button').on('click', function(){
        // console.log('SanityCheck!');
        username = $('input[name="username"]').val();
        password = $('input[name="password"]').val();
        userToSearch = $('input[name="user-to-search"]').val();
        // console.log(username, password, userToSearch);
        endPoint = '/users/' + userToSearch + '/repos';
        console.log(baseUrl + endPoint);

        $.ajax({
            url: baseUrl + endPoint,
            headers: {
                Authorization:'Basic ' + btoa(username + ':' + password)
            },
            success: function(data){

                console.log('data: ', data);
                var repos = Handlebars.templates.repos({
                    repos: data
                });
                $('#results-container').html(repos);
                for(var i = 0; i < data.length ; i++){
                    owner_id.push(data[i]['owner']['login']);
                    repo.push(data[i]['name']);
                }
            },
            errror: function(err){
                console.log(err);
            }

        });
    });


    console.log('owner_ids: ', owner_id);
    console.log('repos: ', repo);


    $('#results-container').on('click', function(e){
        $('.commits').css('display', 'none');
        $('.results').css('z-index', 100);
        // console.log('SanityCheck!');
        //////////I coul not get the correct index number :( )///////////
        var i = $(this).index();
        //////////I coul not get the correct index number :( )///////////

        endPoint = '/repos/' + owner_id[i] + '/' + repo[i] + '/commits';
        console.log(baseUrl + endPoint);

        $.ajax({
            url: baseUrl + endPoint,
            headers: {
                Authorization:'Basic ' + btoa(username + ':' + password)
            },
            success: function(data){
                $('.commits').eq(i).css('display', 'inline-block');
                $('.results').eq(i).css('z-index', -100);
                console.log('data: ', data);
                var commits = Handlebars.templates.commits({
                    commits: data
                });
                $('ul').eq(i).html(commits);
            },
            errror: function(err){
                console.log(err);
            }

        });
    });


    // var myEncryptedPassword = btoa(mySecretPass);

    // add event listener for last commits

    ////////////////// Handlebars DO NOT TOUCH //////////////////
    function initHandlebars(){
        Handlebars.templates = Handlebars.templates || {};

        var templates = document.querySelectorAll(
            'script[type="text/x-handlebars-template"]'
        );

        Array.prototype.slice.call(templates).forEach(function(script) {
            Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
        });
    }
////////////////// Handlebars DO NOT TOUCH //////////////////

}());
