import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function getAddLinkWebview(context: vscode.ExtensionContext): string {
	const templatePath = path.join(context.extensionPath, 'dist', 'webviews', 'addLink.html');
	return fs.readFileSync(templatePath, 'utf8');
}
