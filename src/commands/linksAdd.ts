import * as vscode from 'vscode';
import { QuickLink } from '../Types';
import { getAddLinkWebview } from '../utils/webview';
import { logger } from '../utils/debugging';

export function registerLinksAdd(context: vscode.ExtensionContext) {
	return vscode.commands.registerCommand('quicklinks.addLink', () => {
		try {
			logger.info('Opening add link webview');

			const panel = vscode.window.createWebviewPanel(
				'addItem',
				'Add new Item',
				vscode.ViewColumn.One,
				{enableScripts: true}
			);

			panel.webview.html = getAddLinkWebview(context);

			panel.webview.onDidReceiveMessage((message) => {
				try {
					if (message.command === 'submit') {
						const newLink: QuickLink = {
							...message.data,
							url: message.data.link,
							scope: message.scope
						};

						logger.info(`Adding new ${newLink.scope} link: "${newLink.title}" -> ${newLink.url}`);

						if (newLink.scope === 'global') {
							const globalLinks = context.globalState.get<QuickLink[]>('myQuickLinks', []);
							globalLinks.push(newLink);
							context.globalState.update('myQuickLinks', globalLinks);
							logger.info(`Successfully added global link. Total global links: ${globalLinks.length}`);
						} else {
							const workspaceLinks = context.workspaceState.get<QuickLink[]>('myQuickLinks',[]);
							workspaceLinks.push(newLink);
							context.workspaceState.update('myQuickLinks', workspaceLinks);
							logger.info(`Successfully added workspace link. Total workspace links: ${workspaceLinks.length}`);
						}

						panel.dispose();
					}
				} catch (error) {
					logger.error('Failed to add link', error);
					vscode.window.showErrorMessage('Failed to add link. Check output for details.');
				}
			});
		} catch (error) {
			logger.error('Failed to create add link webview', error);
			vscode.window.showErrorMessage('Failed to open add link panel. Check output for details.');
		}
	});
}
