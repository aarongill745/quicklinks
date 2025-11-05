# QuickLinks 

Quicklinks lets you add bookmarks to specific URLs in VSCode which open browser tabs for you.

**Disclaimer**: This is my first ever extension. If this concerns you, feel free to go through the source code yourself to see how it works [here](https://github.com/aarongill745/quicklinks).

## Usage

### TLDR:

| Action | Command | Shortcut |
|--------|---------|----------|
| Open links menu | `links: show` | `Cmd+K Cmd+L` (Mac)<br>`Ctrl+K Ctrl+L` (Win/Linux) |
| Add new link | `links: add` | - |
| Reset all links | `links: reset` | - |
| View links (prints to console) | `links: print` | - |

### Adding A Link

1. Open the command palette (`Cmd+Shift+P` on Mac or `Ctrl+Shift+P` on Windows/Linux)
2. Type `links: add` and press Enter
3. Fill in the form:
   - **Title**: Display name for your link
   - **URL**: The website URL to open
   - **Description** (optional): Additional context shown when browsing links
   - **Scope Toggle**: Switch between Global and Workspace scope
     - **Global**: Link available across all VSCode windows and projects
     - **Workspace**: Link only available in the current workspace/repository
4. Click "Add Quick Link" to save

### Opening Quick Links

**Using the Command Palette:**
1. Open the command palette
2. Type `links: show` and press Enter
3. Browse your links (organized by Global and Workspace sections)
4. Select a link to open it in your default browser

**Using the Keyboard Shortcut:**
- Mac: `Cmd+K Cmd+L`
- Windows/Linux: `Ctrl+K Ctrl+L`

### Managing Links

- **Reset all links**: Run `links: reset` from the command palette to delete all saved links (both global and workspace)
- **View links in console**: Run `links: print` to output all links to the developer console (useful for debugging)

### Tips

- Use **Global links** for resources you need everywhere (e.g., StackOverflow, Gmail, Confluence, Github)
- Use **Workspace links** for project-specific resources (e.g., Jira board, project documentation, CI/CD dashboards, Github repository)
- The description field is searchable - use it to add keywords that help you find links faster

## Why did I make this?

I made this extension to solve one problem, the pain of navigating through my firefox bookmarks. There was just too many steps:

**Before**: open spotlight -> open firefox -> find bookmark -> click bookmark.

**Now**: keyboard shortcut `Cmd+K Cmd+L (for mac)` -> type link -> enter

Now that I look at it, it's only one extra step. However, the point is, is that the after is just much quicker to do.

## Requirements

VSCode v1.105.0 or newer.

## Known Issues

This extension is still in the early stage of development, I'm still trying to figure out what I'm doing.