// Dimensions and margins
var margin_gov_g = {top: 10, right: 60, bottom: 260, left: 50},
    width_gov_g = document.getElementById("gov-schemes").parentElement.offsetWidth - margin_gov_g.left - margin_gov_g.right,
    height_gov_g = 700 - margin_gov_g.top - margin_gov_g.bottom;

// SVG chart container
var svg_gov_g = d3.select("#gov-schemes")
    .append("svg")
    .attr("width", width_gov_g + margin_gov_g.left + margin_gov_g.right)
    .attr("height", height_gov_g + margin_gov_g.top + margin_gov_g.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin_gov_g.left + "," + margin_gov_g.top + ")");

// Init x and y axes
var x_gov_g = d3.scaleBand()
    .range([0, width_gov_g])
    .padding([0.2]);

var xAxis_gov_g = svg_gov_g.append("g")
    .attr("transform", "translate(0," + height_gov_g + ")");

var y_gov_g = d3.scaleLinear()
    .domain([0, 100])
    .range([height_gov_g, 0]);

var yAxis_gov_g = svg_gov_g.append("g");

// Update and draw chart data depending on filters
function updateGovChart() {

    var dataFile = "";

    // Button input defines data displayed
    if(document.getElementById("job-retention").checked){
      dataFile = "assets/data/queries/gov-schemes/covid-job-retention-scheme.csv"
    }
    else if(document.getElementById("business-rates-holiday").checked){
      dataFile = "assets/data/queries/gov-schemes/business-rates-holiday.csv"
    }
    else if(document.getElementById("deferring-vat").checked){
      dataFile = "assets/data/queries/gov-schemes/deferring-vat-payments.csv"
    }
    else if(document.getElementById("hmrc-time-to-pay").checked){
      dataFile = "assets/data/queries/gov-schemes/hmrc-time-to-pay.csv"
    }
    else if(document.getElementById("small-business").checked){
      dataFile = "assets/data/queries/gov-schemes/small-business-grant.csv"
    }
    else if(document.getElementById("accredited-finance").checked){
      dataFile = "assets/data/queries/gov-schemes/accredited-finance-agreements.csv"
    }
    else if(document.getElementById("none").checked){
      dataFile = "assets/data/queries/gov-schemes/none.csv"
    }

    // Parse CSV data
    d3.csv(dataFile, function (data) {

        // List of subgroups, CSV header
        var subgroups = data.columns.slice(1);

        // List of X axis groups + set X domain
        var groups = d3.map(data, function (d) {
            return (d.industry)
        }).keys();
        x_gov_g.domain(groups);

        // Add X and Y axis
        xAxis_gov_g.call(d3.axisBottom(x_gov_g).tickSize(0))
            .selectAll("text")
            .style('text-anchor', 'start')
            .attr('transform', 'rotate(45 -10 10)');

        yAxis_gov_g.transition().duration(1000).call(d3.axisLeft(y_gov_g));

        // Subgroup positioning scale
        var xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x_gov_g.bandwidth()])
            .padding([0.05]);

        // Show bar groups
        var barGroups = svg_gov_g
            .selectAll("g.layer")
            .data(data);

        barGroups
            .enter()
            .append("g")
            .classed('layer', true)
            .attr("transform", function (d) {
                return "translate(" + x_gov_g(d.industry) + ",0)";
            });

        // Remove non-present groups
        barGroups
            .exit()
            .remove();

        // Show bars
        var bars = svg_gov_g
            .selectAll("g.layer")
            .selectAll("rect")
            .data(function (d) {
                return subgroups.map(function (key) {
                    return {key: key, value: d[key]};
                });
            });

        bars
            .enter()
            .append("rect")
            .on("mouseover", mouseover_gov_g)
            .on("mousemove", mousemove_gov_g)
            .on("mouseleave", mouseleave_gov_g)
            .attr("width", xSubgroup.bandwidth())
            .attr("x", function (d) {
                return xSubgroup(d.key);
            })
            .attr("fill", function (d, i) {
                return color(i);
            })
            .transition()
            .duration(1000)
            .attr("y", function (d) {
                return y_gov_g(d.value);
            })
            .attr("height", function (d) {
                return height_gov_g - y_gov_g(d.value);
            });

        bars
            .transition()
            .duration(1000)
            .attr("y", function (d) {
                return y_gov_g(d.value);
            })
            .attr("height", function (d) {
                return height_gov_g - y_gov_g(d.value);
            });

        // Remove non-present bars
        bars
            .exit()
            .remove();

    })
}

// Change the tooltip when user hovers / moves / leaves a cell
  var mouseover_gov_g = function(d) {
    var subgroupName = d3.select(this).datum().key;
    var capSubgroup = subgroupName.charAt(0).toUpperCase() + subgroupName.slice(1)
    tooltip
        .html(capSubgroup + "<br>" + "Value: " + d.value + "%")
        .style("opacity", 1)
  }
  var mousemove_gov_g = function(d) {
    tooltip
      .style("left", (d3.event.pageX+30) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.event.pageY+30) + "px")
  }
  var mouseleave_gov_g = function(d) {
    tooltip
      .style("opacity", 0)
  }

// Init chart on page load
updateGovChart();