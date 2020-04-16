function createBar(width, height) {
    let bar = d3.select("#bar1")
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

function highlightBars(date) {
    d3.select("#bar1")
        .selectAll("rect")
          .attr("fill", d => d.date === date ? "#0000A0" : "teal")
}

function drawBar(countryData, countryName, countryCode) {
    let bar = d3.select("#bar1");
    d3.select("#countryName")
        .text(countryName);
    let padding = {
        top: 30,
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
    let yScale = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.confirmed)])
                    .range([height - padding.bottom, padding.top]);
    let  numBars = data.length;
    let barWidth =  width / numBars - barPadding;

    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format(".0f"));

    d3.select(".x-axis")
        .attr("transform", "translate(0, " + (height - padding.bottom) + ")")
        .call(xAxis);

    let yAxis = d3.axisLeft(yScale);

    d3.select(".y-axis")
        .attr("transform", "translate(" + (padding.left - barWidth/2) + ",0)")
        .transition()
        .duration(500)
        .call(yAxis);

    d3.select(".y-axis-label")
        .text("Confirmed cases");
    d3.select(".bar-title").text("Confirmed Cases Over Time");
    let t = d3.transition()
                .duration(2000)
                .ease(d3.easeSinOut);

    let update = bar    
                    .selectAll(".bar1")
                    .data(data);
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
          .classed("bar1", true)
          .attr("y", height - padding.bottom)
          .attr("height", 0)
          .on("mouseover touchstart", function() {
              console.log("mouseover");;
            let tooltip = d3.select(".tooltip");
            let tgt = d3.select(d3.event.target);
            let bardata = tgt.data()[0];
            tooltip 
            .style("opacity", 1)
            .style("left", (d3.event.pageX - tooltip.node().offsetWidth / 2) + "px")
            .style("top", (d3.event.pageY - tooltip.node().offsetHeight - 10) + "px");
            if(bardata) {
                tooltip
                tooltip
                    .html(`
                        <p>Data: ${bardata.date}</p>
                        <p>Confirmed: ${bardata.confirmed} </p>
                        <p>Deaths: ${bardata.deaths}</p>
                        <p>Recovered: ${bardata.recovered}</p>
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
            d3.select(".tooltip")
                .style("opacity", 0);
        })
        .merge(update)
            .attr("x", function(d, i) {
                return (barWidth + barPadding) * i; })
            .attr("width", barWidth - barPadding)
            .transition(t)
            .delay((d, i) => i *10)
                .attr("y", d => yScale(d.confirmed))
                .attr("height", d => height - padding.bottom - yScale(d.confirmed))
                .attr("fill", "teal");
}
