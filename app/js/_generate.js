var Generator = (function () {


    /**
     * can be used like in the one lane model
     *
     * @param cars
     * @param maxSpeed
     * @return {*}
     */
    function accelerate(cars, maxSpeed) {
        for (var i = 0; i < cars.length; i++) {
            if (cars[i].speed < maxSpeed) {
                cars[i].speed = cars[i].speed + 1;
            }
        }
        return cars;
    }


    /**
     *
     * must be edited: car must only look on his lane for other cars
     *
     * @param cars
     * @param amountOfCars
     * @param cells
     * @return {*}
     */
    function brake(cars, amountOfCars, cells) {
        for (var i = 0; i < cars.length; i++) {

            // changed this for two lane
            var positionOfNextCar = getPositionOfNextCar(cars, amountOfCars, i, cars[i].onLeftLane);

            var distance = ((positionOfNextCar + cells) - cars[i].position) % cells;
            // breaking
            if (distance < parseInt(cars[i].speed)) {
                cars[i].speed = distance;
            }
        }
        return cars;
    }

    function getPositionOfNextCar(cars, amountOfCars, i, carOnLeftLane) {
        var nextCar = cars[(i + 1) % amountOfCars];
        if ((nextCar.onLeftLane && carOnLeftLane) || (!nextCar.onLeftLane && !carOnLeftLane)) {
            return nextCar.position;
        } else {
            console.log("nextcar position" + nextCar.position);
            i++;
            getPositionOfNextCar(cars, amountOfCars, i, carOnLeftLane);
        }
    }


    /**
     * can be used like in the one lane model
     *
     * @param cars
     * @param dawdleProbability
     * @return {*}
     */
    function dawdle(cars, dawdleProbability) {
        for (var i = 0; i < cars.length; i++) {
            // (cars[i] > 0 was ist besser?)
            if ((cars[i].speed > 0) && Math.random() < dawdleProbability) {
                cars[i].speed = cars[i].speed - 1;
            }
        }
        return cars;
    }

    /**
     * move is also untouched
     *
     * @param cars {Array}
     * @param cells
     * @return {Array}
     */
    function move(cars, cells) {
        for (var i = 0; i < cars.length; i++) {
            cars[i].position = (cars[i].position + cars[i].speed) % cells;
        }
        return cars;
    }

    /**
     * creates a random speed for initial car state
     *
     * @param maxSpeedsimulation
     * @return {number}
     */
    function getRandomSpeed(maxSpeed) {
        return Math.floor((Math.random() * maxSpeed) + 1);
    }


    /**
     * returns true for left lane,
     * false for right lane
     *
     * @param double = probability for car is on the right lane
     */
    function getRandomLane(probability) {
        if (Math.random() < probability) {
            return false
        } else {
            return true;
        }
    }


    /**
     *
     * returns a random color for the cars
     * http://stackoverflow.com/a/1484514
     *
     * @return {string}
     */
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // make the functions accessible
    return {
        accelerate: accelerate,
        brake: brake,
        dawdle: dawdle,
        move: move,
        getRandomColor: getRandomColor,
        getRandomSpeed: getRandomSpeed,
        getRandomLane: getRandomLane
    };
})();
