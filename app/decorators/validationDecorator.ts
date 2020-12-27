import Joi from "joi";
import { validationSchemaPropertyName } from "../constants/constants";
import { Model } from "../models/baseModel";

const schemaPropertyName = validationSchemaPropertyName;

function checkAndCreateSchemaProperty(target: any) {
    if (!target.hasOwnProperty(schemaPropertyName)) {
        Object.defineProperty(target, schemaPropertyName, {
            value: {}
        });
    }
}

/**
 * Validates a particular property using the constraints provided.
 */
export function validate(param: {
    /**
     * The constraint for this property.
     */
    constraint: Joi.AnySchema,
    /**
     * If the property is an array of object, this property should be provided to specify the constraint on the array objects.
     */
    arrayElementsConstraint?: Joi.ObjectSchema,
    /**
     * If an object is used, the type should be provided.
     * The object class should extend the 'Model' class. 
     */
    model?: typeof Model,
}) {
    
    return (target: any, propertyKey: string) => {
        
        // Check if validationSchema object is defined, if not, define it.
        checkAndCreateSchemaProperty(target);

        const schemaObject = target[schemaPropertyName];

        // Check if any such key already exists on the schema object.
        if (schemaObject.hasOwnProperty(propertyKey)) {
            throw new Error(`Model already contains a key with the name: ${propertyKey}`);
        }

        if (param.model) {
            const obj: any = new param.model();
            if (param.constraint.type === 'array') {
                if (!param.arrayElementsConstraint) {
                    throw new Error('Property "arrayElementConstraint" must be provided in case of array of objects.');
                }
                schemaObject[propertyKey] = (<Joi.ArraySchema>param.constraint).items(param.arrayElementsConstraint.append(obj[schemaPropertyName]));
            } else {
                schemaObject[propertyKey] = (<Joi.ObjectSchema>param.constraint).append(obj[schemaPropertyName]);
            }
        } else {
            schemaObject[propertyKey] = param.constraint;
        }
    }
}