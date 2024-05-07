
interface Permissive {
  permitIf:()=>Promise<any>
}

interface IPermitHandler {
  register: any
}

  /**
  * Represents a base method with permission-related functionalities.
  */
  interface BaseMethod {
    /**
    * Checks if the method can be performed based on the provided permissions.
    * @param method - The method to check permission for.
    * @param options {PolicyConfigOptions} - Options for permission checking.
    * @param errorMessage - Custom error message to throw on permission error.
    * @returns A Promise that resolves to true if the method can be performed, otherwise false.
    */
    can(
      method: string,
      options?: Pick < PolicyConfigOptions, "throwOnPermissionError" >,
      errorMessage?: string
    ): Promise < boolean >;

    /**
    * Checks if the method cannot be performed based on the provided permissions.
    * @param method - The method to check permission for.
    * @param options - Options for permission checking.
    * @param errorMessage - Custom error message to throw on permission error.
    * @returns A Promise that resolves to true if the method cannot be performed, otherwise false.
    */
    cannot(
      method: string,
      options?: Pick < PolicyConfigOptions, "throwOnPermissionError" >,
      errorMessage?: string
    ): Promise < boolean >;

    /**
    * Executes a callback when a condition is met.
    * @param condition - The condition to check.
    * @param callback - The callback function to execute when the condition is met.
    * @param options - Options for permission checking.
    * @param errorMessage - Custom error message to throw on permission error.
    * @returns A Promise that resolves once the callback is executed.
    */
    when(
      condition: boolean | (() => boolean),
      callback: () => void,
      options?: Pick < PolicyConfigOptions, "throwOnPermissionError" >,
      errorMessage?: string
    ): Promise < void >;
  }


  /**
  * Represents the options for configuring policies.
  */
  interface PolicyConfigOptions {
    /**
    * The directory where policies are located.
    */
    policiesDir: string;

    /**
    * The directory where models are located.
    * Optional.
    */
    modelsDir?: string;

    /**
    * The suffix used for policy files.
    * Optional.
    */
    suffix?: string;

    /**
    * Whether to throw an error on permission violation.
    * Optional. Defaults to true.
    */
    throwOnPermissionError?: boolean;
  }

  /**
  * Represents a mapping of model names to mongoose models.
  * @template T The type or interface of the mongoose model.
  */
  type ModelMap < T > = Map < string,
  mongoose.Model < T>>;

  /**
  * Represents an express interface for policy request.
  */
  type PolicyRequest = express.Request;
type Permit = "permitIf"|"permitWhen"|"permitUnless"|"permitUntil";

  declare module "express-serve-static-core" {
    /**
    * Extends the Request interface in Express to include user permissions.
    */
    export interface Request {
      /**
      * User object representing permissions.
      */
      user?: Permissive & {
        /**
        * Permission object.
        */
        permission: BaseMethod;
        /**
        * Additional properties.
        */
        [x: string]: any;
      }
    }
  }
//}