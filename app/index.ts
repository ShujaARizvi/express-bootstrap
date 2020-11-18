import { DecoratorDemoController } from "./app";


const cont = new DecoratorDemoController();
console.log((<any>cont).routes);

