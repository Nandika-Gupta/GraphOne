import { Router } from "express";
import { CompanyController } from "../controllers/company.controller";
import { asyncH } from "../shared/asyncH";

const r = Router();

// NOTE: static routes (/trending) declared before param routes (/:slug).
r.get("/trending", asyncH(CompanyController.trending));
r.get("/", asyncH(CompanyController.list));
r.post("/", asyncH(CompanyController.create));
r.get("/:slug", asyncH(CompanyController.detail));
r.get("/:slug/funding", asyncH(CompanyController.funding));
r.get("/:slug/products", asyncH(CompanyController.products));
r.get("/:slug/graph", asyncH(CompanyController.graph));
r.post("/:slug/claim", asyncH(CompanyController.claim));

export default r;
