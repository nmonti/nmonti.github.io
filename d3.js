// Counties from GeoJSON
const US_URL = "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json";

// Map width/height
const width = 975, height = 610;

// Load in JSON, then draw the map
Promise.all([
  d3.json(US_URL)
]).then(([geo]) => {
  // Raw geo data
  console.log("geo: ", geo);

  // list of counties
  const counties = geo.features;
  console.log("counties: ", counties);

  // Create random values per-county
  const values = new Map(counties.map(d => [d.id, Math.random() * 100]));
  d3.select("#source").text("Demo data (random). Add data.csv with id,value columns to use real data.");

  // Use "yellow to red" color scale
  const colorSequence = d3.scaleSequential(d3.interpolateYlOrRd)
  // Use our data values as the scale. Default range is [0, 1]
  const color = colorSequence.domain(d3.extent(values.values()));

  console.log("color", color);

  const projection = d3.geoAlbersUsa()
    .scale(1300)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath(projection);

  const svg = d3.select("#map").append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const tooltip = d3.select("#tooltip");

  svg.append("g")
    .selectAll("path")
    .data(counties)
    .join("path")
    .attr("class", "county")
    .attr("d", path)
    .attr("fill", d => values.has(d.id) ? color(values.get(d.id)) : "#ccc")
    .on("mousemove", (event, d) => {
      const v = values.get(d.id);
      const { NAME, LSAD, STATE } = d.properties;
      tooltip
        .style("opacity", 1)
        .style("left", (event.pageX + 12) + "px")
        .style("top", (event.pageY + 12) + "px")
        .html(`<strong>${NAME} ${LSAD}</strong><br>${v == null ? "No data" : d3.format(",.1f")(v)}`);
    })
    .on("mouseleave", () => tooltip.style("opacity", 0));

  // Legend
  const legendWidth = 260, legendHeight = 10;
  const legend = svg.append("g").attr("transform", `translate(${width - legendWidth - 40}, 20)`);
  const gradientId = "legend-gradient";
  const gradient = legend.append("defs").append("linearGradient").attr("id", gradientId);
  d3.range(0, 1.01, 0.1).forEach(t => {
    gradient.append("stop")
      .attr("offset", `${t * 100}%`)
      .attr("stop-color", d3.interpolateYlOrRd(t));
  });
  legend.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .attr("fill", `url(#${gradientId})`);
  const legendScale = d3.scaleLinear().domain(color.domain()).range([0, legendWidth]);
  legend.append("g")
    .attr("transform", `translate(0, ${legendHeight})`)
    .call(d3.axisBottom(legendScale).ticks(5).tickSize(4))
    .call(g => g.select(".domain").remove());

  // Shared hover handlers for the size maps.
  function showTooltip(event, d) {
    const v = values.get(d.id);
    const { NAME, LSAD } = d.properties;
    tooltip
      .style("opacity", 1)
      .style("left", (event.pageX + 12) + "px")
      .style("top", (event.pageY + 12) + "px")
      .html(`<strong>${NAME} ${LSAD}</strong><br>${v == null ? "No data" : d3.format(",.1f")(v)}`);
  }
  function hideTooltip() {
    tooltip.style("opacity", 0);
  }

  // Second map: size instead of color.
  // sqrt scale so the shape's *area* is proportional to the value; the max value draws at full size.
  const size = d3.scaleSqrt()
    .domain([0, d3.max(values.values())])
    .range([0, 1]);

  const sizeSvg = d3.select("#size-map").append("svg")
    .attr("viewBox", [0, 0, width, height]);

  // Full-size grey outlines underneath; these also catch the hover so tiny shapes are easy to point at.
  sizeSvg.append("g")
    .selectAll("path")
    .data(counties)
    .join("path")
    .attr("class", "county-outline")
    .attr("d", path)
    .on("mousemove", showTooltip)
    .on("mouseleave", hideTooltip);

  // Each county shrunk around its own centroid: move centroid to origin, scale, move back.
  sizeSvg.append("g")
    .selectAll("path")
    .data(counties.filter(d => values.has(d.id) && path.centroid(d).every(Number.isFinite)))
    .join("path")
    .attr("class", "county-scaled")
    .attr("d", path)
    .attr("transform", d => {
      const [cx, cy] = path.centroid(d);
      const k = size(values.get(d.id));
      return `translate(${cx},${cy}) scale(${k}) translate(${-cx},${-cy})`;
    });

  // Third map: size relative to a pivot. A value of PIVOT draws the county at normal size;
  // area is proportional to value / PIVOT, so 100 doubles the area and 25 halves it.
  const PIVOT = 50;
  const pivotScale = v => Math.sqrt(v / PIVOT);

  const pivotSvg = d3.select("#pivot-map").append("svg")
    .attr("viewBox", [0, 0, width, height]);

  // Biggest first so grown counties don't cover the shrunk ones drawn after them.
  const pivotCounties = counties
    .filter(d => values.has(d.id) && path.centroid(d).every(Number.isFinite))
    .sort((a, b) => values.get(b.id) - values.get(a.id));

  pivotSvg.append("g")
    .selectAll("path")
    .data(pivotCounties)
    .join("path")
    .attr("class", d => values.get(d.id) >= PIVOT ? "county-scaled county-over" : "county-scaled county-under")
    .attr("d", path)
    .attr("transform", d => {
      const [cx, cy] = path.centroid(d);
      const k = pivotScale(values.get(d.id));
      return `translate(${cx},${cy}) scale(${k}) translate(${-cx},${-cy})`;
    });

  // True county borders on top, so you can see what's grown past or shrunk inside its outline.
  pivotSvg.append("g")
    .selectAll("path")
    .data(counties)
    .join("path")
    .attr("class", "county-border")
    .attr("d", path)
    .on("mousemove", showTooltip)
    .on("mouseleave", hideTooltip);
}).catch(err => {
  d3.select("#map").append("p").text("Failed to load map data: " + err);
});
