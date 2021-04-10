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
  var tooltip = d3.select("body")
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
      .style("left", (d3.event.pageX+30) + "px")
      .style("top", (d3.event.pageY+30) + "px");
      // highlight(d);
  }
  var moveTooltip = function(d) {
    tooltip
      .style("left", (d3.event.pageX+30) + "px")
      .style("top", (d3.event.pageY+30) + "px")
  }
  var hideTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0);
  }

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