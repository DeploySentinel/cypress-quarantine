import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import dts from 'rollup-plugin-dts';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';

import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const isProd = process.env.NODE_ENV === 'production';

const plugins = [
  json(),
  typescript({
    tsconfig: isProd ? 'tsconfig.release.json' : 'tsconfig.json',
    useTsconfigDeclarationDir: true,
  }),
  commonjs(),
  terser(),
];

export default [
  {
    input: 'src/support.ts',
    output: {
      file: 'dist/support.js',
      format: 'umd',
      sourcemap: false,
      name: 'support',
    },
    external: [],
    watch: {
      include: 'src/**',
    },
    plugins: [
      copy({
        targets: [{ src: 'src/index.d.ts', dest: 'dist' }],
      }),
      ...plugins,
    ],
  },
  ...(isProd
    ? [
        {
          input: 'src/support.ts',
          output: {
            file: 'dist/support.d.ts',
            format: 'es',
            sourcemap: false,
          },
          external: [],
          watch: {
            include: 'src/**',
          },
          plugins: [dts()],
        },
      ]
    : []),
  {
    input: 'src/plugin.ts',
    output: {
      file: 'dist/plugin.js',
      format: 'umd',
      sourcemap: false,
      name: 'plugin',
    },
    external: [],
    watch: {
      include: 'src/**',
    },
    plugins: [nodeResolve({ exportConditions: ['node'] }), ...plugins],
  },
  ...(isProd
    ? [
        {
          input: 'src/plugin.ts',
          output: {
            file: 'dist/plugin.d.ts',
            format: 'es',
            sourcemap: false,
          },
          external: [],
          watch: {
            include: 'src/**',
          },
          plugins: [dts()],
        },
      ]
    : []),
];
