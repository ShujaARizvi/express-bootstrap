import Joi from "joi";
import { compose } from "../decorators/compositionDecorator";
import { validate } from "../decorators/validationDecorator";
import { Model } from "./baseModel";
import { Category } from "./category";

export class Interest extends Model {
    
    @validate({ constraint: Joi.string().min(5) })
    public name: string;
    
    @validate({ constraint: Joi.number() })
    public intensity: number;
    
    @validate({
        constraint: Joi.object(), 
        model: Category
    })
    @compose(Category)
    public category: Category;

    public toString() {
        return `\n${this.name} | Intensity: ${this.intensity} | Category: ${this.category}`;
    }
}