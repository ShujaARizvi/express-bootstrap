import { DecoratorDemoController } from "./controllers/demoDecoratorController";
import express, { json } from 'express';
import { RouteInfo } from "./entities/routeInfo";

const app = express();
app.use(json());

app.use((req, res) => {
    const url = req.url;
    const queryParams = req.query;
    const requestBody = req.body;
    
    // console.log('Method: ', req.method);
    // console.log('QueryParams: ', queryParams);
    // console.log('RequestBody: ', requestBody);
    
    const controller = new DecoratorDemoController();
    const routes = <RouteInfo[]>(<any>controller).routes;
    
    // console.log('The Url is: ', url);
    const matchedRoute = routes.find(x => {
        return new RegExp(x.routeRegex).test(url);
    });
    if (matchedRoute) {
        const routeParams =  getRouteParams(matchedRoute.route, matchedRoute.routeParamsIndices, url);
        
        let methodExecutionExpression = `controller.${matchedRoute.method}(`;

        matchedRoute.params.forEach((x, index) => {
            methodExecutionExpression += routeParams[x.name];
            if (index < matchedRoute.params.length-1) {
                methodExecutionExpression += ',';
            }
        })
        methodExecutionExpression += ')';
        const result = eval(methodExecutionExpression);
        console.log('Result', result);
        res.status(200).send(result);
    } else {
        res.status(404).send('Not Found');
    }
});

app.listen(5000, () => console.log('Listening....'));

const getRouteParams = (toMatch: string, routeParamsIndices: number[], toParse: string) => {
    const toMatchSplit = toMatch.split('/');
    const toParseSplit = toParse.split('/');

    const routeParams: any = new Object();
    routeParamsIndices.forEach(index => {
        const queryParamsRegex = /[?].*/;
        routeParams[toMatchSplit[index].replace(':', '')] = 
            toParseSplit[index].replace(queryParamsRegex, '');
    });
    return routeParams;
}
