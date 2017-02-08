// will hold the received json data
var dataset = [];
// y scale for graph - GDP
var y;
// x scale for graph - dates
var x;

axios.get('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(function (response){
        data = response.data.data;
        printData(data);
    })
    .catch(function (error) {
        console.log(error);
    });


// called when json data is retrieved
function printData(data) {
    console.log(data);
    var maxGDP = d3.max(data, function(d) { return d[1]});
    var minGDP = d3.min(data, function(d) { return d[1]});
    console.log(maxGDP);
    console.log(minGDP);

    y = d3.scaleLinear()
        .domain([minGDP, maxGDP])
        .range([500, 0]);

    // TODO: parse dates
    x = d3.scaleLinear()
        .domain([new Date(Date.parse(data[0])), new Date(Date.parse(data[data.length-1]))]);
    console.log(data[0]);
    console.log(x.domain());;
}

