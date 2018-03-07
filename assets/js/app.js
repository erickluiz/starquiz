$(function(){

    var urlStar             = 'https://swapi.co/api/';
    var controllerGamerHelp = [];
    var ganhaPontos         = 10;
    var pontosAjuda         = 5;
    var rank                = [];
    var pontuacao           = 0;

    var timer2 = "02:01";
    var interval = setInterval(function() {
        var timer = timer2.split(':');
        //by parsing integer, I avoid all extra string processing
        var minutes = parseInt(timer[0], 10);
        var seconds = parseInt(timer[1], 10);
        --seconds;
        minutes = (seconds < 0) ? --minutes : minutes;
        if (minutes < 0) clearInterval(interval);
        seconds = (seconds < 0) ? 59 : seconds;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        //minutes = (minutes < 10) ?  minutes : minutes;

        if((minutes == 0)&&(seconds < 11)){
            $('#timer').css("color", "#f00");
        }
        $('#timer').html(minutes + ':' + seconds);
        timer2 = minutes + ':' + seconds;


        if((minutes == 0)&&(seconds == 0)){


            $("#pontuacao").html("<span>"+pontuacao+"</span> pontos");


            $("#endGame").modal("show");
            clearInterval(interval);
        }
    }, 1000);

    function templatePersonal( data , image) {

        return ' <div class="col-md-3">\n' +
            '               <form action="" class="form-game"  >\n' +
            '                   <div class="thumbnail" data-id="personal_'+data.id+'" >\n' +
            '                       <img src="'+image+'" alt="...">\n' +
            '                       <div class="caption">\n' +
            '                           <div class="input-group">\n' +
            '                               <input type="text" name="nome" class="form-control" required placeholder="Qual o nome...">\n' +
            '                               <input type="hidden" name="id" value="'+data.url+'">\n' +
            '                               <span class="input-group-btn">\n' +
            '                               <button class="btn btn-default" type="submit"><i class="fa fa-check"></i></button>\n' +
            '                              </span>\n' +
            '                           </div><!-- /input-group -->\n' +
            '                           <p><a href="#" data-url="'+data.url+'" class="btn btn-primary openHelp" title="precisando de uma ajudinha??" role="button">Ajuda ?</a></p>\n' +
            '                       </div>\n' +
            '                   </div>' +
            '               </form>'
            '           </div>';
    }

    /* Listagem Geral */
    function listPersonal( page  ){

        $("#listGamer").html( '' );

        /* Disabled pagination */
        $("#previous").prop("disabled", true);
        $("#next").prop("disabled", true);

        $.get( page, function(result){

            $.each( result.results , function( index, value ) {

                $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
                {
                    tags: value.name,
                    tagmode: "any",
                    format: "json"
                },
                function(data) {
                    $("#listGamer").append( templatePersonal( value , data.items[0].media.m) );
                });

            });

            /* Mount pagination */
            $("#previous").attr("data-page", result.previous);
            $("#next").attr("data-page", result.next );

            if(result.previous != null)
                $("#previous").prop("disabled", false);

            if(result.next != null)
                $("#next").prop("disabled", false);
            /* End mount pagination */


        }, "json");
    }

    // Alterna Pagina
    $(".page").on("click", function(){

        var urlx = $(this).attr( "data-page" );
        listPersonal(urlx);

    });

    function load(){

        listPersonal(urlStar+'people/?page=1');


    }

    function getItem( url, itemx  ){

        $.get( url , function(result){
            if(itemx)
                return result.name;
            else
                return result.title;


        }, 'json');

    }


    $("body").on("click", ".openHelp", function(){

        var buscar = $(this).attr("data-url");

       controllerGamerHelp.push(buscar);


        $("#infoPicture").attr("src", $(this).parent().parent().parent().parent().find("img").attr("src"));

        $("#filmes").html('');
        $("#veiculos").html('');
        $("#especie").html('');

        $.get( buscar , function(result){

            $("#gender").html(result.gender);
            $("#height").html(result.height);
            $("#hair_color").html(result.hair_color);


            $.get( result.homeworld , function(result){  $("#planeta").html(result.name);  }, 'json');

            $(result.species).each(function(index, value){

                $.get( value , function(result){  $("#especie").append(result.name);  }, 'json');
            });

            $(result.films).each(function(index, value){

                $.get( value, function(result){  $("#filmes").append(result.title);  }, 'json');
            });

            $(result.vehicles).each(function(index, value){

                $.get( value , function(result){  $("#veiculos").append(result.name);  }, 'json');
            });

            $("#infoPersonal").modal("show");

        }, "json");

    });



    /* Brain Game*/
    $('body').on( 'submit', '.form-game', function(event){

        var correctName = '';
        var name = $(this).find("input[name='nome']").val();
        var form = $(this);
        var urlteste = $(this).find("input[name='id']").val();

        $.get( $(this).find("input[name='id']").val() , function(result){
            console.log(urlteste);
            correctName = result.name;
            if(correctName == name){
                if( (jQuery.inArray( urlteste, controllerGamerHelp) ) > 0 ){
                    pontuacao = pontuacao + pontosAjuda;
                }else{
                    pontuacao = pontuacao + ganhaPontos;
                }

                console.log(pontuacao);
                form.find(".thumbnail").addClass("accept");
            }else{
                form.find(".thumbnail").addClass("reject");
            }

        }, 'json');

        $(this).find("input").prop("disabled", true);
        $(this).find("button[type='submit']").prop("disabled", true);

        event.preventDefault();
    });


    $('body').on( "submit", ".formEnd", function(event){

        rank = localStorage.getItem("rank");
        var myRank = [$("#formEnd").find("input[name='pontucao']").val(), $("#formEnd").find("input[name='nome']").val(),$("#formEnd").find("input[name='email']").val()];
        rank.push(myRank);
        localStorage.setItem("rank", rank);


        console.log( localStorage.getItem("rank") );

        event.preventDefault();
    });


    /* Initialize */
    load();

});