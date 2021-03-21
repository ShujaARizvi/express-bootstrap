import { ControllersContainer } from "../container";
import { Lifetime } from 'awilix';
import { baseControllerClassIdentifier } from "../constants/constants";

export function Controller(constructor: any) {

    const controllerName = constructor.name.replace('Controller', '');
    ControllersContainer.set(controllerName.toLowerCase(), constructor, Lifetime.SINGLETON);

    // Performing validations on the input controller that it extends the BaseController.
    const controller = ControllersContainer.get(controllerName.toLowerCase());
    if (controller && !controller.hasOwnProperty(baseControllerClassIdentifier)) {
        throw new TypeError(`Controller ${controllerName} doesn't extend BaseController`);
    }
}