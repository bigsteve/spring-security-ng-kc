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
        if (v === undefined) return ''
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


    /**
     * 
     * @param target 
     * @param source 
     */
    static deepCopyObjectWhereTargetKeysExist(target: object, source: object) {
        Object.keys(target).forEach(k => {
            if (typeof target[k] === 'object' && typeof source[k] === 'object' && source[k] !== null) {
                Utils.deepCopyObjectWhereTargetKeysExist(target[k], source[k])
            } else if (source.hasOwnProperty(k)) {
                target[k] = source[k]
            }
        })
    }




    static setObjectValue(object: any, k: string, v: any) {

        let obj = object

        let ksplit = k.split('.')
        for (let i = 0; i < ksplit.length - 1; i++) {
            if (!obj[ksplit[i]]) obj[ksplit[i]] = {}
            obj = obj[ksplit[i]]
        }
        obj[ksplit[ksplit.length - 1]] = v
    }


    static getObjectValue(object: any, k: string) {
        
        let obj = object
        let ksplit = k.split('.')
        for (let i = 0; i < ksplit.length; i++) {
            obj = obj[ksplit[i]]
        }
        return obj;
    }


    static stringToDate(date: string | String, format: string | String) {

        let separator = format[format.search(/[^A-Za-z]/)]
        let formatArr = format.toLowerCase().split(separator)
        let dateArr = date.split(separator).map(el => parseInt(el))
        return new Date(dateArr[formatArr.indexOf('yyyy')], dateArr[formatArr.indexOf('mm')] - 1, dateArr[formatArr.indexOf('dd')])
    }

}
