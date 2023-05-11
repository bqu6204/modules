import { CE } from "./services/service-custom-error";
// import { CC } from "./services/service-custom-console";
import express from "express";

const app = express();

app.all("/", (req, res) => {
  res.send({ success: true });
});

app.listen(3005, () => {
  const customError = new CE({ message: "sarasdfas" });
  console.log("customErorr:", customError);
  // CC.log("Start logging");
});
