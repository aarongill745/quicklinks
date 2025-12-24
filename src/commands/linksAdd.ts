import * as vscode from 'vscode';
import { QuickLink } from '../Types';
import { getAddLinkWebview } from '../utils/webview';

export function registerLinksAdd(context: vscode.ExtensionContext) {
	return vscode.commands.registerCommand('quicklinks.addLink', () => {
		console.log("Adding link");

		const panel = vscode.window.createWebviewPanel(
			'addItem',
			'Add new Item',
			vscode.ViewColumn.One,
			{enableScripts: true}
		);

		panel.webview.html = getAddLinkWebview(context);

		panel.webview.onDidReceiveMessage((message) => {
            if (message.command === 'submit') {
                const newLink: QuickLink = {
                    ...message.data,
                    url: message.data.link,
                    scope: message.scope
                };

                if (newLink.scope === 'global') {
                    const globalLinks = context.globalState.get<QuickLink[]>('myQuickLinks', []);
                    globalLinks.push(newLink);
                    context.globalState.update('myQuickLinks', globalLinks);
                } else {
                    const workspaceLinks = context.workspaceState.get<QuickLink[]>('myQuickLinks',[]);
                    workspaceLinks.push(newLink);
                    context.workspaceState.update('myQuickLinks', workspaceLinks);
                }

                panel.dispose();
            }
		});
	});
}
