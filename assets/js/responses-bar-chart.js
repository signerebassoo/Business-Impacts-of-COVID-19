// Create 2 dataset variables
var data_idr = [];
var data_wf = [];

// Dimensions and margins
var margin_resp_g = {top: 30, right: 120, bottom: 70, left: 60},
    width_resp_g = document.getElementById("responses-bar").parentElement.offsetWidth - margin_resp_g.right,
    height_resp_g = 420

// SVG chart container
var svg_resp_g = d3.select("#responses-bar")
  .append("svg")
    .attr("width", width_resp_g + margin_resp_g.left + margin_resp_g.right)
    .attr("height", height_resp_g + margin_resp_g.top + margin_resp_g.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_resp_g.left + "," + margin_resp_g.top + ")");

// Init x and y axis
var x = d3.scaleBand()
  .range([ 0, width_resp_g ])
  .padding(0.2);

var xAxis = svg_resp_g.append("g")
  .attr("transform", "translate(0," + height_resp_g + ")")

var y = d3.scaleLinear()
  .range([ height_resp_g, 0]);

var yAxis = svg_resp_g.append("g")
  .attr("class", "myYaxis")

// Update chart with new data
function update(data, fillType) {

    // Update x and y axes
    x.domain(data.map(function(d) { return d.industry; }))
    xAxis.call(d3.axisBottom(x))

    if(fillType == "industry"){
        y.domain([0, 1100 ]);
    }
    else{
        y.domain([0, 3500 ]);
    }
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    var bars = svg_resp_g.selectAll("rect")
    .data(data)

    // Show bars
    bars
        .enter()
        .append("rect") // Add a new rect for each new elements
          .on("mouseover", mouseover_resp_g) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .merge(bars) // get the already existing elements as well
        .transition() // and apply changes to all of them
        .duration(1000)
            .attr("x", function(d) { return x(d.industry); })
            .attr("y", function(d) { return y(d.responses); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height_resp_g - y(d.responses); })
            .attr("fill", function(d) {

                if (fillType == "workforce"){
                    return "#FFB973";
                }
                return color(d.industry);
            })

    if(fillType == "industry"){
        xAxis.selectAll("text").remove();
    }

  // Remove non-present bars
  bars
    .exit()
    .remove();
}

// Tooltip event
var mouseover_resp_g = function(d) {
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html(d.industry + "<br> Responses: " + d.responses)
      .style("left", (d3.event.pageX+30) + "px")
      .style("top", (d3.event.pageY+30) + "px")
}

// Init the plot with the first dataset
d3.csv("assets/data/queries/total-responses-industry.csv", function (data){
    data_idr = data;
    update(data, "industry")
});

// Parse second dataset
d3.csv("assets/data/queries/total-responses-workforce.csv", function (data){
    data_wf = data;
});