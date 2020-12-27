import Joi from "joi";
import { validate } from "../decorators/validationDecorator";
import { Model } from "./baseModel";

export class UserFilter extends Model {

    @validate({ constraint: Joi.number().min(1) })
    page: number;

    @validate({ constraint: Joi.number().min(1) })
    limit: number;

    public toString() {
        return JSON.stringify(this);
    }
}