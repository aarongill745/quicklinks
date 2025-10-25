// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { QuickLink } from './Types';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "quicklinks" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('quicklinks.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from QuickLinks!');
	});

	const addLink = vscode.commands.registerCommand('quicklinks.addLink', () => {
		console.log("Adding link");

		const panel = vscode.window.createWebviewPanel(
			'addItem',
			'Add new Item',
			vscode.ViewColumn.One,
			{enableScripts: true}
		);
		panel.webview.html = getAddLinkWebview();
		panel.webview.onDidReceiveMessage((newLink) => {
			if (newLink.scope === 'global') {
				const globalLinks = context.globalState.get<QuickLink[]>('myQuickLinks', []); 
				globalLinks.push(newLink);
				context.globalState.update('myQuickLinks', globalLinks);
			} else {
				const workspaceLinks = context.workspaceState.get<QuickLink[]>('myQuickLinks',[]);
				workspaceLinks.push(newLink);
				context.workspaceState.update('myQuickLinks', workspaceLinks);
			}
		});
	});

    const printLinks = vscode.commands.registerCommand('quicklinks.printLinks', () => {
        const globalLinks = context.globalState.get<QuickLink[]>('myQuickLinks', []);
        const workspaceLinks = context.workspaceState.get<QuickLink[]>('myQuickLinks', []); 
        console.log(globalLinks, workspaceLinks);
    });
    
	context.subscriptions.push(disposable);
}

function getAddLinkWebview() {
	return `<!DOCTYPE html>
    <html>
    <head>
        <style>
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
                <button type="submit">Add Quick Link</button>
            </form>
        </div>
        <script>
            const vscode = acquireVsCodeApi();
            document.getElementById('itemForm').addEventListener('submit', (e) => {
                e.preventDefault();
                vscode.postMessage({
                    command: 'submit',
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
