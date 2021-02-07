# Express Bootstrap

A powerful Typescript based middleware for Express.

# Installation
This is a [Node.js](https://nodejs.org/en/) module available through the [npm registry](https://www.npmjs.com/).
Installation is done using the [`npm install` command](https://docs.npmjs.com/downloading-and-installing-packages-locally):
```
$ npm install xpress-bootstrap
```

# Goal and Philosophy
`Express Bootstrap ` strives to be a powerful middleware for [Express.js](https://www.npmjs.com/package/express) that makes developing APIs faster and easier.

# Getting Started
- Install `xpress-bootstrap`.
    ```
    $ npm install xpress-bootstrap
    ```
- Install [Express](https://www.npmjs.com/package/express).
    ```
    $ npm install express
    ```
- Install [ts-node](https://www.npmjs.com/package/ts-node) and [typescript](https://www.npmjs.com/package/typescript) as dev dependencies.
    ```
    $ npm install -D ts-node typescript
    ```
- Run the following command to initiate a `typescript` project:
    ``` 
    $ npx tsc --init
    ```
    A `tsconfig.json` file will be generated.
- In **tsconfig.json**, change the `target` to *ES6* or later and uncomment `experimentalDecorators` and `emitDecoratorMetadata`.
- Create a file `homeController.ts` and copy the following snippet:
    ```js
    import { HTTPResponse } from "xpress-bootstrap/bin/constants/enum";
    import { BaseController } from "xpress-bootstrap/bin/controllers/baseController";
    import { Get } from 'xpress-bootstrap/bin/decorators/routingDecorator';
    import { Response } from 'xpress-bootstrap/bin/models/response';

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
    ```js
    import { bootstrap } from "xpress-bootstrap/bin/bootstrapper";
    import { HomeController } from "./homeController";
    import express from 'express';

    const app = express();
    
    app.use(bootstrap({
        base: '/api', // Optional base url for all routes
        controllers: [ // Provide all the application controllers here to be bootstrapped
            HomeController // A controller class that extends the BaseController
        ]
    }));
    
    const port = 5000;
    app.listen(port, () => console.log(`Listening at port ${port}`));
    ```
- Use `npx ts-node app.ts` to run the application.
- Navigate to [localhost:5000](http://localhost:5000/api/home/hello) in your browser.

# Documentation
- #### Controllers
    API Controllers are classes that group together a set of endpoints that lie under the same resource. For instance, all endpoints/api actions relating to a user could be grouped under a `UsersController`.
    
    To create an api controller, simply ***export*** a typescript class that extends the `BaseController` class. The class name should end in `Controller`.
    
    All controllers must ***extend*** the `BaseController`, otherwise they won't be bootstrap compatible.
    ```js
    export class UsersController extends BaseController {}
    ```
- #### Routing
    - ##### Get
        Specifies that a controller method is to be exposed as an HTTP GET endpoint. Provide an optional route for the method to be exposed as endpoint. If not provided, assumes the default for this resource.
        ```js
        @Get('/hello')
        ```
    - ##### Post
        Specifies that a controller method is to be exposed as an HTTP POST endpoint. Provide an optional route for the method to be exposed as endpoint. If not provided, assumes the default for this resource.
        ```js
        @Post()
        ```
    - ##### Put
        Specifies that a controller method is to be exposed as an HTTP PUT endpoint. Provide an optional route for the method to be exposed as endpoint. If not provided, assumes the default for this resource.
        ```js
        @Put('/:id/:username')
        ```
    - ##### Patch
        Specifies that a controller method is to be exposed as an HTTP PATCH endpoint. Provide an optional route for the method to be exposed as endpoint. If not provided, assumes the default for this resource.
        ```js
        @Patch()
        ```
    - ##### Delete
        Specifies that a controller method is to be exposed as an HTTP DELETE endpoint. Provide an optional route for the method to be exposed as endpoint. If not provided, assumes the default for this resource.
        ```js
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
        ```js
        @Get('/:id')
        getUserById(@FromRoute('id') id: number)
        ```
        Note that the parameter name in the route and in the `FromRoute` decorator should match.
    - ##### Query Params
        Use the `FromQuery` decorator to parse the whole query section into a custom typescript class/model.
        
        To do this, first define a model, let's say, `UserFilter`.
        ```js
        // userFilter.ts
        export class UserFilter extends Model {
            page: number;
            limit: number;
        }
        ```
        **Note that the models that you want `Express Bootstrap` to auto deserialize should extend the `Model` class.*
        
        Next, use the `FromQuery` decorator in the method parameter and provide the `UserFilter` model as a parameter to the decorator, as follows:
        ```js
        getUsersByFilter(@FromQuery(UserFilter) userFilter: UserFilter)
        ```
    - ##### Request Body
        Use the `FromBody` decorator to parse the whole body/payload section into a custom typescript class/model.
        
        To do this, first define a model, let's say, `User`.
        ```js
        // user.ts
        export class User extends Model {
            public name: string;
            public email: string;
            public age: number;
        }
        ```
        **Note that the models that you want `Express Bootstrap` to auto deserialize should extend the `Model` class.*
        
        Next, use the `FromBody` decorator in the method parameter and provide the `User` model as a parameter to the decorator, as follows:
        ```js
        createUser(@FromBody(User) user: User)
        ```
        
- #### Complex Models
    Sometimes you want your models to be a bit complex. This could include cases like composition. This is where the `compose` and `composeMany` decorators come into play.  
    
    ***compose:*** is used when a type composes of another type. For instance, let us assume that the user has an address, which is a separate type. The user model would now look like the following:
    ```js
    export class User extends Model {
        public name: string;
        public email: string;
        public age: number;
        
        @compose(Address)
        public address: Address;
    }
    ```
    The `Address` could in turn compose of other types.
    
    ***composeMany:*** is used when a type composes of a collection of another type. For instance, let us assume that the user has a set of nicknames. For brevity, the nicknames are just simple strings. The user model would now look like the following:
    ```js
    export class User extends Model {
        public name: string;
        public email: string;
        public age: number;
        
        @composeMany(String)
        public nicknames: string[];
    }
    ```
    
    ***Note:*** The limitation of these decorators while deserialization is because of the fact that typescript transpiles into javascript, hence all the types are dissolved at runtime. Since no type information is available at runtime, these decorators are needed to provide the necessary information for proper deserialization.
    
- #### Input Validation
    `Express Bootstrap` uses [Joi](https://www.npmjs.com/package/joi) for its user input validation. The `validate` decorator is used to validate each individual field of a model.
    
    The validate decorator takes an object that has the following 3 properties:  
    ***constraint:*** The `Joi` constraint for this property.  
    ***arrayElementsConstraint (Optional):*** If the property is an array of object, this property should be provided to specify the constraint on the array objects.  
    ***model (Optional):*** If an object is used, the type should be provided. The object class should extend the 'Model' class.  

    Lets take our good old `User` type and apply input validation to it. It would look something like the following:
    ```js
    export class User extends Model {
        @validate({ constraint: Joi.string() })
        public name: string;
        
        @validate({ constraint: Joi.string().email() })
        public email: string;
        
        @validate({ constraint: Joi.number().min(18).max(60) })
        public age: number;
        
        @validate({
            constraint: Joi.array().items().required(), 
            model: Interest, 
            arrayElementsConstraint: Joi.object().required()
        })
        @compose(Address)
        public address: Address;
        
        @validate({ constraint: Joi.array().items(Joi.string()).required() })
        @composeMany(String)
        public nicknames: string[];
    }
    ```
    ***name*** is a string.  
    ***email*** is a string that is an email.  
    ***age*** is a number whose value can be between 18 and 60 inclusive.  
    ***address*** is an array that is required. It is of type `Interest`. The array should have atleast one object.  
    ***nicknames*** is an array of strings. The array is required.  

    For a full list of validation options and capabilities, kindly check [Joi documentation](https://joi.dev/api/?v=17.3.0).

- #### Response Entity
    A `Response` entity could be used to return a status code alongwith the response object. The usage is as follows:
    ```js
    import { HTTPResponse } from 'xpress-bootstrap/bin/constants/enum';
    import { Response } from 'xpress-bootstrap/bin/models/response';
    ...
    ...
    @Get()
    index() {
        return new Response(HTTPResponse.Success, { message: 'Hello World of Express Bootstrap' });
    }
    ```

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