var completeDataSet;

d3.csv("dataset/dataset.csv", function(data){
    completeDataSet = data;
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
            var legendMedianPrice = 175000;
            var greenOffset = 80000;
            var redOffset = legendMedianPrice;
            var color;
            if(averageInteger<legendMedianPrice){
                color = d3.interpolate("#006837", "#FFFFBF")((averageInteger-greenOffset)/(legendMedianPrice-greenOffset));
            }else{
                if (averageInteger>450000){
                    averageInteger = 450000;
                }
                color = d3.interpolate("#FFFFBF", "#A50026")((averageInteger-redOffset)/(350000-redOffset));
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

function getStateArrayIndex(data){
    return stateArray.indexOf(data);
}

updateHeatMap(2000,1, 350, 350);

d3.select("#statesvg").on("click", deselectState);

