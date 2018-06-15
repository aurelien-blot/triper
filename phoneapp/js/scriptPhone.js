//  region INITIALISATION DE LA PAGE

var criteresJson;

$.getJSON('criteres.json',
    function(file){
        criteresJson
            = file.data;
        createResultparametersJson();

});

var parametersJson= {};
$('#windowNewCrit').hide();
$('#resultList').hide();
$('#oneResult').hide();
$('#subscribeDiv').hide();



// J'INITIALISE LE TABLEAU parametersJson DES VALEURS DES CRITERES
function createResultparametersJson(){
    var i=0;
    $(criteresJson).each(
        function(){
            if(this.name=='dist'){
                parametersJson[this.name]={value:this.option[0].value, texte:this.option[0].texte };

            }
            else if(this.name=='lang'){
                parametersJson[this.name]={value:null, texte:null };
            }
            else{
                parametersJson[this.name]={value:null, texte:null };
            }
            i++;
        });
    afficherCrit();
    selectNewCrit();
}


// FUNCTION QUI PERMET DE SELECT LE CRITERE A AJOUTER :
function afficherChoixNouveauCritere(){
    $('#greenLink').show();
    $('#criteres').html('');
    $('#criteres').append('<select name="critere" id="newcritere" /></select>');
    $('#newcritere').append('<option value="">Ajouter un critère :</option>');

    $(criteresJson).each(
        function(){
            if(parametersJson[this.name].value ==null) {
                $('select').append('<option  value="' + this.name + '">' + this.texte + '</option>');
            }
        })
}

// J AFFICHE TOUS LES CRITERES QUI ONT DEJA UNE VALEUR REMPLIE
function afficherCrit() {


    $('#listeCrit').html('');
    $(criteresJson).each(
        function () {

            var name = this.name;
            var texte = this.texte;
            if(parametersJson[name].value != null) {
                $('#listeCrit').append('<div id="' + name + '" ></div>');
                $('#' +  name).append('<div id="' + name + 'Crit" class="buttonCrit"></div>');
                $('#' + name+ 'Crit').append('<button type="button" class="btn btn-primary critButton" id="'+name+'">' + this.texte + ' :</button>');
                $('#' + name+ 'Crit').append('<p class="recordCrit">' + parametersJson[this.name].texte + '</p>');
                if(name!='dist'){
                    $('#' +  name).append('<div id="' + name + 'Moins" class="delCrit">');
                    $('#' + name + 'Moins').append('<img id="'+name+'RedMoins" class="redMoins" src="img/redMoins.png"/>');
                    $('#' + name+'RedMoins').on("click", function(){
                        parametersJson[name].value=null;
                        $('#' +  name).html('');
                        $('select').append('<option  value="' + name + '">' + texte + '</option>');


                    });
                }



                $('#'+name+ 'Crit').on('click', function () {
                    addCritere(name);
                    $('#search').hide();
                    $('#windowNewCrit').show();
                });
            }


            });

    //$('.buttonCrit').hide();
    //$('#dist').show();

    afficherChoixNouveauCritere();
}

// JE CACHE LA DIV DE LA PARTIE CRITERES
//$('#windowNewCrit').hide();

// JE CACHE LA DIV DES RESULTATS
//$('#resultList').hide();

// endregion

//region GESTION DES CRITERES

// FONCTION POUR AJOUTER UN  NOUVEAU CRITERE EN CLIQUANT SUR PLUS VERT PUIS SELECT


function selectNewCrit(){


    $('#newcritere').hide();

    $('#greenLink').on("click", function(){
        $('#greenLink').hide();
        $('#newcritere').show();

    });
    $('#newcritere').change(function(e){
        $('#greenLink').show();
        function crit(){
            if($('#newcritere option:selected').val() != ''){
                return $('#newcritere option:selected').val();

            }
            else{
                return null;
            }
        }
        $('#windowNewCrit').html('');
        if(crit()!=null){
            addCritere(crit());
            $('#search').hide();
            $('#windowNewCrit').show();
        }

        //$('#newcritere').hide();
    });
}

// FORMULE POUR ENREGISTRER UN CRITERE DANS FORMULAIRE (PAS DE BOUTON VALIDER)
function addCritere(critere){

    var eType;
    var eName;
    $(criteresJson).each(
        function () {
            if (this.name == critere) {

                var typeInput = this.type;
                var nameInput = this.name;
                $('#windowNewCrit').append('<form id="form"</form>');
                $('#form').append('<label for="' + this.name + '">' + this.label + '</label>');

                if (this.type == 'text') {
                    $('#form').append('<input type="' + this.type + '" name="' + this.name + '" \>');

                }

                else if (this.type == 'radio' || this.type == 'checkbox') {
                    $(this.option).each(
                        function () {
                            $('#form').append('<input id ="' + this.id + '" type="' + typeInput + '" name="' + nameInput + '" value="' + this.value + '"\>');
                            $('#form').append(this.texte);
                        }
                    );

                }
                ;
                eType = typeInput;
                eName = nameInput;
            }
        })

    $('#form').append('<button type="button" class="btn btn-success" ' +'id="valider">OK</button>');
    $('#valider').on("click", function(){
        var value;

        if(eType == 'text'){
            data=$('#form input');
        }
        else if(eType == 'radio'){
            data=$('#form input[name='+eName+']:checked');
        }
        else if(eType == 'checkbox'){
            data=[];
            $("input[type='checkbox'][name='lang']:checked").each(function () {
                if(this!=null){
                    data.push(this.value);
                }

            })
        }

        function findLabel(Xvalue){
            var result;

            if(eName == 'temp'){
                result=(data.val()+'°C');

            }
            else{
                $(criteresJson).each(function () {

                    if(this.type=='radio'){

                        if(this.name == eName){
                            $(this.option).each(function () {

                                    if(this.value == Xvalue.val()){
                                        result = this.texte;
                                    }
                            })
                        }
                    }
                    else if(this.type=='checkbox'){
                        if(this.name == eName) {
                            result ='';

                            $(this.option).each(function (e) {

                                for(var i=0; i< Xvalue.length; i++) {
                                    if (this.value == Xvalue[i].value) {
                                        result += this.texte+', ';
                                    }
                                }
                            });
                            result=result.substring(0, result.length-2);
                        }

                    }
                });
            }
            return result;
        }


        if(critere != 'lang'){
            parametersJson[critere].value = data.val();
            parametersJson[critere].texte = findLabel(data);
        }
        else{
            parametersJson[critere].value=[];
            for(var i = 0; i <3;i++){
                if(data[i] !=null){
                    parametersJson[critere].value.push({value : data[i]});
                }
            }
            parametersJson[critere].texte=findLabel(parametersJson[critere].value);


        }

        $('#search').show();
        $('#windowNewCrit').hide();

        $('#windowNewCrit').html('');
        $('#listeCrit').html('');
        afficherCrit();
        selectNewCrit();

        });
}

//endregion

// region PARTIE RESULTATS DE LA REQUETE


// FONCTION QUI FORME LA REQUETE DES GETS
function createGetRequestData(){

    var getData={};

    $(criteresJson).each(function(e) {
        var parameter = parametersJson[this.name];

        if (this.name == 'lang') {

            if(parameter.value !=null){

                for (var i = 0; i < parameter.value.length; i++) {
                    if (parameter.value[i].value != null) {
                        getData['lang'+(i+1)] = (parameter.value[i].value);

                    }
                }
            }

        }

        else if (parameter.value != null) {
            getData[this.name] = (parameter.value);
        }

    });

    return getData;
}

// ENVOI DE LA REQUETE A  L API
function getResults(){
    $.get(
        'http://localhost/triper/triper/public/search/api/v1',
        createGetRequestData(),
        showResults,
        'json'
    );

}



// RECEPTION ET AFFICHAGE DES RESULTATS
function showResults(content){
    $('#resultList').show();
    $('#resultList').html('');
    if(content.data.length !=0){
        content.data.forEach(function(d){
            var divId = d.code+'Div';
            var linkId = d.code+'Link';

            //$('#resultList').append('<a class="resultLink" id="'+linkId +'" href="#'+d.code +'"></a>');
            //$('#'+linkId).append('<div class="result" id="'+ divId +'"></div>');
            $('#resultList').append('<div class="result" id="'+ divId +'"></div>');
            $('#'+divId).append('<strong>'+d.name+'</strong>');
            $('#'+divId).on("click", function(){
                showOneResult(d.id)
            });

        })
    }
    else{
        $('#resultList').append('<div class="result" id="noResult"></div>');
        $('#noResult').append('<strong>Aucun résultat trouvé</strong>');
    }


}

function showOneResult(dest){

    /* IMPORTATION DE LA PHOTO GOOGLE
        var placeCode;
        $.get(
                "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+dest.capitale+"&key=AIzaSyB-gTaZboIBJXboJdE79_-tPHVXMz74RM8",
                function(data){
                   placeCode = data.results[0].photos[0].photo_reference;
                   console.log(data.results[0].formatted_address);
                },
                'json'
        );
        */
    $('#resultList').hide();
    $('#search').hide();
    $.get(
        'http://localhost/triper/triper/public/findOne/api/v1',
        {'dest' : dest},
        function(data){
            var result = data.data;

            $('#oneResult').append('<h2>'+result.name+'</h2>');
            $('#oneResult').append('<img id="pictureCapital" src="http://www.countryflags.io/'+result.iso2+'/flat/64.png" </img>');

            $('#oneResult').append('<button id="backToSearch" type="button" class="btn btn-success">Retour aux résultats</button>');
            $('#backToSearch').on("click", function(){
                $('#oneResult').html('');
                $('#oneResult').hide();
                $('#resultList').show();
                $('#search').show();
            })
            $('#oneResult').show();
        },
        'json'
    );

    sendURL(dest, 1);

}


function sendURL(dest, userId){
    $.get(
        'http://localhost/triper/triper/public/url/api/v1',
        {
            'destId' : dest,
            'userId':userId
        },
        'json'
    );
}
//endregion

//region USER
var connected = false;
var userJson;

function initLoginDiv(){
    $('#loginDiv').html('');
    $('#loginDiv').append('<button class="btn btn-secondary" type="button" id="loginBtn">Se connecter</button>');
    $('#loginDiv').append('<button class="btn btn-secondary" type="button" id="subscribeBtn">Créer un compte</button>');
    $('#loginDiv').toggle();
}

function showFavorites(){

}

function showHisto(){
    $.get(
        'http://localhost/triper/triper/public/histo/api/v1',
        {'userId': 1},
        function(data){

            $(data.data).each(function () {
                console.log(this);
            })
        },
        'json'
    );
}
function initConnected(){
    $('#loginDiv').html('');
    $('#loginDiv').append('<img id="starNavIcon" class="navIcon" src="img/star.png"/>');
    $('#loginDiv').append('<img id="histoNavIcon" class="navIcon" src="img/histo1.png"/>');
    $('#loginDiv').append('<img id="logoutNavIcon" class="navIcon" src="img/logout2.png"/>');

    $('#logoutNavIcon').on("click", function () {

        connected = false;
        userJson=null;
        showUserNav();
        $('#userDiv').toggle();

    });
    $('#starNavIcon').on("click", function () {
        showFavorites();

    });
    $('#histoNavIcon').on("click", function () {
        showHisto();

    });

};

function loginAPIget(log, pwd){

    $.get('http://localhost/triper/triper/public/login/api/v1',
        { login : log, pwd:pwd},
        function (data) {
            if(data.status != 'OK'){

            }
            else{
                userJson =  data;
                connected =true;
                initConnected();
            }

        });
};

function createUserAPIget(pseudo,prenom, nom, mail,pwd){

    $.get('http://localhost/triper/triper/public/create/api/v1',
        {pseudo:pseudo,  prenom:prenom, nom : nom,mail:mail, pwd:pwd},
        function (data) {
            if(data.status != 'OK'){


            }
            else{
                connected =true;

                $('#subscribeDiv').hide();
                initConnected();
                $('#search').show();
                //MESSAGE DE CONFIRMATION
            }

        });
};

function showUserNav(){
    if(connected){
        $('#loggedDiv').toggle();
    }
    else{

        initLoginDiv();
        $('#loginBtn').on("click", function () {
            $('#loginDiv').html('');
            $('#loginDiv').append('<input id="nameLoginForm" type="text" class="loginForm" placeholder="Votre nom"/>');
            $('#loginDiv').append('<input id="pwdLoginForm" type="password" class="loginForm" placeholder="Votre mot de passe"/>');
            $('#loginDiv').append('<button class="btn btn-secondary loginForm" type="button" id="validLogin">Se connecter</button>');
            $('#validLogin').on("click", function () {
                loginAPIget($('#nameLoginForm').val(), $('#pwdLoginForm').val());
            })
        })
        $('#subscribeBtn').on("click", function () {
            $('#userDiv').hide();
            $('.choice').hide();
            $('#subscribeDiv').show();
            $('#subscribeDiv').append('<h2>Création du compte :</h2>');
            $('#subscribeDiv').append('<input id="pseudoSubscribeForm" type="text" class="loginForm" placeholder="Votre pseudo"/>');
            $('#subscribeDiv').append('<input id="fistnameSubscribeForm" type="text" class="loginForm" placeholder="Votre prénom"/>');
            $('#subscribeDiv').append('<input id="nameSubscribeForm" type="text" class="loginForm" placeholder="Votre nom"/>');
            $('#subscribeDiv').append('<input id="mailSubscribeForm" type="text" class="loginForm" placeholder="Votre mail"/>');
            $('#subscribeDiv').append('<input id="pwdSubscribeForm" type="password" class="loginForm" placeholder="Votre mot de passe"/>');
            $('#subscribeDiv').append('<input id="pwd2SubscribeForm" type="password" class="loginForm" placeholder="Confirmation du mot de passe"/>');


            $('#subscribeDiv').append('<button class="btn btn-secondary loginForm" type="button" id="validSubscribe">Se connecter</button>');
            $('#subscribeDiv').append('<img id="logoutSubscribeIcon" src="img/logout2.png"/>');

            $('#validSubscribe').on("click", function () {
                createUserAPIget($('#pseudoSubscribeForm').val(),$('#fistnameSubscribeForm').val(),$('#nameSubscribeForm').val(),$('#mailSubscribeForm').val(),$('#pwdSubscribeForm').val());
            })
        })
    }
}

$('#logoUser').on("click", function () {
    $('#userDiv').toggle();
    showUserNav();

});

//endregion
//region EVENT LISTENERS


$('#chercher').on("click", function(){getResults()});






//endregion

// region test valeurs

//endregion



