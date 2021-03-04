const colour = ["#c6c9cc", "#ffc107", "#dc3545", "#343a40", "#007bff"];
const status = ["Healthy", "Infected", "Confirmed", "Dead", "Immune"];

let canvas;
let herd;

let selected;

let population = 5000;
let socialDistancing = 2;
let distribution = "gaussian";
let isolation = true;
let infectivity = 0.2;
let fatality = 0.05;
let incubationPeriod = 2;
let recoveryPeriod = 5;
let immunityPeriod = 10;

let virus;

let paused = true;
let timer = 0;

let days = 0;

let score = 0;
let vaccinePrice = 1;

let x = 0;
var data = {
  x: [],
  0: [],
  1: [],
  2: [],
  3: [],
  4: []
};

$("#tutorial").modal("show");

$("#simulate").click(function() {
  paused = false;
  $('html, body').css('overflow','hidden');
  $("#pause").removeClass("disabled");
  $("#simulate").addClass("disabled");
});

$("#pause").click(function() {
  if (paused) {
    $('html, body').css('overflow','hidden');
    $("#pause").text("Pause");
    $("#analyze").addClass("disabled");
  } else {
    $('html, body').css('overflow','visible');
    $("#pause").text("Resume");
    $("#analyze").removeClass("disabled");
  }
  paused = !paused;
});

$(".speed").click(function(event) {
  let speed = parseInt(event.target.id);
  frameRate(speed);
  switch (speed) {
    case 30:
      $("#speedText").text("Speed: Fast");
      break;
    case 15:
      $("#speedText").text("Speed: Average");
      break;
    case 5:
      $("#speedText").text("Speed: Slow");
      break;
  }
});

$("#analyze").click(function() {
  plotData();

  $("#analysisTitle").text(`Analysis - Day ${days}`);
  $("#analysis").modal("show");
});

$("#target").submit(function(event) {
  event.preventDefault()

  population = $("#inputSize").val();
  socialDistancing = $("#distancingSelect").children("option:selected").val();
  distribution = $("#distributionSelect").children("option:selected").val();
  incubationPeriod = $("#incubationSelect").children("option:selected").val();
  recoveryPeriod = $("#recoverySelect").children("option:selected").val();
  immunityPeriod = $("#immunitySelect").children("option:selected").val();

  infectivity = $('#infectivity').val() / 100;
  fatality = $('#fatality').val() / 100;

  isolation = $('#isolation').is(":checked");

  herd = new Herd(population, socialDistancing, distribution, isolation, width, height);
  virus = new Virus(infectivity, fatality, incubationPeriod, recoveryPeriod, immunityPeriod);

  $("#pause").text("Pause");
  $("#pause").addClass("disabled");
  paused = true;

  $("#simulate").removeClass("disabled");
  $("#analyze").addClass("disabled");

  x = 0;
  score = 0;
  days = 0;

  count = [population, 0, 0, 0, 0];
  data = {x: [], 0: [], 1: [], 2: [], 3: [], 4: []};
});

function setup() {
  if (windowWidth < 750) {
    canvas = createCanvas(windowWidth - 50, windowHeight - 120);
    population = 1000;
    $("#inputSize").val("1000");
  } else {
    canvas = createCanvas(windowWidth * 0.667 - 20, windowHeight - 150);
  }
  canvas.parent('sketch-holder');
  noStroke();

  background('white');

  herd = new Herd(population, socialDistancing, distribution, isolation, width, height);
  virus = new Virus(infectivity, fatality, incubationPeriod, recoveryPeriod, immunityPeriod);

  frameRate(30);
}

function windowResized() {
  if (windowWidth < 750) {
    resizeCanvas(windowWidth - 20, windowHeight - 150);
  } else {
    resizeCanvas(windowWidth * 0.667 - 20, windowHeight - 150);
  }
}

function draw() {
  if (!paused) {
    let boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
    let qtree = new QuadTree(boundary, 4);

    let count = [0, 0, 0, 0, 0];

    for (let human of herd.array){
      human.move();
      human.update();

      count[human.status]++;

      let p = new Point(human.x, human.y, human);
      qtree.insert(p);
    }

    updateProgress(count);

    if (timer > 30) {
      updateData(count);
      timer = 0;
      days++;
      if (days >= 100) {
        endGame();
      }
    } else {
      timer++;
    }

    for (let human of herd.array){
      if (human.status == 1 || (human.status == 2 && !human.isolation)) {
        let range = new Circle(human.x, human.y, human.diameter);
        let points = qtree.query(range);
        for (let point of points) {
          let other = point.userData;
          // for (let other of particles) {
          if (human !== other && (other.status == 0 || (other.status == 4 && other.virus.immunity == false)) && human.intersects(other)) {
            other.status = 1;
            other.virus = virus;
          }
        }
      }
    }
    vaccinate(qtree)

    if (random(1) < 0.05) {
      startInfection(qtree);
    }
  }
  background('white');
  herd.display();
}

function vaccinate(qtree) {
  let range = new Circle(mouseX, mouseY, 10);
  selected = qtree.query(range);

  if (selected && mouseIsPressed) {
    for (let p of selected) {
      if (p.userData.status == 0 && score > vaccinePrice) {
        p.userData.status = 4;
        p.userData.virus = virus;
        score -= vaccinePrice;
      }
    }
  }
}

function startInfection(qtree) {
  let range = new Circle(floor(random(width)), floor(random(height)), 10);
  selected = qtree.query(range);

  if (selected) {
    for (let p of selected) {
      if (p.userData.status == 0) {
        p.userData.status = 1;
        p.userData.virus = virus;
      }
    }
  }
}

function keyPressed() {
  if (selected) {
    for (let p of selected) {
      p.userData.status = 1;
      p.userData.virus = virus;
    }
  }
}

document.oncontextmenu = function() {
    return false;
}

function calculateCashFlow(count) {
  let income = (count[0] + count[4])/(1000*(1+socialDistancing));
  let loss = count[2]/1000;
  return income - loss;
}

function endGame() {
  paused = true;
  plotData();

  $("#pause").addClass("disabled");
  $("#analyze").removeClass("disabled");

  $("#days").text(`${days}`);
  $("#result").text(`${Math.ceil(score)}`);

  if (score > 0) {
    $("#summaryTitle").text("Congratulations!");
  } else {
    $("#summaryTitle").text("Game over!");
  }

  $("#summary").modal("show");
  $('html, body').css('overflow','visible');
}

function updateProgress(count) {
  let total = count[0] + count[1] + count[2] + count[3] + count[4];
  for (let i = 0; i < 5; i++) {
    $(`#${i}.progress-bar`).css("width", `${Math.ceil(count[i] / total * 100)}%`);
    $(`#${i}.count`).text(`${status[i]}: ${count[i]}`);
  }

  score += calculateCashFlow(count);

  if (score < 0) {
    score = 0;
    endGame();
  }
  
  $(`#score`).text(`Score: ${Math.floor(score)}`);
}

function updateData(count) {
  data.x.push(x);
  for (let i = 0; i < 5; i++) {
    data[i].push(count[i]);
  }
  x++;
}