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
    var samplesArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArrayFilter = samplesArray.filter(list => list.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var oneSample = samplesArrayFilter[0];
    // for gauge chart below, testing
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = oneSample.otu_ids;

    var otu_labels = oneSample.otu_labels;
   
    var sample_values = oneSample.sample_values;


    // 3. Create a variable that holds the washing frequency.
    var washing = result.wfreq;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    sortedOTU = otu_ids.sort((a,b) => b -a);
    slicedOTU = otu_ids.slice(0,10);
    var yticks = slicedOTU;

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values,
      y : yticks,
      type: "bar",
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      xvalues: sample_values,
      yvalues: yticks,
      title: "Belly Button Samples",
      hovertext: "otu_labels",
      bargap :0.05
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
        color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)', 'rgb(44, 160, 101)', 'rgb(255, 65, 54)','rgb(93, 164, 214)', 'rgb(255, 144, 14)', 'rgb(44, 160, 101)', 'rgb(255, 65, 54)','rgb(93, 164, 214)', 'rgb(255, 144, 14)'],
        sizemode: "area"}
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bubble Chart",
      xlabel: "OTU ID"
      // margins:
      // hovermode:
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: washing,
      title: { text: "Bellybutton Washing Frequency" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10] }}
     } ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, 
      height: 500, 
      margin: { t: 0, b: 0 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);
  
  });
}

