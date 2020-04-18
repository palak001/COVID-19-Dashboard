d3.queue()
    .defer(d3.json, "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .defer(d3.json, "https://api.covid19api.com/summary")
    .defer(d3.json, "https://pomber.github.io/covid19/timeseries.json")
    .await(function(error, worldMapData,worldCaseData, countryDailyData) {
        if(error) throw error;

        let worldGeoData = topojson.feature(worldMapData, worldMapData.objects.countries).features;

            createWorldMap();
            createBar("confirmed");
            createBar("death")
            createBar("recovered");
            drawWorldMap(worldGeoData, worldCaseData.Countries, countryDailyData);
            drawBar(countryDailyData, "", "", "confirmed");
            drawBar(countryDailyData, "", "", "death");
            drawBar(countryDailyData, "", "", "recovered");

    
    })