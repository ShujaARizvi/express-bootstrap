# Express Bootstrap

A powerful Typescript based middleware for Express.

- [Installation](#installation)
- [Goal and Philosophy](#goal-and-philosophy)
- [Getting Started](#getting-started)
- [Documentation](#documentation)  
      - [Controllers](#controllers)  
      - [Routing](#routing)   
      - [Request Parameters](#request-parameters)  
      - [Request Deserialization](#request-deserialization)  
      - [Complex Models](#complex-models)  
      - [Input Validation](#input-validation)  
      - [Response Entity](#response-entity)  
      - [Project Hierarchy](#project-hierarchy)  
      - [The Bootstrap](#the-bootstrap)  
      - [Authentication & Authorization](#authentication--authorization)  
      - [Dependency Injection](#dependency-injection)  
- [CLI](#cli)  
- [People](#people)  
- [License](#license)  

# Installation
This is a [Node.js](https://nodejs.org/en/) module available through the [npm registry](https://www.npmjs.com/).
Installation is done using the [`npm install` command](https://docs.npmjs.com/downloading-and-installing-packages-locally):
```
$ npm install xpress-bootstrap
```

# Goal and Philosophy
`Express Bootstrap` strives to be a powerful middleware for [Express.js](https://www.npmjs.com/package/express) that makes developing APIs faster and easier.

# Getting Started
**Note:** Navigate to [CLI](#cli) section to learn about quickly generating a _Getting Started_ project.
- Install `xpress-bootstrap`.
    ```
    $ npm install xpress-bootstrap
    ```
- Install [Express](https://www.npmjs.com/package/express).
    ```
    $ npm install express
    ```
- Install [ts-node](https://www.npmjs.com/package/ts-node), [typescript](https://www.npmjs.com/package/typescript) and [@types/express](https://www.npmjs.com/package/@types/express) as dev dependencies.
    ```
    $ npm install -D ts-node typescript @types/express
    ```
- Run the following command to initiate a `typescript` project:
    ``` 
    $ npx tsc --init
    ```
    A `tsconfig.json` file will be generated.
- In **tsconfig.json**, change the `target` to *ES6* or later and uncomment `experimentalDecorators` and `emitDecoratorMetadata`.
- Create a folder named `controllers` in the root directory of the project.
- Create a file `homeController.ts` inside the `controllers` folder and copy the following snippet:
    ```ts
    import { HTTPResponse } from "xpress-bootstrap/bin/constants/enum";
    import { BaseController } from "xpress-bootstrap/bin/controllers/baseController";
    import { Get } from 'xpress-bootstrap/bin/decorators/routingDecorator';
    import { Response } from 'xpress-bootstrap/bin/models/response';
    import { Controller } from 'xpress-bootstrap/bin/decorators/controllerDecorator';
    
    @Controller
    export class HomeController extends BaseController {
    
        @Get('/hello')
        index() {
            const resp = {
                Message: 'Hello World of Xpress Bootstrap!',
                Controller: 'HomeController'
            };
            return new Response(HTTPResponse.Success, resp);
        }
    }
    ```
- Create a file `app.ts` and copy the following snippet:
    ```ts
    import { bootstrap } from "xpress-bootstrap/bin/bootstrapper";
    import express from 'express';

    const app = express();
    
    app.use(bootstrap({
        base: '/api', // Optional base url for all routes
    }));
    
    const port = 5000;
    app.listen(port, () => console.log(`Listening at port ${port}`));
    ```
- Use `npx ts-node app.ts` to run the application.
- Navigate to [localhost:5000](http://localhost:5000/api/home/hello) in your browser.

# Documentation
- #### Controllers
    API Controllers are classes that group together a set of endpoints that lie under the same resource. For instance, all endpoints/api actions relating to a user could be grouped under a `UsersController`.
    
    To create an api controller, simply ***export*** a typescript class that extends the `BaseController` class. The class should be decorated with `@Controller` and its name should end in `Controller`.
    
    All controllers must ***extend*** the `BaseController`, otherwise they won't be bootstrap compatible.
    ```ts
    @Controller
    export class UsersController extends BaseController {}
    ```
- #### Routing
    - ##### Get
        Specifies that a controller method is to be exposed as an HTTP GET endpoint. Provide an optional route for the method to be exposed as endpoint. If not provided, assumes the default for this resource.
        ```ts
        @Get('/hello')
        ```
    - ##### Post
        Specifies that a controller method is to be exposed as an HTTP POST endpoint. Provide an optional route for the method to be exposed as endpoint. If not provided, assumes the default for this resource.
        ```ts
        @Post()
        ```
    - ##### Put
        Specifies that a controller method is to be exposed as an HTTP PUT endpoint. Provide an optional route for the method to be exposed as endpoint. If not provided, assumes the default for this resource.
        ```ts
        @Put('/:id/:username')
        ```
    - ##### Patch
        Specifies that a controller method is to be exposed as an HTTP PATCH endpoint. Provide an optional route for the method to be exposed as endpoint. If not provided, assumes the default for this resource.
        ```ts
        @Patch()
        ```
    - ##### Delete
        Specifies that a controller method is to be exposed as an HTTP DELETE endpoint. Provide an optional route for the method to be exposed as endpoint. If not provided, assumes the default for this resource.
        ```ts
        @Delete('/:id')
        ```
- #### Request Parameters
    - ##### Route Params
        Route parameters are defined in the route. You do this by placing a `:` and providing a name. For instance:
        ```
        'api/users/:userId'
        ```
        There can be multiple route parameters in a single route.
    - ##### Query Params
        Query parameters come from the query section of the request. The query section of a request begins after the `?`. For instance:
        ```
        'api/users?page=5&limit=10'
        ```
        The query section can be deserialized into a typescript class using the decorators described in the section `Request Deserialization` below.
    - ##### Request Body
        Body parameters come from the body/payload of the request. These can be any random JSON. For instance:
        ```json
        {
            "name": "John Doe",
            "age": 24,
            "gender": "M"
        }
        ```
        The payload section can be deserialized into a typescript class using the decorators described in the section `Request Deserialization` below.
- #### Request Deserialization
    `Express Bootstrap` can also deserialize api requests into specified custom models.
    - ##### Route Params
        Use the `FromRoute` decorator to parse a parameter from the route. The usage is as below:
        ```ts
        @Get('/:id')
        getUserById(@FromRoute('id') id: number)
        ```
        Note that the parameter name in the route and in the `FromRoute` decorator should match.
    - ##### Query Params
        Use the `FromQuery` decorator to parse the whole query section into a custom typescript class/model.
        
        To do this, first define a model, let's say, `UserFilter`.
        ```ts
        // userFilter.ts
        export class UserFilter extends Model {
            page: number;
            limit: number;
        }
        ```
        **Note that the models that you want `Express Bootstrap` to auto deserialize should extend the `Model` class.*
        
        Next, use the `FromQuery` decorator in the method parameter and provide the `UserFilter` model as a parameter to the decorator, as follows:
        ```ts
        getUsersByFilter(@FromQuery(UserFilter) userFilter: UserFilter)
        ```
    - ##### Request Body
        Use the `FromBody` decorator to parse the whole body/payload section into a custom typescript class/model.
        
        To do this, first define a model, let's say, `User`.
        ```ts
        // user.ts
        export class User extends Model {
            public name: string;
            public email: string;
            public age: number;
        }
        ```
        **Note that the models that you want `Express Bootstrap` to auto deserialize should extend the `Model` class.*
        
        Next, use the `FromBody` decorator in the method parameter and provide the `User` model as a parameter to the decorator, as follows:
        ```ts
        createUser(@FromBody(User) user: User)
        ```
        
- #### Complex Models
    Sometimes you want your models to be a bit complex. This could include cases like composition. This is where the `Compose` and `ComposeMany` decorators come into play.  
    
    ***Compose:*** is used when a type composes of another type. For instance, let us assume that the user has an address, which is a separate type. The user model would now look like the following:
    ```ts
    export class User extends Model {
        public name: string;
        public email: string;
        public age: number;
        
        @Compose(Address)
        public address: Address;
    }
    ```
    The `Address` could in turn compose of other types.
    
    ***ComposeMany:*** is used when a type composes of a collection of another type. For instance, let us assume that the user has a set of nicknames. For brevity, the nicknames are just simple strings. The user model would now look like the following:
    ```ts
    export class User extends Model {
        public name: string;
        public email: string;
        public age: number;
        
        @ComposeMany(String)
        public nicknames: string[];
    }
    ```
    
    ***Note:*** The limitation of these decorators while deserialization is because of the fact that typescript transpiles into javascript, hence all the types are dissolved at runtime. Since no type information is available at runtime, these decorators are needed to provide the necessary information for proper deserialization.
    
- #### Input Validation
    `Express Bootstrap` uses [Joi](https://www.npmjs.com/package/joi) for its user input validation. The `Validate` decorator is used to validate each individual field of a model.
    
    The validate decorator takes an object that has the following 3 properties:  
    ***constraint:*** The `Joi` constraint for this property.  
    ***arrayElementsConstraint (Optional):*** If the property is an array of object, this property should be provided to specify the constraint on the array objects.  
    ***model (Optional):*** If an object is used, the type should be provided. The object class should extend the 'Model' class.  

    Lets take our good old `User` type and apply input validation to it. It would look something like the following:
    ```ts
    export class User extends Model {
        @Validate({ constraint: Joi.string() })
        public name: string;
        
        @Validate({ constraint: Joi.string().email() })
        public email: string;
        
        @Validate({ constraint: Joi.number().min(18).max(60) })
        public age: number;
        
        @Validate({
            constraint: Joi.array().items().required(), 
            model: Address, 
            arrayElementsConstraint: Joi.object().required()
        })
        @Compose(Address)
        public address: Address;
        
        @Validate({ constraint: Joi.array().items(Joi.string()).required() })
        @ComposeMany(String)
        public nicknames: string[];
    }
    ```
    ***name*** is a string.  
    ***email*** is a string that is an email.  
    ***age*** is a number whose value can be between 18 and 60 inclusive.  
    ***address*** is an array that is required. It is of type `Address`. The array should have atleast one object.  
    ***nicknames*** is an array of strings. The array is required.  

    For a full list of validation options and capabilities, kindly check [Joi documentation](https://joi.dev/api/?v=17.3.0).

- #### Response Entity
    A `Response` entity could be used to return a status code alongwith the response object. The usage is as follows:
    ```ts
    import { HTTPResponse } from 'xpress-bootstrap/bin/constants/enum';
    import { Response } from 'xpress-bootstrap/bin/models/response';
    ...
    ...
    @Get()
    index() {
        return new Response(HTTPResponse.Success, { message: 'Hello World of Express Bootstrap' });
    }
    ```
- ### Project Hierarchy
    As you may have noticed, in the [Getting Started](#getting-started) section, we had placed the `homeController.ts` file inside a folder named `controllers`. This is indeed a requirement for Express Bootstrap. By default, all the controllers should be placed in a directory named controllers, which is read during the bootstrap process and all the qualifying controllers are registered with the application.
    You can, however, change the path of the controllers directory. As a general convention, this has been made part of the configuration. For this, create a JSON file named `bootstrapperConfig.json` in your project root and save the following inside the file:
    ```JSON
    {
        "controllersDir": "./handlers"
    }
    ```
    Express Bootstrap will now look into a directory named `handlers` to find the controllers to be registered.
    Since Express Bootstrap iterates the controllers folder recursively searching for all qualifying controllers, we recommend the following:
    - DONOT keep other files within the controllers directory, unless absolutely necessary.
    - Try to keep the directory depth as minimal as possible.
    - DONOT place controllers on the project root.
- ### The Bootstrap
    Since `Express Bootstrap` is desgined as a middleware for `ExpressJS`, it should be registered with Express to be used. Registration is straightforward and can be done in few simple steps.
    `bootstrap` is a function so it should first be imported:
    ``` ts
    import { bootstrap } from "xpress-bootstrap/bin/bootstrapper";
    ```
    After importing `bootstrap`, `express`, and other dependencies, its time to setup express. Let us create a simple express application with not much going on. This could be done as follows:
    ``` ts
    const app = express();
    ```
    Now, register `bootstrap` as a middleware to express by providing the required parameters:
    ``` ts
    app.use(bootstrap({
        base: '/api'
    }));
    ```
    **base:** It is an optional base url for all routes. For example, /api, /api/v1...  
    
    Note that `bootstrap` should be the last middleware used since its responsible for terminating the api request.

- ### Authentication & Authorization
    Express Bootstrap provides the capability to authenticate and authorize api calls. Since a user may wish to implement auth one way or the other, Express Bootstrap leaves the implementaion upto the user. Auth can be enabled by providing an optional callback to the `bootstrap` function. This callback is called before executing the auth-enabled endpoints' logic.
    The callback is a function that takes two arguments, a `Request` and a `Endpoint` entity, and returns a `AuthResponse`.
    ```TS
    (req: Request, endpoint: Endpoint) => AuthResponse
    ```
    ##### + Request:
    Request is a class wrapping headers, query, and body of an API Request.
    ##### + Endpoint:
    Endpoint is a class that contains basic information of the Endpoint that will be called.
    ##### + AuthResponse:
    AuthResponse is a class representing response of authentication and authorization.
    
    A typical callback function would look like the following:
    ```TS
    const authCallback = (req: Request, endpoint: Endpoint) => {
    // Logging contents of Request
    console.log(req);
    // Logging contents of Endpoint
    console.log(endpoint);

    // The auth failed response
    return new AuthResponse(false, HTTPResponse.Unauthorized, 'This is a test unauthorization message');
    }
    ```
    
    Now the question arises, how does `Express Bootstrap` determine which endpoints would be under auth. For this purpose, three different decorators are used to achieve different results:
    ##### 1) @Auth
    Used on an endpoint/controller method to enable auth on that particular endpoint.
    ##### 2) @ControllerAuth
    Used on a controller to enable auth on all endpoints/methods belonging to that controller.
    ##### 3) @NoAuth
    Used to exclude an endpoint from auth. It is useful in cases where the `@ControllerAuth` is used and you wish to exclude an endpoint or two.
    
    The `@Auth` and `@ControllerAuth` decorators also take an optional parameter, the auth callback like the `bootstrap` method.
    
    ##### Priority
    Method/endpoint level auth callback >> controller level auth callback >> Bootstrap function's auth callback.
- ### Dependency Injection
    Plain old controllers don't seem to provide much fun. Not to mention you can't have all the business logic inside the controller itself. Generally, you may want to abstract out the business logic to the service layer. This makes a controller dependent upon the relevant service(s). This is where Dependency Injection(DI) comes into play.
    You can inject any number of dependencies (we call them services) into the controllers through their constructors. All that is needed is for Express Bootstrap to know which dependency to inject, in other words, a dependency should be registered for it to be injected properly. For this purpose, the `@Injectable` decorator is used.
    Let's take an example of a controller named `RandomController` that has a method `index()` which returns a random number. The controller would look something like the following:
    ```ts
    // Imports
    @Controller
    export class RandomController extends BaseController {
        @Get()
        index() {
            return Math.round(Math.random() * 100);
        }
    }
    ```
    Seems pretty cool, right? Now imagine that at some point in future, your logic to fetch the random number becomes too complicated and you want to abstract it into a class named `RandomService`. You can create your class and decorate it with the `@Injectable` decorator, like the following:
    ```ts
    import { Injectable } from "xpress-bootstrap/bin/decorators/iocDecorator";
    
    @Injectable('randomService')
    export class RandomService {
        getRandomNumber() {
            // Complex logic here...
        }
    }
    ```
    What this would do is register the `RandomService` as *randomService* (name passed as parameter to @Injectable) inside the IoC container of Express Bootstrap. You can now inject `RandomService` as a dependency inside the `RandomController` constructor:
    ```ts
    @Controller
    export class RandomController extends BaseController {
        
        constructor(private randomService: RandomService) {
            super();
        }
        
        @Get()
        index() {
            return this.randomService.getRandomNumber();
        }
    }
    ```
    Note that the dependency parameter name in the constructor should be the same as that of the registration name you passed in `@Injectable`.
    As long as Express Bootstrap is resolving the dependency, you can inject any class anywhere in the application.
# CLI
`Express Bootstrap` also comes with a CLI to easily initiate a *Getting Started* project. 
After initiating an npm project and installing `xpress-bootstrap`, use the following:
```
npx xpress-bootstrap init
```
This will initiate a typescript project, create a basic application, and install the required dependencies.

# People
The original author of Express Bootstrap is [Shuja Rizvi](https://github.com/ShujaARizvi).

# License
[MIT](https://github.com/ShujaARizvi/express-typescript/blob/main/LICENSE)
