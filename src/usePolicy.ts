import {Response, NextFunction} from "express"


import * as utils from "./utils"
import {config, dependencyMap, handlerSet} from "./default"




function usePolicy(
  opts: PolicyConfigOptions = config
) {
  return async function (
    req: PolicyRequest,
    res: Response,
    next: NextFunction
  ) {
    
    const dependencies: any[] = [
      utils.loadPoliciesFromDir(opts.policiesDir)
      ]
    
    if(opts.modelsDir){
      dependencies.push(
        utils.loadModelsFromDir(opts.modelsDir)
        )
    }
  
    const [policies, models] = await Promise.all(dependencies)
    
    //handler.add(PermitHandler);
    
    dependencyMap.set("policies", policies)
    dependencyMap.set("models", models)
    
    /*
    policies.forEach((Policy)=>{
      const _inst = new Policy()

      if (Reflect.has(_instance, method)) {
        const _func = Reflect.get(_instance, method);
        if (typeof _func == "function") {
          const isPermitted = await Promise.resolve(_func(this.request, this.models))

          return this.throwOnPermissionError(
            isPermitted,
            options,
            errorMessage)
        }
      }
    })
    */
}

 function registerHandler(_handler: IPermitHandler){
  handlerSet.add(_handler)
}

export default usePolicy
export registerHandler;