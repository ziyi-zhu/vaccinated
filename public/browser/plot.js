let plt = document.getElementById("plot");

$("#analyze").click(function() {
  var trace1 = {
    x: plot.x,
    y: plot[1],
    name: "Infected",
    mode: "lines",
    line: {width: 0.5, color: "#ffc107"},
    type: "scatter",
    stackgroup: "one"
  };

  var trace2 = {
    x: plot.x,
    y: plot[2],
    name: "Confirmed",
    mode: "lines",
    line: {width: 0.5, color: "#dc3545"},
    type: "scatter",
    stackgroup: "one"
  };

  var trace3 = {
    x: plot.x,
    y: plot[3],
    name: "Dead",
    mode: "lines",
    line: {width: 0.5, color: "#343a40"},
    type: "scatter",
    stackgroup: "one"
  };

  var trace4 = {
    x: plot.x,
    y: plot[4],
    name: "Recovered",
    mode: "lines",
    line: {width: 0.5, color: "#007bff"},
    type: "scatter",
    stackgroup: "one"
  };

  var layout = {
    title: {
      text:'Total number of cases against time',
    },
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

  var data = [trace1, trace2, trace3, trace4];
  Plotly.newPlot(plt, data, layout);

  $("#analysis").modal("show");
});