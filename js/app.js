function addAxesAndLegend (svg, xAxis, yAxis, margin, chartWidth, chartHeight) {
  var legendWidth  = 200,
      legendHeight = 100;

  // clipping to make sure nothing appears behind legend
  svg.append('clipPath')
    .attr('id', 'axes-clip')
    .append('polygon')
      .attr('points', (-margin.left)                 + ',' + (-margin.top)                 + ' ' +
                      (chartWidth - legendWidth - 1) + ',' + (-margin.top)                 + ' ' +
                      (chartWidth - legendWidth - 1) + ',' + legendHeight                  + ' ' +
                      (chartWidth + margin.right)    + ',' + legendHeight                  + ' ' +
                      (chartWidth + margin.right)    + ',' + (chartHeight + margin.bottom) + ' ' +
                      (-margin.left)                 + ',' + (chartHeight + margin.bottom));

  var axes = svg.append('g')
    .attr('clip-path', 'url(#axes-clip)');

  axes.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + chartHeight + ')')
    .call(xAxis);

  axes.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Time (s)');

  var legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(' + (chartWidth - legendWidth) + ', 0)');

  legend.append('rect')
    .attr('class', 'legend-bg')
    .attr('width',  legendWidth)
    .attr('height', legendHeight);

  legend.append('rect')
    .attr('class', 'outer')
    .attr('width',  75)
    .attr('height', 20)
    .attr('x', 10)
    .attr('y', 10);

  legend.append('text')
    .attr('x', 115)
    .attr('y', 25)
    .text('5% - 95%');

  legend.append('rect')
    .attr('class', 'inner')
    .attr('width',  75)
    .attr('height', 20)
    .attr('x', 10)
    .attr('y', 40);

  legend.append('text')
    .attr('x', 115)
    .attr('y', 55)
    .text('25% - 75%');

  legend.append('path')
    .attr('class', 'median-line')
    .attr('d', 'M10,80L85,80');

  legend.append('text')
    .attr('x', 115)
    .attr('y', 85)
    .text('Median');
}

// function drawPaths (svg, data, x, y) {
//   var upperOuterArea = d3.svg.area()
//     .interpolate('basis')
//     .x (function (d) { return x(d.date) || 1; })
//     .y0(function (d) { return y(d.pct95); })
//     .y1(function (d) { return y(d.pct75); });

//   var upperInnerArea = d3.svg.area()
//     .interpolate('basis')
//     .x (function (d) { return x(d.date) || 1; })
//     .y0(function (d) { return y(d.pct75); })
//     .y1(function (d) { return y(d.pct50); });

//   var medianLine = d3.svg.line()
//     .interpolate('basis')
//     .x(function (d) { return x(d.date); })
//     .y(function (d) { return y(d.pct50); });

//   var lowerInnerArea = d3.svg.area()
//     .interpolate('basis')
//     .x (function (d) { return x(d.date) || 1; })
//     .y0(function (d) { return y(d.pct50); })
//     .y1(function (d) { return y(d.pct25); });

//   var lowerOuterArea = d3.svg.area()
//     .interpolate('basis')
//     .x (function (d) { return x(d.date) || 1; })
//     .y0(function (d) { return y(d.pct25); })
//     .y1(function (d) { return y(d.pct05); });

//   svg.datum(data);

//   svg.append('path')
//     .attr('class', 'area upper outer')
//     .attr('d', upperOuterArea)
//     .attr('clip-path', 'url(#rect-clip)');

//   svg.append('path')
//     .attr('class', 'area lower outer')
//     .attr('d', lowerOuterArea)
//     .attr('clip-path', 'url(#rect-clip)');

//   svg.append('path')
//     .attr('class', 'area upper inner')
//     .attr('d', upperInnerArea)
//     .attr('clip-path', 'url(#rect-clip)');

//   svg.append('path')
//     .attr('class', 'area lower inner')
//     .attr('d', lowerInnerArea)
//     .attr('clip-path', 'url(#rect-clip)');

//   svg.append('path')
//     .attr('class', 'median-line')
//     .attr('d', medianLine)
//     .attr('clip-path', 'url(#rect-clip)');
// }

// function addMarker (marker, svg, chartHeight, x) {
//   var radius = 32,
//       xPos = x(marker.date) - radius - 3,
//       yPosStart = chartHeight - radius - 3,
//       yPosEnd = (marker.type === 'Client' ? 80 : 160) + radius - 3;

//   var markerG = svg.append('g')
//     .attr('class', 'marker '+marker.type.toLowerCase())
//     .attr('transform', 'translate(' + xPos + ', ' + yPosStart + ')')
//     .attr('opacity', 0);

//   markerG.transition()
//     .duration(1000)
//     .attr('transform', 'translate(' + xPos + ', ' + yPosEnd + ')')
//     .attr('opacity', 1);

//   markerG.append('path')
//     .attr('d', 'M' + radius + ',' + (chartHeight-yPosStart) + 'L' + radius + ',' + (chartHeight-yPosStart))
//     .transition()
//       .duration(1000)
//       .attr('d', 'M' + radius + ',' + (chartHeight-yPosEnd) + 'L' + radius + ',' + (radius*2));

//   markerG.append('circle')
//     .attr('class', 'marker-bg')
//     .attr('cx', radius)
//     .attr('cy', radius)
//     .attr('r', radius);

//     //Hides Some extraneous data -Cheng Ding
//   /*markerG.append('text')
//     .attr('x', radius)
//     .attr('y', radius*0.9)
//     .text(marker.type);

//   markerG.append('text')
//     .attr('x', radius)
//     .attr('y', radius*1.5)
//     .text(marker.version);*/

//   markerG.append('text')
//     .attr('x', radius)
//     .attr('y', radius*1.2)
//     .text(marker.version);
// }

// function startTransitions (svg, chartWidth, chartHeight, rectClip, markers, x) {
//   rectClip.transition()
//     .duration(1000*markers.length)
//     .attr('width', chartWidth);

//   markers.forEach(function (marker, i) {
//     setTimeout(function () {
//       addMarker(marker, svg, chartHeight, x);
//     }, 1000 + 500*i);
//   });
// }

// function makeChart (data) {
//   var svgWidth  = 1200,
//       svgHeight = 300,
//       margin = { top: 20, right: 20, bottom: 40, left: 40 },
//       chartWidth  = svgWidth  - margin.left - margin.right,
//       chartHeight = svgHeight - margin.top  - margin.bottom;

//   var x = d3.time.scale().range([0, chartWidth])
//             .domain(d3.extent(data, function (d) { return d.date; })),
//       y = d3.scale.linear().range([chartHeight, 0])
//             .domain([0, d3.max(data, function (d) { return d.pct95; })]);

//   var xAxis = d3.svg.axis().scale(x).orient('bottom')
//                 .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
//       yAxis = d3.svg.axis().scale(y).orient('left')
//                 .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10);

//   var svg = d3.select('#display').append('svg')
//     .attr('width',  svgWidth)
//     .attr('height', svgHeight)
//     .append('g')
//       .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//   // clipping to start chart hidden and slide it in later
//   var rectClip = svg.append('clipPath')
//     .attr('id', 'rect-clip')
//     .append('rect')
//       .attr('width', 0)
//       .attr('height', chartHeight);

//   addAxesAndLegend(svg, xAxis, yAxis, margin, chartWidth, chartHeight);
//   drawPaths(svg, data, x, y);
//   startTransitions(svg, chartWidth, chartHeight, rectClip, markers, x);
// }

function formatQuarter (d) {
  if (d.substring(4) == "Q1") {
    return d.substring(0,4);
  }
  else {
    return "";
  }
}

function addMarker (svg, chartWidth, svgHeight, x) {

    d3.csv("dataset/eventsquarter.csv",function(data) {
      console.log(data.length)
      for (i = 0; i < data.length; i++) {
          // var index = (  ((parseInt((data[i].times).substring(0,4)) - 2000) * 3 + (parseInt((data[i].times).substring(5,6))) * 1.15 )) 
          var index = x(data[i].times);
          var line = svg.append("line")
          line.attr("x1", index)
              .attr("y1", svgHeight - 40)
              .attr("x2", index)
              .attr("y2", 120)
              .attr("stroke", "black")
              .attr("stroke-width", 2)
              .attr("opacity", 0.4);

          if (data[i].importance == 1) {
              var strArr = (data[i].events).split(" ")
              var strOne = strArr[0]
              var strTwo = strArr[1]
              svg.append("circle")
                 .attr("cx", index)
                 .attr("cy", 70)
                 .attr("r", 50)
                 .attr("fill", "rgba(255, 255, 0, 0.65)")
                 .attr("stroke", "rgba(255, 0, 0, 0.25)")
                 .attr("stroke-width", 12)
                 .attr("opacity", 0.8)

              svg.append("text")
                 .text(strOne)
                 .attr("x", index)
                 .attr("y", 60)
                 .attr("fill", "black")
                 .attr("font-family", "sans-serif")
                 .attr("font-size", "18px")
                 .attr("text-anchor", "middle");

              svg.append("text")
                 .text(strTwo)
                 .attr("x", index)
                 .attr("y", 90)
                 .attr("fill", "black")
                 .attr("font-family", "sans-serif")
                 .attr("font-size", "18px")
                 .attr("text-anchor", "middle");
          }
      }
    });
}

function deselectState () {
  d3.selectAll(".state-line")
    .style("display", "none");
  d3.selectAll(".state-text")
    .style("display", "none");
}

function selectState (stateData) {
  // deselectState();
  d3.event.stopPropagation();
  d3.selectAll("." + stateData.id + "-line")
    .style("display", "inline");
}


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
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  x.domain(d3.map(data, function(d) { return d.YearQuarter; }).keys());
  y.domain([0,d3.max(data, function(d) { return d.MedianPrice; })]);
  // console.log(d3.max(data, function(d) { return d.MedianPrice; }));

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

  svg.append("path")
      .datum(data.filter(function(d) { return d.State == 'US'; } ))
      .attr("class", "line country-line")
      .attr("clip-path", "url(#clip)")
      .attr("d", line);

  svg.append("text")
      .datum(data.filter(function(d) { return d.State == 'US' && d.YearQuarter == '2010Q2'; } ))
      .attr("transform", function(d) { return "translate(" + (x(d[0].YearQuarter)+5) + "," + y(d[0].MedianPrice) + ")"; })
      .attr("class", "us-text")
      .text("US");

  var states = d3.map(data, function(d) { return d.State; }).keys();

  states.forEach(function (state, i) {
    svg.append("path")
        .datum(data.filter(function(d) { return d.State == state; }))
        .attr("class", "line state-line " + state + "-line")
        .style("stroke", color(i % 20))
        .style("display", "none")
        .attr("clip-path", "url(#clip)")
        .attr("d", line);

    svg.append("text")
        .datum(data.filter(function(d) { return d.State == state && d.YearQuarter == '2010Q2'; } ))
        .attr("transform", function(d) { return "translate(" + (x(d[0].YearQuarter)+5) + "," + y(d[0].MedianPrice) + ")"; })
        .attr("class", "state-text " + state + "-line")
        .style("display", "none")
        .text(state);

  })

  svg.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", chartWidth)
    .attr("height", chartHeight);


  addMarker(svg, chartWidth, svgHeight, x);

  function zoomed() {
    // svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);
    svg.selectAll('path.line').attr('d', line); 
    svg.selectAll('.us-text').attr("transform", function(d) { return "translate(" + (x(d[0].YearQuarter)+5) + "," + y(d[0].MedianPrice) + ")"; });
    svg.selectAll('.state-text').attr("transform", function(d) { return "translate(" + (x(d[0].YearQuarter)+5) + "," + y(d[0].MedianPrice) + ")"; });
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

var parseDate  = d3.time.format('%Y-%m-%d').parse;



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

  // d3.csv('dataset.csv', function (error, markerData) {
  //   if (error) {
  //     console.error(error);
  //     return;
  //   }
  //   console.log(markerData);

  //   var markers = markerData.map(function (marker) {
  //     return {
  //       date: parseDate(marker.date),
  //       type: marker.type,
  //       version: marker.version
  //     };
  //   });

  //   makeChart(data, markers);
  // });
  makeChart(data);
  // selectState("WA");
});
