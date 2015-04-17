var completeDataSet;
$( document ).ready(function() {


$('#quarter').hide();
$('#playButtonDiv').hide();
$('#stopButtonDiv').hide();
$('#legendContainer').hide();
$('#loading').fadeOut(500);

setTimeout(function(){ 
    $('#amount') .prop('number', Math.floor(Math.random()*9999)).animateNumber({ number: 2000 , color:'black','font-size':'84px',easing:'easeInQuad'},1000);
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
          }
        });
        $( "#amount" ).val( $( "#slider-range-min" ).slider( "value" ));
    });


 }, 500);

// Closes the sidebar menu
$("#menu-close").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
});

// Opens the sidebar menu
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
});

// Scrolls to the selected menu item on the page
$(function() {
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {

            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });
});


    //Data CSV File

    d3.csv("dataset/dataset.csv", function(data){
        completeDataSet = data;
    });
});

var US=0,AK=1,AL=2,AR=3,AZ=4,CA=5,CO=6,CT=7,DC=8,DE=9,FL=10,GA=11,HI=12,IA=13,ID=14,IL=15,IN=16,KS=17,KY=18,LS=19,MA=20,MD=21,ME=22,MI=23,MN=24,MO=25,MS=26,MT=27,NC=28,ND=29,NE=30,NH=31,NJ=32,NM=33,NV=34,NY=35,OH=36,OK=37,OR=38,PA=39,RI=40,SC=41,SD=42,TN=43,TX=44,UT=45,VA=46,VT=47,WA=48,WI=49,WV=50,WY=51;


// Formula for Index: (state#) * 42 + year*4 + Quarter#


function getIndex(StateName, Year, Quarter){
    if(StateName>51 || StateName<0){
        alert("StateName Out of Bounds: "+ StateName)
        return 0;
    }
    if(Year > 2010 || Year <2000 ){
        alert("Year Out of Bounds: "+Year)
        return 0;
    }
    if(Quarter >4 || Quarter <0){
        alert("Quarter Out of Bounds: "+Quarter)
        return 0;
    }
    if(Year == 2010 && Quarter >2){
        alert("Data Out of Bounds: Year is 2010 and Quarter is higher than 2.")
        return 0;
    }

    return (StateName * 42 + (Year-2000)*4 + Quarter-1);

}
//draw heat map
var sampleData ={}; /* Sample random data. */   
var stateArray = ["US","AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","HI","IA","ID","IL","IN","KS","KY","LS","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VA","VT","WA","WI","WV","WY"];
var stateList;
function updateHeatMap(year, quarter, waitTimerDrawMap, waitTimerLoadData){
    //Update Heat Map Data
    setTimeout(function(){ 
        stateList = ["VA", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
        "ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH", 
        "MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT", 
        "CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN", 
        "WI", "MO", "AR", "OK", "KS", "LS", "HI"]
        .forEach(function(d){
            var average=completeDataSet[getIndex(getStateArrayIndex(d),year,quarter)].AveragePrice; 
            var median=completeDataSet[getIndex(getStateArrayIndex(d),year,quarter)].MedianPrice;
            var averageInteger = Number(average.replace(/[^0-9\.]+/g,""));
            //Middle Yellowish Color = #FFFFBF, Green #006837, and Red = #A50026
            //Highest Price is $600,000
            //Lowest Price is &80,000
            var averageColorRatio = averageInteger/600000;
            var color;
            if(averageInteger<150000){
                color = d3.interpolate("#006837", "#FFFFBF")((averageInteger-80000)/70000);
            }else{
                color = d3.interpolate("#FFFFBF", "#A50026")((averageInteger-150000)/450000);
            }


            sampleData[d]={average:average, median:median, color: color};        
        })
    }, waitTimerLoadData); 
    setTimeout(function(){
        //Remove Heat Map
        $("#statemap").empty();
        uStates.draw("#statemap", sampleData, tooltipHtml, selectState);
    },waitTimerDrawMap);
}

/*InfoVisGraph Code*/
function tooltipHtml(n, d){ /* function to create html content string in tooltip div. */
    return "<h4>"+n+"</h4><table>"+
        "<tr><td colspan=\"2\"><p style=\"font-size:7px;margin-top:5px;\">Single Family Home</p></td></tr>"+
        "<tr><td>Average</td><td>"+(d.average)+"</td></tr>"+
        "<tr><td>Median</td><td>"+(d.median)+"</td></tr>"+
        "</table>";
}
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
function getStateArrayIndex(data){
    return stateArray.indexOf(data);
}

updateHeatMap(2000,1, 350, 350);

d3.select("#statesvg").on("click", deselectState);

