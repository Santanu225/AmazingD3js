/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 1 - Star Break Coffee
 */
// Declaring Variables

var margin = { left: 100, right: 100, top: 100, bottom: 100 };

var width = 800 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

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

// X labels

g.append("text")
  .attr("class", "X axis-label")
  .attr("x", width / 2)
  .attr("y", height + 50)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Months");

// Y label

g.append("text")
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

    // Set Scales
    var x = d3
      .scaleBand()
      .domain(
        data.map(function(d) {
          return d.month;
        })
      )
      .range([0, width])
      .padding(0.2);

    var y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function(d) {
          return d.revenue;
        })
      ])
      .range([height, 0]);

    //Set the axis

    //X axis
    var xAxisCall = d3.axisBottom(x);
    g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxisCall);

    //Y axis
    var yAxisCall = d3.axisLeft(y).tickFormat(function(d) {
      return "$" + d;
    });
    g.append("g")
      .attr("class", "y axis")
      .call(yAxisCall);

    // Set the Bars
    var rects = g.selectAll("rects").data(data);
    rects
      .enter()
      .append("rect")
      .attr("y", function(d) {
        return y(d.revenue);
      })
      .attr("x", function(d) {
        return x(d.month);
      })
      .attr("width", x.bandwidth)
      .attr("height", function(d) {
        return height - y(d.revenue);
      })
      .attr("fill", function(d) {
        return "grey";
      });
  })
  .catch(function(error) {
    console.log(error);
  });
