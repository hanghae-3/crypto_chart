import { InlineConfig, UserConfig, defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import AutoImport from 'unplugin-auto-import/vite';

interface VitestConfigExport extends UserConfig {
	test: InlineConfig;
}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		AutoImport({
			imports: ['vitest'],
			dts: true,
		}),
	],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: './vite.setup.ts',
	},
} as VitestConfigExport);
