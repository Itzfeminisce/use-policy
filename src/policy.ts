import { NextFunction, Request, Response } from "express";
import path from "path";
import fs from "fs";
import util from "util";


import Permission from "./permission"
import defaultPolicyConfigs from "./default"

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);






class Policy {
  private options: PolicyConfigOptions;
  protected request: PolicyRequest;
  protected response: Response;
  protected next: NextFunction;
  protected policySet: Set<Object>;

  constructor(
    opts: PolicyConfigOptions,
    req: PolicyRequest,
    res: Response,
    next: NextFunction
  ) {
    this.options = opts;
    this.request = req;
    this.response = res;
    this.next = next;
    this.policySet = new Set<Object>();
  }

  public async loadPolicies() {
    if (!(this.request.user)) {
        throw new Error(
          "Express.Request.User not defined."
        )
    }

    const files = await readdir(this.options.policiesDir as string);
    for (const file of files) {
      if (file.includes("BasePolicy")) continue;
      const policyName = path.basename(file, ".js");
      if (!policyName.endsWith("Policy")) continue;
      const { default: customPolicy } = await import(
        `${this.options.policiesDir}/${policyName}`
      );
      try {
        this.policySet.add(new customPolicy(this.request));
      } catch (e) {
        throw e
      }
      const models = await this.loadModels();
      const pm = new Permission<typeof models>(
        this.request,
        this.response,
        this.next,
        models,
        this.options,
        this.policySet
      );
      this.request.user.permissions = pm;
    }
    return this;
  }

  async loadModels(dir?: string): Promise<Map<string, any>> {
    const instances = new Map<string, any>();
    if (!dir) return instances;

    try {
      const files = await readdir(dir);

      for (const file of files) {
        const fullPath = path.resolve(dir, file);
        if (fullPath.includes("index")) continue;
        const fileStat = await stat(fullPath);

        if (fileStat.isDirectory()) {
          const subInstances = await this.loadModels(fullPath);
          for (const [key, value] of subInstances) {
            instances.set(key, value);
          }
        } else if (file.endsWith(".ts") || file.endsWith(".js")) {
          const Model = require(fullPath);
          const instance = Model;
          for (const [key, value] of Object.entries(instance)) {
            instances.set(key, value);
          }
        }
      }
    } catch (error) {
      throw error;
    }

    return instances;
  }
}


export default Policy;