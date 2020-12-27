import { Model } from "../models/baseModel";

export class Composition {
    property: string; 
    type: any;
    isCollection: boolean;
    
    constructor(property: string, type: any, isCollection: boolean) {
        this.property = property;
        this.type = type;
        this.isCollection = isCollection;
    }
}