import { InlineConfig, UserConfig, defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

interface VitestConfigExport extends UserConfig {
	test: InlineConfig;
}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		global: true,
		setupFiles: './vite.setup.ts',
	},
} as VitestConfigExport);
