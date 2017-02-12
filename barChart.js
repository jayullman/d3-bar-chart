// will hold the received json data
var dataset = [];
// y scale for graph - GDP
var yScale;
// x scale for graph - dates
var xScale;

// dynamically set width of svg based on window size
var svgWidth = getSVGWidth();
var svgHeight = 400;
var svgPadding = 40;
var svgPaddingLeft = 80;
var tooltipHeight = 50;
var tooltipWidth = 100;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

axios.get('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(function (response){
        dataset = response.data.data;
        drawChart();
    })
    .catch(function (error) {
        console.log(error);
    });

function getSVGWidth() {
    width = window.innerWidth * .9;
    if (width > 700) {
            width = 700;
        } else if (width < 350) {
            width = 350;
        }
    return width;
}

// find width of browser window to resize graph dynamically   
window.onload = function() {
    // create tooltip
    var tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip');

    // labels within tooltip that will display gdp and date data
    tooltip.append('div')
        .attr('class', 'gdp-label');

    tooltip.append('div')
        .attr('class', 'date-label');
    
    // resize width of SVG when window resizes
    window.addEventListener('resize', function(event) {
        svgWidth = getSVGWidth();
        d3.select('svg').remove();
        drawChart();
    });
};   




function mouseOverHandler(d) {
    d3.select('.tooltip')
                .attr('style', 'left: ' + (d3.event.clientX + 10)
                    + 'px; top:  ' + (d3.event.clientY - tooltipHeight + 10) + 'px;' 
                    + 'height: ' + tooltipHeight + 'px; width: ' + tooltipWidth + 'px;')
                .classed('show-tooltip', true);

            d3.select('.gdp-label')
                .text('$' + d[1].toFixed(2) + ' Billion');
            
            var date = new Date(d[0])
            d3.select('.date-label')
                .text(date.getFullYear() + ', ' + MONTHS[date.getMonth()]);
}


// called when json data is retrieved
function drawChart() {
    var maxGDP = d3.max(dataset, function(d) { return d[1] });
    var minGDP = d3.min(dataset, function(d) { return d[1] });

    yScale = d3.scaleLinear()
        .domain([0, maxGDP])
        .range([svgHeight - svgPadding, svgPadding]);

    xScale = d3.scaleLinear()
        .domain([Date.parse(dataset[0][0]), Date.parse(dataset[dataset.length-1][0])])
        .range([svgPaddingLeft, svgWidth - svgPadding]);
        
    var svg = d3.select('.graph-container').append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr('class', 'graph');

    // add x-axis label
    svg.append('text')
        .attr('x', svgWidth / 2 )
        .attr('y', svgHeight - 5)
        .style('text-anchor', 'middle')
        .text('Year');

    // add y-axis label
    svg.append('text')
        .attr('x', 0 - (svgHeight / 2))
        .attr('y', (svgPadding - 10))
        .style('text-anchor', 'middle')
        .text('Gross Domestic Product (USA)')
        .attr('transform', 'rotate(-90)');

    d3.select("svg").selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('width', function(d, i) {
            return svgWidth / (dataset.length);
        })
        .attr('height', function(d, i) {
            return (svgHeight - svgPadding) - yScale(d[1]);
        })
        .attr('x', function(d, i) {
            // console.log(xScale(Date.parse(d[0])));
            return xScale(Date.parse(d[0]));

            //return i * (svgWidth / dataset.length);
        })
        .attr('y', function(d, i) {
            return yScale(d[1]);
        })
        .attr('class', 'bar')

        // add mouseover event to each bar
        .on('mouseenter', mouseOverHandler)
        .on('mousemove', mouseOverHandler)
        .on('mouseover', mouseOverHandler)
        .on('mouseleave', function() {
            d3.select('.tooltip')
                .classed('show-tooltip', false);
        });
        
    // create x and y axis
    var xAxis = d3.axisBottom(xScale);
    xAxis.tickSizeOuter(0);
    xAxis.tickFormat(d3.timeFormat('%Y'))
    
    // xAxis.style('color', 'green');

    svg.append('g')
        .attr('transform', 'translate(2,' + (svgHeight - svgPadding) + ')')
        .style('font-size', function() {
            if (svgWidth < 400) {
                return '6px';
            } else if ( svgWidth < 500) {
                return '8px';
            } else {
                return '12px';
            }
        })
       .call(xAxis);
   
    var yAxis = d3.axisLeft(yScale);
    yAxis.tickSizeOuter(0);
    
    svg.append('g')
        .attr('transform', 'translate(' + svgPaddingLeft + ',0)')
        .call(yAxis);


   

}
