import { ParamType } from "../constants/enum";

export class ParamInfo {
    index: number;
    name: string;
    type: ParamType;

    public constructor(index: number, name: string, type: ParamType) {
        this.index = index;
        this.name = name;
        this.type = type;
    }
}