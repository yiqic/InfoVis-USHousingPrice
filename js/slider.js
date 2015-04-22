
$( document ).ready(function() {

    $('#quarter').hide();
    $('#playButtonDiv').hide();
    $('#stopButtonDiv').hide();
    $('#legendContainer').hide();
    $('#loading').fadeOut(500);

    setTimeout(function(){ 
        $('#amount').prop('number', Math.floor(Math.random()*9999))
            .animateNumber({ number: 2000 , color:'black','font-size':'84px',easing:'easeInQuad'},1000);
        $('#quarter').show();
        $('#playButtonDiv').show();
        $('#stopButtonDiv').show();
        $('#legendContainer').show();

        $(function() {
            $( "#slider-range-min" ).slider({
              range: "min",
              value: 2000.00,
              min: 2000.00,
              max: 2010.49,
              step:0.25,
              slide: function( event, ui ) {

                //Updates Slider Values
                var year = Math.floor(ui.value);
                $( "#amount" ).animateNumber({ number: year },0);
                var quarter = Math.floor(((ui.value*100) - Math.floor(ui.value)*100)/25+1);  //Value from 1-4 representing which quarter
                document.getElementById("quarter").innerHTML = "Q"+quarter;

                animationYear = year;
                animationQuarter = quarter;

                updateHeatMap(year, quarter, 20, 20);
                updateLineTime(year, quarter);
              }
            });
            $( "#amount" ).val( $( "#slider-range-min" ).slider( "value" ));
        });


     }, 500);

    
});



var animationRunning = 0;
var myInterval;
var animationYear;
var animationQuarter;
function animateButton(){
    if(animationRunning==1){
        clearInterval(myInterval);
        animationYear = 2000;
        animationQuarter = 1;
    }else{
        if(animationYear > 2010 && animationQuarter>2){
            animationYear = 2000;
            animationQuarter = 1;
        }
        if(!animationYear || !animationQuarter){
            animationYear = 2000;
            animationQuarter = 1;
        }
        animationRunning = 1;
    }

    myInterval = setInterval(function(){ 
        /*Update Slider Info*/
        $( "#amount" ).animateNumber({ number: animationYear },0);
        $("#slider-range-min").slider('value',animationYear+animationQuarter*0.25);
        document.getElementById("quarter").innerHTML = "Q"+animationQuarter;
        //console.log($("#slider").slider('value'));

        /*Update Heat Map*/
        //console.log("Year: "+ animationYear + "Quarter: "+animationQuarter);
        updateHeatMap(animationYear,animationQuarter,10,10);
        updateLineTime(animationYear,animationQuarter);
        animationQuarter++;
        if(animationQuarter > 4){
            //console.log("Increment Year and reset animationQuarter.");
            animationQuarter = 1;
            animationYear++;
        }
        if(animationYear==2010 && animationQuarter ==3){
            //console.log("Interval Cleared");
            animationRunning = 0;
            animationYear = null;
            animationQuarter = null;
            clearInterval(myInterval);
        }
    }, 200);
}
function stopAnimationButton(){
    animationRunning = 0;
    clearInterval(myInterval);
}