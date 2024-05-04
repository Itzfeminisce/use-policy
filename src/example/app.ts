import express, {
  Application,
  Response,
  Request
} from "express"
import path from "path"
import usePolicy from "../usePolicy"
const app = express()

app.get("/",

/**
 * Authenticate User and populate req.user
**/
(req: any, __, next: any)=> {
  req.user = {
    id: 500
  }
  next()
},

/**
 * Apply middleware
**/
  usePolicy({
    //modelDir: path.resolve(__dirname, "models"),
    policiesDir: path.resolve(__dirname, "policies"),
  }),


/***
 * Apply policy
**/
  async (req: any, res: any, next)=>{
    try{
    await req.user.permissions.can("test_policy", undefined, "Not Permitted")
    res.json("OK")
      
    }catch(err){
      console.log("Error", err.message)
      res.send(err.message)
    }
      }
)


app.listen(3000, ()=>console.log("Serving at 3000"))