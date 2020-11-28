import { compose } from "../decorators/compositionDecorator";
import { Category } from "./category";

export class Interest {
    
    public name: string;
    public intensity: number;
    @compose(Category)
    public category: Category;

    public toString() {
        return `\n${this.name} | Intensity: ${this.intensity} | Category: ${this.category}`;
    }
}