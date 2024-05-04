

interface BaseMethod {
  
  can(
    method: string,
    options?: Pick<PolicyConfigOptions, "throwOnPermissionError">,
    errorMessage?: string
  ): Promise<boolean>;
  
  
  cannot(
    method: string,
    options?: Pick<PolicyConfigOptions, "throwOnPermissionError">,
    errorMessage?: string
  ): Promise<boolean>;
  
 
  
  when(
    condition: boolean | ()=>boolean,
    callback: () => void,
    options?: Pick<PolicyConfigOptions, "throwOnPermissionError">,
    errorMessage?: string
  ): Promise<void>;

}


interface PolicyConfigOptions {
  policiesDir: string;
  modelDir?: string;
  suffix?: string;
  throwOnPermissionError?: boolean;
}


/**
 * Represents a mapping of model names to mongoose models.
 * @template T The type or interface of the mongoose model.
 */
type ModelMap<T> = Map<string, mongoose.Model<T>>;

/**
 * Represents an express interface for policy request.
 */
type PolicyRequest = express.Request;


declare module "express-serve-static-core" {
  export interface Request {
    user?: {
      permission: BaseMethod;
      [x: string]: any;
    }
  }
}