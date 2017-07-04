// represents our cars on
var cars = [];

// initialize the table in the fronted
var table = document.createElement("table");


function startSimulation() {

    var cells = parseInt(document.getElementById("cellsInput").value);
    var density = document.getElementById("densityInput").value;
    var dawdleProbability = document.getElementById("dawdleInput").value;
    var maxSpeed = parseInt(document.getElementById("maxSpeedInput").value);
    var generations = parseInt(document.getElementById("generationsInput").value);
    var amountOfCars = Math.floor(cells * density);

    var whichLaneProbability = 0.5;

    // set the calculated amount of cars
    document.getElementById("carsInput").value = amountOfCars;

    // set the cars to the lanes
    for (var i = 0; i < amountOfCars; i++) {
        //console.log(Math.round(cells * i / amountOfCars));
        var car = new Car(
            i, // id of the car
            Generator.getRandomSpeed(maxSpeed), // initial speed of the car
            Math.round(cells * i / amountOfCars),  // position of the car
            Generator.getRandomColor(), // colour to identify the car
            Generator.getRandomLane(whichLaneProbability)); // car positioned on the left lane);

        cars.push(car);

    }

    // todo: was macht diese funktion?

    var tables = document.getElementsByTagName("table");
    for (var i = tables.length - 1; i >= 0; i -= 1) {
        if (tables[i]) {
            tables[i].parentNode.removeChild(tables[i]);
        }
    }


    // append the above generated table
    document.getElementById("canvasWrapper").appendChild(table);
    // plot the initial position to the table
    Drawer.plot(cells, cars);


    for (var j = 0; j < generations; j++) {

        cars = Generator.accelerate(cars, maxSpeed);
        cars = Generator.brake(cars, amountOfCars, cells);
        cars = Generator.dawdle(cars, dawdleProbability);
        cars = Generator.move(cars, cells);

        Drawer.plot(cells, cars);

    }
}


//console.log("event listener is setted up");

