import { TagCategories } from "./extension_adapter";

export function getFilterUniqueValuesByCategory (tagCategoriesByJobID){
    const filters = {};

    Object.values(tagCategoriesByJobID).forEach(tagCategories => {
        for (const [categoryName, tags] of Object.entries(tagCategories)){
            if (!Object.keys(TagCategories).includes(categoryName)){
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
    });

    Object.keys(filters).forEach(category => {
        filters[category] = Array.from(filters[category]).sort();
    });
    
    return filters;
}

export function isJobMatched (jobID, formula, tagCategoriesByJobID){
    // TODO remove this, all jobs should have tags
    if (tagCategoriesByJobID[jobID] === undefined) {
        return true;
    }

    if ('bool_op' in formula){
        if (formula.bool_op === "AND"){
            return formula.operands.every((operand) => isJobMatched(jobID, operand, tagCategoriesByJobID));
        }
        else if (formula.bool_op === "OR"){
            return formula.operands.some((operand) => isJobMatched(jobID, operand, tagCategoriesByJobID));
        }
        else if (formula.bool_op === "NOT") {
            if (formula.operands.length !== 1){
                throw new Error("invalid number of operands for NOT");
            }

            return !isJobMatched(jobID, formula.operands[0], tagCategoriesByJobID);
        }
        else {
            throw new Error("invalid bool operator");
        }
    } 
    else if ('category' in formula) { // Terminal
        const jobTags = tagCategoriesByJobID[jobID];
        // formula.category === formula["category"]
        const tags = jobTags[formula.category];
        if (typeof tags === 'string') {
            return tags === formula.value;
        }
        else { // it's an array
            return tags.includes(formula.value);
        }
    }
    else { // formula not loaded yet, just an empty object
        return true;
    }
}