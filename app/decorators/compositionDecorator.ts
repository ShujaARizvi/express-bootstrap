import { Composition } from "../entities/composition";
import { Model } from "../models/baseModel";

/**
 * Specify on the array properties.
 * 
 * Typescript compiles to Javascript before execution. Since Javascript doesn't feature types,
 * the type information of an array is lost at runtime, hence making it impossible to parse an
 * array of objects to proper types.
 * @param type Type parameter that denotes the class to which an array of object needs to be casted to.
 */
export function composeMany(type: any) {
    
    return (target: any, propertyKey: string) => {
        checkAndInitializeCompositions(target);
        target.compositions.push(new Composition(propertyKey, type, true));
    };
}

/**
 * Specify on the object properties.
 * 
 * Typescript compiles to Javascript before execution. Since Javascript doesn't feature types,
 * the type information is lost at runtime, hence making it impossible to parse an
 * objects to proper types.
 * @param type Type parameter that denotes the class to which an object needs to be casted to.
 */
export function compose(type: any) {

    return (target: any, propertyKey: string) => {
        checkAndInitializeCompositions(target);
        target.compositions.push(new Composition(propertyKey, type, false));
    }
}

function checkAndInitializeCompositions(target: any) {
    if (!target.hasOwnProperty('compositions')) {
        Object.defineProperty(target, 'compositions', {
            value: new Array<Composition>()
        });
    }
}