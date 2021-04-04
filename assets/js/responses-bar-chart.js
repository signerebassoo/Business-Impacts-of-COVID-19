// create 2 data_set
var data1 = [
   {group: "A", value: 4},
   {group: "B", value: 16},
   {group: "C", value: 8}
];

var data2 = [
   {group: "A", value: 7},
   {group: "B", value: 1},
   {group: "C", value: 20},
   {group: "D", value: 10}
];

// set the dimensions and margins of the graph
var margin2 = {top: 30, right: 30, bottom: 70, left: 60},
    width2 = 460,
    height2 = 420

// append the svg object to the body of the page
var svg2 = d3.select("#responses-bar")
  .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin2.left + "," + margin2.top + ")");

// Initialize the X axis
var x = d3.scaleBand()
  .range([ 0, width2 ])
  .padding(0.2);
var xAxis = svg2.append("g")
  .attr("transform", "translate(0," + height2 + ")")

// Initialize the Y axis
var y = d3.scaleLinear()
  .range([ height2, 0]);
var yAxis = svg2.append("g")
  .attr("class", "myYaxis")

// A function that create / update the plot for a given variable:
function update(data) {

  // Update the X axis
  x.domain(data.map(function(d) { return d.industry; }))
  xAxis.call(d3.axisBottom(x))

  // Update the Y axis
  y.domain([0, d3.max(data, function(d) { return d.responses }) ]);
  yAxis.transition().duration(1000).call(d3.axisLeft(y));

  // Create the u variable
  var u = svg2.selectAll("rect")
    .data(data)

  u
    .enter()
    .append("rect") // Add a new rect for each new elements
      .on("mouseover", showTooltip2) // What to do when hovered
    .on("mousemove", moveTooltip2)
    .on("mouseleave", hideTooltip2)
    .merge(u) // get the already existing elements as well
    .transition() // and apply changes to all of them
    .duration(1000)
        .attr("x", function(d) { return x(d.industry); })
        .attr("y", function(d) { return y(d.responses); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height2 - y(d.responses); })
        .attr("fill", "#69b3a2");

  // If less group in the new dataset, I delete the ones not in use anymore
  u
    .exit()
    .remove();
}

// ---------------------------//
  //      TOOLTIP               //
  // ---------------------------//

  // -1- Create a tooltip div that is hidden by default:
  var tooltip2 = d3.select("#responses-bar")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "gray")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  var showTooltip2 = function(d) {
    tooltip2
      .transition()
      .duration(200)
    tooltip2
      .style("opacity", 1)
      .html(d.industry + "<br> Responses: " + d.responses)
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var moveTooltip2 = function(d) {
    tooltip2
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var hideTooltip2 = function(d) {
    tooltip2
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

// Initialize the plot with the first dataset
d3.csv("assets/data/queries/total-responses-industry.csv", function (data){
    data1 = data;
    for (var i = 0; i < data.length; i++) {
        console.log(data[i].industry);
        console.log(data[i].responses);
    }
    update(data)
});

d3.csv("assets/data/queries/total-responses-workforce.csv", function (data){
    data2 = data;
    for (var i = 0; i < data.length; i++) {
        console.log(data[i].workforce);
        console.log(data[i].responses);
    }
});