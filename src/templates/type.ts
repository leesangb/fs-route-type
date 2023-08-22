import { Config } from '@/config';

type TypeTemplateConfig = Extract<Config['output'], { mode: 'type' }>;

export const typeTemplate = (config: TypeTemplateConfig, paths: string[]) => {
    return `export type ${config.name} = ${paths.map(path => `'${path}'`).join(' | ')} | (string & {});
export type ${config.name}WithParam = ${config.name} | \`\${${config.name}}?\${string}\`;
`;
};
