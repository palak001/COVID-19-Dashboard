function createWorldMap(width, height) {

    d3.select("#worldMap")
        .attr("height", height)
        .attr("width", width)
}

function drawWorldMap(geoData, data, countryData) {
    let totalConfirmedCases = [];
    geoData.forEach(d => {
        let countries = data.filter(c => c.Country === d.properties.name || c.CountryCode === d.properties.name);
        if(countries[0])
            d.properties = countries[0];
        else {
            d.properties = {
                ...name,
                TotalConfirmed: 0,
                dataNotAvailable: true
            }
        }
        (countries[0] && countries[0].TotalConfirmed) ? totalConfirmedCases.push(countries[0].TotalConfirmed) : totalConfirmedCases.push(0);
    });

    console.log(geoData);

    let colors = ["#E0EEEE", "#66CCCC", "#73B1B7", "#00868B", "#2F4F4F"];
    let max =  d3.max(totalConfirmedCases);
    let domain= [0,max/8, max/4, max/2, max];
    let colorScale = d3.scaleLinear()
                        .domain(domain)
                        .range(colors);

    let map = d3.select("#worldMap");
    let projection = d3.geoMercator()
                        .scale(110)
                        .translate([+map.attr("width")/2, +map.attr("height")/1.4]);
    let path = d3.geoPath()
                    .projection(projection);

    let update = map.selectAll(".country")
                    .data(geoData);

    update  
        .enter()
        .append("path")
            .classed("country", true)
            .attr("d", path)
            .on("mouseover touchstart", function() {
                let tooltip = d3.select(".tooltip");
                let tgt = d3.select(d3.event.target);
                let data = tgt.data()[0].properties;
                tooltip 
                .style("opacity", 1)
                .style("left", (d3.event.pageX - tooltip.node().offsetWidth / 2) + "px")
                .style("top", (d3.event.pageY - tooltip.node().offsetHeight - 10) + "px");
                if(data.Country != undefined) {
                    tooltip
                    .html(`
                        <p>Country: ${data.Country}</p>
                        <p>Total Confirmed: ${data.TotalConfirmed} </p>
                        <p>Total Deaths: ${data.TotalDeaths}</p>
                        <p>Total Recovered: ${data.TotalRecovered}</p>
                    `)
                }
                else {
                    tooltip
                    .html(`
                        <p>Data not available</p>
                    `)  
                }

            })
            .on("mouseout touchend", function() {
                d3.select(".tooltip")
                    .style("opacity", 0);
            })
            .on("click", function() {
                console.log("clicked");
                let country = d3.select(this);
                let isActive = country.classed("active");
                let countryName = isActive ? "" : (country.data()[0].properties.Country || country.data()[0].properties.name) ;
                let countryCode = isActive ? "" : (country.data()[0].properties.CountryCode || country.data()[0].properties.name);
                if(countryName && countryCode) {
                    drawBar(countryData, countryName, countryCode);
                    d3.selectAll(".country").classed("active", false);
                    country.classed("active", !isActive);
                }
            })
        .merge(update)
            .attr("fill", d => {
                if(d.properties.dataNotAvailable === true || d.properties.TotalConfirmed === 0)
                    return "#ccc";
                let val = d.properties ? d.properties.TotalConfirmed : 0;
                return colorScale(val);
            });
}