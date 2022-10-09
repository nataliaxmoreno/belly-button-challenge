

function dropdown(patientselected){d3.json("samples.json").then((data) => {
  let metadata = data.metadata;
  let patient = metadata.filter((sampleobject) => sampleobject.id == patientselected)[0];
  let demographicInfoBox = d3.select("#sample-metadata");
  demographicInfoBox.html("");
  demographicInfoBox.append("h5").text(patient.map(key=>(`${key}: ${value}`)));}
}
       


function buildCharts(patientselected) 
{
  {d3.json("samples.json").then((data) => {
        let samples = data.samples;
        let patient = metadata.filter((sampleobject) => sampleobject.id == patientselected)[0];
        let otu_ids = patient.otu_ids;
        let otu_labels = patient.otu_labels;
        let sample_values = patient.sample_values;
                                               
        // Build a Bubble Chart                            
        let bubbleLayout = {                                                                                                                    
          title: "Bacteria Cultures Per Sample",
          margin: { t: 0 },
          hovermode: "closest",
          xaxis: { title: "OTU ID" },                                                                                                                       
          margin: { t: 30}    
        };
        let bubbleData = [{x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",                        
            marker: {size: sample_values,                                                                                                                            
              color: otu_ids,
              colorscale: "Earth"}}];
    
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
        let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        let barData = [
          {
            y: yticks,
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
          }
        ];
    
        let barLayout = {
          title: "Top 10 Bacteria Cultures Found",
          margin: { t: 30, l: 150 }
        };
    
        Plotly.newPlot("bar", barData, barLayout);
    
      var guageData = [
          {
            domain: { x: [0, 5], y: [0, 1] },
            value: patient.wfreq,
            text: patient.wfreq,
            type: "indicator",
            mode: "gauge+number",
            delta: { reference: 10 },
            gauge: {
              axis: { range: [null, 9] },
              steps: [
                { range: [0, 1], color: "rgb(248, 243, 236)" },
                { range: [1, 2], color: "rgb(239, 234, 220)" },
                { range: [2, 3], color: "rgb(230, 225, 205)" },
                { range: [3, 4], color: "rgb(218, 217, 190)" },
                { range: [4, 5], color: "rgb(204, 209, 176)" },
                { range: [5, 6], color: "rgb(189, 202, 164)" },
                { range: [6, 7], color: "rgb(172, 195, 153)" },
                { range: [7, 8], color: "rgb(153, 188, 144)" },
                { range: [8, 9], color: "rgb(132, 181, 137)" },
              ],
            },
          },
        ];
    
        var layout = {
          title: "<b>Belly Button Washing Frequency</b> <br>Scrubs Per Week</br>",
          width: 350,
          height: 350,
          margin: { t: 50, r: 25, l: 25, b: 25 },
        };
        Plotly.newPlot("gauge", guageData, layout);
      });
    }
}
    
function init() 
{
      // Grab a reference to the dropdown select element
      let selector = d3.select("#selDataset");
    
      // Use the list of sample names to populate the select options
      d3.json("samples.json").then((data) => {
            for (let i = 0; i < sampleNames.length; i++){
          selector
            .append("option")
            .text(sampleNames[i])
            .property("value", sampleNames[i]);
        };
    
        // Use the first sample from the list to build the initial plots
        let firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
      });
}
    
function optionChanged(newSample) 
{
      // Fetch new data each time a new sample is selected
      buildCharts(newSample);
      buildMetadata(newSample);
}
    
    // Initialize the dashboard
    init();