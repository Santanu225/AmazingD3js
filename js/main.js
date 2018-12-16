/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 1 - Star Break Coffee
 */
// Declaring Variables

var margin = { left: 100, right: 100, top: 100, bottom: 100 };

var width = 800 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

var flag = true;
var t = d3.transition().duration(750);

// add Svg to the div
var svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);
// Add g to Svg
var g = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set Scales
var x = d3
  .scaleBand()
  .range([0, width])
  .padding(0.2);

var y = d3.scaleLinear().range([height, 0]);

//add axis groups
var xAxisGroup = g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")");

var yAxisGroup = g.append("g").attr("class", "y axis");

// X labels

g.append("text")
  .attr("class", "X axis-label")
  .attr("x", width / 2)
  .attr("y", height + 50)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Months");

// Y label

var yLabel = g
  .append("text")
  .attr("class", "y axis-label")
  .attr("x", -(height / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Revenue");

// Get the data
d3.json("/data/revenues.json")
  .then(function(data) {
    // Format the data from stings to number
    data.forEach(d => {
      d.revenue = +d.revenue;
      d.profit = +d.profit;
    });

    d3.interval(function() {
      var newData = flag ? data : data.slice(1);
      update(newData);
      flag = !flag;
    }, 1000);

    update(data);
  })
  .catch(function(error) {
    console.log(error);
  });

function update(data) {
  var value = flag ? "revenue" : "profit";

  // setting domains dynamic
  x.domain(
    data.map(function(d) {
      return d.month;
    })
  );

  y.domain([
    0,
    d3.max(data, function(d) {
      return d[value];
    })
  ]);
  //Set the axis

  //X axis
  var xAxisCall = d3.axisBottom(x);
  xAxisGroup.transition(t).call(xAxisCall);
  //Y axis
  var yAxisCall = d3.axisLeft(y).tickFormat(function(d) {
    return "$" + d;
  });
  yAxisGroup.transition(t).call(yAxisCall);

  // Join New data with Old datas.
  var rects = g.selectAll("rect").data(data, function(d) {
    return d.month;
  });

  //Exit old elements not present inthe new data;
  rects
    .exit()
    .attr("fill", "red")
    .transition(t)
    .attr("y", y(0))
    .attr("height", 0)
    .remove();

  //Updates old elements present in the new data;
  rects
    .transition(t)
    .attr("y", function(d) {
      return y(d[value]);
    })
    .attr("x", function(d) {
      return x(d.month);
    })
    .attr("height", function(d) {
      return height - y(d[value]);
    })
    .attr("width", x.bandwidth);

  //Enter new elements presents in the new data;
  rects
    .enter()
    .append("rect")

    .attr("x", function(d) {
      return x(d.month);
    })
    .attr("width", x.bandwidth)
    .attr("fill", function(d) {
      return "grey";
    })
    .attr("y", y(0))
    .attr("height", 0)

    .merge(rects)
    .transition(t)
    .attr("x", function(d) {
      return x(d.month);
    })
    .attr("width", x.bandwidth)
    .attr("y", function(d) {
      return y(d[value]);
    })
    .attr("height", function(d) {
      return height - y(d[value]);
    });

  var label = flag ? "Revenue" : "Profit";
  yLabel.text(label);
}
