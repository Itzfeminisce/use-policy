import {Response, NextFunction} from "express"


import BasePolicy from "./policy"
import defaultPolicyConfigs from "./default"


export default function usePolicy(
  opts: PolicyConfigOptions = defaultPolicyConfigs
) {
  return async function (
    req: PolicyRequest,
    res: Response,
    next: NextFunction
  ) {
    await new BasePolicy(opts, req, res, next).loadPolicies();
    
    // @ts-ignore
    next()
  };
}
