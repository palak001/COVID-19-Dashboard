function createBar(dataType) {
    let bar;
    var width = window.innerWidth * .9;
    var height = window.innerHeight / 3 - 30;
    if(dataType === "confirmed") {
        bar = d3.select("#bar1")
    }
    else if(dataType === "death") {
            bar = d3.select("#bar2")
    }
    else if(dataType === "recovered") {
            bar = d3.select("#bar3")
    }

    bar     
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${width} ${height}`)  

    bar.append("g")
        .classed("x-axis", true);
    bar.append("g")
        .classed("y-axis", true);

    bar.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", - height/2)
        .attr("dy", ".75em")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .classed("y-axis-label", true);
}


//for highlighting bars on hovering
function highlightBars(date, dataType, colorScale) {
    let bar;
    if(dataType === "confirmed") {
        bar = d3.select("#bar1")
    }
    else if(dataType === "death") {
            bar = d3.select("#bar2")
        }
    else if(dataType === "recovered") {
            bar = d3.select("#bar3")
    }
    
    bar.selectAll("rect")
        .attr("fill", d => {
            if(d.date === date)
                return "#ccc";
            else if(dataType === "confirmed")
                return colorScale(d.confirmed);
            else if(dataType === "death")
                return colorScale(d.deaths);
            else if(dataType === "recovered")
                return colorScale(d.recovered);
          });
}


function drawBar(countryData, countryName, countryCode, dataType) {
    let bar;
    if(dataType === "confirmed") {
        bar = d3.select("#bar1")
    }
    else if(dataType === "death") {
            bar = d3.select("#bar2")
        }
    else if(dataType === "recovered") {
            bar = d3.select("#bar3")
    }

    d3.select("#countryName")
        .html(`
        <span style="font-size: 40px">${countryName[0].toUpperCase()}</span>${countryName.substr(1)}
        `);

    let padding = {
        top: 10,
        right: 40,
        bottom: 10,
        left: 40
    };
    let barPadding = .5;

    var width = window.innerWidth * .9;
    var height = window.innerHeight / 3 - 30;
    let data = countryData[countryName] || countryData[countryCode];
    if(!data){
        data = [];
        let now = new Date;
        data.push({
            date : d3.timeDay(now),
            confirmed: 0,
            deaths: 0,
            recovered: 0
        })

        var date = data[0].date;
        var year=date.getFullYear();
        var month=date.getMonth()+1 //getMonth is zero based;
        var day=date.getDate();
        data[0].date=year+"-"+month+"-"+day;
    }

    let xScale = d3.scaleLinear()
                    .domain(d3.extent(data, d => d.date))
                    .range([2*padding.left, width-padding.right]);
    let yScale;
    let max;
    if(dataType === "confirmed") {
        max = d3.max(data, d => d.confirmed);
        yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.confirmed)])
        .range([height - padding.bottom, padding.top]);
    }
    else if(dataType === "death") {
        max = d3.max(data, d => d.deaths);
        yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.deaths)])
        .range([height - padding.bottom, padding.top]);
        }
    else if(dataType === "recovered") {
        max = d3.max(data, d => d.recovered);
        yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.recovered)])
        .range([height - padding.bottom, padding.top]);
    }
    
    let barColorDomain = [0, max/1000, max/100, max/10, max];
    let colors = ["#F8B195",   "#F67280",   "#C06C84",   "#6C5B7B",   "#355C7D" ];
    let colorScale = d3.scaleLinear()
                        .domain(barColorDomain)
                        .range(colors);

    let  numBars = data.length;
    let barWidth =  (width -2* padding.right - padding.left) / numBars;

    let xAxis = d3.axisBottom(xScale);

    bar.select(".x-axis")
        .attr("transform", "translate(" + (0) + ", " + (height - padding.bottom) + ")")
        .call(xAxis);

    let yAxis = d3.axisLeft(yScale);

    bar.select(".y-axis")
        .attr("transform", "translate(" + (2*padding.left ) + ",0)")
        .transition()
        .duration(500)
        .call(yAxis);

    bar.select(".y-axis-label")
        .text(`${dataType} cases`);

    let t = d3.transition()
                .duration(2000)
                .ease(d3.easeSinOut);

    let barName;
    if(dataType === "confirmed") {
        barName = "bar1";
    }
    else if(dataType === "death") {
        barName = "bar2";
    }
    else if(dataType === "recovered") {
        barName = "bar3";
    }

    let update = bar    
        .selectAll(`.${barName}`)
        .data(data);
        
    let tooltipString;

    update  
        .exit()
        .transition(t)
            .delay((d, i, nodes) => (nodes.length - i - 1) * 10)
            .attr("y", height - padding.bottom)
            .attr("height", 0)
            .remove();

    update  
        .enter()
        .append("rect")
          .classed(barName, true)
          .attr("y", height - padding.bottom)
          .attr("height", 0)
          .on("mouseover touchstart", function() {
            let tooltip = d3.select(".tooltip");
            let tgt = d3.select(d3.event.target);
            let bardata = tgt.data()[0];
            highlightBars(bardata.date, dataType, colorScale);
            tooltip 
            .style("opacity", 1)
            .style("left", (d3.event.pageX - tooltip.node().offsetWidth / 2) + "px")
            .style("top", (d3.event.pageY + 10) + "px");
            if(bardata) {
                if(dataType )
                    if(dataType === "confirmed") {
                        tooltipString = "Confirmed: " + bardata.confirmed;
                    }
                    else if(dataType === "death") {
                        tooltipString = "Deaths: " + bardata.deaths;
                    }
                    else if(dataType === "recovered") {
                        tooltipString = "Recovered: " + bardata.recovered;
                    }
                tooltip
                    .html(`
                        <p>Date: ${bardata.date}</p>
                        <p>${tooltipString}</p>
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
            bar
                .selectAll("rect")
                .attr("fill", d => {
                    if(dataType === "confirmed")
                        return colorScale(d.confirmed);
                    else if(dataType === "death")
                        return colorScale(d.deaths);
                    else if(dataType === "recovered")
                        return colorScale(d.recovered);
                });
            d3.select(".tooltip")
                .style("opacity", 0);
        })
        .merge(update)
            .attr("x", function(d, i) {
                return (barWidth) * (i) + 2*padding.left; })
            .attr("width", barWidth - barPadding)
            .transition(t)
            .delay((d, i) => i *10)
                .attr("y", d => {
                    if(dataType === "confirmed")
                       return yScale(d.confirmed);
                    else if(dataType === "death")
                        return yScale(d.deaths);
                    else if(dataType === "recovered")
                        return yScale(d.recovered);
                })
                .attr("height", d => {
                    if(dataType === "confirmed")
                        return height - padding.bottom - yScale(d.confirmed);
                    else if(dataType === "death")
                        return height - padding.bottom - yScale(d.deaths);
                    else if(dataType === "recovered")
                        return height - padding.bottom - yScale(d.recovered);
                })
                .attr("fill", d => {
                    if(dataType === "confirmed")
                        return colorScale(d.confirmed);
                    else if(dataType === "death")
                        return colorScale(d.deaths);
                    else if(dataType === "recovered")
                        return colorScale(d.recovered);
                });

}

