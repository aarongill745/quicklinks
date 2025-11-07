// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from 'fs';
import * as path from 'path';
import { QuickLink } from './Types';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // We only want to actually retrieve these once at the start, but have them updated when we add/ delete.
    
    
    const linksShow = vscode.commands.registerCommand('quicklinks.showLinks', async () => {  
        const globalLinks = context.globalState.get<QuickLink[]>('myQuickLinks', []);
        const workspaceLinks = context.workspaceState.get<QuickLink[]>('myQuickLinks', []);
        
        const items: (vscode.QuickPickItem & { link?: string })[] = [
            {label: "Global", kind: vscode.QuickPickItemKind.Separator},
            ...globalLinks.map((link) => ({
                label: link.title,
                detail: link.description,
                iconPath: new vscode.ThemeIcon('link-external'),
                link: link.url
            })),
            {label: "Workspace", kind: vscode.QuickPickItemKind.Separator},
            ...workspaceLinks.map((link) => ({
                label: link.title,
                detail: link.description,
                iconPath: new vscode.ThemeIcon('link-external'),
                link: link.url}))
        ];
        
        const selected = await vscode.window.showQuickPick(items, {
            matchOnDetail: true,
            matchOnDescription: true,
        });
        if (selected && selected.link) {
           vscode.env.openExternal(vscode.Uri.parse(selected.link));
        };
    });

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "quicklinks" is now active!');

	const linksAdd = vscode.commands.registerCommand('quicklinks.addLink', () => {
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

    const linksPrint = vscode.commands.registerCommand('quicklinks.printLinks', () => {
        const globalLinks = context.globalState.get<QuickLink[]>('myQuickLinks', []);
        const workspaceLinks = context.workspaceState.get<QuickLink[]>('myQuickLinks', []); 
        console.log(globalLinks, workspaceLinks);
    });

    // This will be changed to a UI containing all global links + workspace links
    const linksReset = vscode.commands.registerCommand('quicklinks.resetLinks', () => {
        context.globalState.update('myQuickLinks', []);
        context.workspaceState.update('myQuickLinks', []);
        console.log("All links have been deleted");
    });
    const commands = [linksAdd, linksPrint, linksReset, linksShow];
    context.subscriptions.push(...commands);
}

function getAddLinkWebview(context: vscode.ExtensionContext): string {
	const templatePath = path.join(context.extensionPath, 'dist', 'webviews', 'addLink.html');
	return fs.readFileSync(templatePath, 'utf8');
}
// This method is called when your extension is deactivated
export function deactivate() {}
