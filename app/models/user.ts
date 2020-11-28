import { composeMany } from "../decorators/compositionDecorator";
import { Interest } from "./interest";

export class User {
    public name: string;
    public email: string;
    public age: number;
    
    @composeMany(Interest)
    public interests: Interest[];
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