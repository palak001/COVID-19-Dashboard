d3.queue()
    .defer(d3.json, "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    // .defer(d3.json, "https://gist.githubusercontent.com/karmadude/4527959/raw/59492893c2f13ffb909ba48253fa7fa30a640c56/in-states-topo.json")
    .defer(d3.json, "https://api.covid19api.com/summary")
    .defer(d3.json, "https://pomber.github.io/covid19/timeseries.json")
    // .defer(d3.json, "https://api.covid19india.org/data.json")
    // .defer(d3.json, "https://api.covid19india.org/states_daily.json")
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