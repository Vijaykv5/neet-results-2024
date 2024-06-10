
import db from "../db";

const START_ROLL = 240411183516;
const FIRST_ROLL = 240411100000;
const LAST_ROLL =  240411199999;

async function main() {

    let i = START_ROLL - 1;
    let j = START_ROLL;
    let applicationNumbers = [];

    while (i >= FIRST_ROLL || j <= LAST_ROLL) {
        if (i >= FIRST_ROLL) {
            applicationNumbers.push(i.toString());
            i--
        }

        if (j <= LAST_ROLL) {
            applicationNumbers.push(j.toString());
            j++
        }
    }

    console.log(applicationNumbers.length);
    await db.applicationNumber.createMany({
        data: applicationNumbers.map((applicationNumber) => ({
            applicationNumber,
            pickupTime: null,
            solved: false
        }))
    });
}
// main();