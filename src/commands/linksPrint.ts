import * as vscode from 'vscode';
import { QuickLink } from '../Types';

export function registerLinksPrint(context: vscode.ExtensionContext) {
    return vscode.commands.registerCommand('quicklinks.printLinks', () => {
        const globalLinks = context.globalState.get<QuickLink[]>('myQuickLinks', []);
        const workspaceLinks = context.workspaceState.get<QuickLink[]>('myQuickLinks', []);
        console.log(globalLinks, workspaceLinks);
    });
}
