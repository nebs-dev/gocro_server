import "./preStart"; // Must be the first import
import app from "@server";
import logger from "@shared/Logger";
import * as https from "https";
import fs from "fs";

// Start the server
const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  logger.info("Express server started on port: " + port);
});

// For https localhost.
// https
//   .createServer(
//     {
//       key: fs.readFileSync("server.key"),
//       cert: fs.readFileSync("server.cert"),
//     },
//     app
//   )
//   .listen(port, () => {
//     logger.info("Express server started on port: " + port);
//   });
