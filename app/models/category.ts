import Joi from "joi";
import { composeMany } from "../decorators/compositionDecorator";
import { validate } from "../decorators/validationDecorator";
import { Model } from "./baseModel";
import { Tag } from "./tag";

export class Category extends Model {

    @validate({ constraint: Joi.string() })
    public name: string;
    
    @validate({ constraint: Joi.string() })
    public description: string;
    
    @validate({
        constraint: Joi.array(),
        model: Tag,
        arrayElementsConstraint: Joi.object().required()
    })
    @composeMany(Tag)
    public tags: Tag[];

    public toString() {
        let stringifiedResult = '';
        if (this.name) {
            stringifiedResult += `${this.name} `;
        }
        if (this.description) {
            stringifiedResult += `<${this.description}>`;
        }
        if (this.tags) {
            stringifiedResult += `\n${this.tags}`;
        }
        return stringifiedResult;
    }
}