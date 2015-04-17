function formatQuarter (d) {
  if (d.substring(4) == "Q1") {
    return d.substring(0,4);
  }
  else {
    return "";
  }
}

function addMarker (svg, chartWidth, chartHeight, x) {

    d3.csv("dataset/eventsquarter.csv", function(eventData) {
      
      for (i = 0; i < eventData.length; i++) {
          svg.append("line")
              .datum(eventData[i])
              .attr("class", "event-line")
              .attr("x1", function(d) { return x(d.times); })
              .attr("y1", 0)
              .attr("x2", function(d) { return x(d.times); })
              .attr("y2", chartHeight)
              .attr("stroke", "black")
              .attr("stroke-width", 3)
              .attr("opacity", 0.3)
              .on("mouseover", eventMouseOver)
              .on("mouseout", eventMouseOut);
      }
    });
    
    function eventMouseOver(d) {
      d3.select("#tooltip").transition().duration(200).style("opacity", .9);      
      
      d3.select("#tooltip").html("<strong style='color:red'>" + d.times + "</strong><br>" + d.events)  
        .style("left", (d3.event.pageX) + "px")     
        .style("top", (d3.event.pageY - 28) + "px");
    }
    
    function eventMouseOut() {
      d3.select("#tooltip").transition().duration(500).style("opacity", 0);      
    }
}

function deselectState () {
  d3.selectAll(".state-group")
    .style("display", "none");
  // d3.selectAll(".state-text")
  //   .style("display", "none");
}

function selectState (stateData) {
  // deselectState();
  d3.event.stopPropagation();
  d3.selectAll("." + stateData.id + "-group")
    .style("display", "inline");
}

var xIndex; 

function makeChart (data) {
  var svgWidth  = 750,
      svgHeight = 300,
      margin = { top: 20, right: 40, bottom: 20, left: 80 },
      chartWidth  = svgWidth  - margin.left - margin.right,
      chartHeight = svgHeight - margin.top  - margin.bottom;

  var x = d3.scale.ordinal().rangePoints([0, chartWidth]);

  var y = d3.scale.linear()
      .range([chartHeight, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(formatQuarter);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5)
      .tickSize(-chartWidth);

  var color = d3.scale.category20b();

  var line = d3.svg.line()
      .interpolate('basis')
      .x(function(d) { return x(d.YearQuarter); })
      .y(function(d) { return y(d.MedianPrice); });

  var svg = d3.select('#graph').append('svg')
    .attr('width',  svgWidth)
    .attr('height', svgHeight)
    .append('g')
    .attr('id', 'linegraph')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


  x.domain(d3.map(data, function(d) { return d.YearQuarter; }).keys());
  y.domain([0,d3.max(data, function(d) { return d.MedianPrice; })]);  

  var zoom = d3.behavior.zoom()
    .y(y)
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

  svg.call(zoom, svg);
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + chartHeight + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90) translate(10,0)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

  addMarker(svg, chartWidth, chartHeight, x);

  xIndex = x;
  svg.append("line")
    .attr("id", "time-line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", chartHeight)
    .attr("stroke", "#e6550d")
    .attr("stroke-width", 5);

  svg.append("path")
      .datum(data.filter(function(d) { return d.State == 'US'; } ))
      .attr("class", "line country-line")
      .attr("clip-path", "url(#clip)")
      .attr("d", line);

  svg.selectAll(".dot")
      .data(data.filter(function(d) { return d.State == 'US'; }))
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", function(d) { return x(d.YearQuarter); })
      .attr("cy", function(d) { return y(d.MedianPrice); })
      .attr("r", 5)
      .style("display", function(d) {
        if (d.YearQuarter == "2000Q1") {
          return "inline";
        }
        else {
          return "none";
        }
      });

  svg.append("text")
      .datum(data.filter(function(d) { 
        return d.State == 'US' && d.YearQuarter == '2010Q2'; 
      } ))
      .attr("transform", function(d) { 
        return "translate(" + (x(d[0].YearQuarter)+5) + "," + y(d[0].MedianPrice) + ")"; 
      })
      .attr("class", "us-text")
      .text("US");

  var states = d3.map(data, function(d) { return d.State; }).keys();

  states.forEach(function (state, i) {
    var stateGroup = svg.append("g")
      .datum(data.filter(function(d) { return d.State == state; }))
      .attr("class", "state-group " + state + "-group")
      .style("display", "none");

    stateGroup.append("path")
        .datum(data.filter(function(d) { return d.State == state; }))
        .attr("class", "line state-line " + state + "-line")
        .style("stroke", color(i % 20))
        .attr("clip-path", "url(#clip)")
        .attr("d", line)
        .on("mouseover", lineMouseOver)
        .on("mouseout", lineMouseOut);

    stateGroup.selectAll(".dot")
        .data(data.filter(function(d) { return d.State == state; }))
        .enter()
        .append("circle")
        .attr("class", "dot")
        .style("fill", color(i % 20))
        .attr("cx", function(d) { return x(d.YearQuarter); })
        .attr("cy", function(d) { return y(d.MedianPrice); })
        .attr("r", 5)
        .style("display", function(d) {
          if (d.YearQuarter == "2000Q1") {
            return "inline";
          }
          else {
            return "none";
          }
        });

    stateGroup.append("text")
        .datum(data.filter(function(d) { 
          return d.State == state && d.YearQuarter == '2010Q2'; 
        } ))
        .attr("transform", function(d) { 
          return "translate(" + (x(d[0].YearQuarter)+5) + "," + y(d[0].MedianPrice) + ")"; 
        })
        .attr("class", "state-text " + state + "-line")
        .text(state);

  })

  svg.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", chartWidth)
    .attr("height", chartHeight);


  function lineMouseOver(da) {
    d3.select("." + da[0].State + "-line").style("stroke-width", 5);
    d3.selectAll(".state")
      .filter(function(d) { return d.id == da[0].State; })
      .style("opacity", 0.5);
  }

  function lineMouseOut() {
    d3.selectAll(".state-line").style("stroke-width", 2);
    d3.selectAll(".state").style("opacity", 1);
  }

  function zoomed() {
    // svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);
    svg.selectAll('path.line').attr('d', line); 
    svg.selectAll('.dot').attr('cy', function(d) { return y(d.MedianPrice); });
    svg.selectAll('.us-text').attr("transform", function(d) { 
      return "translate(" + (x(d[0].YearQuarter)+5) + "," + y(d[0].MedianPrice) + ")"; 
    });
    svg.selectAll('.state-text').attr("transform", function(d) { 
      return "translate(" + (x(d[0].YearQuarter)+5) + "," + y(d[0].MedianPrice) + ")"; 
    });
  }

  function reset() {
    d3.transition().duration(750).tween("zoom", function() {
          iy = d3.interpolate(y.domain(), [0,d3.max(data, function(d) { return d.MedianPrice; })]);
      return function(t) {
        zoom.y(y.domain(iy(t)));
        zoomed();
      };
    });
  }

  d3.select("#resetlinegraph").on("click", reset);

}

var parseDate = d3.time.format('%Y-%m-%d').parse;

function updateLineTime(year, quarter) {
  var timeString = "" + year + "Q" + quarter;
  d3.select("#time-line")
    .attr("x1", xIndex(timeString))
    .attr("x2", xIndex(timeString));
  d3.selectAll(".dot")
    .style("display", function(d) {
      if (d.YearQuarter == timeString) {
        return "inline";
      }
      else {
        return "none";
      }
    });
}

d3.csv('dataset/dataset.csv', function (error, rawData) {
  if (error) {
    console.error(error);
    return;
  }

  var data = rawData.map(function (d) {
    return {
      State: d.State,
      YearQuarter: d.YearQuarter,
      AveragePrice: Number(d.AveragePrice.substring(1).replace(",", "")),
      MedianPrice: Number(d.MedianPrice.substring(1).replace(",", "")),
    };
  });

  makeChart(data);
});
