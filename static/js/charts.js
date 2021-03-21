function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    var charts = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var arrayFilter = charts.filter(sampleObj => parseInt(sampleObj.id) == sample);

    //  5. Create a variable that holds the first sample in the array.
    var firstSample = arrayFilter[0];
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.map(otu => `otu ${otu}`).slice(0, 10).reverse();
    var xvalues = sampleValues.slice(0,10).reverse().map(element => element);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      y: yticks,
      x: xvalues,
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
    };
    // 10. Use Plotly to plot the data with the layout. 
    
    Plotly.newPlot("bar", barData, barLayout)

    // create trace for bubble data

    var bubbleData =[{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {size: sampleValues, color: otuIds, colorscale: "turbid"}
    }]
    
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
      margin: {t:60}
    }
    
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive:true})

  // 4. Create the trace for the gauge chart.
  var metadata = data.metadata;

  var metaFilter = metadata.filter(sampleObj => parseInt(sampleObj.id) == sample);

  console.log(metaFilter)

  //  5. Create a variable that holds the first sample in the array.
  var start = metaFilter[0];
  
  // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
  var partId = start.id;
  var washFreq = start.wfreq;
 
  console.log(washFreq)

    var gaugeData = [{
      domain: { x: partId, y: washFreq },
      value: washFreq,
      title: { text: "Scrubs per Week" },
      name: "Scrubs per Week",
      type: "indicator",
      mode: "gauge+number",
      gauge: {axis : {range: [null, 10]},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "#16d900"},
          { range: [8, 10], color: "#0a5700"}
        ],
        bar: {color: "black"}
        
        }
      }]
    
  // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 400, height: 350, margin: { t: 60 }, title: {text: "Bellybutton Washing Frequency"}
    };

  // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  }); 
  
}


