import Joi from "joi";
import { validate } from "../decorators/validationDecorator";
import { Model } from "./baseModel";

export class Tag extends Model {

    @validate({ constraint: Joi.string() })
    public name: string;

    public toString() {
        return this.name;
    }
}