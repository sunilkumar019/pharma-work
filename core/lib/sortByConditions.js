sortMultiCompare = (a, b, sorts) => {
    let select = sorts[0].select
    let order = sorts[0].order
    if (a[select] < b[select]) {
        return order == 'ascending' ? -1 : 1
    } 
    if (a[select] > b[select]) {
        return order == 'ascending' ? 1 : -1
    }
    if(sorts.length > 1) {
        let remainingSorts = sorts.slice(1)
        return sortMultiCompare(a, b, remainingSorts)
    }
    return 0
}
//pass data as array, and sorts as array [{select: String, order: String}]
exports.sort = (data, sorts) => {
    return data.sort((a, b) => {
        return sortMultiCompare(a, b, sorts)
    })
};