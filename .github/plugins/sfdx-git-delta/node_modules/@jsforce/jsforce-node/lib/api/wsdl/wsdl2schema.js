"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const xml2js_1 = __importDefault(require("xml2js"));
const soap_1 = require("../../soap");
const function_1 = require("../../util/function");
/**
 *
 */
const WSDLRestrictionSchema = {
    $: { base: 'string' },
    enumeration: [
        {
            $: { value: 'string' },
        },
    ],
    'xsd:enumeration': [
        {
            $: { value: 'string' },
        },
    ],
};
const WSDLSimpleTypeSchema = {
    $: { name: 'string' },
    restriction: WSDLRestrictionSchema,
    'xsd:restriction': WSDLRestrictionSchema,
};
const WSDLElementSchema = {
    $: {
        name: 'string',
        type: 'string',
        minOccurs: '?number',
        maxOccurs: '?string',
        nillable: '?boolean',
    },
};
const WSDLSequenceSchema = {
    element: ['?', WSDLElementSchema],
    'xsd:element': ['?', WSDLElementSchema],
};
const WSDLExtensionSchema = {
    $: { base: 'string' },
    sequence: { '?': WSDLSequenceSchema },
    'xsd:sequence': { '?': WSDLSequenceSchema },
};
const WSDLComplexContentSchema = {
    extension: { '?': WSDLExtensionSchema },
    'xsd:extension': { '?': WSDLExtensionSchema },
};
const WSDLComplexTypeSchema = {
    $: { name: 'string' },
    sequence: { '?': WSDLSequenceSchema },
    'xsd:sequence': { '?': WSDLSequenceSchema },
    complexContent: { '?': WSDLComplexContentSchema },
    'xsd:complexContent': { '?': WSDLComplexContentSchema },
};
const WSDLSchemaSchema = {
    $: 'any',
    complexType: ['?', 'any'],
    simpleType: ['?', 'any'],
    'xsd:complexType': ['?', 'any'],
    'xsd:simpleType': ['?', 'any'],
};
const WSDLSchema = {
    definitions: {
        $: 'any',
        types: {
            schema: ['?', WSDLSchemaSchema],
            'xsd:schema': ['?', WSDLSchemaSchema],
        },
        message: ['any'],
        portType: {
            $: 'any',
            operation: ['any'],
        },
        binding: {
            $: 'any',
            operation: ['any'],
        },
        service: {
            $: 'any',
            documentation: 'string',
            operation: ['any'],
        },
    },
};
/**
 *
 */
function toJsType(xsdType, simpleTypes) {
    switch (xsdType) {
        case 'xsd:boolean':
            return 'boolean';
        case 'xsd:string':
        case 'xsd:date':
        case 'xsd:dateTime':
        case 'xsd:time':
        case 'xsd:base64Binary':
            return 'string';
        case 'xsd:int':
        case 'xsd:long':
        case 'xsd:double':
            return 'number';
        case 'xsd:anyType':
            return 'any';
        default: {
            const [ns, type] = xsdType.split(':');
            if (simpleTypes[type]) {
                return simpleTypes[type];
            }
            if (ns) {
                return type;
            }
            return xsdType;
        }
    }
}
/**
 *
 */
async function readWSDLFile(filePath) {
    const xmlData = await node_fs_1.default.promises.readFile(filePath, 'utf8');
    const json = await xml2js_1.default.parseStringPromise(xmlData, {
        explicitArray: false,
    });
    return (0, soap_1.castTypeUsingSchema)(json, WSDLSchema);
}
/**
 *
 */
function getTypeInfo(el, simpleTypes) {
    const type = toJsType(el.$.type, simpleTypes);
    const isArray = el.$.maxOccurs === 'unbounded';
    const nillable = (!isArray && el.$.minOccurs === 0) || el.$.nillable;
    return isArray
        ? nillable
            ? ['?', type]
            : [type]
        : nillable
            ? `?${type}`
            : type;
}
/**
 *
 */
function extractComplexTypes(wsdl) {
    console.log(wsdl.definitions.types['xsd:schema']);
    const schemas = {};
    const simpleTypes = {};
    const types = wsdl.definitions.types;
    for (const sc of types.schema ?? types['xsd:schema'] ?? []) {
        for (const st of sc.simpleType ?? sc['xsd:simpleType'] ?? []) {
            const simpleType = (0, soap_1.castTypeUsingSchema)(st, WSDLSimpleTypeSchema);
            const rs = simpleType.restriction ?? simpleType['xsd:restriction'];
            const base = rs.$.base.split(':')[1];
            simpleTypes[simpleType.$.name] = base;
        }
    }
    console.log({ simpleTypes });
    for (const sc of types.schema ?? types['xsd:schema'] ?? []) {
        for (const ct of sc.complexType ?? sc['xsd:complexType'] ?? []) {
            const complexType = (0, soap_1.castTypeUsingSchema)(ct, WSDLComplexTypeSchema);
            const schema = {
                type: complexType.$.name,
                props: {},
            };
            const seq = complexType.sequence ?? complexType['xsd:sequence'];
            const els = seq?.element ?? seq?.['xsd:element'];
            for (const el of els ?? []) {
                schema.props[el.$.name] = getTypeInfo(el, simpleTypes);
            }
            const cc = complexType.complexContent ?? complexType['xsd:complexContent'];
            if (cc) {
                const extension = cc.extension ?? cc['xsd:extension'];
                if (extension) {
                    schema.extends = extension.$.base.split(':')[1];
                    const seq = extension.sequence ?? extension['xsd:sequence'];
                    const els = seq?.element ?? seq?.['xsd:element'];
                    for (const el of els ?? []) {
                        schema.props[el.$.name] = getTypeInfo(el, simpleTypes);
                    }
                }
            }
            schemas[complexType.$.name] = schema;
        }
    }
    return schemas;
}
/**
 *
 */
const GENERATED_MESSAGE_COMMENT = `/**
 * This file is generated from WSDL file by wsdl2schema.ts.
 * Do not modify directly.
 * To generate the file, run "ts-node path/to/wsdl2schema.ts path/to/wsdl.xml path/to/schema.ts"
 */
`;
/**
 *
 */
async function dumpSchema(schemas, outFile) {
    const out = node_fs_1.default.createWriteStream(outFile, 'utf8');
    const print = (str, indent = 0) => {
        for (let i = 0; i < indent; i++) {
            out.write(' ');
        }
        out.write(str);
    };
    const println = (str = '', indent = 0) => {
        print(str + '\n', indent);
    };
    return new Promise((resolve, reject) => {
        out.on('error', reject);
        out.on('finish', () => resolve());
        println(GENERATED_MESSAGE_COMMENT);
        print('export const ApiSchemas = ');
        writeSchema(schemas);
        println(' as const;');
        println();
        writeTypeDefs(schemas);
        out.end();
    });
    function writeSchema(o, indent = 0) {
        if (indent > 20) {
            print("'any'");
            return;
        }
        if (Array.isArray(o)) {
            print('[');
            let i = 0;
            for (const co of o) {
                if (i > 0) {
                    print(', ');
                }
                writeSchema(co, indent);
                i++;
            }
            print(']');
        }
        else if ((0, function_1.isMapObject)(o)) {
            const keys = Object.keys(o);
            if (keys.length > 0) {
                println('{');
                for (const name of keys) {
                    const co = o[name];
                    const nameId = /^[\w_$]+$/.test(name) ? name : `'${name}'`;
                    print(`${nameId}: `, indent + 2);
                    writeSchema(co, indent + 2);
                    println(',');
                }
                print('}', indent);
            }
            else {
                print('{}');
            }
        }
        else {
            print(JSON.stringify(o).replace(/"/g, "'"));
        }
    }
    function writeTypeDef(o, schemas, indent = 0) {
        if (typeof o === 'string') {
            print(o);
        }
        else if ((0, function_1.isMapObject)(o)) {
            if ('type' in o && 'props' in o) {
                if ('extends' in o && typeof o.extends === 'string') {
                    print(`${o.extends} & `);
                }
                writeTypeDef(o.props, schemas, indent);
                return;
            }
            const keys = Object.keys(o);
            if (keys.length > 0) {
                println('{');
                for (const prop of Object.keys(o)) {
                    let value = o[prop];
                    let nillable = false;
                    let isArray = false;
                    if (Array.isArray(value)) {
                        isArray = true;
                        const len = value.length;
                        if (len === 2 && value[0] === '?') {
                            nillable = true;
                            value = value[1];
                        }
                        else {
                            value = value[0];
                        }
                    }
                    else if ((0, function_1.isMapObject)(value)) {
                        if ('?' in value) {
                            nillable = true;
                            value = value['?'];
                        }
                    }
                    if (typeof value === 'string' && value.startsWith('?')) {
                        nillable = true;
                        value = value.substring(1);
                    }
                    print(`${prop}${nillable ? '?' : ''}: `, indent + 2);
                    writeTypeDef(value, schemas, indent + 2);
                    if (isArray) {
                        print('[]');
                    }
                    if (nillable) {
                        print(' | null | undefined');
                    }
                    println(';');
                }
                print('}', indent);
            }
            else {
                print('{}');
            }
        }
    }
    function writeTypeDefs(schemas) {
        for (const name of Object.keys(schemas)) {
            const schema = schemas[name];
            print(`export type ${name} = `);
            writeTypeDef(schema, schemas);
            println(';');
            println();
        }
        println('export type ApiSchemaTypes = {');
        for (const name of Object.keys(schemas)) {
            println(`${name}: ${name};`, 2);
        }
        println('};');
    }
}
/**
 *
 */
async function main() {
    const wsdlFilePath = process.argv[2];
    if (!wsdlFilePath) {
        console.error('No input WSDL file is specified.');
        return;
    }
    const outFilePath = process.argv[3];
    if (!wsdlFilePath) {
        console.error('No output typescript schema file is specified.');
        return;
    }
    const wsdl = await readWSDLFile(wsdlFilePath);
    const schemas = extractComplexTypes(wsdl);
    dumpSchema(schemas, outFilePath);
}
main();
