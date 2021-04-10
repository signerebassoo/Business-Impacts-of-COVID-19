// set the dimensions and margins of the graph
var margin4 = {top: 10, right: 60, bottom: 20, left: 50},
    width4 = document.getElementById("gov-schemes").parentElement.offsetWidth - margin4.left - margin4.right,
    height4 = 400 - margin4.top - margin4.bottom;

// append the svg object to the body of the page
var svg4 = d3.select("#gov-schemes")
  .append("svg")
    .attr("width", width4 + margin4.left + margin4.right)
    .attr("height", height4 + margin4.top + margin4.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin4.left + "," + margin4.top + ")");

// Parse the Data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv", function(data) {

  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d.group)}).keys()

  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width4])
      .padding([0.2])
  svg4.append("g")
    .attr("transform", "translate(0," + height4 + ")")
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 40])
    .range([ height4, 0 ]);
  svg4.append("g")
    .call(d3.axisLeft(y));

  // Another scale for subgroup position?
  var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#66c2a5','#fc8d62','#8da0cb']);

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover4 = function(d) {
    var subgroupName = d3.select(this).datum().key;
    // var subgroupValue = d.data[subgroupName];
    tooltip
        // .html(subgroupName + "<br>" + "Value: " + subgroupValue + "%")
        .html(subgroupName + "<br>" + "Value: " + d[subgroupName] + " %")
        .style("opacity", 1)
  }
  var mousemove4 = function(d) {
    tooltip
      .style("left", (d3.event.pageX+30) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.event.pageY+30) + "px")
  }
  var mouseleave4 = function(d) {
    tooltip
      .style("opacity", 0)
  }

  // Show the bars
  svg4.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.group) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .on("mouseover", mouseover4)
      .on("mousemove", mousemove4)
      .on("mouseleave", mouseleave4)
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return y(0); })
      .transition()
      .duration(1000)
      .attr("y", function (d) { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return height4 - y(d.value); })
      .attr("fill", function(d) { return color(d.key); });

})