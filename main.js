var score = 0;

$(document).ready(function() {

    var cookie = $.cookie("cookieok");
    if(cookie == undefined){
        $("<div class='cookiewarning'>Diese Seite benutz Cookies :P Sonst gibts kein Highscore (; </br><button onclick=cookiehw();>Ok</button></div>").appendTo("body");
    }

    var fields = new Array();
    if($.cookie("pers_highscore") != undefined || $.cookie("pers_highscore") != null){
        $(".highscore").html('Highscore </br>'+$.cookie("pers_highscore"));
    }

    for (let x=0; x<4;x++){
        fields[x] = [];
        for(let y=0; y<4;y++){
            fields[x][y] = {"x":x+1,"y":y+1,number:0,blocked:false};
        }
    }

    for (let i =0; i<2; i++){
        var x = Math.round(Math.random() * (3 - 0)) + 0;
        var y = Math.round(Math.random() * (3 - 0)) + 0;


        if (fields[x][y].number == 0){
            fields[x][y].number = 2;
        }
        else{
            i--;
        }

    }

    cardsdisplay(fields);


    $(document).keydown(function(event) {


        if (event.keyCode == 38) {  //up
            move(fields,1,0,'x<4','y<4','x++','y++','x','x-i-1','y','x-i','y');
        }
        if (event.keyCode == 40) {  //down
            move(fields,2,0,'x>=0','y<4','x--','y++','3-x','x+i+1','y','x+i','y');
        }
        if (event.keyCode == 37) {  //left
            move(fields,0,1,'x<4','y<4','x++','y++','y','x','y-i-1','x','y-i');
        }
        if (event.keyCode == 39) {  //right
            move(fields,0,3,'x<4','y>=0','x++','y--','3-y','x','y+i+1','x','y+i');
        }
        
    });


});


function move(fields,bx,by,ex,ey,calcx,calcy,direction,calcnewx,calcnewy,calcoldx,calcoldy){

    var move = false;
    for (let x=0; x<4;x++){for(let y=0; y<4;y++){fields[x][y].blocked =false;}}

    for (let x=bx; eval(ex);eval(calcx)){        //vertikal    Schleife
        for(let y=by; eval(ey);eval(calcy)){     //horizontal  Schleife    
            
            if (fields[x][y].number !== 0){  // wenn das Feld nicht 0
               

                for(let i=0; i<eval(direction);i++){        // Anzahl der Felder nach oben Schleife

                    if (fields[eval(calcnewx)][eval(calcnewy)].number == 0){      //wenn Feld davor 0

                            fields[eval(calcnewx)][eval(calcnewy)].number = fields[eval(calcoldx)][eval(calcoldy)].number;    //verschiebe in Feld vorher
                            fields[eval(calcoldx)][eval(calcoldy)].number = 0;                                                //ersetze Feld durch 0   
                            move = true;       
                    }
                    else if (fields[eval(calcoldx)][eval(calcoldy)].blocked == false && fields[eval(calcnewx)][eval(calcnewy)].number == fields[eval(calcoldx)][eval(calcoldy)].number){      //wenn Felder gleich

                        fields[eval(calcnewx)][eval(calcnewy)].number = fields[eval(calcoldx)][eval(calcoldy)].number + fields[eval(calcnewx)][eval(calcnewy)].number;    //adiere Felder
                        score+=fields[eval(calcnewx)][eval(calcnewy)].number;
                        fields[eval(calcnewx)][eval(calcnewy)].blocked = true;                                              //für Addieren diese Runde sperren
                        fields[eval(calcoldx)][eval(calcoldy)].number = 0;                                                //ersetze altes Feld durch 0      
                        if( fields[eval(calcnewx)][eval(calcnewy)].number == 2048){

                            $(".fieldcon").append("<div class='win'>Sie haben gewonnen</div>");
                            $(document).off('keydown');
                        }
                        move = true;    
                    }
                    else{

                        i=eval(direction);
                    }


                }
            }
        }
    }

    randomnb(fields, move);

}


function cardsdisplay(fields){

    /* $(".numbers").hide("slide", { direction: "right" }, 100,function(){ $(this).remove();})
    $(".numbers").effect( "drop").remove(); */
    $(".numbers").remove();

    $(".score").html('Score </br>'+score);
    for (let x=0; x<4;x++){
        
        for(let y=0; y<4;y++){
            
            if (fields[x][y].number != 0){

                var acfl = $(".bgfield>div:eq("+x+")>div:eq("+y+")");
                acfl.append("<div class='numbers nb_"+fields[x][y].number+"'>"+fields[x][y].number+"</div>");
                

            }  
        }
    }
}

function randomnb(fields, move){

    if (move == true){
        var x = Math.round(Math.random() * (3 - 0)) + 0;
        var y = Math.round(Math.random() * (3 - 0)) + 0;

        if (fields[x][y].number == 0){
            var zl = Math.round(Math.random() * (4 - 2)) + 2;
            while(zl == 3){
                zl = Math.round(Math.random() * (4 - 2)) + 2;
            }
            fields[x][y].number = zl;
            cardsdisplay(fields);
        }
        else{
            randomnb(fields, true);
        }
        
    }
    else{
        for (let x=0; x<4;x++){       
            for(let y=0; y<4;y++){
                if (fields[x][y].number == 0 || x>0 && fields[x][y].number == fields[x-1][y].number || x<3 && fields[x][y].number == fields[x+1][y].number ||y>0 && fields[x][y].number == fields[x][y-1].number || y<3 && fields[x][y].number == fields[x][y+1].number){   
                  return;  
                }     
            }
        }
        if($.cookie("pers_highscore") == undefined || $.cookie("pers_highscore") == null){
            $.cookie("pers_highscore", score);
            console.log($.cookie("pers_highscore"));
        }
        else if($.cookie("pers_highscore") < score){
            $.cookie("pers_highscore", score); 
        }

        $(".fieldcon").append("<div class='lose'>Sie haben verloren.</div>");
        $(document).off('keydown');
    }


}


function cookiehw(){

    $.cookie("cookieok", true); 
    $(".cookiewarning").remove();

}