// This file contains functions used for debugging

import * as vscode from 'vscode';

/**
 * Logger class for QuickLinks extension
 * Provides centralized logging to VS Code Output Channel
 */
class Logger {
    private static instance: Logger;
    private outputChannel: vscode.OutputChannel;

    private constructor() {
        this.outputChannel = vscode.window.createOutputChannel('QuickLinks');
    }

    // getInstance ensures logger is singleton.
    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    // May not be necessary
    private getTimestamp(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    public info(message: string, ...args: any[]): void {
        const timestamp = this.getTimestamp();
        const formattedArgs = args.length > 0 ? ' ' + JSON.stringify(args, null, 2) : '';
        this.outputChannel.appendLine(`[${timestamp}] [INFO] ${message}${formattedArgs}`);
    }

    public error(message: string, error?: Error | unknown): void {
        const timestamp = this.getTimestamp();
        this.outputChannel.appendLine(`[${timestamp}] [ERROR] ${message}`);

        if (error) {
            if (error instanceof Error) {
                this.outputChannel.appendLine(`  Stack: ${error.stack || 'No stack trace available'}`);
            } else {
                this.outputChannel.appendLine(`  Details: ${JSON.stringify(error, null, 2)}`);
            }
        }
    }

    public dispose(): void {
        this.outputChannel.dispose();
    }
}

// Export singleton instance
export const logger = Logger.getInstance();
