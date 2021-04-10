// set the dimensions and margins of the graph
var width_tr_wf_g = document.getElementById("trading-wf1").parentElement.offsetWidth - 80,
    height_tr_wf_g = width_tr_wf_g,
    margin_tr_wf_g = 20;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width_tr_wf_g, height_tr_wf_g) / 2 - margin_tr_wf_g

// Three function that change the tooltip when user hover / move / leave a cell
  var mouseover_tr_wf_g = function(d) {
    var val = d.value;
    if(val == 1){
      val = 0.5;
    }
    tooltip
        .html(d.data.key + "<br>" + "Value: " + val + "%")
        .style("opacity", 1)
  }
  var mousemove_tr_wf_g = function(d) {
    tooltip
      .style("left", (d3.event.pageX+30) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.event.pageY+30) + "px")
  }
  var mouseleave_tr_wf_g = function(d) {
    tooltip
      .style("opacity", 0)
  }

var og_tr_wf1 = {"Continuing to Trade": 74.8, "Permanently Ceased Trading": 0.5, "Temporarily Closed or Paused Trading":24.7}
var og_tr_wf2 = {"Continuing to Trade": 79.8, "Permanently Ceased Trading": 0.5, "Temporarily Closed or Paused Trading":19.7}

// Create data
var data_tr_wf_g1 = {"Continuing to Trade": 74.8, "Permanently Ceased Trading": 0.5, "Temporarily Closed or Paused Trading":24.7}
var data_tr_wf_g2 = {"Continuing to Trade": 79.8, "Permanently Ceased Trading": 0.5, "Temporarily Closed or Paused Trading":19.7}

function drawWorkforceChart() {

  d3.selectAll("#trading-wf1 > *").remove();

  var svg_tr_wf_g1 = d3.select("#trading-wf1")
      .append("svg")
      .attr("width", width_tr_wf_g)
      .attr("height", height_tr_wf_g)
      .append("g")
      .attr("transform", "translate(" + width_tr_wf_g / 2 + "," + height_tr_wf_g / 2 + ")");

  var svg_tr_wf_g2 = d3.select("#trading-wf1")
      .append("svg")
      .attr("width", width_tr_wf_g)
      .attr("height", height_tr_wf_g)
      .append("g")
      .attr("transform", "translate(" + width_tr_wf_g / 2 + "," + height_tr_wf_g / 2 + ")");

// Compute the position of each group on the pie:
  var pie = d3.pie()
      .value(function (d) {
        if (d.value < 1 && d.value != 0.0) {
          return 1;
        }
        return d.value;
      })
  var data1_ready = pie(d3.entries(data_tr_wf_g1))
  var data2_ready = pie(d3.entries(data_tr_wf_g2))

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svg_tr_wf_g1
      .selectAll('whatever')
      .data(data1_ready)
      .enter()
      .append('path')
      .attr('d', d3.arc()
          .innerRadius(radius - 30)         // This is the size of the donut hole
          .outerRadius(radius)
      )
      .attr('fill', function (d, i) {
        return (color(i))
      })
      .attr("stroke", "white")
      .on("mouseover", mouseover_tr_wf_g)
      .on("mousemove", mousemove_tr_wf_g)
      .on("mouseleave", mouseleave_tr_wf_g)
      .style("stroke-width", "3px");

  svg_tr_wf_g1.append("text")
      .attr("text-anchor", "middle")
      .text("Workforce Size 0-249")
      .style("font-size", "11px");

  svg_tr_wf_g2
      .selectAll('whatever')
      .data(data2_ready)
      .enter()
      .append('path')
      .attr('d', d3.arc()
          .innerRadius(radius - 30)         // This is the size of the donut hole
          .outerRadius(radius)
      )
      .attr('fill', function (d, i) {
        return (color(i))
      })
      .attr("stroke", "white")
      .on("mouseover", mouseover_tr_wf_g)
      .on("mousemove", mousemove_tr_wf_g)
      .on("mouseleave", mouseleave_tr_wf_g)
      .style("stroke-width", "3px");

  svg_tr_wf_g2.append("text")
      .attr("text-anchor", "middle")
      .text("Workforce Size 250+")
      .style("font-size", "11px");

}

function updateDonutCharts(){
	for (i=0; i < temp_data.length; i++){
		if (document.getElementById("contChk").checked){
			data_tr_wf_g1["Continuing to Trade"] = og_tr_wf1["Continuing to Trade"];
			data_tr_wf_g2["Continuing to Trade"] = og_tr_wf2["Continuing to Trade"];
		} else{
			data_tr_wf_g1["Continuing to Trade"] = 0.0;
			data_tr_wf_g2["Continuing to Trade"] = 0.0;
		}

		if (document.getElementById("ceasedChk").checked){
			data_tr_wf_g1["Permanently Ceased Trading"] = og_tr_wf1["Permanently Ceased Trading"];
			data_tr_wf_g2["Permanently Ceased Trading"] = og_tr_wf2["Permanently Ceased Trading"];
		} else{
			data_tr_wf_g1["Permanently Ceased Trading"] = 0.0;
			data_tr_wf_g2["Permanently Ceased Trading"] = 0.0;
		}

		if (document.getElementById("pausedChk").checked){
			data_tr_wf_g1["Temporarily Closed or Paused Trading"] = og_tr_wf1["Temporarily Closed or Paused Trading"];
			data_tr_wf_g2["Temporarily Closed or Paused Trading"] = og_tr_wf2["Temporarily Closed or Paused Trading"];
		} else{
			data_tr_wf_g1["Temporarily Closed or Paused Trading"] = 0.0;
			data_tr_wf_g2["Temporarily Closed or Paused Trading"] = 0.0;
		}
	}

	drawWorkforceChart();
}

drawWorkforceChart();

