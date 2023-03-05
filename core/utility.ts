import {ErrorInterface} from "./resources/ErrorInterface";
import {SauceConfig} from "./resources/SauceConfig";

export const cleanObject = async (obj: any) :Promise<void> => {
    asyncForEach(Object.keys(obj), async key =>{
        if(isObject(obj[key])) {
            await cleanObject(obj[key]);
        }
        else{
            (obj[key] == null) && delete obj[key];
        }
    });
};

export const formatError = (status: number, details: any) :ErrorInterface => {
    return {
        status,
        details
    };
};

// eslint-disable-next-line no-unused-vars
type asyncForEachCB<A, B> = (item: A, index?: number, array?: A[])=>any;
export const asyncForEach = async <A=any, B=A>(array: A[], callback:asyncForEachCB<A, B>) :Promise<B[]> => {
    try {
        const allPromises = array.map(async (item: A, index: number, array: A[]) => callback(item, index, array));
        return await Promise.all(allPromises);
    }
    catch (e) {
        throw e;
    }
};

export const getAppUrl = (config :SauceConfig) :string => {
    if(config.environments[process.env.ENV]) {
        return config.environments[process.env.ENV].url;
    }
    throw new Error(`Environment ${process.env.ENV} not recognized`);
};

export const isObject = (obj)=>{
    return obj === Object(obj) && !Array.isArray(obj) && typeof obj !== "function";
};
