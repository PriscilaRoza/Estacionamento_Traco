import express, { request, response } from "express";
import {
  activityCheckin,
  activityCheckout,
  listActivities,
  removeActivity,
} from "./controllers/activitiesController.js";
import {
  insertVehicles,
  listVehicles,
  removeVehicle,
  updateVechicles,
} from "./controllers/vehiclesController.js";

const app = express();

app.use(express.json());

app.get("/api/ping", (request, response) => {
  response.send({
    message: "pong",
  });
});

/* Endpoints Vehicle */
app.get("/api/vehicles", listVehicles);

app.post("/api/vehicles", insertVehicles);
// UPDATE
app.put("/api/vehicles/:id", updateVechicles);
// DELETE
app.delete("/api/vehicles/:id", removeVehicle);
// ENDPOINTS ACTIVITIES

app.post("/api/activities/checkin", activityCheckin);
// PUT
app.put("/api/activities/checkout", activityCheckout);

// DELETE
app.delete("/api/activities/:id", removeActivity);

// GET
app.get("/api/activities", listActivities);

app.listen(8000, () => {
  console.log("Servidor funcionando na porta 8000...");
});
