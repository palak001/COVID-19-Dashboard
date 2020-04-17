function createIndiaMap(width, height) {
    d3.select("#map")
        .attr("width", width)
        .attr("height", height)
        .append("text")
        .classed("indiaMap-title", true)
        .attr("x", width/2)
        .attr("y", "1em")
        .attr("font-size", "3em")
        .attr("font-weight", "bold")
        .style("text-anchor", "middle");
}

function drawIndiaMap(geoData, caseData, stateWiseData){
    d3.select(".indiaMap-title").text("India COVID 19 cases");

    let totalCases = [];

    geoData.forEach(d => {
        let state = caseData.filter(s => s.statecode === d.id);
        if(state[0]) {
            totalCases.push(+state[0].confirmed);
            d.properties = {
                state: state[0].state, 
                confirmed: +state[0].confirmed, 
                deaths: +state[0].deaths, 
                recovered: +state[0].recovered
            };
        }
        else {
            d.properties = {
                ...name,
                dataNotAvailable: true
            };
        }
    });
    console.log(geoData);
    console.log(totalCases);
    let colors = ["#f1c40f", "#e67e22", "#e74c3c", "#c0392b", "#ED2939"];
    let max = d3.max(totalCases);
    let domain = [0, max/8, max/4, max/2, max];
    let colorScale = d3.scaleLinear()
                        .domain(domain)
                        .range(colors);


    let map = d3.select("#map");
    // // let projection = d3.geoMercator()
    //                     .scale(110)
    //                     .translate([+map.attr("width")/2, +map.attr("height"/1.4)]);

    var projection = d3.geoMercator()
                        .center([2, 47])                // GPS of location to zoom on
                        .scale(980)                       // This is like the zoom
                        .translate([+map.attr("width")/2, +map.attr("height")/2 ])

    let path = d3.geoPath()
                .projection(projection);

    let update = map.selectAll(".state")
                    .data(geoData);

    update  
        .enter()
        .append("path")
            .classed("state", true)
            .attr("d", path)
        .merge(update)
            .attr("fill", d => {
                if(d.properties.dataNotAvailable === true || d.properties.confirmed === 0)
                    return "#ccc";
                
                return colorScale(d.properties.confirmed);
            });
}