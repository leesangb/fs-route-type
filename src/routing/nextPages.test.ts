import { expect, describe, it, test } from 'vitest';
import { NextPages } from './nextPages';

describe('when adding 3 files with same route', () => {
    const sameRouteFiles = [
        'pages/page.tsx',
        'pages/page/index.tsx',
        'pages/page.ts',
    ] as const;

    it('should have only 1 route', () => {
        const nextPages = new NextPages();

        sameRouteFiles.forEach((file) => {
            nextPages.addFile(file);
        });

        expect(nextPages.routes).toHaveLength(1);
        expect(nextPages.routes).toEqual(expect.arrayContaining([
            '/page',
        ]));
    });

    describe('then removing 1 file', () => {
        it('should have 1 route', () => {
            const nextPages = new NextPages();
            sameRouteFiles.forEach((file) => {
                nextPages.addFile(file);
            });

            nextPages.removeFile(sameRouteFiles[0]);

            expect(nextPages.routes).toHaveLength(1);
            expect(nextPages.routes).toEqual(expect.arrayContaining([
                '/page',
            ]));
        });
    });

    describe('then removing every files', () => {
        it('should have no routes', () => {
            const nextPages = new NextPages();
            sameRouteFiles.forEach((file) => {
                nextPages.addFile(file);
            });

            sameRouteFiles.forEach((file) => {
                nextPages.removeFile(file);
            });

            expect(nextPages.routes).toHaveLength(0);
        });
    });
});

describe('when adding multiple files with 3 different routes', () => {
    const differentRouteFiles = [
        'pages/page.tsx',
        'pages/test/page.tsx',
        'pages/index.tsx',
    ] as const;

    it('should have 3 different routes', () => {
        const nextPages = new NextPages();

        differentRouteFiles.forEach((file) => {
            nextPages.addFile(file);
        });

        expect(nextPages.routes).toHaveLength(3);
        expect(nextPages.routes).toEqual(expect.arrayContaining([
            '/page',
            '/test/page',
            '/',
        ]));
    });

    describe('then removing 1 file', () => {
        it('should have 2 routes', () => {
            const nextPages = new NextPages();
            differentRouteFiles.forEach((file) => {
                nextPages.addFile(file);
            });

            nextPages.removeFile(differentRouteFiles[0]);

            expect(nextPages.routes).toHaveLength(2);
            expect(nextPages.routes).toEqual(expect.arrayContaining([
                '/test/page',
                '/',
            ]));
        });
    });
});

describe('when adding dynamic route', () => {
    test.each([
        {
            filename: 'pages/[id]/index.tsx',
            expected: '/',
        },
        {
            filename: 'pages/test/[[...id]]/index.tsx',
            expected: '/test',
        },
        {
            filename: 'pages/test/[this]/[is]/[dynamic]/[route]/[page].tsx',
            expected: '/test',
        },
        {
            filename: 'pages/[id].tsx',
            expected: '/',
        },
        {
            filename: 'pages/test/[[...id]].tsx',
            expected: '/test',
        },
        {
            filename: 'pages/test/[[id]].tsx',
            expected: '/test',
        },
    ])('$filename, should return $expected', ({ filename, expected }) => {
        const nextPages = new NextPages();

        nextPages.addFile(filename);

        expect(nextPages.routes).toHaveLength(1);
        expect(nextPages.routes).toEqual(expect.arrayContaining([
            expected,
        ]));
    });
});
