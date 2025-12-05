import { RequestHandler, Request, Response, NextFunction } from 'express';
import { config } from "../config";

export const checkPostCount: RequestHandler = (request: Request, response: Response, next: NextFunction) => {
  const { num } = request.params;
  const parsedValue = parseInt(num, 10);

  if (isNaN(parsedValue) || parsedValue < 1 || parsedValue >= config.supportedPostCount) {
    return response.status(400).send('Brak lub niepoprawna wartość! Oczekiwano liczby z zakresu [1, 14].'); 
  }

  next();
};