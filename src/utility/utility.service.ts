import {Injectable} from "@nestjs/common";

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

}
