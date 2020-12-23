import { ParamType } from "../constants/enum";

export class ParamInfo {
    /**
     * Index of the param.
     */
    index: number;
    /**
     * Name of the param.
     */
    name: string;
    /**
     * Type of the param.
     */
    paramType: ParamType;
    model: any;

    public constructor(index: number, name: string, paramType: ParamType, model?: any) {
        this.index = index;
        this.name = name;
        this.paramType = paramType;
        this.model = model;
    }
}