import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';

// Rollup Configuration
export default {
  input: 'src/index.ts',  // Set the input file to TypeScript
  output: [
    {
      file: 'dist/index.js',   // CommonJS output
      format: 'cjs',
      sourcemap: true,         // Optional: Generate source maps
    },
    {
      file: 'dist/index.esm.js', // ES Module output
      format: 'esm',
      sourcemap: true,         // Optional: Generate source maps
    },
  ],
  plugins: [
    resolve(),                 // Resolve node_modules
    commonjs(),                // Convert CommonJS modules to ES6
    typescript({ tsconfig: './tsconfig.json' }),  // Use TypeScript plugin
    babel({
      extensions: ['.js', '.ts', '.tsx'],  // Handle .js, .ts, and .tsx files
      babelHelpers: 'bundled',  // Use bundled babel helpers
    }),
  ],
  external: ['react'],         // Mark react as external, to prevent bundling it
};
