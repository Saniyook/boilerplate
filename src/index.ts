import UserController from './controllers/user/';
import Application from './app';

export default function main() {
  const myApp = new Application({ port: 8000 });

  myApp.controlller(UserController);

  myApp.start();
}
