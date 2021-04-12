// Dimensions and margins
var margin_gov_wf_g = {top: 10, right: 75, bottom: 260, left: 50},
    width_gov_wf_g = document.getElementById("gov-schemes-wf").parentElement.offsetWidth - margin_gov_wf_g.left - margin_gov_wf_g.right,
    height_gov_wf_g = 700 - margin_gov_wf_g.top - margin_gov_wf_g.bottom;

// SVG chart container
var svg_gov_wf_g = d3.select("#gov-schemes-wf")
    .append("svg")
    .attr("width", width_gov_wf_g + margin_gov_wf_g.left + margin_gov_wf_g.right)
    .attr("height", height_gov_wf_g + margin_gov_wf_g.top + margin_gov_wf_g.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin_gov_wf_g.left + "," + margin_gov_wf_g.top + ")");

// Init x and y axes
var x_gov_wf_g = d3.scaleBand()
    .range([0, width_gov_wf_g])
    .padding([0.2]);

var xAxis_gov_wf_g = svg_gov_wf_g.append("g")
    .attr("transform", "translate(0," + height_gov_wf_g + ")");

var y_gov_wf_g = d3.scaleLinear()
    .domain([0, 100])
    .range([height_gov_wf_g, 0]);

var yAxis_gov_wf_g = svg_gov_wf_g.append("g");

// Update and draw chart data depending on filters
function updateGovWfChart() {

    var dataFile = "";

    // Button input defines data displayed
    if(document.getElementById("job-retention").checked){
      dataFile = "assets/data/queries/gov-schemes/covid-job-retention-scheme-wf.csv"
    }
    else if(document.getElementById("business-rates-holiday").checked){
      dataFile = "assets/data/queries/gov-schemes/business-rates-holiday-wf.csv"
    }
    else if(document.getElementById("deferring-vat").checked){
      dataFile = "assets/data/queries/gov-schemes/deferring-vat-payments-wf.csv"
    }
    else if(document.getElementById("hmrc-time-to-pay").checked){
      dataFile = "assets/data/queries/gov-schemes/hmrc-time-to-pay-wf.csv"
    }
    else if(document.getElementById("small-business").checked){
      dataFile = "assets/data/queries/gov-schemes/small-business-grant-wf.csv"
    }
    else if(document.getElementById("accredited-finance").checked){
      dataFile = "assets/data/queries/gov-schemes/accredited-finance-agreements-wf.csv"
    }
    else if(document.getElementById("none").checked){
      dataFile = "assets/data/queries/gov-schemes/none-wf.csv"
    }

    // Parse CSV data
    d3.csv(dataFile, function (data) {

        // List of subgroups, CSV header
        var subgroups = data.columns.slice(1);

        // List of X axis groups + set X domain
        var groups = d3.map(data, function (d) {
            return (d.workforce)
        }).keys();
        x_gov_wf_g.domain(groups);

        // Add X and Y axis
        xAxis_gov_wf_g.call(d3.axisBottom(x_gov_wf_g).tickSize(0))
            .selectAll("text")
            .style('text-anchor', 'start')
            .attr('transform', 'rotate(45 -10 10)');

        yAxis_gov_wf_g.attr("transform", "translate(" + width_gov_wf_g + ",0)").transition().duration(1000).call(d3.axisRight(y_gov_wf_g));

        // Subgroup positioning scale
        var xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x_gov_wf_g.bandwidth()])
            .padding([0.05]);

        // Show bar groups
        var barGroups = svg_gov_wf_g
            .selectAll("g.layer")
            .data(data);

        barGroups
            .enter()
            .append("g")
            .classed('layer', true)
            .attr("transform", function (d) {
                return "translate(" + x_gov_wf_g(d.workforce) + ",0)";
            });

        // Remove non-present groups
        barGroups
            .exit()
            .remove();

        // Show bars
        var bars = svg_gov_wf_g
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
                return triColor(i);
            })
            .transition()
            .duration(1000)
            .attr("y", function (d) {
                return y_gov_wf_g(d.value);
            })
            .attr("height", function (d) {
                return height_gov_wf_g - y_gov_wf_g(d.value);
            });

        bars
            .transition()
            .duration(1000)
            .attr("y", function (d) {
                return y_gov_wf_g(d.value);
            })
            .attr("height", function (d) {
                return height_gov_wf_g - y_gov_wf_g(d.value);
            });

        // Remove non-present bars
        bars
            .exit()
            .remove();

    })
}

// Init chart on page load
updateGovWfChart();