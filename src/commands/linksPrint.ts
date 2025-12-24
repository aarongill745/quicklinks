import * as vscode from 'vscode';
import { QuickLink } from '../Types';
import { logger } from '../utils/debugging';

export function registerLinksPrint(context: vscode.ExtensionContext) {
    return vscode.commands.registerCommand('quicklinks.printLinks', () => {
        logger.info("Printing links")
        const globalLinks = context.globalState.get<QuickLink[]>('myQuickLinks', []);
        const workspaceLinks = context.workspaceState.get<QuickLink[]>('myQuickLinks', []);
        console.log(globalLinks, workspaceLinks);
    });
}
