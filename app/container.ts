
export class ControllersContainer {

    private static controllersMap: Map<string, Object> =  new Map<string, Object>();

    static set(key: string, value: Object): void {
        ControllersContainer.controllersMap.set(key, value);
    }
    
    static get(key: string): Object | undefined {
        return ControllersContainer.controllersMap.get(key);
    }

    static toString() {
        ControllersContainer.controllersMap.forEach((value, key) => {
            console.log(`${key}: `, value);
        });
    }
}