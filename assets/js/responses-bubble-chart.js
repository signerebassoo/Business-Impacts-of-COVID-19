// Dimensions
var width = document.getElementById("responses-bubble").parentElement.offsetWidth,
    height = 460,
    sizeDivisor = 8.5,
    nodePadding = 2.5;

// SVG chart container
var svg = d3.select("#responses-bubble")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Define global colour schemes
var color = d3.scaleOrdinal(["#66c2a5", "#ff6751", "#b3b3b3", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#8da0cb", "#fc8d62", "#92c9d7", "#c292d7", "#77adf0"]);
var triColor = d3.scaleOrdinal(["#66c2a5", "#fc8d62", "#8da0cb"]);

// Define simulation
var simulation = d3.forceSimulation()
    .force("forceX", d3.forceX().strength(.1).x(width * .5))
    .force("forceY", d3.forceY().strength(.1).y(height * .5))
    .force("center", d3.forceCenter().x(width * .5).y(height * .5))
    .force("charge", d3.forceManyBody().strength(-15));

// Parse data
d3.csv("assets/data/queries/responses-all.csv", types, function(error,graph){

  if (error) throw error;

  graph = graph.sort(function(a,b){ return b.size - a.size; });

  // Update simulation
  simulation
      .nodes(graph)
      .force("collide", d3.forceCollide().strength(.5).radius(function(d){ return d.radius + nodePadding; }).iterations(1))
      .on("tick", function(d){
        node
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
      });

  // Append bubble nodes
  var node = svg.append("g")
      .attr("class", "node")
    .selectAll("circle")
    .data(graph)
    .enter().append("circle")
      .attr("r", function(d) { return d.radius; })
      .attr("fill", function(d) { return color(d.industry); })
      .attr("cx", function(d){ return d.x; })
      .attr("cy", function(d){ return d.y; })
      .on("mouseover", mouseover_resp_bub_g) // What to do when hovered
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

});

// Tooltip element
var tooltip = d3.select("body")
  .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "gray")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")

// Tooltip events
function mouseover_resp_bub_g(d) {
  tooltip
    .transition()
    .duration(200);
  tooltip
    .style("opacity", 1)
    .html("" + d.industry + "<br>" + d.workforce + "<br> Responses: " + d.responses)
    .style("left", (d3.event.pageX+30) + "px")
    .style("top", (d3.event.pageY+30) + "px");
}
function mousemove(d) {
  tooltip
    .style("left", (d3.event.pageX+30) + "px")
    .style("top", (d3.event.pageY+30) + "px")
}
function mouseleave(d) {
  tooltip
    .style("opacity", 0)
}

// Bubble drag events
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