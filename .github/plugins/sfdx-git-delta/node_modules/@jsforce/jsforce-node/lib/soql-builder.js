"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSOQL = void 0;
/**
 * @file Create and build SOQL string from configuration
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
const date_1 = __importDefault(require("./date"));
/** @private **/
function escapeSOQLString(str) {
    return String(str || '').replace(/'/g, "\\'");
}
/** @private **/
function createFieldsClause(fields, childQueries = {}) {
    const cqueries = Object.values(childQueries);
    // eslint-disable-next-line no-use-before-define
    return [
        ...(fields || ['Id']),
        ...cqueries.map((cquery) => `(${createSOQL(cquery)})`),
    ].join(', ');
}
/** @private **/
function createValueExpression(value) {
    if (Array.isArray(value)) {
        return value.length > 0
            ? `(${value.map(createValueExpression).join(', ')})`
            : undefined;
    }
    if (value instanceof date_1.default) {
        return value.toString();
    }
    if (typeof value === 'string') {
        return `'${escapeSOQLString(value)}'`;
    }
    if (typeof value === 'number') {
        return value.toString();
    }
    if (value === null) {
        return 'null';
    }
    return value;
}
const opMap = {
    '=': '=',
    $eq: '=',
    '!=': '!=',
    $ne: '!=',
    '>': '>',
    $gt: '>',
    '<': '<',
    $lt: '<',
    '>=': '>=',
    $gte: '>=',
    '<=': '<=',
    $lte: '<=',
    $like: 'LIKE',
    $nlike: 'NOT LIKE',
    $in: 'IN',
    $nin: 'NOT IN',
    $includes: 'INCLUDES',
    $excludes: 'EXCLUDES',
    $exists: 'EXISTS',
};
/** @private **/
function createFieldExpression(field, value) {
    let op = '$eq';
    let _value = value;
    // Assume the `$in` operator if value is an array and none was supplied.
    if (Array.isArray(value)) {
        op = '$in';
    }
    else if (typeof value === 'object' && value !== null) {
        // Otherwise, if an object was passed then process the supplied ops.
        for (const k of Object.keys(value)) {
            if (k.startsWith('$')) {
                op = k;
                _value = value[k];
                break;
            }
        }
    }
    const sfop = opMap[op];
    if (!sfop || typeof _value === 'undefined') {
        return null;
    }
    const valueExpr = createValueExpression(_value);
    if (typeof valueExpr === 'undefined') {
        return null;
    }
    switch (sfop) {
        case 'NOT LIKE':
            return `(${['NOT', field, 'LIKE', valueExpr].join(' ')})`;
        case 'EXISTS':
            return [field, _value ? '!=' : '=', 'null'].join(' ');
        default:
            return [field, sfop, valueExpr].join(' ');
    }
}
/** @private **/
function createOrderByClause(sort = []) {
    let _sort = [];
    if (typeof sort === 'string') {
        if (/,|\s+(asc|desc)\s*$/.test(sort)) {
            // must be specified in pure "order by" clause. Return raw config.
            return sort;
        }
        // sort order in mongoose-style expression.
        // e.g. "FieldA -FieldB" => "ORDER BY FieldA ASC, FieldB DESC"
        _sort = sort.split(/\s+/).map((field) => {
            let dir = 'ASC'; // ascending
            const flag = field[0];
            if (flag === '-') {
                dir = 'DESC';
                field = field.substring(1); // eslint-disable-line no-param-reassign
            }
            else if (flag === '+') {
                field = field.substring(1); // eslint-disable-line no-param-reassign
            }
            return [field, dir];
        });
    }
    else if (Array.isArray(sort)) {
        _sort = sort;
    }
    else {
        _sort = Object.entries(sort).map(([field, dir]) => [field, dir]);
    }
    return _sort
        .map(([field, dir]) => {
        /* eslint-disable no-param-reassign */
        switch (String(dir)) {
            case 'DESC':
            case 'desc':
            case 'descending':
            case '-':
            case '-1':
                dir = 'DESC';
                break;
            default:
                dir = 'ASC';
        }
        return `${field} ${dir}`;
    })
        .join(', ');
}
/** @private **/
function createConditionClause(conditions = {}, operator = 'AND', depth = 0) {
    if (typeof conditions === 'string') {
        return conditions;
    }
    let conditionList = [];
    if (!Array.isArray(conditions)) {
        // if passed in hash object
        const conditionsMap = conditions;
        conditionList = Object.keys(conditionsMap).map((key) => ({
            key,
            value: conditionsMap[key],
        }));
    }
    else {
        conditionList = conditions.map((cond) => {
            const conds = Object.keys(cond).map((key) => ({ key, value: cond[key] }));
            return conds.length > 1
                ? { key: '$and', value: conds.map((c) => ({ [c.key]: c.value })) }
                : conds[0];
        });
    }
    const conditionClauses = conditionList
        .map((cond) => {
        let d = depth + 1;
        let op;
        switch (cond.key) {
            case '$or':
            case '$and':
            case '$not':
                if (operator !== 'NOT' && conditionList.length === 1) {
                    d = depth; // not change tree depth
                }
                op = cond.key === '$or' ? 'OR' : cond.key === '$and' ? 'AND' : 'NOT';
                return createConditionClause(cond.value, op, d);
            default:
                return createFieldExpression(cond.key, cond.value);
        }
    })
        .filter((expr) => expr);
    let hasParen;
    if (operator === 'NOT') {
        hasParen = depth > 0;
        return `${hasParen ? '(' : ''}NOT ${conditionClauses[0]}${hasParen ? ')' : ''}`;
    }
    hasParen = depth > 0 && conditionClauses.length > 1;
    return ((hasParen ? '(' : '') +
        conditionClauses.join(` ${operator} `) +
        (hasParen ? ')' : ''));
}
/**
 * Create SOQL
 * @private
 */
function createSOQL(query) {
    let soql = [
        'SELECT ',
        createFieldsClause(query.fields, query.includes),
        ' FROM ',
        query.table,
    ].join('');
    const cond = createConditionClause(query.conditions);
    if (cond) {
        soql += ` WHERE ${cond}`;
    }
    const orderby = createOrderByClause(query.sort);
    if (orderby) {
        soql += ` ORDER BY ${orderby}`;
    }
    if (query.limit) {
        soql += ` LIMIT ${query.limit}`;
    }
    if (query.offset) {
        soql += ` OFFSET ${query.offset}`;
    }
    return soql;
}
exports.createSOQL = createSOQL;
