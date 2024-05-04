## Overview

This hook-like middleware helps to intelligently apply policy handlers to your code by simply following some basic steps.

## Supports Typescript

## This library is specifically for expressjs and mongoose applications

## Installation
1. NPM:
```bash
npm install use-policy
```
2. Yarn:
```bash
yarn add use-policy
```

## Test
To test the application, execute the following command:
```bash
npm run start:example
```
The application will be served at `http://localhost:3000`.


```
curl localhost:3000
```


## Code Structure
- `index.ts`: Entry point of the application.
- `usePolicy.ts`: Middleware for applying policies.
- `models/`: Directory for storing models (currently commented out).
- `policies/`: Directory containing policy definitions.

## How to use this Middleware

Create the following folder in your project Directory

- `policies`: This will hold all our policy declarations

- Inside policies folder, lets create `UserPolicy.ts`

```
// UserPolicy.ts


// If you are a typescript fan
import {PolicyRequest, ModelMap} from 'use-policy'

// You must export a default class named after your filename
// All policies must return boolean


export default UserPolicy{
  
  // Optionally catch the request in constructor (Not Recommded)
  
constructor(request: PolicyRequest){}
  
  
  // Define your first policy
  // You can name it anything
  // request and models are injected for you
// For proper typescripting, we have imported ModelMap with our IUser interface

  public async test_policy(request: PolicyRequest, models: ModelMap<IUser>): Promise<boolean> {
  
  Lets let a User schema
  • Whatever you pass to `get` must have existed in models/* folder
  
  • Notice the ?. This is applied to stop typescript from screaming undefined. It is actually defined
  
  
    const User = models?.get("User")
    
    const user = await User.findById(request.user.id)
    
    const isAdmin = user?.roles.includes("admin")
    
    return isAdmin
  }
  
  ... Add more policies
}

```


_Note_: The filename must end with Policy
 (we can change this to whatever we want in the later)

- `models`: Create a file, `User.ts` to export a mongoose schema (This is if you need database persistence. It is optional for this middleware to work)


In `app.ts`

```
import express from "express"
import path from "path"

import usePolicy from "use-policy"


const app = express()
```

Initialize your route

```
app.get("/"
```
* Authenticate User and populate req.user

```
(req: any, __, next: any)=> {
    req.user = {
      id: hd7g3ujeiueuegdiheueh
    }
    next()
},
```

* Apply use-policy

```
usePolicy({

** Location of your policies folder (Required)


policiesDir: path.resolve(__dirname, "policies"),

** Location of your models folder (Optional)

modelDir: path.resolve(__dirname, "models"),
}),
```

* Handle your request
```
async (req: any, res: any, next)=>{
try{

1. We will throw error if permission fails

await req.user.permissions.can("test_policy")

```

2. You can send a custom message if not permiited
```await req.user.permissions.can("test_policy", undefined, "You are not permmitted")
```

3. You can handle the checks yourself
```
const isPermitted = await req.user.permissions.can("test_policy", {
throwOnPermissionError: false
})

if(!isPermitted) res.send("Not Permitted")

else res.send("OK")
```

If checks passes

``` 
res.json("OK")
```

otherwise, 

``` 
  
}catch(err){
```
4. Catch and handle error here (User not permmited)

```
console.log("Error", err.message)
res.send(err.message)
}
}
)


app.listen(3000, ()=>console.log("Serving at 3000"))
```


## Tyoescript declarations
```

usePolicy({

// Registers thr location of all policy files
  policiesDir: string,
  
  
  // Registers the location to find all models (mongoose schemas only)
  modelDir?: string,
  
  // If `false`, will return the boolean response instead to throwing on permission error
  throwOnPermissionError?: boolean
})

```