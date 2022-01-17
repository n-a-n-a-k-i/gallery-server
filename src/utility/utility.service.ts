import {Injectable} from "@nestjs/common";
import {sep, posix} from "path";

@Injectable()
export class UtilityService {

    /**
     * Формат числа
     * @param number
     * @param length
     */
    formatNumber(number: number, length: number): string {

        let string = number.toString()

        while (string.length < length) string = '0' + string

        return string

    }

    /**
     * Путь из стиля Windows в стиль POSIX
     * @param path
     */
    windowsToPOSIX(path: string): string {

        if (sep === posix.sep) {
            return path
        }

        return path.split(sep).join(posix.sep)

    }

}
