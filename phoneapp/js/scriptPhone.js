//  region INITIALISATION DE LA PAGE

var criteresJson;

$.getJSON('criteres.json',
    function(file){
        criteresJson= file.data;
        createResultparametersJson();

});

var parametersJson= {};




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
                /*parametersJson.lang1={value:null, texte:null };
                parametersJson.lang2={value:null, texte:null };
                parametersJson.lang3={value:null, texte:null };*/
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
    $(criteresJson).each(
        function (e) {

            var name = this.name;
            if(parametersJson[name].value != null) {
                $('#listeCrit').append('<div id="' + name + '" class="buttonCrit">');
                $('#' + name).append('<button type="button" class="btn btn-primary">' + this.texte + ' :</button>');
                $('#' + name).append('<p class="recordCrit">' + parametersJson[this.name].texte + '</p>');
                $('#' + name).append('</div>');
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

    $('#greenLink').on("click", function(){
        //$('#newcritere').show();
    });
    $('#newcritere').change(function(e){
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
            //$('#search').toggle();
            //$('#windowNewCrit').toggle();
        }

        //$('#newcritere').hide();
    });
}

// FORMULE POUR ENREGISTRER UN CRITERE DANS FORMULAIRE (PAS DE BOUTON VALIDER)
function addCritere(critere){

    var eType;
    var eName;
    $(criteresJson).each(
        function (e) {
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
        var label;

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
            var concatLabel='';
            parametersJson[critere].value=[];
            for(var i = 0; i <3;i++){
                if(data[i] !=null){
                    parametersJson[critere].value.push({value : data[i]});
                }
            }
            parametersJson[critere].texte=findLabel(parametersJson[critere].value);


        }

        //$('#search').toggle();
        //$('#windowNewCrit').toggle();
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
            for (var i = 0; i < parameter.length; i++) {
                if (parameter[i].value != null) {
                    getData[this.name+i] = (parameter.value);
                }
            }
        }

        else if (parameter.value != null) {
            getData[this.name] = (parameter.value);
        }

    });

    console.log(parametersJson);
    console.log(getData);

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

    $('#resultList').html('');
    content.data.forEach(function(d){
        var divId = d.code+'Div';
        var linkId = d.code+'Link';

        $('#resultList').append('<a class="resultLink" id="'+linkId +'" href=""></a>');
        $('#'+linkId).append('<div class="result" id="'+ divId +'"></div>');
        $('#'+divId).append('<strong>'+d.name+'</strong>');

    })
    //$('#resultList').show();
}

//endregion


//region EVENT LISTENERS



$('#chercher').on("click", function(){getResults()});

//endregion

// region test valeurs

//endregion



