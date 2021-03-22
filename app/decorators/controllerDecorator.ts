import { ControllersContainer } from "../container";
import { Lifetime } from 'awilix';
import { baseControllerClassIdentifier } from "../constants/constants";
import { FgRed, Reset } from "../constants/consoleConstants";

export function Controller(constructor: any) {
    const controllerName = constructor.name.replace('Controller', '');
    ControllersContainer.set(controllerName.toLowerCase(), constructor, Lifetime.SINGLETON);

    // Performing validations on the input controller that it extends the BaseController.
    const controller = ControllersContainer.get(controllerName.toLowerCase());
    if (controller && !controller.hasOwnProperty(baseControllerClassIdentifier)) {
        const message = `${FgRed}[error] Controller '${controllerName}' doesn't extend BaseController. It won't be registered unless you extend it from BaseController.${Reset}`;
        console.warn(message);
        ControllersContainer.remove(controllerName.toLowerCase());
    }
}