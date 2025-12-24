import * as vscode from 'vscode';
import { registerLinksShow } from './commands/linksShow';
import { registerLinksAdd } from './commands/linksAdd';
import { registerLinksPrint } from './commands/linksPrint';
import { registerLinksReset } from './commands/linksReset';
import { logger } from './utils/debugging';

export function activate(context: vscode.ExtensionContext) {
	logger.info('QuickLinks extension activated successfully');

	context.subscriptions.push(
		registerLinksShow(context),
		registerLinksAdd(context),
		registerLinksPrint(context),
		registerLinksReset(context)
	);
}

export function deactivate() {
	logger.dispose();
}
