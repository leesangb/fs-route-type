import { getConfig } from '@/config';
import { writeFile } from '@/utils/file';
import chokidar from 'chokidar';
import { Command } from 'commander';
import fs from 'fs';
import { getRouting } from '@/routing';
import { getTemplate } from '@/templates';
import { debounce } from '@/utils/debounce';

const program = new Command();

type WatchOptions = {
    /**
     * config file path
     */
    config?: string;
}

program
    .command('watch')
    .option('-c, --config <path>', 'config file path (js or json)')
    .description('watch files')
    .action(async (options: WatchOptions) => {
        const config = await getConfig(options.config);

        const watcher = chokidar.watch([...config.files], {
            ignored: /node_modules/,
            persistent: true,
        });

        const routing = getRouting(config.preset);

        const write = debounce(() => {
            console.log('write', routing.routes);
            void writeFile(config.output.path, getTemplate(config.output, routing.routes));
        }, 100);

        watcher.on('add', (path) => {
            console.log('add', path);
            routing.addFile(path);
            write();
        });

        watcher.on('unlink', (path) => {
            console.log('unlink', path);
            routing.removeFile(path);
            write();
        });
    });

program.parse(process.argv);
