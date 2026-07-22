const asyncFilter = async (list, predicate) => {
    const resolvedPredicates = [];
    for (const elem of list) {
        const predicateResult = await predicate(elem);
        resolvedPredicates.push(predicateResult);
    }
    return list.filter((_, idx) => resolvedPredicates[idx]);
};
export default asyncFilter;
//# sourceMappingURL=asyncFilter.js.map