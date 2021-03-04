let plt = document.getElementById("plot");

function plotData() {
  var trace1 = {
    x: data.x,
    y: data[1],
    name: "Infected",
    mode: "lines",
    line: {width: 0.5, color: "#ffc107"},
    type: "scatter",
    stackgroup: "one"
  };

  var trace2 = {
    x: data.x,
    y: data[2],
    name: "Confirmed",
    mode: "lines",
    line: {width: 0.5, color: "#dc3545"},
    type: "scatter",
    stackgroup: "one"
  };

  var trace3 = {
    x: data.x,
    y: data[3],
    name: "Dead",
    mode: "lines",
    line: {width: 0.5, color: "#343a40"},
    type: "scatter",
    stackgroup: "one"
  };

  var trace4 = {
    x: data.x,
    y: data[4],
    name: "Immune",
    mode: "lines",
    line: {width: 0.5, color: "#007bff"},
    type: "scatter",
    stackgroup: "one"
  };

  var layout = {
    xaxis: {
      title: {
        text: 'Days',
      },
    },
    yaxis: {
      title: {
        text: 'Cases',
      }
    }
  };

  if (windowWidth < 750) {
    $("#plot").css("width", "320px");
    layout["showlegend"] = false;
  }

  Plotly.newPlot(plt, [trace1, trace2, trace3, trace4], layout);
}