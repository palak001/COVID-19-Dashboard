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

function drawBar(countryData, countryName, countryCode) {
    let bar = d3.select("#bar1");
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
    // console.log(data);
    // console.log(d3.max(data, d => d.date));
    let xScale = d3.scaleLinear()
                    .domain(d3.extent(data, d => d.date))
                    .range([padding.left, width-padding.right]);
    let yScale = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.confirmed)])
                    .range([height - padding.bottom, padding.top]);
    let  numBars = data.length;
    let barWidth =  width / numBars - barPadding;
    // console.log(barWidth);
    // console.log(xScale.range()[xScale.domain()[0]+1]);
    // console.log(xScale.range()[1]);

    let xAxis = d3.axisBottom(xScale);

    d3.select(".x-axis")
        .attr("transform", "translate(0, " + (height - padding.bottom) + ")")
        .call(xAxis);

    let yAxis = d3.axisLeft(yScale);

    d3.select(".y-axis")
        .attr("transform", "translate(" + (padding.left - barWidth/2) + ",0)")
        .transition()
        .duration(500)
        .call(yAxis);

    let t = d3.transition()
                .duration(500)
                .ease(d3.easeBounceOut);

    let update = bar    
                    .selectAll(".bar1")
                    .data(data);
    update  
        .exit()
        .transition(t)
            .delay((d, i, nodes) => (nodes.length - i - 1) * 50)
            .attr("y", height - padding.bottom)
            .attr("height", 0)
            .remove();

    update  
        .enter()
        .append("rect")
          .classed("bar1", true)
          .attr("y", height - padding.bottom)
          .attr("height", 0)
        .merge(update)
            .attr("x", function(d, i) {
                return (barWidth + barPadding) * i; })
            .attr("width", barWidth - barPadding)
            .transition(t)
            .delay((d, i) => i *50)
                .attr("y", d => yScale(d.confirmed))
                .attr("height", d => height - padding.bottom - yScale(d.confirmed))
                .attr("fill", "teal");
}
