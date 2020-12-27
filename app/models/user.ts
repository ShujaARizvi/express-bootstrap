import Joi from "joi";
import { composeMany } from "../decorators/compositionDecorator";
import { validate } from "../decorators/validationDecorator";
import { Model } from "./baseModel";
import { Interest } from "./interest";

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
    @composeMany(Interest)
    public interests: Interest[];
    
    @validate({ constraint: Joi.array().items(Joi.string()).required() })
    @composeMany(String)
    public shows: string[];

    public toString() {
        let stringifiedResult = '';
        if (this.name) {
            stringifiedResult += `Name: ${this.name}\n`;
        }
        if (this.email) {
            stringifiedResult += `Email: ${this.email}\n`;
        }
        if (this.age) {
            stringifiedResult += `Age: ${this.age}\n`;
        }
        if (this.interests) {
            stringifiedResult += `Interests: ${this.interests}\n`;
        }
        if (this.shows) {
            stringifiedResult += `Shows: ${this.shows}`;
        }
        return stringifiedResult;
    }
}