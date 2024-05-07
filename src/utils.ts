import path from "path";
import fs from "fs";
import util from "util";



import * as error from "./exceptions"


const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);




export enum Logger {
  ERR_LOAD_POLICY_FROM_DIR = "ERR_LOAD_POLICY_FROM_DIR"
}



export async function loadPoliciesFromDir(
  dir: string,
  suffix: string = "Policy"
): Promise < Set < any >> {
  try {
    const files = await readdir(dir);
    const policySet = new Set < any > ()

    for (const file of files) {

      const policyName = path.basename(file, ".js");

      if (!policyName.endsWith(suffix)) continue;

      const {
        default: Policy
        } = await import(
          `${dir}/${policyName}`
        );

        policySet.add(Policy)
      }
      return policySet;
    }catch(err: any) {
      throw new error.PolicyLoadErrorException(err.message)
    }
  }

  export async function loadModelsFromDir(dir: string): Promise < Map < string, any>> {

    const instances = new Map < string,
    any > ()

    if (!dir) throw new error.ModelLoadErrorException("Failed to load models from directory: "+dir)

    try {
      const files = await readdir(dir);

      for (const file of files) {

        const fullPath = path.resolve(dir, file);

        if (fullPath.includes("index")) continue;

        const fileStat = await stat(fullPath);

        if (fileStat.isDirectory()) {
          const subInstances = await loadModelsFromDir(fullPath);
          for (const [key, value] of subInstances) {
            instances.set(key, value);
          }
        } else {
          for (const [key, value] of Object.entries(require(fullPath))) {
            instances.set(key, value);
          }
        }
      }

      return instances
    } catch (error: any) {
      throw new error.UnknownPolicyException(error.message)
    }

    return instances;
  }
  
  
  export async function validateUserAgainstPolicy(method: string, policySet: Set<string, any>): Promise<any>{
    
    policySet.forEach(_Class=>{
      console.log(_Class)
      //const _inst = new _Class()
    })
  /*  
    for (let _instance of policySet) {
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
    }
    */
    
    return policySet
  }