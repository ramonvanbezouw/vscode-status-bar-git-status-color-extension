// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';
import { State } from './state';
import * as Colors from './colors';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "git-status-color" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('git-status-color.testGit', () => {
		console.log('test git:');
		const cwd = vscode.workspace.rootPath;
		console.log(path);
		exec('git rev-parse --is-inside-work-tree', { cwd }, (err, stdout, stderr) => {
			const isRepo = !err && stdout.includes('true');
			if (!isRepo) {
				updateTitlebar(State.NO_REPOSITORY);
			} else {
				exec('git status --porcelain', { cwd }, (err, stdout, stderr) => {
					const outOfSync = stdout.length > 0;
					if (outOfSync) {
						updateTitlebar(State.OUT_OF_SYNC);
					} else {
						updateTitlebar(State.LOCAL_SYNC);	
					}
				})
			}
		},);
	})

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function updateTitlebar(state: State) {
	switch(state) {
		case State.NO_REPOSITORY:
			setTitlebarVales(Colors.NO_REPOSITORY);
			break;
		case State.OUT_OF_SYNC:
			setTitlebarVales(Colors.OUT_OF_SYNC);
			break;
		case State.LOCAL_SYNC:
			setTitlebarVales(Colors.LOCAL_SYNC);
			break;
		case State.REMOTE_SYNC:
			setTitlebarVales(Colors.REMOTE_SYNC);
			break;
	}
}

function setTitlebarVales(value: any) {
	const config = vscode.workspace.getConfiguration();
	config.update('workbench.colorCustomizations', value, false);
}
