import * as vscode from 'vscode';
import { registerLinksShow } from './commands/linksShow';
import { registerLinksAdd } from './commands/linksAdd';
import { registerLinksPrint } from './commands/linksPrint';
import { registerLinksReset } from './commands/linksReset';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "quicklinks" is now active!');

	context.subscriptions.push(
		registerLinksShow(context),
		registerLinksAdd(context),
		registerLinksPrint(context),
		registerLinksReset(context)
	);
}

export function deactivate() {}
