import * as vscode from 'vscode';
import { logger } from '../utils/debugging';

export function registerLinksReset(context: vscode.ExtensionContext) {
    return vscode.commands.registerCommand('quicklinks.resetLinks', () => {
        logger.info("Resetting links");
        context.globalState.update('myQuickLinks', []);
        context.workspaceState.update('myQuickLinks', []);
        console.log("All links have been deleted");
    });
}
