# Manage Session Data with a TypeScript Object

## Purpose

The sessionStorage object can be complicated to use for the following reasons:
* sessionStorage only supports strings. That means you have to use JSON.stringify and JSON.parse to use it for other types.
* If a key has not been set using sessionStorage, it will return null. That makes is difficult to tell if the key was set to null, or if the key was never set in the first place.
* There is no TypeScript type safety with sessionStorage

### sessionStorage Problem Examples:
```typescript
function sessionStorageNonString() {
    const dataKey = 'examples::session-storage-problems-non-string::data';

    sessionStorage.setItem(dataKey, 7);
    // Argument of type '7' is not assignable to parameter of type 'string'.
}
```
```typescript
function sessionStorageUndefined() {
    const dataKey = 'examples::session-storage-problems-undefined::data';

    sessionStorage.setItem(dataKey, JSON.stringify(undefined));

    let data = JSON.parse(sessionStorage.getItem(dataKey));
    // ERROR SyntaxError: "JSON.parse: unexpected character at line 1 column 1 of the JSON data"
}
```
```typescript
function sessionStorageNotTypeSafe() {
    const dataKey = 'examples::session-storage-problems-not-type-safe::data';

    sessionStorage.setItem(dataKey, JSON.stringify('Babe Ruth'));

    sessionStorage.setItem(dataKey, JSON.stringify(7));

    // No warnings about type discrepancy
}
```
## SessionObject to the Rescue

The type and key are declared in one line:
```typescript
const data = new SessionObject<number>('examples::rescue::data');
```

You can get and save the item easily:

```typescript
function basicExample() {
    const data = new SessionObject<string>('examples::basic-example::data');

    data.set('Hello World');

    console.log(data.get());
    // Hello World
}
```
No need to use JSON.stringify or JSON.parse for non-string types:
```typescript
function counterExample() {
    const data = new SessionObject<number>('examples::counter-example::data');
    data.set(0);

    let count = data.get();

    console.log(count);
    // 0

    count++;

    data.set(count);

    console.log(data.get());
    // 1
}
```
undefined and null values work like everything else in javascript:
```typescript
function undefinedExample() {
    const data = new SessionObject<string>('examples::undefined-example::data');

    console.log(data.get());
    // undefined

    console.log(typeof data.get() === 'undefined');
    // true

    data.set('Hello World');

    console.log(data.get());
    // Hello World

    data.delete();

    console.log(typeof data.get() === 'undefined');
    // true
}
```
```typescript
function nullExample() {
    let data = new SessionObject<string>('examples::null-example::data');

    data.set(null);

    console.log(data.get());
    // null

    console.log(data.get() === null);
    // true
}
```
Here is an example of a counter service using SessionObject:
```typescript
class CounterService {
    // second parameter is default value
    private countData = new SessionObject<number>('counter-service::countData', 0);

    public decrement() {
        this.countData.set(this.countData.get() - 1);
    }

    public getCount() {
        return this.countData.get();
    }

    public increment() {
        this.countData.set(this.countData.get() + 1);
    }

    public reset() {
        this.countData.set(0);
    }
}
```
Here is an example for storing a user data object:
```typescript
class User {
    fullname: string;
    email: string;
}
```
```typescript
class UserService {
    private userData = new SessionData<User>('examples::user-service::user-data');

    constructor() {
        this.userData.set({
            fullname: 'Babe Ruth',
            email: 'babe.ruth@yankees.com'
        });
    }

    public updateEmail(email: string) {
        let user = userData.get();

        user.email = email;

        userData.set(user);
    }
}
```
## SessionObject Class Definition

```typescript
class SessionObject<T extends any>
```

* T can be any type

```typescript
constructor(sessionKey: string, defaultValue?: T);
```

* sessionKey
    * must be unique to the session [e.g. sessionStorage.getItem(sessionKey)]
* defaultValue (optional)
    * this value will be stored only when value for sessionKey has not already been set during current session

```typescript
get(): T
```
* returns value from sessionStorage

```typescript
set(value: T): void
```

* stores the value in sessionStorage

```typescript
delete(): void
```

* removes key from sessionStorage

## Best Practices
This is fine for non-object types:
```typescript
class UserNameService {
    private nameData = new SessionObject<string>('examples::user-name-service::name-data');

    public get name() {
        return this.nameData.get();
    }

    public set name(value: string) {
        this.nameData.set(value);
    }
}

function thisIsFine() {
    const service = new UserNameService();

    service.name = 'Fred';

    console.log(service.name);
    // Fred
}
```
But can be confusing for object types:
```typescript
class UserService {
    private userData = new SessionObject<User>('examples::user-service::user-data');

    public get user() {
        return this.user.get();
    }

    public set user(value: User) {
        this.user.set(value);
    }
}

function confuse() {
    const service = new UserService();

    service.user = {
        name: 'Fred Flintstone',
        email: 'fred.flintstone@stone-age.com'
    };

    console.log(service.user);
    // {
    //   "name": "Fred Flintstone",
    //   "email": "fred.flintstone@stone-age.com"
    // }

    service.user.email = 'fred@bedrock.com';

    console.log(service.user);
    // {
    //   "name": "Fred Flintstone",
    //   "email": "fred.flintstone@stone-age.com"
    // }

    // The email field did not change because the object was not replaced with set().
}
```
