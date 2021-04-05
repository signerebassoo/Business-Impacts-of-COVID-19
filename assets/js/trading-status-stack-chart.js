var initStackedBarChart = {
	draw: function(config) {
		me = this,
		domEle = config.element,
		stackKey = config.key,
		data = config.data,
		margin = {top: 20, right: 60, bottom: 60, left: 215},
		width3 = document.getElementById(domEle).parentElement.offsetWidth - margin.left - margin.right,
		height3 = 500 - margin.top - margin.bottom,
		xScale = d3.scaleLinear().rangeRound([0, width3]),
		yScale = d3.scaleBand().rangeRound([height3, 0]).padding(0.1),
		color3 = d3.scaleOrdinal(d3.schemeCategory20),
		xAxis3 = d3.axisBottom(xScale),
		yAxis3 =  d3.axisLeft(yScale),
		svg3 = d3.select("#"+domEle).append("svg")
				.attr("width", width3 + margin.left + margin.right)
				.attr("height", height3 + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var stack = d3.stack()
			.keys(stackKey)
			.offset(d3.stackOffsetNone);

		var layers= stack(data);
			yScale.domain(data.map(function(d) { return d.date; }));
			xScale.domain([0, 100 ]).nice();

		var layer = svg3.selectAll(".layer")
			.data(layers)
			.enter().append("g")
			.attr("class", "layer")
			.style("fill", function(d, i) { return color(i); });

		  layer.selectAll("rect")
			  .data(function(d) { return d; })
			.enter().append("rect")
			  .attr("y", function(d) { return yScale(d.data.date); })
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

var trading_data_industry = [];
var trading_key = ["cont","closed","paused"];

d3.csv("assets/data/queries/trading-status-industry.csv", function (data){

    for (var i = 0; i < data.length; i+=3) {
    	var entry = {"date": data[i].industry, "cont": parseFloat(data[i].proportion), "closed": parseFloat(data[i+1].proportion), "paused": parseFloat(data[i+2].proportion)};
    	trading_data_industry.push(entry);
    }
    console.log(trading_data);
});

var data7 = [{"date":"Manufacturing","cont":79.0,"closed":0.4,"paused":20.6},
	{"date":"Water Supply, Sewerage, Waste Management And Remediation Activities","cont":90.0,"closed":0.0,"paused":10.0},
	{"date":"Construction","cont":73.2,"closed":0.7,"paused":26.1},
	{"date":"Wholesale And Retail Trade; Repair Of Motor Vehicles And Motorcycles","cont":75.2,"closed":0.5,"paused":24.3},
	{"date":"Accommodation And Food Service Activities","cont":18.2,"closed":1.2,"paused":80.6},
	{"date":"Transportation And Storage","cont":91.5,"closed":0.0,"paused":8.5},
	{"date":"Information And Communication","cont":95.0,"closed":0.5,"paused":4.5},
	{"date":"Professional, Scientific And Technical Activities","cont":96.7,"closed":0.3,"paused":3.0},
	{"date":"Administrative And Support Service Activities","cont":91.5,"closed":0.4,"paused":8.1},
	{"date":"Education","cont":86.8,"closed":0.6,"paused":12.6},
	{"date":"Human Health And Social Work Activities","cont":93.7,"closed":1.4,"paused":4.9},
	{"date":"Arts, Entertainment And Recreation","cont":20.5,"closed":0.0,"paused":79.5}
	];

initStackedBarChart.draw({
	data: data7,
	key: trading_key,
	element: 'trading-stack'
});