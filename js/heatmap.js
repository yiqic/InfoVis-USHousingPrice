var completeDataSet;
$( document ).ready(function() {


$('#quarter').hide();
$('#playButtonDiv').hide();
$('#loading').fadeOut(3000);

setTimeout(function(){ 
    $('#amount') .prop('number', Math.floor(Math.random()*9999)).animateNumber({ number: 2000 , color:'black','font-size':'84px',easing:'easeInQuad'},1000);
    $('#quarter').show();
    $('#playButtonDiv').show();

    $(function() {
        $( "#slider-range-min" ).slider({
          range: "min",
          value: 2000,
          min: 2000,
          max: 2010,
          slide: function( event, ui ) {
            $( "#amount" ).animateNumber({ number: ui.value },0);
          }
        });
        $( "#amount" ).val( $( "#slider-range-min" ).slider( "value" ) );
    });


 }, 3000);

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
        // alert(data[getIndex(WY,2010,2)].State);
        // alert(data[getIndex(WY,2010,2)].YearQuarter);
        // alert(data[getIndex(WY,2010,2)].AveragePrice);
        // alert(data[getIndex(WY,2010,2)].MedianPrice);
        // data[row#].ColumnName


        /*
    completeDataSet = [];
    stateDataSet = [];  

    for(var a = data.length-1; a>=0; a--){
        $("#checkbox").prepend("<input type=\"checkbox\" name=\"country\" value=\""+a+"\" />"+data[a].Country+" <br />");
        completeDataSet.push({text: data[a].Country,  count: data[a].TotalMedals, goldCount: data[a].GoldMedals, 
          silverCount: data[a].Silver, bronzeCount: data[a].Bronze});
      }*/


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

/*InfoVisGraph Code*/
function tooltipHtml(n, d){ /* function to create html content string in tooltip div. */
    return "<h4>"+n+"</h4><table>"+
        "<tr><td colspan=\"2\"><p style=\"font-size:7px;margin-top:5px;\">Single Family Home</p></td></tr>"+
        "<tr><td>Average</td><td>"+(d.average)+"</td></tr>"+
        "<tr><td>Median</td><td>"+(d.median)+"</td></tr>"+
        "</table>";
}
function animateButton(){
    alert("Animate Button Pressed!");
}
function getStateArrayIndex(data){
    return stateArray.indexOf(data);
}

var sampleData ={}; /* Sample random data. */   

var stateArray = ["US","AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","HI","IA","ID","IL","IN","KS","KY","LS","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VA","VT","WA","WI","WV","WY"];

var stateList;
// var statemap = d3.select("#statesvg").append("g")
//     .
setTimeout(function(){ 
    stateList = ["VA", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
    "ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH", 
    "MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT", 
    "CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN", 
    "WI", "MO", "AR", "OK", "KS", "LS", "HI"]
    .forEach(function(d){
            var average=completeDataSet[getIndex(getStateArrayIndex(d),2009,2)].AveragePrice; 
            var median=completeDataSet[getIndex(getStateArrayIndex(d),2009,2)].MedianPrice;
            var averageInteger = Number(average.replace(/[^0-9\.]+/g,""));
            sampleData[d]={average:average, median:median, color:d3.interpolate("#CCFFCC", "#006600")(averageInteger/600000)};        
    })
}, 500); 
setTimeout(function(){
    //console.log(sampleData);  
    uStates.draw("#statemap", sampleData, tooltipHtml, selectState);
},700);

    /*.forEach(function(d){ 
        if(d!="US"){
            var average=completeDataSet[getIndex(stateListindexOf(d),2010,2)].AveragePrice, 
                median=completeDataSet[getIndex(stateList.indexOf(d),2010,2)].MedianPrice;
            sampleData[d]={average:average, median:median, 
                     color:d3.interpolate("#CCFFCC", "#006600")(average/100000)}; 
        }
    });*/

/* draw states on id #statesvg */   
// console.log(selectState);
d3.select("#statesvg").on("click", deselectState);

