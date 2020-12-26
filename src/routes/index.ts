import { Router } from "express";
import UserRouter from "./Users";
import AuthRouter from "./Auth";
import { authMW } from "./middleware";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/users", authMW, UserRouter);
router.use("/auth", AuthRouter);

// Export the base-router
export default router;
