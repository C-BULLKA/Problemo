import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import DataService from '../modules/services/data.service';
import { checkPostCount } from '../middlewares/checkPostCount.middleware';

class PostController implements Controller {
    public path = '/api';
    public router = Router();
    private dataService: DataService;

    constructor() {
        this.dataService = new DataService();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/posts`, this.getAllPosts);

        this.router.delete(`${this.path}/posts`, this.deleteAllPosts);
        
        this.router.post(`${this.path}/post`, this.addData); 
        
        this.router.post(`${this.path}/post/:num`, checkPostCount, this.getPostByNum); 
        
        this.router.get(`${this.path}/post/take/:num`, this.getNPosts);
        
        this.router.get(`${this.path}/post/:id`, this.getElementById); 

        this.router.delete(`${this.path}/post/:id`, this.removePost); 

        this.router.get(`${this.path}/post/latest`, this.getAllPosts);
    }

    private addData = async (request: Request, response: Response, next: NextFunction) => {
        const { title, text, image } = request.body;

        const readingData = { title, text, image };

        try {
            await this.dataService.createPost(readingData);
            response.status(200).json(readingData);
        } catch (error: any) {
            response.status(400).json({ error: 'Invalid input data.', details: error.message });
        }
    };

    private getElementById = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;

        try {
            const result = await this.dataService.query({ _id: id });
            if (result.length === 0) {
                return response.status(404).json({ message: 'Post not found.' });
            }
            response.status(200).json(result[0]);
        } catch (error: any) {
            response.status(500).json({ error: 'Database query failed.', details: error.message });
        }
    };
    
    private removePost = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;

        try {
            await this.dataService.deleteData({ _id: id });
            response.sendStatus(200);
        } catch (error: any) {
            response.status(500).json({ error: 'Database deletion failed.', details: error.message });
        }
    };

    private getAllPosts = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const allData = await this.dataService.query({});
            response.status(200).json(allData);
        } catch (error: any) {
            response.status(500).json({ error: 'Database query failed.', details: error.message });
        }
    };
    
    private deleteAllPosts = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.dataService.deleteData({});
            response.status(200).json({ message: 'Wszystkie posty usunięte.' });
        } catch (error: any) {
            response.status(500).json({ error: 'Database deletion failed.', details: error.message });
        }
    };
    
    private getNPosts = async (request: Request, response: Response, next: NextFunction) => {
        const { num } = request.params;
        const count = parseInt(num, 10);

        if (isNaN(count) || count <= 0) {
            return response.status(400).json({ message: 'Nieprawidłowa liczba elementów.' });
        }

        try {
            const result = await this.dataService.query({}).then(data => data.slice(0, count));
            response.status(200).json(result);
        } catch (error: any) {
            response.status(500).json({ error: 'Database query failed.', details: error.message });
        }
    };

    private getPostByNum = async (request: Request, response: Response, next: NextFunction) => {
        const { num } = request.params;
        
        response.status(200).json({ 
            message: `Middleware walidacyjne dla ${num} zadziałało poprawnie.`,
            received_num: num 
        });
    };
}
export default PostController;