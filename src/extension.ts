// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { link } from 'fs';
import { QuickLink } from './Types';
import * as vscode from 'vscode';
import { title } from 'process';

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
		panel.webview.html = getAddLinkWebview();
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

function getAddLinkWebview() {
	return `<!DOCTYPE html>
    <html>
    <head>
        <style>
            .switch {
                position: relative;
                display: inline-block;
                width: 40px;
                height: 20px;
            }

            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: var(--vscode-input-background);
                transition: 0.3s;
                border-radius: 20px;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 14px;
                width: 14px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: 0.3s;
                border-radius: 50%;
            }

            input:checked + .slider {
                background-color: var(--vscode-button-background);
            }

            input:checked + .slider:before {
                transform: translateX(20px);
            }
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                padding: 20px;
                box-sizing: border-box;
                background-color: var(--vscode-editor-background);
                color: var(--vscode-editor-foreground);
                font-family: var(--vscode-font-family);
                font-size: var(--vscode-font-size);
            }

            .container {
                width: 100%;
                max-width: 500px;
            }

            h2 {
                color: var(--vscode-editor-foreground);
                margin-bottom: 24px;
                text-align: center;
            }

            form {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            label {
                display: flex;
                flex-direction: column;
                gap: 6px;
                color: var(--vscode-foreground);
                font-size: 13px;
            }

            input, textarea {
                padding: 8px 10px;
                background-color: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                border: 1px solid var(--vscode-input-border);
                border-radius: 2px;
                font-family: var(--vscode-font-family);
                font-size: 13px;
                outline: none;
            }

            input:focus, textarea:focus {
                border-color: var(--vscode-focusBorder);
                outline: 1px solid var(--vscode-focusBorder);
            }

            textarea {
                min-height: 80px;
                resize: vertical;
            }

            button {
                margin-top: 8px;
                padding: 10px 16px;
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                border-radius: 2px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: background-color 0.15s ease;
            }

            button:hover {
                background-color: var(--vscode-button-hoverBackground);
            }

            button:active {
                transform: translateY(1px);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Add New Quick Link</h2>
            <form id="itemForm">
                <label>
                    Title
                    <input type="text" id="title" placeholder="Enter link title" required />
                </label>
                <label>
                    URL
                    <input type="url" id="link" placeholder="https://example.com" required />
                </label>
                <label>
                    Description (optional)
                    <textarea id="description" placeholder="Optional description"></textarea>
                </label>
                <label>
                    Scope
                    <div class="toggle-container">
                        <span class="toggle-label">Global</span>
                        <label class="switch">
                            <input type="checkbox" id="myToggle">
                            <span class="slider"></span>
                        </label>
                        <span class="toggle-label">Workspace</span>
                    </div>  
                </label>
                <button type="submit">Add Quick Link</button>
            </form>
        </div>
        <script>
            const vscode = acquireVsCodeApi();
            document.getElementById('itemForm').addEventListener('submit', (e) => {
                e.preventDefault();
                const toggle = document.getElementById('myToggle');
                const scope = toggle.checked ? 'workspace' : 'global';

                vscode.postMessage({
                    command: 'submit',
                    scope: scope,
                    data: {
                        title: document.getElementById('title').value,
                        link: document.getElementById('link').value,
                        description: document.getElementById('description').value,
                    }
                });
            });
        </script>
    </body>
    </html>`;
}
// This method is called when your extension is deactivated
export function deactivate() {}
