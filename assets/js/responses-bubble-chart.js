var width = 500, height = 460, sizeDivisor = 8.5, nodePadding = 2.5;

    var svg = d3.select("#responses-bubble")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var color = d3.scaleOrdinal(["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3", "#ff6751", "#92c9d7", "#c292d7", "#77adf0"]);

    var simulation = d3.forceSimulation()
        .force("forceX", d3.forceX().strength(.1).x(width * .5))
        .force("forceY", d3.forceY().strength(.1).y(height * .5))
        .force("center", d3.forceCenter().x(width * .5).y(height * .5))
        .force("charge", d3.forceManyBody().strength(-15));

    d3.csv("assets/data/queries/responses-all.csv", types, function(error,graph){
      if (error) throw error;

      // sort the nodes so that the bigger ones are at the back
      graph = graph.sort(function(a,b){ return b.size - a.size; });

      //update the simulation based on the data
      simulation
          .nodes(graph)
          .force("collide", d3.forceCollide().strength(.5).radius(function(d){ return d.radius + nodePadding; }).iterations(1))
          .on("tick", function(d){
            node
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; })
          });

      var node = svg.append("g")
          .attr("class", "node")
        .selectAll("circle")
        .data(graph)
        .enter().append("circle")
          // .attr("class", function(d) { return "bubbles " + d.industry })
          .attr("r", function(d) { return d.radius; })
          .attr("fill", function(d) { return color(d.industry); })
          .attr("cx", function(d){ return d.x; })
          .attr("cy", function(d){ return d.y; })
          .on("mouseover", showTooltip) // What to do when hovered
          .on("mousemove", moveTooltip)
          .on("mouseleave", hideTooltip)
          .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));

    });

    // ---------------------------//
  //      TOOLTIP               //
  // ---------------------------//

  // -1- Create a tooltip div that is hidden by default:
  var tooltip = d3.select("#responses-bubble")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "gray")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  var showTooltip = function(d) {
    tooltip
      .transition()
      .duration(200);
    tooltip
      .style("opacity", 1)
      .html("" + d.industry + "<br>" + d.workforce + "<br> Responses: " + d.responses)
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px");
      // highlight(d);
  }
  var moveTooltip = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var hideTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0);
    // noHighlight(d);
  }

  // ---------------------------//
  //       HIGHLIGHT GROUP      //
  // ---------------------------//

  // What to do when one group is hovered
  // var highlight = function(d){
  //   // reduce opacity of all groups
  //   d3.selectAll(".bubbles").style("opacity", .1)
  //   // expect the one that is hovered
  //   d3.selectAll("."+d.industry).style("opacity", 1)
  // }
  //
  // // And when it is not hovered anymore
  // var noHighlight = function(d){
  //   d3.selectAll(".bubbles").style("opacity", 1)
  // }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(.03);
      d.fx = null;
      d.fy = null;
    }

    function types(d){
      d.responses = +d.responses;
      d.size = +d.responses / sizeDivisor;
      d.size < 3 ? d.radius = 3 : d.radius = d.size;
      return d;
    }

    // ---------------------------//
    //       LEGEND              //
    // ---------------------------//

    // Add legend: circles
    // var valuesToShow = [10000000, 100000000, 1000000000]
    // var xCircle = 390
    // var xLabel = 440
    // svg
    //   .selectAll("legend")
    //   .data(valuesToShow)
    //   .enter()
    //   .append("circle")
    //     .attr("cx", xCircle)
    //     .attr("cy", function(d){ return height - 100 - z(d) } )
    //     .attr("r", function(d){ return z(d) })
    //     .style("fill", "none")
    //     .attr("stroke", "black")
    //
    // // Add legend: segments
    // svg
    //   .selectAll("legend")
    //   .data(valuesToShow)
    //   .enter()
    //   .append("line")
    //     .attr('x1', function(d){ return xCircle + z(d) } )
    //     .attr('x2', xLabel)
    //     .attr('y1', function(d){ return height - 100 - z(d) } )
    //     .attr('y2', function(d){ return height - 100 - z(d) } )
    //     .attr('stroke', 'black')
    //     .style('stroke-dasharray', ('2,2'))
    //
    // // Add legend: labels
    // svg
    //   .selectAll("legend")
    //   .data(valuesToShow)
    //   .enter()
    //   .append("text")
    //     .attr('x', xLabel)
    //     .attr('y', function(d){ return height - 100 - z(d) } )
    //     .text( function(d){ return d/1000000 } )
    //     .style("font-size", 10)
    //     .attr('alignment-baseline', 'middle')
    //
    // // Legend title
    // svg.append("text")
    //   .attr('x', xCircle)
    //   .attr("y", height - 100 +30)
    //   .text("Population (M)")
    //   .attr("text-anchor", "middle")

// const generateChart = data => { };
//
// (async () => {
//     data = await d3.json(file).then(data => data);
//     generateChart(data);
// })();
//
// const width = window.innerWidth;
// const height = window.innerHeight;
// const colors = {
//     html: '#F16529',
//     css: '#1C88C7',
//     js: '#FCC700'
// };
//
// const bubble = data => d3.pack()
//     .size([width, height])
//     .padding(2)(d3.hierarchy({ children: data }).sum(d => d.score));
//
// const root = bubble(data);
// const svg = d3.select('#bubble-chart')
//     .style('width', width)
//     .style('height', height);
//
// const tooltip = d3.select('.tooltip');
//
// const node = svg.selectAll()
//     .data(root.children)
//     .enter().append('g')
//     .attr('transform', d => `translate(${d.x}, ${d.y})`);
//
// const circle = node.append('circle')
//     .attr('r', d => d.r)
//     .style('fill', d => colors[d.data.category])

// set the dimensions and margins of the graph
// var margin = {top: 40, right: 150, bottom: 60, left: 30},
//     width = 500 - margin.left - margin.right,
//     height = 420 - margin.top - margin.bottom;
//
// // append the svg object to the body of the page
// var svg = d3.select("#my_dataviz")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");
//
// //Read the data
// d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv", function(data) {
//
//   // ---------------------------//
//   //       AXIS  AND SCALE      //
//   // ---------------------------//
//
//   // Add X axis
//   var x = d3.scaleLinear()
//     .domain([0, 45000])
//     .range([ 0, width ]);
//   svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x).ticks(3));
//
//   // Add X axis label:
//   svg.append("text")
//       .attr("text-anchor", "end")
//       .attr("x", width)
//       .attr("y", height+50 )
//       .text("Gdp per Capita");
//
//   // Add Y axis
//   var y = d3.scaleLinear()
//     .domain([35, 90])
//     .range([ height, 0]);
//   svg.append("g")
//     .call(d3.axisLeft(y));
//
//   // Add Y axis label:
//   svg.append("text")
//       .attr("text-anchor", "end")
//       .attr("x", 0)
//       .attr("y", -20 )
//       .text("Life expectancy")
//       .attr("text-anchor", "start")
//
//   // Add a scale for bubble size
//   var z = d3.scaleSqrt()
//     .domain([200000, 1310000000])
//     .range([ 2, 30]);
//
//   // Add a scale for bubble color
//   var myColor = d3.scaleOrdinal()
//     .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
//     .range(d3.schemeSet1);
//
//
//   // ---------------------------//
//   //      TOOLTIP               //
//   // ---------------------------//
//
//   // -1- Create a tooltip div that is hidden by default:
//   var tooltip = d3.select("#my_dataviz")
//     .append("div")
//       .style("opacity", 0)
//       .attr("class", "tooltip")
//       .style("background-color", "black")
//       .style("border-radius", "5px")
//       .style("padding", "10px")
//       .style("color", "white")
//
//   // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
//   var showTooltip = function(d) {
//     tooltip
//       .transition()
//       .duration(200)
//     tooltip
//       .style("opacity", 1)
//       .html("Country: " + d.country)
//       .style("left", (d3.mouse(this)[0]+30) + "px")
//       .style("top", (d3.mouse(this)[1]+30) + "px")
//   }
//   var moveTooltip = function(d) {
//     tooltip
//       .style("left", (d3.mouse(this)[0]+30) + "px")
//       .style("top", (d3.mouse(this)[1]+30) + "px")
//   }
//   var hideTooltip = function(d) {
//     tooltip
//       .transition()
//       .duration(200)
//       .style("opacity", 0)
//   }
//
//
//   // ---------------------------//
//   //       HIGHLIGHT GROUP      //
//   // ---------------------------//
//
//   // What to do when one group is hovered
//   var highlight = function(d){
//     // reduce opacity of all groups
//     d3.selectAll(".bubbles").style("opacity", .05)
//     // expect the one that is hovered
//     d3.selectAll("."+d).style("opacity", 1)
//   }
//
//   // And when it is not hovered anymore
//   var noHighlight = function(d){
//     d3.selectAll(".bubbles").style("opacity", 1)
//   }
//
//
//   // ---------------------------//
//   //       CIRCLES              //
//   // ---------------------------//
//
//   // Add dots
//   svg.append('g')
//     .selectAll("dot")
//     .data(data)
//     .enter()
//     .append("circle")
//       .attr("class", function(d) { return "bubbles " + d.continent })
//       .attr("cx", function (d) { return x(d.gdpPercap); } )
//       .attr("cy", function (d) { return y(d.lifeExp); } )
//       .attr("r", function (d) { return z(d.pop); } )
//       .style("fill", function (d) { return myColor(d.continent); } )
//     // -3- Trigger the functions for hover
//     .on("mouseover", showTooltip )
//     .on("mousemove", moveTooltip )
//     .on("mouseleave", hideTooltip )
//
//
//
//     // ---------------------------//
//     //       LEGEND              //
//     // ---------------------------//
//
//     // Add legend: circles
//     var valuesToShow = [10000000, 100000000, 1000000000]
//     var xCircle = 390
//     var xLabel = 440
//     svg
//       .selectAll("legend")
//       .data(valuesToShow)
//       .enter()
//       .append("circle")
//         .attr("cx", xCircle)
//         .attr("cy", function(d){ return height - 100 - z(d) } )
//         .attr("r", function(d){ return z(d) })
//         .style("fill", "none")
//         .attr("stroke", "black")
//
//     // Add legend: segments
//     svg
//       .selectAll("legend")
//       .data(valuesToShow)
//       .enter()
//       .append("line")
//         .attr('x1', function(d){ return xCircle + z(d) } )
//         .attr('x2', xLabel)
//         .attr('y1', function(d){ return height - 100 - z(d) } )
//         .attr('y2', function(d){ return height - 100 - z(d) } )
//         .attr('stroke', 'black')
//         .style('stroke-dasharray', ('2,2'))
//
//     // Add legend: labels
//     svg
//       .selectAll("legend")
//       .data(valuesToShow)
//       .enter()
//       .append("text")
//         .attr('x', xLabel)
//         .attr('y', function(d){ return height - 100 - z(d) } )
//         .text( function(d){ return d/1000000 } )
//         .style("font-size", 10)
//         .attr('alignment-baseline', 'middle')
//
//     // Legend title
//     svg.append("text")
//       .attr('x', xCircle)
//       .attr("y", height - 100 +30)
//       .text("Population (M)")
//       .attr("text-anchor", "middle")
//
//     // Add one dot in the legend for each name.
//     var size = 20
//     var allgroups = ["Asia", "Europe", "Americas", "Africa", "Oceania"]
//     svg.selectAll("myrect")
//       .data(allgroups)
//       .enter()
//       .append("circle")
//         .attr("cx", 390)
//         .attr("cy", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
//         .attr("r", 7)
//         .style("fill", function(d){ return myColor(d)})
//         .on("mouseover", highlight)
//         .on("mouseleave", noHighlight)
//
//     // Add labels beside legend dots
//     svg.selectAll("mylabels")
//       .data(allgroups)
//       .enter()
//       .append("text")
//         .attr("x", 390 + size*.8)
//         .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
//         .style("fill", function(d){ return myColor(d)})
//         .text(function(d){ return d})
//         .attr("text-anchor", "left")
//         .style("alignment-baseline", "middle")
//         .on("mouseover", highlight)
//         .on("mouseleave", noHighlight)
//   })