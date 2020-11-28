import { Composition } from "../entities/composition";

export function deserialize(param: any, type: any) {
    return deserializer(param, type);
}

function deserializer(param: any, type: any, parentType?: any, paramName?: string) {
    const response = new type();
    let parent;
    if (parentType) {
        parent = new parentType();
    }
    for (let key in param) {
        if (typeof param[key] === 'object') {
            if (response.constructor.name === 'Array') {
                const arrayType = (<Composition[]>parent.compositions).find(x => x.property === paramName);
                if (arrayType) {
                    response.push(deserializer(param[key], arrayType.type, type, key));
                }
            } else {
                let arrayType;
                if (response.compositions) {
                    arrayType = (<Composition[]>response.compositions).find(x => x.property === key);
                }
                const constructor = arrayType ? (arrayType.isCollection ? Array : arrayType.type) : response[key].constructor;
                response[key] = deserializer(param[key], constructor, type, key);
            }
        } else {
            response[key] = param[key];
        }
    }
    return response;
}