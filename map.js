function createWorldMap() {
	var width = window.innerWidth * .97;
	var height = width/1.85;

	d3.select("#map")
        .attr("height", height)
		.attr("width", width)
		.append("text")
        .attr("x", width/2)
        .attr("y", "1em")
		.attr("font-size", "2em")
        .style("font-weight", "bold")
        .style("text-anchor", "middle")
        .classed("map-title", true);  
}

function drawWorldMap(geoData, data, countryData) {
	
	var width = window.innerWidth * .97;
	var height = width/1.85;

	let totalConfirmedCases = [];
    d3.select(".map-title").text("Worldwide COVID 19 cases")
    geoData.forEach(d => {
        let countries = data.filter(c => c.Country === d.properties.name || c.CountryCode === d.properties.name || c.slug === d.properties.name);
        if(countries[0])
            d.properties = countries[0];
        else{
            d.properties = {
                name: d.properties.name,
                // TotalConfirmed: 0,
                dataNotAvailable: true
            }
        }
        (countries[0] && countries[0].TotalConfirmed) ? totalConfirmedCases.push(countries[0].TotalConfirmed) : totalConfirmedCases.push(0);
    });

	//Define map projection 
	var projection = d3.geoMercator();
	projection
	.scale([width/9])
		.translate([width/2,height/1.4]);

	//Define path generator
	var path = d3.geoPath().projection(projection);

	let map = d3.select("#map");

	let colors = ["ffed83", "#f1c40f", "#e67e22", "#e74c3c", "#c0392b"];
    let max =  d3.max(totalConfirmedCases);
    let domain= [0,max/1000, max/100, max/10, max];
    let colorScale = d3.scaleLinear()
                        .domain(domain)
                        .range(colors);

	let update = map.selectAll(".country").data(geoData);
	
	update  
        .enter()
        .append("path")
            .classed("country", true)
            .attr("d", path)
            .on("mouseover touchstart", function() {
                let tooltip = d3.select(".tooltip");
                let tgt = d3.select(d3.event.target);
                let data = tgt.data()[0].properties;
                // console.log(countryData);
                tooltip 
                .style("opacity", 1)
                .style("left", (d3.event.pageX - tooltip.node().offsetWidth / 2) + "px")
                .style("top", (d3.event.pageY + 10) + "px");


                if((data.Country || data.name) && !data.dataNotAvailable) {
                    tooltip
                    .html(`
                        <p>Country: ${data.Country}</p>
                        <p>Total Confirmed: ${data.TotalConfirmed} </p>
                        <p>Total Deaths: ${data.TotalDeaths}</p>
                        <p>Total Recovered: ${data.TotalRecovered}</p>
                    `)    
                }
                else if(countryData[data.name||data.Country]){
                    tooltip
                    .html(`
                        <p>Total Data not available.</p>
                        <p>For daily basis data,</p> 
                        <p>Refer to below graph.</p>
                    `)  
                }
                else {
                    tooltip
                    .html(`
                        <p>Data not available.</p>
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
                console.log(countryName);
                console.log(country);

                if(countryName && countryCode) {
                    if((countryData[countryName||countryCode] || countryName === "Greenland")) {
                        d3.select("#barGraph").style("display", "inline");
                        var element = document.getElementById("barGraph");
                        element.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
                        drawBar(countryData, countryName, countryCode, "confirmed");
                        drawBar(countryData, countryName, countryCode, "death");
                        drawBar(countryData, countryName, countryCode, "recovered");
    
                        d3.selectAll(".country").classed("active", false);
                        country.classed("active", !isActive);
                    }

                }
            })
        .merge(update)
            .attr("fill", d => {
                if(d.properties.dataNotAvailable === true)
                    return "#ccc";
                let val = d.properties.TotalConfirmed;
                return colorScale(val);
            });

}