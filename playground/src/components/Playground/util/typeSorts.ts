import {
    GraphQLEnumType,
    GraphQLInputObjectType,
    GraphQLInterfaceType, GraphQLObjectType,
    GraphQLScalarType, GraphQLSchema,
    GraphQLUnionType
} from "graphql";
import {defaultTypes} from "./createSDL";

const builtinTypes = [
    "Void",
    "DateTime",
    "Duration",
    "Upload",
    "Query",
    "Mutation",
    "Subscription",
];

interface TypeSorts {
    objects: GraphQLObjectType[]
    interfaces: GraphQLInterfaceType[]
    unions: GraphQLUnionType[]
    enums: GraphQLEnumType[]
    scalars: GraphQLScalarType[]
    inputs: GraphQLInputObjectType[]
}

export function sortTypesFromSchema(schema: GraphQLSchema): TypeSorts {
    const sorts: TypeSorts = {
        objects: [],
        interfaces: [],
        unions: [],
        enums: [],
        scalars: [],
        inputs: []
    };
    if (!schema) {
        return sorts;
    }
    const typeMap = schema.getTypeMap();
    const typeNames = Object.keys(typeMap).filter(name =>
        !defaultTypes.includes(name) && !builtinTypes.includes(name) && !name.startsWith('__')
    ).sort();
    typeNames.forEach((typeName) => {
        const type = typeMap[typeName];
        if (type instanceof GraphQLObjectType) {
            sorts.objects.push(type)
        } else if (type instanceof GraphQLInputObjectType) {
            sorts.inputs.push(type)
        } else if (type instanceof GraphQLEnumType) {
            sorts.enums.push(type)
        } else if (type instanceof GraphQLInterfaceType) {
            sorts.interfaces.push(type)
        } else if (type instanceof GraphQLUnionType) {
            sorts.unions.push(type)
        } else if (type instanceof GraphQLScalarType) {
            sorts.scalars.push(type)
        }
    });
    return sorts
}

export function getType(sorts: TypeSorts, index: number): any {
    if (index < sorts.objects.length) {
        return sorts.objects[index]
    }
    index -= sorts.objects.length;
    if (index < sorts.interfaces.length) {
        return sorts.interfaces[index]
    }
    index -= sorts.interfaces.length;
    if (index < sorts.enums.length) {
        return sorts.enums[index]
    }
    index -= sorts.enums.length;
    if (index < sorts.scalars.length) {
        return sorts.scalars[index]
    }
    index -= sorts.unions.length;
    if (index < sorts.unions.length) {
        return sorts.unions[index]
    }
    return null
}
