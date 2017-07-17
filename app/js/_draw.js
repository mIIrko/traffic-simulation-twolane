var Plotter = (function () {

    /**
     * must be updated to print the two lane traffic
     *
     *
     * @param amountOfCells
     * @param cars
     * @return {Element}
     */
    function plot(amountOfCells, cars) {

        var leftLaneCars = 0;
        var rightLaneCars = 0;

        // create new rows
        var rightLane = document.createElement("tr");
        var leftLane = document.createElement("tr");
        leftLane.setAttribute("class", "leftlane");

        // create and add empty grey cells to both lanes
        for (var i = 0; i < amountOfCells; i++) {
            var emptyCellRight = document.createElement("td");
            emptyCellRight.style.backgroundColor = "grey";
            rightLane.appendChild(emptyCellRight);

            var emptyCellLeft = document.createElement("td");
            emptyCellLeft.style.backgroundColor = "grey";
            leftLane.appendChild(emptyCellLeft);
        }

        for (var j = 0; j < cars.length; j++) {

            // get the cell from the new row
            var carPosition = cars[j].position;
            var carCell;

            if (cars[j].onLeftLane) {
                carCell = leftLane.cells[carPosition];
            } else {
                // car is on the right lane
                carCell = rightLane.cells[carPosition];
            }

            // paint the cell with the specific color
            carCell.style.backgroundColor = cars[j].color;
            carCell.innerHTML = cars[j].speed;
        }

        table.appendChild(rightLane);
        table.appendChild(leftLane);

    }

    return {
        plot: plot
    };

})();