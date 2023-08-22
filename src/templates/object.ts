import { Config } from '@/config';
import { camelCase, pascalCase, constantCase, snakeCase, paramCase } from 'change-case';

type ObjectTemplateConfig = Extract<Config['output'], { mode: 'object' }>;

export const objectTemplate = (config: ObjectTemplateConfig, paths: string[]) => {
    return `export const ${config.name} = {
    ${paths.map(path => `${changeCase(path === '/' ? `/${config.rootName}` : path, config.case)}: '${path}'`).join(',\n    ')},
} as const;
`;
};

const changeCase = (path: string, caseStyle: ObjectTemplateConfig['case']): string => {
    const segments = path.split('/');
    segments.shift();
    switch (caseStyle) {
    case 'camel':
        return segments.map((segment) => camelCase(segment)).join('_');
    case 'pascal':
        return segments.map((segment) => pascalCase(segment)).join('_');
    case 'snake':
        return segments.map((segment) => snakeCase(segment)).join('_');
    case 'kebab':
    case 'param':
        return segments.map((segment) => paramCase(segment)).join('_');
    case 'screaming_snake':
    case 'constant':
        return segments.map((segment) => constantCase(segment)).join('_');
    }
};
