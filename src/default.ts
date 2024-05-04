import path from "path"

const defaultPolicyConfigs: PolicyConfigOptions = {
  policiesDir: path.resolve(__dirname),
  modelDir: path.resolve(__dirname, "models"),
  suffix: "Policy",
  throwOnPermissionError: true,
};


export default defaultPolicyConfigs