
import { Request, Response } from "express";
import query from "../database/connection";
import { tokenize } from "../middlewares";

class UserController {
  public async login(req: Request, res: Response): Promise<void> {
    const { mail, password } = req.body;

    if (!mail && !password) {
      res.status(401).json({ erro: "Forneça o e-mail e senha" });
    } else {
      const response: any = await query(
        `SELECT id, mail, profile
          FROM users 
          WHERE mail=$1 AND password=$2`,
        [mail, password]
      );

      if (response.length > 0) {
        const [object] = response;
        res.json({ ...object, token: tokenize(object) });
      } else {
        res.json({ erro: "Dados de login não conferem" });
      }
    }
  }
   public async create(req: Request, res: Response): Promise<void> {
    const { mail, password, profile } = req.body;

    const response: any = await query(
      "INSERT INTO users(mail,password,profile) VALUES ($1,$2,$3) RETURNING id, mail, profile",
      [mail, password,profile]
    );

    if (response && response.id) {
      const object = {
        id: response.id,
        mail: response.mail,
        profile:response.profile,

      };
      res.json(object);
    } else {
      res.json({ erro: response.message });
    }
  }
  public async list(_: Request, res: Response): Promise<void> {
    const response: any = await query(
      "SELECT id,mail,profile FROM users ORDER BY mail"
    );
    res.json(response);
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { iduser } = req.body;
    const response: any = await query(
      "DELETE FROM users WHERE id = $1 RETURNING id, mail, profile",
      [iduser]
    );

    if (response && response.rowcount && response.rowcount > 0) {
      res.json(response.rows);
    } else {
      res.json({ erro: `Usuário não localizado` });
    }
  }
}
export default new UserController();
