import { environment } from "src/environments/environment";

export class Utils {

    static zeroPrefix(n: number): string {
        return (n < 10) ? "0" + n : n.toString()
    }

}
