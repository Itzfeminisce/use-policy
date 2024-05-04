import {
  Response,
  NextFunction
} from "express"
import defaultPolicyConfigs from "./default"


class Permission < U > implements BaseMethod {

  constructor(
    private request: PolicyRequest,
    private response: Response,
    private next: NextFunction,
    private models: ModelMap < U >,
    private options: PolicyConfigOptions,
    private policySet: Set < Object >
  ) {}

  private throwOnPermissionError(
    isPermitted: boolean,
    options?: Pick < PolicyConfigOptions, "throwOnPermissionError" >,
    errorMessage?: string
  ): boolean {
    if (!isPermitted) {
      if (options && options.throwOnPermissionError === false) {
        this.options.throwOnPermissionError = defaultPolicyConfigs.throwOnPermissionError;
        return isPermitted;
      }

      throw new Error(
        errorMessage || "You do not have the required permissions to perform this action."
      );
    }
    return isPermitted;
  }
  public async can(
    method: string,
    options?: PolicyConfigOptions,
    errorMessage?: string
  ): Promise < boolean > {
    for (let _instance of this.policySet) {
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
    return false;
  }

  public async cannot(
    method: string,
    options?: PolicyConfigOptions,
    errorMessage?: string
  ): Promise < boolean > {
    return !this.can(method, options, errorMessage);
  }


  public async when(
    condition: boolean,
    callback: Function,
    options?: PolicyConfigOptions,
    errorMessage?: string
  ): Promise < void > {
    if (condition) {
      Promise.resolve(callback(this.request)).catch((err) => new Error(err));
    } else {
      this.throwOnPermissionError(condition, options, errorMessage);
    }
  }
}


export default Permission;