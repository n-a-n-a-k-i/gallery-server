import {Injectable} from "@nestjs/common";

@Injectable()
export class UtilService {

    numberToString(number: number, length: number, char: string = '0'): string {

        let string: string = number.toString()

        while (string.length < length) string = char + string

        return string

    }

}
