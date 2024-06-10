import db from "../db";
import express from "express";
import { sendRequest } from "../worker/sendRequest";
const app = express();

app.use(express.json());

const PICKUP_BACKOFF_TIME_MS = 1000 * 60 * 60 * 2; // 2 hours

app.get("/next", async (req, res) => {
  const nextApplicationNumber = await db.applicationNumber.findFirst({
    where: {
        OR: [{
            pickupTime: {
                lt: new Date(Date.now() + PICKUP_BACKOFF_TIME_MS) // last picked up 2 hours ago
            }
        }, {
            pickupTime: null
        }]
    }
  });
  if (!nextApplicationNumber) {
    return res.status(404).json({ error: "No application found" });
  }

  await db.applicationNumber.update({
    where: {
      id: nextApplicationNumber?.id
    },
    data: {
      pickupTime: new Date()
    }
  });
  
  res.json({
    applicationNumber: nextApplicationNumber?.applicationNumber
  });
});

app.post("/result", async (req, res) => {
  const { applicationNumber, candidateName, allIndiaRank, day, month, year } = req.body;
  const result = await sendRequest(day, month, year, applicationNumber);

  if (!result.solved) {
    return res.status(400).json({ error: "Application not found" });
  }
  console.log("result stored", )

  await db.result.create({
    data: {
      applicationNumber,
      candidateName,
      allIndiaRank,
      day,
      month,
      year
    }
  });
  res.json({});
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});