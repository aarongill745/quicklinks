import * as vscode from 'vscode';
import { QuickLink } from '../Types';

export function registerLinksShow(context: vscode.ExtensionContext) {
    return vscode.commands.registerCommand('quicklinks.showLinks', async () => {
        const globalLinks = context.globalState.get<QuickLink[]>('myQsuickLinks', []);
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
        }
    });
}
