import { AwilixContainer, Lifetime, LifetimeType } from "awilix";
const awilix = require('awilix');

export class ControllersContainer {

    // Create the container and set the injectionMode to CLASSIC.
    private static container: AwilixContainer = awilix.createContainer({
        injectionMode: awilix.InjectionMode.CLASSIC
    });

    private constructor() {}

    public static getContainer() {
        return ControllersContainer.container;
    }

    static get(key: string): Object | undefined {
        return ControllersContainer.container.resolve(key);
    }

    static set(key: string, value: any, lifetime: LifetimeType): void {
        const obj: any = new Object();
        obj[key] = awilix.asClass(value, { lifetime: lifetime });

        ControllersContainer.container.register(obj);
    }
    
    static remove(key: string) {
        const obj: any = new Object();
        obj[key] = undefined;

        ControllersContainer.container.register(obj);
    }
}