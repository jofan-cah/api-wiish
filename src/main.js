import {web} from "./application/web.js";
import {logger} from "./application/logging.js";

web.listen(3002, () => {
    logger.info("App start");
});

web.get("/", (req, res) => {
    res.send("HAlolll");
  });