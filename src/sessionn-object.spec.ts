import { expect } from "chai";
import { SessionObject } from "./session-object";

class TestModel {
    constructor(
        public email: string,
        public name: string,
    ) { }
}

describe("SessionObject", () => {
    it("sets and gets a string", () => {
        const stringData = new SessionObject<string>("test::set-and-get-string");

        stringData.set("This is a test.");

        expect(stringData.get()).to.equal("This is a test.");
    });

    it("sets and gets an object", () => {
        const testObject = new TestModel("Babe Ruth", "babe.ruth@yankees.com");

        const objectData = new SessionObject<TestModel>("test::set-and-get-object");

        objectData.set(testObject);

        const resultObject = objectData.get();

        expect(resultObject.email).to.equal(testObject.email);
        expect(resultObject.name).to.equal(testObject.name);
    });

    it("returns undefined when deleted", () => {
        const deleteData = new SessionObject<string>("test::delete");

        deleteData.set("This is a test.");

        deleteData.delete();

        expect(deleteData.get()).to.be.an("undefined");
    });

    it("returns undefined when not initialized", () => {
        const unInitializedData = new SessionObject<string>("test::uninitialized");

        expect(unInitializedData.get()).to.be.an("undefined");
    });

    it("returns same value for new instance with same key", () => {
        const instance1 = new SessionObject<string>("test::same-key");

        instance1.set("This is a test.");

        const instance2 = new SessionObject<string>("test::same-key");

        expect(instance2.get()).to.equal("This is a test.");
    });

    it("stores and returns a default value", () => {
        const defaultData = new SessionObject<string>("test::default", "This is a test.");

        expect(defaultData.get()).to.equal("This is a test.");
    });

    it("retains type", () => {
        const typedData = new SessionObject<number>("test:typed");

        typedData.set(7);

        expect(typedData.get()).to.be.an("number");
    });

    it("changes the value from default", () => {
        const changingData = new SessionObject<number>("test::changes-default", 0);

        let count = changingData.get();
        count++;
        changingData.set(count);

        expect(changingData.get()).to.equal(1);
    });

    it("changes a previously set value", () => {
        const changingData = new SessionObject<number>("test::changes-set");

        changingData.set(0);
        let count = changingData.get();
        count++;
        changingData.set(count);

        expect(changingData.get()).to.equal(1);
    });
});
