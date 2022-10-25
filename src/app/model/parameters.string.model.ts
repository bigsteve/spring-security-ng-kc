import { Utils } from "../utils/utils.model"
/**
 * @desc Parameters must get stored and read from local storage as {storagename.pageurl.sectionname: {'?param1=val1&param2=val2'}}
 */
export class ParametersString {


    protected parameters: {} = {}
    protected stringParams: string = ""
    protected isStored = true
    protected storageName: string


    constructor(section: string, isUiRequest: boolean = true) {

        this.storageName = Utils.strReplaceAll(['/', '-', ' '], '_', window.location.pathname).toLowerCase() + "_" + section
        if (isUiRequest) {
            this.setParam('uirequest', 'true')
        } else {
            this.useLocalStorage(false)
        }
    }


    setParam(name: string, value: string) {
        this.parameters[name] = value
    }


    saveParametersString = () => {

        if (Object.keys(this.parameters).length === 0) return

        this.stringParams = "?" + Utils.objToUriParameters(this.parameters)

        if (this.isStored) {
            try {
                localStorage.setItem(this.storageName, this.stringParams)
            }
            catch (e) {
                console.error(e)
            }
        }
    }


    getParametersString = () => {

        let str = ""

        if (this.isStored && localStorage.getItem(this.storageName) != null) {
            try {
                str = localStorage.getItem(this.storageName)
            }
            catch (e) {
                console.error(e)
            }
        }

        if(str !== "") return str
        if (Object.keys(this.parameters).length === 0) return ""
        return "?" + Utils.objToUriParameters(this.parameters)
    }


    useLocalStorage = (isStored: boolean) => {
        this.isStored = isStored
    }
}
