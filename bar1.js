function createBar(dataType) {
    let bar;
    var width = window.innerWidth * .95;
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
        .attr("width", width)
        .attr("height", height);

    bar.append("g")
        .classed("x-axis", true);
    bar.append("g")
        .classed("y-axis", true);

    bar.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", - height/2)
        .attr("dy", ".75em")
        .style("text-anchor", "middle")
        .style("font-size", "1em")
        .classed("y-axis-label", true);

}

function highlightBars(date, dataType) {
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
          .attr("fill", d => d.date === date ? "#a8a494" : "#61605c")
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
        .text(countryName);

    let padding = {
        top: 10,
        right: 20,
        bottom: 10,
        left: 40
    };
    let barPadding = .5;
    let width = +bar.attr("width");
    let height = +bar.attr("height");
    let data = countryData[countryName] || countryData[countryCode];
    // console.log(data);
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
    if(dataType === "confirmed") {
        yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.confirmed)])
        .range([height - padding.bottom, padding.top]);
    }
    else if(dataType === "death") {
        yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.deaths)])
        .range([height - padding.bottom, padding.top]);
        }
    else if(dataType === "recovered") {
        yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.recovered)])
        .range([height - padding.bottom, padding.top]);
    }
    

    let  numBars = data.length;
    console.log(data.length);
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

    // bar.select(".bar-title").text(`${dataType} cases over time`);
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
            //   console.log("mouseover");
            let tooltip = d3.select(".tooltip");
            let tgt = d3.select(d3.event.target);
            let bardata = tgt.data()[0];
            highlightBars(bardata.date, dataType);
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
                .attr("fill", "#61605c");
            d3.select(".tooltip")
                .style("opacity", 0);
        })
        .merge(update)
            .attr("x", function(d, i) {
                console.log((barWidth + barPadding) * i);
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
                .attr("fill", "#61605c");
}
