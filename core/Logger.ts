import { SauceConfig } from "./resources/SauceConfig";

function logit(method :Function, msg :any, ...extraArgs :any) {
    if(extraArgs) {
        method(msg, ...extraArgs);
    }
    else{
        method(msg);
    }
}

export function log(config :SauceConfig, logger :"debug" | "info" | "warn" | "error", msg :any, ...extraArgs :any) {
    if(!config.disableLogs) {
        if(config.logger?.[logger]) {
            logit(config.logger?.[logger], msg, ...extraArgs);
        }
        else{
            logit(console.log, msg, ...extraArgs);
        }
    }
}
