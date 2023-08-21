import { Config } from '@/config';
import { DefaultRouting } from './defaultRouting';
import { NextApp } from './nextApp';
import { NextPages } from './nextPages';
import { Routing } from './routing';

export const getRouting = (preset: Config['preset']): Routing => {
    switch (preset) {
    case 'next-app':
        return new NextApp();
    case 'next-pages':
        return new NextPages();
    default:
        return new DefaultRouting();
    }
};
