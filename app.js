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
		patientinfo(firstSample);
	});
}
// call the init function to generate the first graphs
init();

// this function is populating the patient information from metadata
function patientinfo(patientselected) {
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
				title: "<b>Bacteria Cultures Per Sample</b>",
				margin: {
					t: 0
				},
				hovermode: "closest",
				xaxis: {
					title: "OTU ID"
				},
				margin: {
					t: 30
				},
				paper_bgcolor: "rgba(0,0,0,0)",
				plot_bgcolor:'rgba(0,0,0,0)',
				font: {
					family: 'Arial',
					
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
				}, paper_bgcolor: "rgba(0,0,0,0)",
				font: {
					family: 'Arial',
					
				  }
			};
			Plotly.newPlot("gauge", guageData, layout);

			let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`);
			
			
			new Chart("my bar", {
				type: "horizontalBar",
				data: {
						labels: yticks,
						datasets: [{data: sample_values.slice(0, 10),
						borderWidth: 1,
						backgroundColor: [
									'rgba(255, 99, 132, 0.2)',
									'rgba(255, 159, 64, 0.2)',
									'rgba(255, 205, 86, 0.2)',
									'rgba(75, 192, 192, 0.2)',
									'rgba(54, 162, 235, 0.2)',
									'rgba(153, 102, 255, 0.2)',
									'rgba(201, 203, 207, 0.2)',
									'rgba(135, 212, 0, 0.2)',
									'rgba(0, 97, 255, 0.3)',
									'rgba(150, 36, 0, 0.2)'
								  ],
								  borderColor: [
									'rgb(255, 99, 132)',
									'rgb(255, 159, 64)',
									'rgb(255, 205, 86)',
									'rgb(75, 192, 192)',
									'rgb(54, 162, 235)',
									'rgb(153, 102, 255)',
									'rgb(201, 203, 207)'
								  ],
						}]
					  },
				options: {scales: {
					xAxes: [{
						ticks: {
							beginAtZero: true
						},
						responsive: false,
						maintainAspectRatio: false,
					}]
				},
				  legend: {display: false},
				  title: {
					display: true,
					text: "Top 10 Bacteria Cultures Found"
				  },
				  font: {family: "Arial", fontColor:"#f5f5f5"}
				 
				}
			  });


		});
		
	}
	
};

 


// this function changes all the graphs and uses and event listener, it has to be linked both in js and html 
function eventlistenerfunction(newSample) {Chart.helpers.each(Chart.instances, function (instance) {
	instance.destroy();
}); 
	// Fetch new data each time a new sample is selected
	buildCharts(newSample);
	patientinfo(newSample);
	
}


