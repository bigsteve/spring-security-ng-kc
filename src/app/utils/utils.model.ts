import { type } from "os";
import { environment } from "src/environments/environment";

/**
 * @desc Utils class to provide general functions
 */
export class Utils {

    /**
     * 
     * @param n 
     * @returns string
     */
    static zeroPrefix(n: number): string {
        return (n < 10) ? "0" + n : n.toString()
    }


    /**
     * 
     * @param obj 
     * @returns string
     */
    static objToUriParameters(obj: any): string {
        return Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&')
    }


    /**
     * @desc This function
     * @param from 
     * @param to 
     * @param v 
     */
    static strReplaceAll = function (from: string | string[], to: string | string[], v: string): string {
        if(v === undefined) return ''
        if (Array.isArray(to) && (!Array.isArray(from) || (Array.isArray(from) && from.length !== to.length))) {
            console.error('Error: Both arguments must be strings, or if the first argument is an array, the second argument must be a string or an array with the same length as the first array argument.')
            return v
        }

        if (typeof (from) === 'string') from = [from]
        if (typeof (to) === 'string') to = [to]

        let ii = '0'

        for (let i in from) {

            if (to[i] !== undefined) ii = i

            while (v.includes(from[i])) {
                v = v.replace(from[i], to[ii])
            }
        }

        return v
    }

    static setObjectValue(object: any, k: String, v: any) {

        let obj = object

        let ksplit = k.split('.')
        for(let i = 0; i < ksplit.length - 1; i++) {
            if( !obj[ksplit[i]] ) return
            obj = obj[ksplit[i]]
        }
        
        obj[ksplit[ksplit.length-1]] = v
    }

}
