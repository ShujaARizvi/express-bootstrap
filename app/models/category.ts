import { composeMany } from "../decorators/compositionDecorator";
import { Tag } from "./tag";

export class Category {

    public name: string;
    public description: string;

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