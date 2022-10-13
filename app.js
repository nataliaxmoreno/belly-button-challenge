// This function will let you pick the id then generate the graphs for that patient
function init() {
	// Grab a reference to the dropdown select element
	let selector = d3.select("#selDataset");

	// Use the list of sample names to populate the select options
	d3.json("samples.json").then((data) => {
		// new data in browser
		console.log(data);
		let sampleNames = data.names;
		for (let i = 0; i < sampleNames.length; i++) {
			selector
				.append("option")
				.text(sampleNames[i])
				.property("value", sampleNames[i]);
		};

		// Use the first sample from the list to build the initial plots
		let firstSample = sampleNames[0];
		buildCharts(firstSample);
		dropdown(firstSample);
	});
}
// call the init function to generate the first graphs
init();

// this function is populating the patient information from metadata
function dropdown(patientselected) {
	d3.json("samples.json").then((data) => {
		let metadata = data.metadata;
		let patient = metadata.filter((sampleobject) => sampleobject.id == patientselected)[0];
		let demographicInfoBox = d3.select("#sample-metadata");
		demographicInfoBox.html("");
		for (key in patient) {
			demographicInfoBox.append("h6").text(`${key}: ${patient[key]}`);
		};

	})
}



function buildCharts(patientselected) {
	{
		d3.json("samples.json").then((data) => {
			let samples = data.samples;
			let patient = samples.filter((sampleobject) => sampleobject.id == patientselected)[0];
			let metadata = data.metadata.filter((sampleobject) => sampleobject.id == patientselected)[0];
			let otu_ids = patient.otu_ids;
			let otu_labels = patient.otu_labels;
			let sample_values = patient.sample_values;
			console.log(metadata)

			// Build a Bubble Chart                            
			let bubbleLayout = {
				title: "Bacteria Cultures Per Sample",
				margin: {
					t: 0
				},
				hovermode: "closest",
				xaxis: {
					title: "OTU ID"
				},
				margin: {
					t: 30
				}
			};
			let bubbleData = [{
				x: otu_ids,
				y: sample_values,
				text: otu_labels,
				mode: "markers",
				marker: {
					size: sample_values,
					color: otu_ids,
					colorscale: 'Electric'
				}
			}];

			Plotly.newPlot("bubble", bubbleData, bubbleLayout);

			let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
			let barData = [{
				y: yticks,
				x: sample_values.slice(0, 10).reverse(),
				text: otu_labels.slice(0, 10).reverse(),
				type: "bar",
				orientation: "h",
				marker: {
					color: '#B4F8C8'
				}
			}];

			let barLayout = {
				title: "Top 10 Bacteria Cultures Found",
				margin: {
					t: 30,
					l: 150
				}
			};

			Plotly.newPlot("bar", barData, barLayout);

			var guageData = [{
				domain: {
					x: [0, 5],
					y: [0, 1]
				},
				value: metadata.wfreq,
				text: metadata.wfreq,
				type: "indicator",
				mode: "gauge+number",
				delta: {
					reference: 10
				},
				gauge: {
					axis: {
						range: [null, 9]
					},
					steps: [{
						range: [0, 1],
						color: "rgb(128, 173, 61)"
					},
					{
						range: [1, 2],
						color: "rgb(140, 207, 41)"
					},
					{
						range: [2, 3],
						color: "rgb(160, 250, 25)"
					},
					{
						range: [3, 4],
						color: "rgb(214, 242, 172)"
					},
					{
						range: [4, 5],
						color: "rgb(136, 235, 180)"
					},
					{
						range: [5, 6],
						color: "rgb(142, 237, 206)"
					},
					{
						range: [6, 7],
						color: "rgb(108, 218, 235)"
					},
					{
						range: [7, 8],
						color: "rgb(84, 201, 247)"
					},
					{
						range: [8, 10],
						color: "rgb(104, 155, 242)"
					},
					],
				},
			},];

			var layout = {
				title: "<b>Belly Button Washing Frequency</b> <br>Scrubs Per Week</br>",
				width: 350,
				height: 350,
				margin: {
					t: 50,
					r: 25,
					l: 25,
					b: 25
				},
			};
			Plotly.newPlot("gauge", guageData, layout);
		});
	}
}


// this function changes all the graphs and uses and event listener, it has to be linked both in js and html 
function eventlistenerfunction(newSample) {
	// Fetch new data each time a new sample is selected
	buildCharts(newSample);
	dropdown(newSample);
}

// Initialize the dashboard
