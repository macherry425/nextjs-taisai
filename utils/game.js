export function rollThreeDice() {
    // console.log("rollThreeDice()")
    const diceResults = [];
    for (let i = 0; i < 3; i++) {
        // Generate a random number between 1 and 6 (inclusive) for each die
        const dieRoll = Math.floor(Math.random() * 6) + 1;
        diceResults.push(dieRoll);
    }
    return diceResults;
}

export function checkBet(diceResults) {
    const checkDoubles = (diceResults) => {
        // Create an object to store the counts of each die face
        console.log('[checkDoubles', diceResults);
        const counts = {};

        // Count the occurrences of each die face
        for (const die of diceResults) {
            counts[die] = (counts[die] || 0) + 1;
        }

        // Initialize an array to hold the double options that have been satisfied
        const doubleOptions = [];

        // Check for doubles from 1 to 6
        for (let i = 1; i <= 6; i++) {
            if (counts[i] >= 2) {
                console.log("is double:" + i)
                doubleOptions.push(i);
            }
        }

        return doubleOptions; // Return an array of satisfied double options
    }
    const caseStatus = Array.from({ length: 50 }, () => ({ status: false }));
    const total = diceResults.reduce((a, b) => a + b, 0); // Calculate the total of the three dice
    const [die1, die2, die3] = diceResults;

    const isTriplet = (num) => die1 === num && die2 === num && die3 === num;
    const isDouble = checkDoubles(diceResults);


    //case 3-8

    for (let i = 1; i <= 6; i++) {
        if (isTriplet(i)) {
            console.log('i', i, isTriplet(i))
            caseStatus[i + 2].status = true;
            if (!caseStatus[2].status) {
                caseStatus[2].status = true
            }

        }
    }

    const anyTriplet = caseStatus[2].status;
    if (!anyTriplet) {
        // case 0 - 2
        caseStatus[0].status = (total >= 4 && total <= 10) ? true : false;
        caseStatus[1].status = total >= 11 && total <= 17 ? true : false;
        //case 9-14
        for (const i of isDouble) {
            // console.log("isDouble: " + i);
            caseStatus[i + 8].status = true;
        }

        //case 15-20
        // Check for single dice bets
        // new check
        const diceFreq = Array.from({ length: 6 }, (_, i) => diceResults.filter(x => x === i + 1).length);
        for (let i = 0; i < 6; i++) {
            const status = diceFreq[i] > 0 ? true : false;
            const count = diceFreq[i]
            caseStatus[i + 15] = { status: status, count: count };
        }

        //case 21-34
        // Check for total bets from 4 to 17
        const totalBets = {};
        for (let i = 4; i <= 17; i++) {
            totalBets[`Total ${i}`] = (total === i); // Check if the total matches the specific value
            caseStatus[i + 20 - 3].status = (total === i);
        }

        //case 35 - 49
        // Check for any two dice combinations
        const anyTwoDiceBets = {};
        var anyTwoDiceCount = 35;
        for (let i = 1; i <= 6; i++) {
            for (let j = i + 1; j <= 6; j++) { // Ensures unique pairs, e.g., (1,2), (1,3), etc.
                const isAnyTwoDiceBets =
                    (die1 === i && die2 === j) ||
                    (die1 === j && die2 === i) ||
                    (die1 === i && die3 === j) ||
                    (die1 === j && die3 === i) ||
                    (die2 === i && die3 === j) ||
                    (die2 === j && die3 === i);
                anyTwoDiceBets[`Any Two Dice ${i} & ${j}`] = isAnyTwoDiceBets;

                caseStatus[anyTwoDiceCount].status = isAnyTwoDiceBets;
                anyTwoDiceCount++;

            }
        }
        // console.log(anyTwoDiceBets)
    }

    // done
    // console.log(diceResults);
    // console.log(caseStatus);
    return caseStatus;

}


