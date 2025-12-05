import Controller from '../interfaces/controller.interface';
import { Request, Response, Router } from 'express';
import path from 'path';

class IndexController implements Controller {
  public path = '/*';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.serveIndex);
  }

  private serveIndex = (request: Request, response: Response) => {
    // Poprawka ścieżki jest tutaj
    response.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  }
}

export default IndexController;