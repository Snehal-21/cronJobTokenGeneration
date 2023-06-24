import express from "express";
import { CreateSearch, PollSearch } from "../controllers/userControllers.js";
import { CronJob } from "cron";

const router=express.Router();

// let job = new CronJob('*/1  * * * *', ()=>{
//     console.log("Hello");
// });

// job.start();

router.post('/CreateSearch',CreateSearch);
router.get('/PollSearch',PollSearch);
export default router;