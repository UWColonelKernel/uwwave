
export function getFilterUniqueValuesByCategory (tagCategoriesByJobID){
    const filters = {};

    for (const [jobid, tagCategories] of Object.entries(tagCategoriesByJobID)){
        for (const [categoryName, tags] of Object.entries(tagCategories)){
            if (categoryName === "keywords"){
                continue;
            }
            if (!(categoryName in filters)) {
                filters[categoryName] = new Set();
            }
            if (typeof tags === 'string') {
                filters[categoryName].add(tags);
            }
            else { // it's an array
                tags.forEach((tag) => {
                    filters[categoryName].add(tag);
                })
            }
        }
    }
    
    return filters;
}

export function isJobMatched (jobID, formula, tagCategoriesByJobID){
    if ('bool_op' in formula){
        if (formula.bool_op === "AND"){
            formula.operands.forEach((operand) => {
                if (!isJobMatched(jobID, operand, tagCategoriesByJobID)){
                    return false;
                }
            })

            return true;
        }
        else if (formula.bool_op === "OR"){
            formula.operands.forEach((operand) => {
                if (isJobMatched(jobID, operand, tagCategoriesByJobID)){
                    return true;
                }
            })

            return false;
        }
        else if (formula.bool_op === "NOT") {
            if (formula.operands.length !== 1){
                throw new Error("invalid number of operands for NOT");
            }

            return isJobMatched(jobID, formula.operands[0], tagCategoriesByJobID);
        }
        else {
            throw new Error("invalid bool operator");
        }
    } 
    else { // Terminal
        const jobTags = tagCategoriesByJobID[jobID];
        // formula.category === formula["category"]
        const tags = jobTags[formula.category];
        if (typeof tags === 'string') {
            return tags === formula.value;
        }
        else { // it's an array
            return tags.contains(formula.value);
        }
    }
}