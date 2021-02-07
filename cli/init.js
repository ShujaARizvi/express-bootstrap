#!/usr/bin/env node

console.log('Initializing a Getting Started project');

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const appFileName = 'app';
const homeControllerFileName = 'homeController';
const tsConfigFileName = 'tsconfig.json';

const cwd = process.cwd();
const controllersPath = path.resolve(cwd, 'controllers');

!fs.existsSync(controllersPath) && fs.mkdirSync(controllersPath);

fs.copyFileSync(path.resolve(__dirname, homeControllerFileName), path.resolve(controllersPath, `${homeControllerFileName}.ts`));

fs.copyFileSync(path.resolve(__dirname, appFileName), path.resolve(cwd, `${appFileName}.ts`));

fs.copyFileSync(path.resolve(__dirname, tsConfigFileName), path.resolve(cwd, tsConfigFileName));

execSync('npm install express', { cwd: cwd });
execSync('npm install -D ts-node typescript', { cwd: cwd });

console.log('Project initialized. Use "ts-node app.ts" to run the application.');