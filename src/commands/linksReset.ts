import * as vscode from 'vscode';

export function registerLinksReset(context: vscode.ExtensionContext) {
    return vscode.commands.registerCommand('quicklinks.resetLinks', () => {
        context.globalState.update('myQuickLinks', []);
        context.workspaceState.update('myQuickLinks', []);
        console.log("All links have been deleted");
    });
}
