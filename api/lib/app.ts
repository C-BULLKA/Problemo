import express from 'express';
import { config } from './config'; // Zakładam, że masz ten plik
import Controller from './interfaces/controller.interface';
import path from 'path';
import bodyParser from 'body-parser'; // <-- DODANY IMPORT
import morgan from 'morgan';       // <-- DODANY IMPORT
import mongoose from 'mongoose'; // <-- DODANY IMPORT (1)

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initializeMiddlewares(); // <-- DODANE WYWOŁANIE

    // DODANO: Połączenie z bazą (2)
    this.connectToDatabase();
    
    // To już miałeś i jest OK
    this.app.use(express.static(path.join(__dirname, 'public')));

    this.initializeControllers(controllers);
  }

  // <-- DODANA CAŁA METODA -->
  private initializeMiddlewares(): void {
    // Parsuje JSONy wysyłane w body zapytania (np. z Postmana)
    this.app.use(bodyParser.json());
    // Loguje w konsoli przychodzące zapytania (np. "GET /api/posts 200")
    this.app.use(morgan('dev'));
  }

  // <-- DODANA CAŁA METODA --> (3)
  private async connectToDatabase(): Promise<void> {
    try {
      await mongoose.connect(config.databaseUrl);
      console.log('Connection with database established'); 
    } catch (error) {
      console.error('Error connecting to MongoDB:', error); 
    }

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error); 
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected'); 
    });

    // Obsługa zamknięcia aplikacji (CTRL+C lub SIGTERM)
    process.on('SIGINT', async () => { 
      await mongoose.connection.close(); 
      console.log('MongoDB connection closed due to app termination'); 
      process.exit(0); 
    });
    
    process.on('SIGTERM', async () => { 
      await mongoose.connection.close(); 
      console.log('MongoDB connection closed due to app termination'); 
      process.exit(0); 
    });
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  public listen(): void {
    this.app.listen(config.port, () => {
      console.log(`App listening on the port ${config.port}`);
    });
  }
}

export default App;