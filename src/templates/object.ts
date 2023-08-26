import { Config } from '@/config';
import { camelCase, pascalCase, constantCase, snakeCase, paramCase } from 'change-case';

type ObjectTemplateConfig = Extract<Config['output'], { mode: 'object' }>;
type GroupedPaths = Record<string, string[]>;

function createKey(config: ObjectTemplateConfig, path:string, groupName?: string) {
    if (groupName) {
        const regex = new RegExp(`^/${groupName}`);
        const temp = path.replace(regex, '');
        return changeCase(temp === '' ? `/${config.rootName}` : temp, config.case);
    } else {
        return changeCase(path === '/' ? `/${config.rootName}` : path, config.case);
    }
}

function createObject(config: ObjectTemplateConfig, paths: string[], groupName?: string) {
    return `export const ${changeCase(`/${groupName ?? ''}`, 'pascal')}${config.name} = {
    ${paths.map(path => `${createKey(config, path, groupName)}: '${path}'`).join(',\n    ')},
} as const;`;
}

const groupingPaths = (paths: string[]): GroupedPaths => {
    const groupedPaths: GroupedPaths = {};

    for (const path of paths) {
        if (path === '/') {
            groupedPaths[''] = ['/'];
            continue;
        }

        const pathElements = path.split('/');
        const category = pathElements[1];

        if (category) {
            if (!groupedPaths[category]) {
                groupedPaths[category] = [];
            }
            groupedPaths[category]!.push(path);
        }
    }

    return groupedPaths;
};

export const objectTemplate = (config: ObjectTemplateConfig, paths: string[]) => {
    if (config.split) {
        const groupedPaths = groupingPaths(paths);
        return Object.keys(groupedPaths).map((groupName) => createObject(config, groupedPaths[groupName]!, groupName)).join('\n\n');
    }
    return createObject(config, paths);
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
