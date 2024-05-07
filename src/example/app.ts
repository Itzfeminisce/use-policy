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
    
    policiesDir: path.resolve(__dirname, "policies"),
  }),


  /***
  * Apply policy
  **/
  async (req: any, res: any, next: any)=> {
    try {

//await req.user.permitIf("email_is_verified")


      await req.user.permissions.can("delete_user", undefined, "Only user with ID 500 can delete User")


      await req.user.permissions.can("test_policy", undefined, "Not Permitted")

      await req.user.permissions.can("test_policy_2")

      // If all policies passes
      res.json("OK")

    }catch(err: any) {
      console.log("ERR_PERMISSION", err.message)
      res.send(err.message)
    }
  }
)


app.listen(3000, ()=>console.log("Serving at 3000"))