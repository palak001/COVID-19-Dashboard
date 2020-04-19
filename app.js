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


        //list of all country names
        let ul = document.getElementById("countryList");
        for(let i = 0; i < worldCaseData.Countries.length; i++) {
            let countryName = worldCaseData.Countries[i].Country;
            let countryCode = worldCaseData.Countries[i].CountryCode;
            let li = document.createElement("li");
            console.log(countryName);
            li.innerHTML = `${countryName}`;
            ul.appendChild(li);
        }

        ul.addEventListener("click", selectedCountryName);
        let searchBar = document.getElementById("searchBar");
        searchBar.addEventListener("keyup", searchFunc);

        // searchBar.onblur = function(e) {
        //     console.log(e.relatedTarget);
        //     // console.log(document.activeElement.tagName);
        //     if(document.activeElement.tagName === "ul" || document.activeElement.tagName === "li") return;
        //     document.getElementById("controlHeight").style.display = "none";
        // }
        searchBar.onfocus = function() {
            document.getElementById("controlHeight").style.display = "block";
        }

        function searchFunc() {
            let input = document.getElementById("searchBar");
            let inputText = input.value.toLowerCase();      // so far entered search term
            let li = document.getElementsByTagName("li"); // array of list tags
            let liText;
            for(let i = 0; i < li.length; i++) {
                liText = li[i].innerText;
                if(liText.toLowerCase().indexOf(inputText) > -1) {
                    li[i].style.display = "block";
                }
                else {
                    li[i].style.display = "none";
                }
            }

        }

        function selectedCountryName(e) {
            // console.log(e.target)
            if(!e.target.matches('li')) {
                return;
            } 
            document.getElementById("controlHeight").style.display = "none";
            document.getElementById("searchBar").value = e.target.innerText;
            let searchTerm = e.target.innerText;
            let countries = document.getElementsByClassName("country");
            // console.log(searchTerm);
            // console.log(countries);
            let flag = 0;
            for(let i = 0; i < countries.length; i++) {
                console.log(countries[i].classList.contains(searchTerm));
                if(countries[i].classList.contains(searchTerm)) {
                    flag = 1;
                    d3.select(".active").classed("active", false);
                    d3.select(`.${searchTerm}`).classed("active", true);
                }
            }
            if(flag === 0)
            {
                d3.selectAll(".country").classed("active", false);
            }
        }

    
    })
