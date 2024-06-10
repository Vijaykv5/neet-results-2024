import axios from 'axios'; 
import { sendRequest } from './sendRequest';

const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || "https://neet-orchestrator.100xdevs.com";

async function findRank(applicationNumber: string) {
    console.log(`Finding rank for ${applicationNumber}`);
    let args = [];
    for (let i = 1; i <= 31; i++) {
        for (let k = 2007; k >= 2004; k--) {
            for (let j = 1; j <= 12; j++) {
                args.push({
                    day: i.toString(),
                    month: j.toString(),
                    year: k.toString(),
                    applicationNumber: applicationNumber
                })
            }
        }
    }

    const BATCH_SIZE = Number(process.env.BATCH_SIZE) ||  50;

    let done = false;

    for (let i = 0; i < args.length; i += BATCH_SIZE) {
        const batch = args.slice(i, i + BATCH_SIZE);
        const startTime = Date.now();
        await Promise.all(batch.map(async (arg) => {
            const res = await sendRequest(arg.day, arg.month, arg.year, arg.applicationNumber);
            if (res.solved) {
                console.log(`Rank found for ${applicationNumber}`);
                done = true; 

                await axios.post(`${ORCHESTRATOR_URL}/result`, {
                    applicationNumber: arg.applicationNumber,
                    candidateName: res.candidateName,
                    allIndiaRank: res.allIndiaRank,
                    day: arg.day,
                    month: arg.month,
                    year: arg.year,
                    marks: res.marks
                }).then(x => {
                    console.log("Result stored");
                }).catch(e => {
                    console.log("Error storing result", e);
                });
            }
        }));
        const endTime = Date.now();
        console.log(`Batch ${i} took ${endTime - startTime}ms`);
        if (done) {
            break;
        }
    }
}


async function main() {
    while(1) {
        const response = await axios.get(`${ORCHESTRATOR_URL}/next`);
        const nextApplicationNumber = response.data.applicationNumber;
        if (nextApplicationNumber) {
            await findRank(nextApplicationNumber);
        }
    }
}

main();