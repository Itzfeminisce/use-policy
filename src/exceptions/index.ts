import * as fs from 'fs';

abstract class BaseException<T> extends Error {
    protected constructor(public enumValue: T, message: string) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        
        // Log the error
        console.warn(JSON.stringify({ error: this.enumValue, message: this.message }));
        
        // Save error in a file
        fs.writeFileSync('error_log.json', JSON.stringify({ error: this.enumValue, message: this.message }));
    }
}

// Subclasses
export class ModelLoadErrorException extends BaseException<string> {
    constructor(message: string) {
        super('MODEL_LOAD_ERROR', message);
    }
}
// Subclasses
export class UnknownPolicyException extends BaseException<string> {
    constructor(message: string) {
        super('UNKNOWN_POLICY_ERROR', message);
    }
}

export class PolicyLoadErrorException extends BaseException<string> {
    constructor(message: string) {
        super('POLICY_LOAD_ERROR', message);
    }
}

export class UndefinedAuthUserException extends BaseException<string> {
    constructor(message: string) {
        super('UNDEFINED_AUTH_USER', message);
    }
}
export class InitDependenciesException extends BaseException<string> {
    constructor(message: string) {
        super('INIT_DEPENDENCIES_ERROR', message);
    }
}
