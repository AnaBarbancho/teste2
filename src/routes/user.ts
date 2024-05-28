import { Router, Request, Response } from "express";
import controller from "../controllers/UserController";
import { checkAdm } from "../middlewares";

const routes = Router();

routes.post("/",checkAdm,controller.create);
routes.get("/",checkAdm,controller.list);
routes.delete("/",checkAdm,controller.delete);

//aceita qualquer método HTTP ou URL
routes.use( (_:Request,res:Response) => res.json({error:"Operação desconhecida com o usuário"}) );

export default routes;