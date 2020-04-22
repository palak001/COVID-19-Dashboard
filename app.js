d3.queue()
    .defer(d3.json, "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .defer(d3.json, "https://api.covid19api.com/summary")
    .defer(d3.json, "https://pomber.github.io/covid19/timeseries.json")
    .await(function(error, worldMapData,worldCaseData, countryDailyData) {
        if(error) throw error;

        let worldGeoData = topojson.feature(worldMapData, worldMapData.objects.countries).features;
        createWorldMap();
        drawWorldMap(worldGeoData, worldCaseData.Countries, countryDailyData);
        d3.select("#text-area").style("display", "flex");

        Date.prototype.toShortFormat = function() {

            var month_names =["Jan","Feb","Mar",
                              "Apr","May","Jun",
                              "Jul","Aug","Sep",
                              "Oct","Nov","Dec"];
            
            var day = this.getDate();
            var month_index = this.getMonth();
            var year = this.getFullYear();
            
            return "" + day + " " + month_names[month_index] + " " + year;
        }
        
        let today = new Date();

        d3.select("#text-area").html(`
            <p><span style="color: #F67280">Globally</span>, as of <span style="color: #F67280">2:00am CEST, ${today}</span>, there have been <b>${worldCaseData.Global.TotalConfirmed.toLocaleString()}</b> confirmed cases of COVID-19, including <b>${worldCaseData.Global.TotalDeaths.toLocaleString()}</b> deaths and <b>${worldCaseData.Global.TotalRecovered.toLocaleString()}</b> recovery, reported to WHO.</p>
            <p>Click on the map to see country-wise cases.</p>
        `);



        //list of all country names
        let ul = document.getElementById("countryList");
        for(let i = 0; i < worldCaseData.Countries.length; i++) {
            let countryName = worldCaseData.Countries[i].Country;
            let countryCode = worldCaseData.Countries[i].CountryCode;
            let li = document.createElement("li");
            // console.log(countryName);
            li.innerHTML = `${countryName}`;
            ul.appendChild(li);
        }
        
        // Event Listeners
        ul.addEventListener("click", selectedCountryName);
        document.getElementsByTagName("body")[0].addEventListener("click", bodyClicked);
        let searchBar = document.getElementById("searchBar");
        searchBar.onclick = function(e) {
            e.stopPropagation();
            document.getElementById("controlHeight").style.display = "block";
            
        }
        searchBar.addEventListener("keyup", searchFunc);

        function bodyClicked(e) {
            document.getElementById("controlHeight").style.display = "none";

        }

        function searchFunc() {
            document.getElementById("controlHeight").style.display = "block";
            let inputText = searchBar.value.toLowerCase();      // so far entered search term
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
            e.stopPropagation();
            if(!e.target.matches('li')) {
                return;
            } 
            let searchTerm = e.target.innerText;
            let countries = document.getElementsByClassName("country");
            // console.log(countries);
            let flag = 0;
            for(let i = 0; i < countries.length; i++) {
                if(countries[i].classList.contains(searchTerm)) {
                    flag = 1;
                    document.getElementById("controlHeight").style.display = "none";
                    document.getElementById("searchBar").value = searchTerm;
                    d3.select(".active").classed("active", false);
                    d3.select(`.${searchTerm}`).classed("active", true);
                }
            }
            if(flag === 0)
            {
                document.getElementById("controlHeight").style.display = "none";
                d3.selectAll(".country").classed("active", false);
            }
            else {
                d3.select(`.${searchTerm}`).dispatch('click');

            }
        }
    })
