import App from './app';
import IndexController from './controllers/index.controller';
import PostController from './controllers/post.controller';

const controllers = [
  new PostController(),
  new IndexController() 
];

const appInstance = new App(controllers);

appInstance.listen();