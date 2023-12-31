import { Config } from '@/config';
import { objectTemplate } from './object';
import { typeTemplate } from './type';

const generatedComment = () => `/**
 * This file is generated by fs-routing-type on ${new Date().toLocaleString()}.
 * Do not edit this file directly, it may be overwritten.
 */
`;

export const getTemplate = (config: Config['output'], paths: string[]) => {
    const comment = generatedComment();
    switch (config.mode) {
    case 'object':
        return [comment, objectTemplate(config, paths)].join('\n');
    case 'type':
        return [comment, typeTemplate(config, paths)].join('\n');
    }
};
