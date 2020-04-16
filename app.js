d3.queue()
    .defer(d3.json, "worldmap.json")
    .defer(d3.json, "worldCases.json")
    .defer(d3.json, "https://pomber.github.io/covid19/timeseries.json")
    .await(function(error, mapData, caseData, countryData) {
        if(error) throw error;

        let geoData = topojson.feature(mapData, mapData.objects.countries).features;

        // let height = 700;
        // let width = 1400;

        let width = +d3.select(".chart-container").node().offsetWidth;
        let height = 300;
        createWorldMap(width, width*4 / 5);
        createBar(width, height);
        drawWorldMap(geoData, caseData, countryData);
        drawBar(countryData, "", ""); //country name
        
    })