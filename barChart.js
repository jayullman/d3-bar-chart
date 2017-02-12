// will hold the received json data
var dataset = [];
// y scale for graph - GDP
var yScale;
// x scale for graph - dates
var xScale;

var svgWidth = 700;
var svgHeight = 500;
var svgPadding = 40;
var svgPaddingLeft = 100;

axios.get('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(function (response){
        data = response.data.data;
        printData(data);
    })
    .catch(function (error) {
        console.log(error);
    });


// called when json data is retrieved
function printData(dataSet) {
    console.log(dataSet);
    var maxGDP = d3.max(dataSet, function(d) { return d[1] });
    var minGDP = d3.min(dataSet, function(d) { return d[1] });
    console.log(maxGDP);
    console.log(minGDP);

    yScale = d3.scaleLinear()
        .domain([0, maxGDP])
        .range([svgHeight - svgPadding, svgPadding]);

    // TODO: parse dates
    xScale = d3.scaleLinear()
        .domain([Date.parse(dataSet[0][0]), Date.parse(dataSet[dataSet.length-1][0])])
        .range([svgPaddingLeft, svgWidth - svgPadding]);
        

        console.log(Date.parse(dataSet[dataSet.length-1][0]));
        
    console.log(dataSet[0]);
    var svg = d3.select('body').append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    // add x-axis label
    svg.append('text')
        .attr('x', svgWidth / 2 )
        .attr('y', svgHeight)
        .style('text-anchor', 'middle')
        .text('Year');

    // add y-axis label
    svg.append('text')
        .attr('x', 0 - svgHeight / 2)
        .attr('y', svgPadding)
        .style('text-anchor', 'middle')
        .text('Gross Domestic Product (USA)')
        .attr('transform', 'rotate(-90)');

    d3.select("svg").selectAll('rect')
        .data(dataSet)
        .enter()
        .append('rect')
        .attr('width', function(d, i) {
            return svgWidth / (dataSet.length);
        })
        .attr('height', function(d, i) {
            return (svgHeight - svgPadding) - yScale(d[1]);
        })
        .attr('x', function(d, i) {
            // console.log(xScale(Date.parse(d[0])));
            return xScale(Date.parse(d[0]));

            //return i * (svgWidth / dataSet.length);
        })
        .attr('y', function(d, i) {
            return yScale(d[1]);
        })
        .attr('fill', 'green');
        
    // create x and y axis


    var xAxis = d3.axisBottom(xScale);
    xAxis.tickSizeOuter(0);
    xAxis.tickFormat(d3.timeFormat('%Y'));

    svg.append('g')
        .attr('transform', 'translate(2,' + (svgHeight - svgPadding) + ')')
       .call(xAxis);
   
    var yAxis = d3.axisLeft(yScale);
    yAxis.tickSizeOuter(0);
    
    svg.append('g')
        .attr('transform', 'translate(' + svgPaddingLeft + ',0)')
        .call(yAxis);

}
