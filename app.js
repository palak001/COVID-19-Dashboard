d3.queue()
    .defer(d3.json, "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .defer(d3.json, "https://api.covid19api.com/summary")
    .defer(d3.json, "https://pomber.github.io/covid19/timeseries.json")
    .await(function(error, mapData, caseData, countryData) {
        if(error) throw error;

        let geoData = topojson.feature(mapData, mapData.objects.countries).features;

        let width = +d3.select(".chart-container").node().offsetWidth;
        let height = 300;
        createWorldMap(width, width*4 / 5);
        createBar(width, height, "confirmed");
        createBar(width, height, "death")
        createBar(width, height, "recovered");
        drawWorldMap(geoData, caseData.Countries, countryData);
        drawBar(countryData, "", "", "confirmed");
        drawBar(countryData, "", "", "death");
        drawBar(countryData, "", "", "recovered"); 
    
    })