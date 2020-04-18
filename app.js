d3.queue()
    .defer(d3.json, "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .defer(d3.json, "https://api.covid19api.com/summary")
    .defer(d3.json, "https://pomber.github.io/covid19/timeseries.json")
    .await(function(error, worldMapData,worldCaseData, countryDailyData) {
        if(error) throw error;

        let worldGeoData = topojson.feature(worldMapData, worldMapData.objects.countries).features;

        //list of all country names
        let ul = document.getElementById("countryList");
        for(let i = 0; i < worldCaseData.Countries.length; i++) {
            let countryName = worldCaseData.Countries[i].Country;
            let countryCode = worldCaseData.Countries[i].CountryCode;
            let li = document.createElement("li");
            li.innerHTML = `${countryName}(${countryCode})`;
            ul.appendChild(li);
        }
        // d3.select("#searchBar")
        //     .on("keydown", searchFunc);

        let searchBar = document.getElementById("searchBar");
        searchBar.addEventListener("keyup", searchFunc);
        searchBar.onblur = function() {
            document.getElementById("controlHeight").style.display = "none";
        }
        searchBar.onfocus = function() {
            document.getElementById("controlHeight").style.display = "inline";
        }
        // console.log(countryName);

            createWorldMap();
            createBar("confirmed");
            createBar("death")
            createBar("recovered");
            drawWorldMap(worldGeoData, worldCaseData.Countries, countryDailyData);
            drawBar(countryDailyData, "", "", "confirmed");
            drawBar(countryDailyData, "", "", "death");
            drawBar(countryDailyData, "", "", "recovered");

        function searchFunc() {
            let input = document.getElementById("searchBar");
            let inputText = input.value.toLowerCase();      // so far entered search term
            let li = document.getElementsByTagName("li"); // array of list tags
            let liText;
            for(let i = 0; i < li.length; i++) {
                liText = li[i].innerText;
                // console.log(liText);
                if(liText.toLowerCase().indexOf(inputText) > -1) {
                    li[i].style.display = "";
                }
                else {
                    li[i].style.display = "none";
                }
            }

        }

    
    })
