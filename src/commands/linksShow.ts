import * as vscode from 'vscode';
import { QuickLink } from '../Types';
import { logger } from '../utils/debugging';

export function registerLinksShow(context: vscode.ExtensionContext) {
    return vscode.commands.registerCommand('quicklinks.showLinks', async () => {
        try {
            const globalLinks = context.globalState.get<QuickLink[]>('myQuickLinks', []);
            const workspaceLinks = context.workspaceState.get<QuickLink[]>('myQuickLinks', []);

            logger.info(`Showing links: ${globalLinks.length} global, ${workspaceLinks.length} workspace`);

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
                logger.info(`Opening link: ${selected.label} (${selected.link})`);
                vscode.env.openExternal(vscode.Uri.parse(selected.link));
            } else {
                logger.info('Link selection cancelled by user');
            }
        } catch (error) {
            logger.error('Failed to show links', error);
            vscode.window.showErrorMessage('Failed to show QuickLinks. Check output for details.');
        }
    });
}
