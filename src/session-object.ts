export class SessionObject<T extends any> {
    public constructor(private key: string, private defaultValue?: T) {
        if (typeof defaultValue !== "undefined" && typeof this.get() === "undefined") {
            this.set(defaultValue);
        }
    }

    public delete() {
        sessionStorage.removeItem(this.key);
    }

    public get(): T {
        const value = sessionStorage.getItem(this.key);

        if (value === "undefined" || value === null) {
            return undefined as any;
        }

        return JSON.parse(value);
    }

    public set(value: T) {
        sessionStorage.setItem(this.key, JSON.stringify(value));
    }
}
