import {Response, NextFunction} from "express"


import * as utils from "./utils"
import * as error from "./exceptions"

import {config, dependencyMap} from "./default"


export default abstract class PermitHandler {
  
  protected static getPolicies(){
    return dependencyMap.get("policies");
  }
  protected static getModels(){
    return dependencyMap.get("models");
  }
}