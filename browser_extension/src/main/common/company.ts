const DIVISION_DATA_IDENTIFIER = 'division_'

export interface HireHistory {
    term: string,
    organizationHired: string,
    divisionHired: string,
}

// Pie graphs only have series, bar graphs will have series and categories
export interface HireGraph {
    title: string,
    series: object,
    categories?: object,
}

export interface CompanyDivisionWorkTermRating {
    organization: string,
    division: string,
    hireHistory: HireHistory[],
    graphs: HireGraph[],
}

export function getCompanyDivisionDataKey(divisionId: number) {
    return `${DIVISION_DATA_IDENTIFIER}${divisionId.toString()}`
}

