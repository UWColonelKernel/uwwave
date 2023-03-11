export interface CompanyHireHistory {
    term: string,
    organizationHired: string,
    divisionHired: string,
}

// Pie graphs only have series, bar graphs will have series and categories
export interface CompanyHireGraph {
    title: string,
    series: object,
    categories?: object,
}

export interface CompanyWorkTermRating {
    organization: string,
    division: string,
    hireHistory: CompanyHireHistory[],
    graphs: CompanyHireGraph[],
}

