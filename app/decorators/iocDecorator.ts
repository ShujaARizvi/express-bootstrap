import { Lifetime } from 'awilix';
import { ControllersContainer } from '../container';
const awilix = require('awilix');

/**
 * Marks a class as Injectable. 
 * This means that the class's instance can be injected into constructors of other classes through DI.
 * @param registrationName Name to be used while resolving the dependency. 
 * During constructor resolution, this name should match the parameter name, or else the `injection` process wouldn't work.
 */
export function Injectable(registrationName: string) {
    
    return function (constructor: any) {
        ControllersContainer.set(registrationName, constructor, Lifetime.TRANSIENT);
    }

}