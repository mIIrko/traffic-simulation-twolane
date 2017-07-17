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
     * @return {Array}
     */
    function brake(cars, amountOfCars, cells) {
        for (var i = 0; i < cars.length; i++) {

            var currentCar = cars[i];

            /*
             * changed this for two lane
             *
             */
            var carsOnSameLane = cars.filter(function (car) {
                return currentCar.onLeftLane === car.onLeftLane;
            });

            var positionOfCurrentCarInNewArray = carsOnSameLane.indexOf(currentCar);
            var positionOfNextCar = carsOnSameLane[(positionOfCurrentCarInNewArray + 1) % carsOnSameLane.length].position;
            var distance = ((positionOfNextCar + cells) - cars[i].position) % cells - 1;

            // breaking
            if (distance < parseInt(cars[i].speed)) {
                cars[i].speed = distance;
            }
        }
        return cars;
    }


    /**
     * can be used like in the one lane model
     *
     * @param cars
     * @param dawdleProbability
     * @return {Array}
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
     *
     * @param cars
     * @param maxSpeed
     * @return {*}
     */
    function laneChange(cars, maxSpeed) {

        for (var i = 0; i < cars.length; i++) {

            var currentCar = cars[i];

            // look ahead on same lane: assert gap(i) >= l
            var gapSameLane = calculateGap(currentCar, cars, true);
            if (gapSameLane >= (currentCar.speed + 1)) {
                console.log(currentCar.id + " stays on same lane, gap = " + gapSameLane + " (spd = " + currentCar.speed + "; pos = " + currentCar.position + ")");
                // we must not change the lane, got enough space ahead
                continue;
            }

            // check forward gap on other lane: assert gap(i) >= l0
            var gapOtherLane = calculateGap(currentCar, cars, false);
            if (gapOtherLane <= maxSpeed) {
                // the gap is not big enough, so no lane change
                console.log(currentCar.id + " forward gap on other lane too small = " + gapOtherLane + "(spd = " + currentCar.speed + "; pos = " + currentCar.position + ")");
                continue;
            }

            // look backwards on the other lane
            var gapOtherLaneBackward = calculateGapBackward(currentCar, cars);
            if (gapOtherLaneBackward <= maxSpeed) {
                // the gap is not big enough, so no lane change
                console.log(currentCar.id + " backward gap on other lane too small = " + gapOtherLaneBackward + "(spd = " + currentCar.speed + "; pos = " + currentCar.position + ")");
                continue;
            }

            console.log(currentCar.id + "do lane change! (spd = " + currentCar.speed + "; pos = " + currentCar.position + ")");

            // just change when the other lane is better!
            if (gapSameLane < gapOtherLane) {
                // do the lane change
                if (cars[i].onLeftLane) {
                    cars[i].onLeftLane = false;
                } else {
                    cars[i].onLeftLane = true;
                }
            }
        }
        return cars;
    }

    /**
     * used for the lane change decision
     *
     * @param currentCar
     * @param cars
     * @param lookOnSameLane {boolean}
     * @return {number}
     */
    function calculateGap(currentCar, cars, lookOnSameLane) {
        var carsOnSameLane = cars.filter(function (car) {
            if (lookOnSameLane) {
                return currentCar.onLeftLane === car.onLeftLane;
            } else {
                return currentCar.onLeftLane !== car.onLeftLane;
            }
        });
        var amountOfCarsOnSameLane = carsOnSameLane.length;

        if (lookOnSameLane) {

            // if theres just one single car on the lane
            if (amountOfCarsOnSameLane < 2) {
                return Number.MAX_VALUE;
            }
            var positionOfCurrentCarInNewArray = carsOnSameLane.indexOf(currentCar);
            var positionOfNextCarOnCurrentLane = carsOnSameLane[(positionOfCurrentCarInNewArray + 1) % amountOfCarsOnSameLane].position;
            return ((positionOfNextCarOnCurrentLane + cells) - currentCar.position) % cells - 1;
        }
        else {

            // check if theres a car with the same position on other lane
            var carsWithSamePosition = carsOnSameLane.filter(function (car) {
                if (car.position === currentCar.position) {
                    return true;
                } else {
                    return false;
                }
            });
            if (carsWithSamePosition.length > 0) {
                return 0;
            }

            for (var i = 0; i < carsOnSameLane.length; i++) {
                var tmpCar = carsOnSameLane[i];
                if (tmpCar.position > currentCar.position) {
                    break;
                }
            }
            var positionOfNextCar = tmpCar.position;
            return ((positionOfNextCar + cells) - currentCar.position) % cells - 1;
        }
    }

    function calculateGapBackward(currentCar, cars) {
        var carsOnOtherLane = cars.filter(function (car) {
            return currentCar.onLeftLane !== car.onLeftLane;
        });

        var minDiff = Number.MAX_VALUE;
        var carWithMinDiff;
        for (var i = carsOnOtherLane.length - 1; i >= 0 ; i--) {
            var tmpCar = carsOnOtherLane[i];

            if (tmpCar.position < currentCar.position) {
                // lower than, because we look backwards
                if ((currentCar.position - tmpCar.position) < minDiff) {
                    minDiff= currentCar.position - tmpCar.position;
                    carWithMinDiff = tmpCar;
                }
            }
        }
        //var positionOfCarBackwards= tmpCar.position;
        //return ((positionOfCarBackwards + cells) - currentCar.position) % cells - 1;

        // minus one, because when we make the lane change, there is no space
        return minDiff-1;
    }


    /**
     * creates a random speed for initial car state
     *
     * @param maxSpeed
     * @return {number}
     */
    function getRandomSpeed(maxSpeed) {
        return Math.floor((Math.random() * maxSpeed) + 1);
    }


    /**
     * returns true for left lane,
     * false for right lane
     *
     * @param probability = probability for car is on the right lane
     * @return {boolean}
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
        laneChange: laneChange,
        getRandomColor: getRandomColor,
        getRandomSpeed: getRandomSpeed,
        getRandomLane: getRandomLane
    };
})();
