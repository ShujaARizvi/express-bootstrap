#!/usr/bin/env node

const consoleFgGreen = "\x1b[32m";
const consoleFgCyan = "\x1b[36m"
const consoleColorReset = "\x1b[0m";

console.log(`${consoleFgCyan}Initializing a Getting Started project${consoleColorReset}`);

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

console.log(`${consoleFgCyan}Installing express...${consoleColorReset}`);
execSync('npm install express', { cwd: cwd });
console.log(`${consoleFgGreen}express installed.${consoleColorReset}`);

console.log(`${consoleFgCyan}Installing DevDependencies...${consoleColorReset}`)
execSync('npm install -D ts-node typescript @types/express', { cwd: cwd });
console.log(`${consoleFgGreen}DevDependencies installed.${consoleColorReset}`)

console.log(`${consoleFgGreen}Project initialized. Use "ts-node app.ts" to run the application.${consoleColorReset}`);