import {Injectable} from "@nestjs/common";

@Injectable()
export class UtilityService {

    formatNumber(number: number, length: number): string {

        let string = number.toString()

        while (string.length < length) string = '0' + string

        return string

    }

}
