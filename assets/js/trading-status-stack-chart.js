var initStackedBarChart = {
	draw: function(config) {
		me = this,
		domEle = config.element,
		stackKey = config.key,
		data = config.data,
		margin = {top: 20, right: 10, bottom: 60, left: 215},
		width3 = document.getElementById(domEle).parentElement.offsetWidth - margin.left - margin.right,
		height3 = 500 - margin.top - margin.bottom,
		xScale = d3.scaleLinear().rangeRound([0, width3]),
		yScale = d3.scaleBand().rangeRound([height3, 0]).padding(0.1),
		color3 = d3.scaleOrdinal(d3.schemeCategory20),
		xAxis3 = d3.axisBottom(xScale),
		yAxis3 =  d3.axisLeft(yScale);
		d3.selectAll("#" + domEle + " > *").remove();
		svg3 = d3.select("#"+domEle).append("svg")
				.attr("width", width3 + margin.left + margin.right)
				.attr("height", height3 + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var stack = d3.stack()
			.keys(stackKey)
			.offset(d3.stackOffsetNone);

		var layers = stack(data);
			yScale.domain(data.map(function(d) { return d.date; }));
			xScale.domain([0, 100]).nice();

		var layer = svg3.selectAll(".layer")
			.data(layers)
			.enter().append("g")
			.attr("class", "layer")
			.style("fill", function(d, i) { return color(i); });

		  layer.selectAll("rect")
			  .data(function(d) { return d; })
			.enter().append("rect")
			  .attr("y", function(d) { return yScale(d.data.date); })
			  .attr("x", function(d) { return xScale(0); })
			  .on("mouseover", mouseover3)
			  .on("mousemove", mousemove3)
			  .on("mouseleave", mouseleave3)
			  .transition().duration(1000)
			  .attr("x", function(d) { return xScale(d[0]); })
			  .attr("height", yScale.bandwidth())
			  .attr("width", function(d) { return xScale(d[1]) - xScale(d[0]) });

			svg3.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + (height3+5) + ")")
			.call(xAxis3);

			svg3.append("g")
			.attr("class", "axis axis--y")
			.attr("transform", "translate(0,0)")
			.call(yAxis3)
			.selectAll(".tick text")
      		.call(wrap, 190);

			svg3.append("text")
			  .attr("transform",
					"translate(" + (width3/2) + " ," +
								   (height3 + margin.top + 30) + ")")
			  .style("text-anchor", "middle")
			  .text("Proportion of Responses (%)");
	}
}

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover3 = function(d) {
    var subgroupName = d3.select(this.parentNode).datum().key;
    var subgroupValue = d.data[subgroupName];
    tooltip
        .html(d.data["date"] + "<br>" + subgroupName + "<br>" + "Value: " + subgroupValue + "%")
        .style("opacity", 1)
  }
  var mousemove3 = function(d) {
    tooltip
      .style("left", (d3.event.pageX+30) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.event.pageY+30) + "px")
  }
  var mouseleave3 = function(d) {
    tooltip
      .style("opacity", 0)
  }

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        x = text.attr("x"),
		y = text.attr("y"),
        dx = parseFloat(text.attr("dx")),
		dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("y", 0).attr("x", x).attr("dx", dx + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("dx", dx + "em").attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

var trading_key = ["Continuing to Trade","Permanently Ceased Trading","Temporarily Closed or Paused Trading"];

// d3.csv("assets/data/queries/trading-status-industry.csv", function (data){
//
//     for (var i = 0; i < data.length; i+=3) {
//     	var entry = {"date": data[i].industry, "Continuing to Trade": parseFloat(data[i].proportion), "Permanently Ceased Trading": parseFloat(data[i+1].proportion), "Temporarily Closed or Paused Trading": parseFloat(data[i+2].proportion)};
//     	trading_data_industry.push(entry);
//     }
//     console.log(trading_data);
// });

var trading_data = [{"date":"Manufacturing","Continuing to Trade":79.0,"Permanently Ceased Trading":0.4,"Temporarily Closed or Paused Trading":20.6},
	{"date":"Water Supply, Sewerage, Waste Management And Remediation Activities","Continuing to Trade":90.0,"Permanently Ceased Trading":0.0,"Temporarily Closed or Paused Trading":10.0},
	{"date":"Construction","Continuing to Trade":73.2,"Permanently Ceased Trading":0.7,"Temporarily Closed or Paused Trading":26.1},
	{"date":"Wholesale And Retail Trade; Repair Of Motor Vehicles And Motorcycles","Continuing to Trade":75.2,"Permanently Ceased Trading":0.5,"Temporarily Closed or Paused Trading":24.3},
	{"date":"Accommodation And Food Service Activities","Continuing to Trade":18.2,"Permanently Ceased Trading":1.2,"Temporarily Closed or Paused Trading":80.6},
	{"date":"Transportation And Storage","Continuing to Trade":91.5,"Permanently Ceased Trading":0.0,"Temporarily Closed or Paused Trading":8.5},
	{"date":"Information And Communication","Continuing to Trade":95.0,"Permanently Ceased Trading":0.5,"Temporarily Closed or Paused Trading":4.5},
	{"date":"Professional, Scientific And Technical Activities","Continuing to Trade":96.7,"Permanently Ceased Trading":0.3,"Temporarily Closed or Paused Trading":3.0},
	{"date":"Administrative And Support Service Activities","Continuing to Trade":91.5,"Permanently Ceased Trading":0.4,"Temporarily Closed or Paused Trading":8.1},
	{"date":"Education","Continuing to Trade":86.8,"Permanently Ceased Trading":0.6,"Temporarily Closed or Paused Trading":12.6},
	{"date":"Human Health And Social Work Activities","Continuing to Trade":93.7,"Permanently Ceased Trading":1.4,"Temporarily Closed or Paused Trading":4.9},
	{"date":"Arts, Entertainment And Recreation","Continuing to Trade":20.5,"Permanently Ceased Trading":0.0,"Temporarily Closed or Paused Trading":79.5},
	{"date":"All Industries","Continuing to Trade":76.7,"Permanently Ceased Trading":0.5,"Temporarily Closed or Paused Trading":22.8}
	];

var temp_data = [{"date":"Manufacturing","Continuing to Trade":0.0,"Permanently Ceased Trading":0.4,"Temporarily Closed or Paused Trading":20.6},
	{"date":"Water Supply, Sewerage, Waste Management And Remediation Activities","Continuing to Trade":0.0,"Permanently Ceased Trading":0.0,"Temporarily Closed or Paused Trading":10.0},
	{"date":"Construction","Continuing to Trade":0.0,"Permanently Ceased Trading":0.7,"Temporarily Closed or Paused Trading":26.1},
	{"date":"Wholesale And Retail Trade; Repair Of Motor Vehicles And Motorcycles","Continuing to Trade":0.0,"Permanently Ceased Trading":0.5,"Temporarily Closed or Paused Trading":24.3},
	{"date":"Accommodation And Food Service Activities","Continuing to Trade":0.0,"Permanently Ceased Trading":1.2,"Temporarily Closed or Paused Trading":80.6},
	{"date":"Transportation And Storage","Continuing to Trade":0.0,"Permanently Ceased Trading":0.0,"Temporarily Closed or Paused Trading":8.5},
	{"date":"Information And Communication","Continuing to Trade":0.0,"Permanently Ceased Trading":0.5,"Temporarily Closed or Paused Trading":4.5},
	{"date":"Professional, Scientific And Technical Activities","Continuing to Trade":0.0,"Permanently Ceased Trading":0.3,"Temporarily Closed or Paused Trading":3.0},
	{"date":"Administrative And Support Service Activities","Continuing to Trade":0.0,"Permanently Ceased Trading":0.4,"Temporarily Closed or Paused Trading":8.1},
	{"date":"Education","Continuing to Trade":0.0,"Permanently Ceased Trading":0.6,"Temporarily Closed or Paused Trading":12.6},
	{"date":"Human Health And Social Work Activities","Continuing to Trade":0.0,"Permanently Ceased Trading":1.4,"Temporarily Closed or Paused Trading":4.9},
	{"date":"Arts, Entertainment And Recreation","Continuing to Trade":0.0,"Permanently Ceased Trading":0.0,"Temporarily Closed or Paused Trading":79.5},
	{"date":"All Industries","Continuing to Trade":0.0,"Permanently Ceased Trading":0.5,"Temporarily Closed or Paused Trading":22.8}
	];

initStackedBarChart.draw({
	data: trading_data,
	key: trading_key,
	element: 'trading-stack'
});

function updateStackChart(){
	for (i=0; i < temp_data.length; i++){
		if (document.getElementById("contChk").checked){
			temp_data[i]["Continuing to Trade"] = trading_data[i]["Continuing to Trade"];
		} else{
			temp_data[i]["Continuing to Trade"] = 0.0;
		}

		if (document.getElementById("ceasedChk").checked){
			temp_data[i]["Permanently Ceased Trading"] = trading_data[i]["Permanently Ceased Trading"];
		} else{
			temp_data[i]["Permanently Ceased Trading"] = 0.0;
		}

		if (document.getElementById("pausedChk").checked){
			temp_data[i]["Temporarily Closed or Paused Trading"] = trading_data[i]["Temporarily Closed or Paused Trading"];
		} else{
			temp_data[i]["Temporarily Closed or Paused Trading"] = 0.0;
		}
	}

	initStackedBarChart.draw({
	data: temp_data,
	key: trading_key,
	element: 'trading-stack'
});
}