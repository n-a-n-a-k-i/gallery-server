export class PhotoQueryDto {

    readonly limit: number = 20

    readonly sortColumn: string = 'dateCreate'

    readonly sortDirection: string = 'DESC'

    readonly years: number[] = []

    readonly months: number[] = []

    readonly days: number[] = []

    lastDate: number = Date.now()

}