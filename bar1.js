function createBar(width, height, dataType) {
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
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "1em")
        .classed("y-axis-label", true);

    bar.append("text")
        .attr("x", width/2)
        .attr("y", "1em")
        .attr("font-size", "1.5em")
        .style("text-anchor", "middle")
        .classed("bar-title", true);
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
          .attr("fill", d => d.date === date ? "#0000A0" : "teal")
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
        top: 20,
        right: 30,
        bottom: 30,
        left: 110
    };
    let barPadding = 1;
    let width = +bar.attr("width");
    let height = +bar.attr("height");
    let data = countryData[countryName] || countryData[countryCode];
    console.log(data);

    let xScale = d3.scaleLinear()
                    .domain(d3.extent(data, d => d.date))
                    .range([padding.left, width-padding.right]);
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
    let barWidth =  width / numBars - barPadding;

    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format(".0f"));

    bar.select(".x-axis")
        .attr("transform", "translate(0, " + (height - padding.bottom) + ")")
        .call(xAxis);

    let yAxis = d3.axisLeft(yScale);

    bar.select(".y-axis")
        .attr("transform", "translate(" + (padding.left + barWidth/2) + ",0)")
        .transition()
        .duration(500)
        .call(yAxis);

    bar.select(".y-axis-label")
        .text(`${dataType} cases`);

    bar.select(".bar-title").text(`${dataType} cases over time`);
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
                .attr("fill", "teal");
            d3.select(".tooltip")
                .style("opacity", 0);
        })
        .merge(update)
            .attr("x", function(d, i) {
                return (barWidth + barPadding) * i; })
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
                .attr("fill", "teal");
}
