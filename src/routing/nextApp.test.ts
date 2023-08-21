import { expect, describe, it, test } from 'vitest';
import { NextApp } from './nextApp';

describe('when adding 3 files with same route', () => {
    const sameRouteFiles = [
        'app/page.tsx',
        'app/page.ts',
        'app/route.ts',
    ] as const;

    it('should have only 1 route', () => {
        const nextApp = new NextApp();

        sameRouteFiles.forEach((file) => {
            nextApp.addFile(file);
        });

        expect(nextApp.routes).toHaveLength(1);
        expect(nextApp.routes).toEqual(expect.arrayContaining([
            '/',
        ]));
    });

    describe('then removing 1 file', () => {
        it('should have 1 route', () => {
            const nextApp = new NextApp();
            sameRouteFiles.forEach((file) => {
                nextApp.addFile(file);
            });

            nextApp.removeFile(sameRouteFiles[0]);

            expect(nextApp.routes).toHaveLength(1);
            expect(nextApp.routes).toEqual(expect.arrayContaining([
                '/',
            ]));
        });
    });

    describe('then removing every files', () => {
        it('should have no routes', () => {
            const nextApp = new NextApp();
            sameRouteFiles.forEach((file) => {
                nextApp.addFile(file);
            });

            sameRouteFiles.forEach((file) => {
                nextApp.removeFile(file);
            });

            expect(nextApp.routes).toHaveLength(0);
        });
    });
});

describe('when adding 3 files with 3 different routes', () => {
    const differentRouteFiles = [
        'app/page.tsx',
        'app/test/page.tsx',
        'app/app/route.ts',
    ] as const;

    it('should have 3 different routes', () => {
        const nextApp = new NextApp();

        differentRouteFiles.forEach((file) => {
            nextApp.addFile(file);
        });

        expect(nextApp.routes).toHaveLength(3);
        expect(nextApp.routes).toEqual(expect.arrayContaining([
            '/',
            '/app',
            '/test',
        ]));
    });

    describe('then removing 1 file', () => {
        it('should have 2 routes', () => {
            const nextApp = new NextApp();
            differentRouteFiles.forEach((file) => {
                nextApp.addFile(file);
            });

            nextApp.removeFile(differentRouteFiles[0]);

            expect(nextApp.routes).toHaveLength(2);
            expect(nextApp.routes).toEqual(expect.arrayContaining([
                '/app',
                '/test',
            ]));
        });
    });
});

describe('when adding dynamic route', () => {
    test.each([
        {
            filename: 'app/[id]/page.tsx',
            expected: '/',
        },
        {
            filename: 'app/test/[[...id]]/page.tsx',
            expected: '/test',
        },
        {
            filename: 'app/test/[this]/[is]/[dynamic]/[route]/page.tsx',
            expected: '/test',
        },
        {
            filename: 'app/[[test]]/page.tsx',
            expected: '/',
        },
    ])('$filename, should return $expected', ({ filename, expected }) => {
        const nextApp = new NextApp();

        nextApp.addFile(filename);

        expect(nextApp.routes).toHaveLength(1);
        expect(nextApp.routes).toEqual(expect.arrayContaining([
            expected,
        ]));
    });
});
