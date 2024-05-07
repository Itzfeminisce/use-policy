import path from "path"

export const config: PolicyConfigOptions = {
  policiesDir: path.resolve(__dirname, "policies"),
  modelsDir: path.resolve(__dirname, "models"),
  suffix: "Policy",
  throwOnPermissionError: true,
};

// Register all defined permission handlers
export const handlerSet: IPermitHandler = new Set<IPermitHandler>()



export const dependencyMap = new Map<"policies"|"models", any>()


