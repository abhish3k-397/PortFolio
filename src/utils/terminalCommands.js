/**
 * Terminal Commands Registry for NETRUNNER TERMINAL
 * Each command returns { output, newCwd?, sideEffect? }
 */

import { resolvePath, getNode, listDir, listDirLong, readFile, tree, find, getAllFiles } from './virtualFS';

const COMMANDS = {};

function register(name, fn, description, flags = []) {
    COMMANDS[name] = { fn, description, flags };
}

// ═══════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════

register('pwd', (args, { cwd }) => {
    return { output: cwd };
}, 'Print working directory');

register('cd', (args, { cwd }) => {
    const target = args[0] || '~';
    const newPath = resolvePath(cwd, target);
    const node = getNode(newPath);

    if (!node) {
        return { output: `cd: no such file or directory: ${target}`, type: 'error' };
    }
    if (node.type !== 'dir') {
        return { output: `cd: not a directory: ${target}`, type: 'error' };
    }

    return { output: '', newCwd: newPath };
}, 'Change directory', ['..', '~', '-']);

register('ls', (args, { cwd }) => {
    let showHidden = false;
    let longFormat = false;
    let targetPath = null;

    for (const arg of args) {
        if (arg.startsWith('-')) {
            if (arg.includes('a')) showHidden = true;
            if (arg.includes('l')) longFormat = true;
        } else {
            targetPath = arg;
        }
    }

    const path = targetPath ? resolvePath(cwd, targetPath) : cwd;
    const node = getNode(path);

    if (!node) {
        return { output: `ls: cannot access '${targetPath}': No such file or directory`, type: 'error' };
    }
    if (node.type !== 'dir') {
        return { output: targetPath };
    }

    if (longFormat) {
        const entries = listDirLong(path, showHidden);
        return { output: `total ${entries.length}\n` + entries.join('\n') };
    }

    const entries = listDir(path, showHidden);
    if (!entries || entries.length === 0) {
        return { output: '' };
    }

    const formatted = entries.map(e => {
        if (e.type === 'dir') return `\x1b[1;34m${e.name}/\x1b[0m`;
        if (e.name.endsWith('.pdf')) return `\x1b[1;31m${e.name}\x1b[0m`;
        if (e.name.endsWith('.txt')) return `\x1b[0;32m${e.name}\x1b[0m`;
        if (e.name.endsWith('.json')) return `\x1b[0;33m${e.name}\x1b[0m`;
        return e.name;
    });

    return { output: formatted.join('  '), colored: true };
}, 'List directory contents', ['-a', '-l']);

register('tree', (args, { cwd }) => {
    let showHidden = false;
    let targetPath = null;

    for (const arg of args) {
        if (arg === '-a') showHidden = true;
        else targetPath = arg;
    }

    const path = targetPath ? resolvePath(cwd, targetPath) : cwd;
    const node = getNode(path);

    if (!node || node.type !== 'dir') {
        return { output: `tree: '${targetPath || path}': Not a directory`, type: 'error' };
    }

    const name = path === '/' ? '/' : path.split('/').pop();
    const lines = [name + '/'];
    const subtree = tree(path, '', true, showHidden);
    lines.push(...subtree);

    const fileCount = lines.filter(l => !l.endsWith('/')).length;
    const dirCount = lines.filter(l => l.endsWith('/')).length - 1;
    lines.push('', `${dirCount} directories, ${fileCount} files`);

    return { output: lines.join('\n') };
}, 'Display directory tree', ['-a']);

register('find', (args, { cwd }) => {
    if (args.length === 0) {
        return { output: 'Usage: find [path] -name [pattern]\n       find [pattern] (shorthand)', type: 'error' };
    }

    let pattern;
    let searchPath = cwd;

    if (args.length === 1) {
        pattern = args[0];
    } else if (args.includes('-name')) {
        const nameIdx = args.indexOf('-name');
        pattern = args[nameIdx + 1] || '';
        if (nameIdx > 0) searchPath = resolvePath(cwd, args[0]);
    } else {
        searchPath = resolvePath(cwd, args[0]);
        pattern = args[1] || '';
    }

    const results = find(searchPath, pattern);
    if (results.length === 0) {
        return { output: `No files found matching '${pattern}'` };
    }
    return { output: results.join('\n') };
}, 'Find files by name', ['-name']);

// ═══════════════════════════════════════════
// FILE OPERATIONS
// ═══════════════════════════════════════════

register('cat', (args, { cwd }) => {
    if (args.length === 0) {
        return { output: 'Usage: cat [file...]', type: 'error' };
    }

    const outputs = [];
    for (const arg of args) {
        const path = resolvePath(cwd, arg);
        const result = readFile(path);
        if (result.error) {
            outputs.push(result.error);
        } else {
            const content = result.content.trim();
            // Add line numbers if multiple files or -n flag
            if (args.includes('-n') || args.length > 1) {
                const lines = content.split('\n');
                const numbered = lines.map((line, i) => `  ${String(i + 1).padStart(4)}  ${line}`).join('\n');
                outputs.push(numbered);
            } else {
                outputs.push(content);
            }
        }
    }
    return { output: outputs.join('\n\n') };
}, 'Display file contents', ['-n']);

register('head', (args, { cwd }) => {
    let lines = 10;
    let filePath = null;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-n' && args[i + 1]) {
            lines = parseInt(args[i + 1], 10);
            i++;
        } else {
            filePath = args[i];
        }
    }

    if (!filePath) {
        return { output: 'Usage: head [-n count] [file]', type: 'error' };
    }

    const path = resolvePath(cwd, filePath);
    const result = readFile(path);
    if (result.error) return { output: result.error, type: 'error' };

    const content = result.content.trim();
    const output = content.split('\n').slice(0, lines).join('\n');
    return { output };
}, 'Display first lines of a file', ['-n']);

register('tail', (args, { cwd }) => {
    let lines = 10;
    let filePath = null;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-n' && args[i + 1]) {
            lines = parseInt(args[i + 1], 10);
            i++;
        } else {
            filePath = args[i];
        }
    }

    if (!filePath) {
        return { output: 'Usage: tail [-n count] [file]', type: 'error' };
    }

    const path = resolvePath(cwd, filePath);
    const result = readFile(path);
    if (result.error) return { output: result.error, type: 'error' };

    const content = result.content.trim();
    const allLines = content.split('\n');
    const output = allLines.slice(-lines).join('\n');
    return { output };
}, 'Display last lines of a file', ['-n']);

register('grep', (args, { cwd }) => {
    if (args.length < 2) {
        return { output: 'Usage: grep [pattern] [file]', type: 'error' };
    }

    const pattern = args[0];
    const filePath = resolvePath(cwd, args[1]);
    const result = readFile(filePath);

    if (result.error) return { output: result.error, type: 'error' };

    const lines = result.content.split('\n');
    const matches = lines
        .map((line, i) => ({ line, num: i + 1 }))
        .filter(({ line }) => line.toLowerCase().includes(pattern.toLowerCase()));

    if (matches.length === 0) {
        return { output: `(no matches found for '${pattern}')` };
    }

    const output = matches.map(({ line, num }) => {
        const highlighted = line.replace(
            new RegExp(`(${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
            '\x1b[1;31m$1\x1b[0m'
        );
        return `  ${String(num).padStart(4)}: ${highlighted}`;
    }).join('\n');

    return { output: `Found ${matches.length} match(es):\n${output}`, colored: true };
}, 'Search file contents for pattern');

register('wc', (args, { cwd }) => {
    if (args.length === 0) {
        return { output: 'Usage: wc [file]', type: 'error' };
    }

    const path = resolvePath(cwd, args[0]);
    const result = readFile(path);
    if (result.error) return { output: result.error, type: 'error' };

    const content = result.content;
    const lines = content.split('\n').length;
    const words = content.split(/\s+/).filter(Boolean).length;
    const chars = content.length;

    return { output: `  ${lines}  ${words}  ${chars}  ${args[0]}` };
}, 'Count lines, words, characters in file');

// ═══════════════════════════════════════════
// SYSTEM INFO
// ═══════════════════════════════════════════

register('whoami', (args, { env }) => {
    return { output: env.USER || 'guest' };
}, 'Display current user');

register('hostname', () => {
    return { output: 'netrunner-portfolio' };
}, 'Display system hostname');

register('uname', (args) => {
    if (args.includes('-a')) {
        return { output: 'NetRunnerOS 2.0.0 netrunner-portfolio x86_64 Browser/JavaScript V8' };
    }
    if (args.includes('-r')) {
        return { output: '2.0.0' };
    }
    return { output: 'NetRunnerOS' };
}, 'Display system information', ['-a', '-r']);

register('date', () => {
    return { output: new Date().toString() };
}, 'Display current date and time');

register('uptime', () => {
    const ms = performance.now();
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const s = seconds % 60;
    const m = minutes % 60;

    return { output: ` ${new Date().toLocaleTimeString()} up ${hours}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}, 1 user, load average: 0.42, 0.37, 0.21` };
}, 'Display system uptime');

register('neofetch', (args, { cwd, env, commandCount, theme }) => {
    const isCyberpunk = theme !== 'inkpaper';
    const uptimeSeconds = Math.floor(performance.now() / 1000);
    const uptimeMin = Math.floor(uptimeSeconds / 60);

    if (isCyberpunk) {
        const art = [
            '        _____       ',
            '       /     \\      ',
            '      / NET   \\     ',
            '     / RUNNER  \\    ',
            '    /───────────\\   ',
            '   /  ◉       ◉  \\  ',
            '  |    ▀▀▀▀▀▀▀    | ',
            '  |  ╔═════════╗  | ',
            '  |  ║PORTFOLIO║  | ',
            '  |  ╚═════════╝  | ',
            '   \\             /  ',
            '    \\___________/   ',
            '     |  |   |  |    ',
            '     |  |   |  |    ',
            '    ╱    ╲ ╱    ╲   ',
        ];

        const info = [
            `\x1b[1;36m${env.USER}\x1b[0m@\x1b[1;36mnetrunner-portfolio\x1b[0m`,
            '─────────────────────',
            `\x1b[1;36mOS\x1b[0m       NetRunnerOS 2.0 x86_64`,
            `\x1b[1;36mHost\x1b[0m     Browser Virtual Machine`,
            `\x1b[1;36mKernel\x1b[0m   JavaScript V8 Engine`,
            `\x1b[1;36mShell\x1b[0m    /bin/netrunner`,
            `\x1b[1;36mTerminal\x1b[0m  NETRUNNER TERMINAL v2.0`,
            `\x1b[1;36mTheme\x1b[0m    Cyberpunk`,
            `\x1b[1;36mCwd\x1b[0m      ${cwd}`,
            `\x1b[1;36mUptime\x1b[0m   ${uptimeMin}m ${uptimeSeconds % 60}s`,
            `\x1b[1;36mCommands\x1b[0m ${commandCount}`,
            `\x1b[1;36mMemory\x1b[0m   ${Math.floor(Math.random() * 40 + 20)}MiB / 8192MiB`,
            '',
            '\x1b[40m  \x1b[41m  \x1b[42m  \x1b[43m  \x1b[44m  \x1b[45m  \x1b[46m  \x1b[47m  \x1b[0m',
            '\x1b[0m',
        ];

        // Interleave art and info
        const maxLines = Math.max(art.length, info.length);
        const lines = [];
        for (let i = 0; i < maxLines; i++) {
            const artLine = art[i] || '                    ';
            const infoLine = info[i] || '';
            lines.push(`  ${artLine}  ${infoLine}`);
        }

        return { output: lines.join('\n'), colored: true };
    } else {
        // InkPaper mode — more minimal, calligraphy style
        const art = [
            '      ╱▔▔▔▔▔▔▔╲     ',
            '     ╱   墨    ╲    ',
            '    │  TERMINAL  │   ',
            '    │  ────────  │   ',
            '    │  ◯     ◯   │   ',
            '    │    ▽▽▽    │   ',
            '     ╲          ╱    ',
            '      ╲▁▁▁▁▁▁▁╱     ',
        ];

        const info = [
            `  \x1b[1m${env.USER} @ portfolio\x1b[0m`,
            '  ─────────────────',
            `  OS        PaperOS 2.0`,
            `  Shell     /bin/sumi`,
            `  Theme     Ink & Paper`,
            `  Cwd       ${cwd}`,
            `  Uptime    ${uptimeMin}m`,
            `  Commands  ${commandCount}`,
            '',
        ];

        const maxLines = Math.max(art.length, info.length);
        const lines = [];
        for (let i = 0; i < maxLines; i++) {
            const artLine = art[i] || '                     ';
            const infoLine = info[i] || '';
            lines.push(`${artLine}${infoLine}`);
        }

        return { output: lines.join('\n'), colored: true };
    }
}, 'Display system information with ASCII art');

register('env', (args, { env }) => {
    const entries = Object.entries(env).map(([k, v]) => `${k}=${v}`);
    return { output: entries.join('\n') };
}, 'Display environment variables');

register('export', (args, { env }) => {
    if (args.length === 0) {
        return { output: Object.entries(env).map(([k, v]) => `declare -x ${k}="${v}"`).join('\n') };
    }

    const assignment = args.join(' ');
    const eqIdx = assignment.indexOf('=');
    if (eqIdx === -1) {
        return { output: `export: '${assignment}': not a valid identifier`, type: 'error' };
    }

    const key = assignment.slice(0, eqIdx).trim();
    let value = assignment.slice(eqIdx + 1).trim();
    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
    }

    return { output: '', sideEffect: { type: 'setEnv', key, value } };
}, 'Set environment variable');

// ═══════════════════════════════════════════
// PORTFOLIO SPECIFIC
// ═══════════════════════════════════════════

register('skills', (args, { cwd }) => {
    const path = resolvePath(cwd, '~/about/skills.txt');
    const result = readFile(path);
    return result.error ? { output: result.error, type: 'error' } : { output: result.content.trim() };
}, 'Display technical skills');

register('projects', (args, { cwd }) => {
    const path = resolvePath(cwd, '~/projects/index.txt');
    const result = readFile(path);
    return result.error ? { output: result.error, type: 'error' } : { output: result.content.trim() };
}, 'List portfolio projects');

register('experience', (args, { cwd }) => {
    const path = resolvePath(cwd, '~/experience/timeline.txt');
    const result = readFile(path);
    return result.error ? { output: result.error, type: 'error' } : { output: result.content.trim() };
}, 'Display experience timeline');

register('contact', (args, { cwd }) => {
    const path = resolvePath(cwd, '~/contact/email.txt');
    const result = readFile(path);
    return result.error ? { output: result.error, type: 'error' } : { output: result.content.trim() };
}, 'Display contact information');

register('download', (args) => {
    if (args[0] === 'resume') {
        return {
            output: 'Initiating download sequence...',
            sideEffect: { type: 'download', file: 'resume' }
        };
    }
    return { output: 'Usage: download resume', type: 'error' };
}, 'Download resume PDF');

// ═══════════════════════════════════════════
// UTILITY
// ═══════════════════════════════════════════

register('echo', (args, { env }) => {
    let text = args.join(' ');

    // Expand environment variables
    text = text.replace(/\$(\w+)/g, (_, key) => env[key] || '');

    // Remove surrounding quotes
    if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
        text = text.slice(1, -1);
    }

    return { output: text };
}, 'Display text');

register('clear', () => {
    return { output: '', sideEffect: { type: 'clear' } };
}, 'Clear terminal screen');

register('history', (args, { commandHistory }) => {
    if (!commandHistory || commandHistory.length === 0) {
        return { output: 'No commands in history' };
    }

    const lines = commandHistory.map((cmd, i) => `  ${String(i + 1).padStart(4)}  ${cmd}`);
    return { output: lines.join('\n') };
}, 'Display command history');

register('alias', (args, { aliases }) => {
    if (args.length === 0) {
        const entries = Object.entries(aliases);
        if (entries.length === 0) {
            return { output: 'No aliases defined. Use: alias name=command' };
        }
        return { output: entries.map(([k, v]) => `alias ${k}='${v}'`).join('\n') };
    }

    const assignment = args.join(' ');
    const eqIdx = assignment.indexOf('=');
    if (eqIdx === -1) {
        return { output: `alias: ${assignment}: not found`, type: 'error' };
    }

    return { output: '', sideEffect: { type: 'alias', key: assignment.slice(0, eqIdx), value: assignment.slice(eqIdx + 1).replace(/^['"]|['"]$/g, '') } };
}, 'Define command aliases');

register('chmod', () => {
    return { output: "Nice try. This is a virtual filesystem — everyone has every permission. It's the wild west out here." };
}, 'Change file permissions (joke)');

// ═══════════════════════════════════════════
// TERMINAL CONTROL
// ═══════════════════════════════════════════

register('help', (args, { commandList }) => {
    const categories = {
        'Navigation': ['pwd', 'cd', 'ls', 'tree', 'find'],
        'File Operations': ['cat', 'head', 'tail', 'grep', 'wc'],
        'System Info': ['neofetch', 'whoami', 'hostname', 'uname', 'date', 'uptime', 'env', 'export'],
        'Portfolio': ['skills', 'projects', 'experience', 'contact', 'download'],
        'Utility': ['echo', 'clear', 'history', 'alias', 'chmod'],
        'Fun': ['matrix', 'cowsay', 'fortune', 'sudo', 'ping', 'banner', 'hack', 'breach'],
        'Terminal': ['help', 'gui', 'exit', 'theme'],
    };

    const lines = [
        '╔══════════════════════════════════════════════════════════╗',
        '║            NETRUNNER TERMINAL v2.0 — HELP                ║',
        '╚══════════════════════════════════════════════════════════╝',
        ''];

    for (const [category, cmds] of Object.entries(categories)) {
        lines.push(`  ── ${category} ${'─'.repeat(Math.max(0, 48 - category.length))}`);
        for (const cmd of cmds) {
            const info = COMMANDS[cmd];
            if (info) {
                lines.push(`    ${cmd.padEnd(12)} ${info.description}`);
            }
        }
        lines.push('');
    }

    lines.push('  TIPS:');
    lines.push('    • Use Up/Down arrows for command history');
    lines.push('    • Press Tab for autocompletion');
    lines.push('    • Chain commands with &&');
    lines.push('    • Ctrl+C to cancel, Ctrl+L to clear');
    lines.push('    • Use -a and -l flags with ls');
    lines.push('');

    return { output: lines.join('\n') };
}, 'Display this help message');

register('gui', () => {
    return { output: '', sideEffect: { type: 'switchToGui' } };
}, 'Switch to graphical command palette');

register('exit', () => {
    return { output: '', sideEffect: { type: 'exit' } };
}, 'Close terminal');

register('theme', (args) => {
    const target = args[0];
    if (!target) {
        return { output: 'Usage: theme [cyber|ink]\nSwitch between Cyberpunk and Ink & Paper themes.' };
    }
    if (target === 'cyber' || target === 'cyberpunk') {
        return { output: 'Switching to Cyberpunk mode...', sideEffect: { type: 'setTheme', theme: 'cyberpunk' } };
    }
    if (target === 'ink' || target === 'inkpaper') {
        return { output: 'Switching to Ink & Paper mode...', sideEffect: { type: 'setTheme', theme: 'inkpaper' } };
    }
    return { output: `Unknown theme: ${target}. Available: cyber, ink`, type: 'error' };
}, 'Switch visual theme', ['cyber', 'ink']);

// ═══════════════════════════════════════════
// FUN / EASTER EGGS
// ═══════════════════════════════════════════

register('hack', () => {
    return { output: 'Initiating mainframe hack...', sideEffect: { type: 'startHack' } };
}, 'Initiate mainframe hacking sequence (Mini-game)');

register('breach', () => {
    return { output: 'Initiating breach protocol...', sideEffect: { type: 'startBreach' } };
}, 'Initiate ICE breach protocol (Mini-game)');

register('matrix', () => {
    const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z';
    const lines = [];
    for (let i = 0; i < 12; i++) {
        let line = '';
        for (let j = 0; j < 56; j++) {
            line += Math.random() > 0.7 ? chars[Math.floor(Math.random() * chars.length)] : ' ';
        }
        lines.push(line);
    }
    lines.push('');
    lines.push('Wake up, Neo...');
    lines.push('The Matrix has you...');
    lines.push('Follow the white rabbit.');
    lines.push('');
    return { output: lines.join('\n'), matrixEffect: true };
}, '???');

register('cowsay', (args) => {
    const message = args.length > 0 ? args.join(' ') : 'Moo!';
    const border = '─'.repeat(message.length + 2);
    const output = [
        ` ┌${border}┐`,
        ` │ ${message} │`,
        ` └${border}┘`,
        '        \\   ^__^',
        '         \\  (oo)\\_______',
        '            (__)\\       )\\/\\',
        '                ||----w |',
        '                ||     ||',
    ];
    return { output: output.join('\n') };
}, 'Display a message with an ASCII cow');

register('fortune', () => {
    const fortunes = [
        "A ship in harbor is safe, but that's not what ships are built for.",
        "The best error message is the one that never shows up.",
        "It works on my machine. ¯\\_(ツ)_/¯",
        "There are only 10 types of people: those who understand binary and those who don't.",
        "To understand recursion, you must first understand recursion.",
        "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
        "Programming is the art of telling another human what one wants the computer to do. — Donald Knuth",
        "Any sufficiently advanced technology is indistinguishable from magic. — Arthur C. Clarke",
        "The most dangerous phrase in the language is 'We've always done it this way.'",
        "First, solve the problem. Then, write the code. — John Johnson",
        "Talk is cheap. Show me the code. — Linus Torvalds",
        "The only way to learn a new programming language is by writing programs in it. — Dennis Ritchie",
        "In theory, there's no difference between theory and practice. In practice, there is.",
        "Debugging is twice as hard as writing the code. So if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it. — Kernighan",
        "Weeks of coding can save you hours of planning.",
        "It's not a bug, it's an undocumented feature.",
        "// TODO: Write a better fortune",
        "The code that is hardest to debug is the code that you know cannot possibly be wrong.",
        "Software and cathedrals are much the same — first we build them, then we pray.",
        "Your code is a reflection of your thinking. Clean code = clear mind.",
    ];
    return { output: fortunes[Math.floor(Math.random() * fortunes.length)] };
}, 'Display a random fortune');

register('sudo', (args) => {
    if (args.length === 0) {
        return { output: 'usage: sudo command', type: 'error' };
    }

    const cmd = args[0];
    if (cmd === 'rm' && args.includes('-rf') && args.includes('/')) {
        return { output: '\n  ⚠️  NICE TRY.\n\n  This incident will be reported.\n  (Just kidding. But please don\'t.)\n', type: 'error' };
    }

    if (cmd === 'make' && args.includes('me') && args.includes('a') && args.includes('sandwich')) {
        return { output: '  Okay. 🥪\n  (You have been granted one (1) virtual sandwich)' };
    }

    return { output: `[sudo] password for guest: \nSorry, user guest is not in the sudoers file.\nThis incident will be reported to root.\n\nHint: You're a guest. Guests don't get sudo. That's the whole point.` };
}, 'Execute command as superuser (you wish)');

register('ping', (args) => {
    const target = args[0] || 'localhost';
    const lines = [`PING ${target} (${target === 'localhost' ? '127.0.0.1' : '142.250.80.46'}): 56 data bytes`];

    for (let i = 0; i < 4; i++) {
        const time = (Math.random() * 50 + 10).toFixed(3);
        lines.push(`64 bytes from ${target}: icmp_seq=${i} ttl=64 time=${time} ms`);
    }

    lines.push('');
    lines.push(`--- ${target} ping statistics ---`);
    lines.push('4 packets transmitted, 4 received, 0% packet loss');

    return { output: lines.join('\n') };
}, 'Ping a host (simulated)');

register('banner', (args) => {
    const text = args.join(' ').toUpperCase() || 'HELLO';
    const lines = ['', ''];

    // Simple block letter rendering
    const charMap = {
        'A': ['  █  ', ' █ █ ', '█████', '█   █', '█   █'],
        'B': ['████ ', '█   █', '████ ', '█   █', '████ '],
        'C': [' ████', '█    ', '█    ', '█    ', ' ████'],
        'D': ['████ ', '█   █', '█   █', '█   █', '████ '],
        'E': ['█████', '█    ', '████ ', '█    ', '█████'],
        'F': ['█████', '█    ', '████ ', '█    ', '█    '],
        'G': [' ████', '█    ', '█  ██', '█   █', ' ████'],
        'H': ['█   █', '█   █', '█████', '█   █', '█   █'],
        'I': ['█████', '  █  ', '  █  ', '  █  ', '█████'],
        'J': ['█████', '   █ ', '   █ ', '█  █ ', ' ██  '],
        'K': ['█  █ ', '█ █  ', '██   ', '█ █  ', '█  █ '],
        'L': ['█    ', '█    ', '█    ', '█    ', '█████'],
        'M': ['█   █', '██ ██', '█ █ █', '█   █', '█   █'],
        'N': ['█   █', '██  █', '█ █ █', '█  ██', '█   █'],
        'O': [' ███ ', '█   █', '█   █', '█   █', ' ███ '],
        'P': ['████ ', '█   █', '████ ', '█    ', '█    '],
        'Q': [' ███ ', '█   █', '█ █ █', '█  █ ', ' ██ █'],
        'R': ['████ ', '█   █', '████ ', '█ █  ', '█  █ '],
        'S': [' ████', '█    ', ' ███ ', '    █', '████ '],
        'T': ['█████', '  █  ', '  █  ', '  █  ', '  █  '],
        'U': ['█   █', '█   █', '█   █', '█   █', ' ███ '],
        'V': ['█   █', '█   █', '█   █', ' █ █ ', '  █  '],
        'W': ['█   █', '█   █', '█ █ █', '██ ██', '█   █'],
        'X': ['█   █', ' █ █ ', '  █  ', ' █ █ ', '█   █'],
        'Y': ['█   █', ' █ █ ', '  █  ', '  █  ', '  █  '],
        'Z': ['█████', '   █ ', '  █  ', ' █   ', '█████'],
        ' ': ['     ', '     ', '     ', '     ', '     '],
        '!': ['  █  ', '  █  ', '  █  ', '     ', '  █  '],
        '0': [' ███ ', '█  ██', '█ █ █', '██  █', ' ███ '],
        '1': ['  █  ', ' ██  ', '  █  ', '  █  ', ' ███ '],
        '2': [' ███ ', '█   █', '  ██ ', ' █   ', '█████'],
        '3': [' ███ ', '█   █', '  ██ ', '█   █', ' ███ '],
        '4': ['█   █', '█   █', '█████', '    █', '    █'],
        '5': ['█████', '█    ', '████ ', '    █', '████ '],
        '6': [' ███ ', '█    ', '████ ', '█   █', ' ███ '],
        '7': ['█████', '    █', '   █ ', '  █  ', '  █  '],
        '8': [' ███ ', '█   █', ' ███ ', '█   █', ' ███ '],
        '9': [' ███ ', '█   █', ' ████', '    █', ' ███ '],
    };

    for (let row = 0; row < 5; row++) {
        let line = '';
        for (const ch of text) {
            const glyph = charMap[ch] || charMap[' '];
            line += glyph[row] + ' ';
        }
        lines.push(line);
    }

    lines.push('', '');
    return { output: lines.join('\n') };
}, 'Display text in ASCII block letters');

// ═══════════════════════════════════════════
// COMMAND EXECUTION ENGINE
// ═══════════════════════════════════════════

/**
 * Execute a single command string
 * Returns { output, newCwd?, sideEffect?, type?, matrixEffect?, colored? }
 */
export function executeCommand(rawInput, context) {
    const trimmed = rawInput.trim();
    if (!trimmed) return { output: '' };

    // Parse command and arguments (respecting quoted strings)
    const parts = parseCommandLine(trimmed);
    const command = parts[0];
    const args = parts.slice(1);

    // Check aliases
    if (context.aliases && context.aliases[command]) {
        const aliased = context.aliases[command] + ' ' + args.join(' ');
        return executeCommand(aliased.trim(), context);
    }

    // Look up command
    const cmd = COMMANDS[command];
    if (!cmd) {
        return { output: `${command}: command not found. Type 'help' for available commands.`, type: 'error' };
    }

    try {
        return cmd.fn(args, context);
    } catch (err) {
        return { output: `${command}: internal error — ${err.message}`, type: 'error' };
    }
}

/**
 * Parse a command line respecting quoted strings
 */
function parseCommandLine(input) {
    const parts = [];
    let current = '';
    let inQuote = false;
    let quoteChar = '';

    for (let i = 0; i < input.length; i++) {
        const ch = input[i];

        if (inQuote) {
            if (ch === quoteChar) {
                inQuote = false;
            } else {
                current += ch;
            }
        } else if (ch === '"' || ch === "'") {
            inQuote = true;
            quoteChar = ch;
        } else if (ch === ' ') {
            if (current) {
                parts.push(current);
                current = '';
            }
        } else {
            current += ch;
        }
    }

    if (current) parts.push(current);
    return parts;
}

/**
 * Execute a full input line (supports && chaining)
 */
export function executeCommandLine(input, context) {
    // Split on && for chaining
    const segments = input.split('&&').map(s => s.trim()).filter(Boolean);
    const results = [];
    let currentContext = { ...context };

    for (const segment of segments) {
        const result = executeCommand(segment, currentContext);
        results.push(result);

        // Update context if cwd changed
        if (result.newCwd) {
            currentContext = { ...currentContext, cwd: result.newCwd };
        }

        // Stop chaining on error
        if (result.type === 'error') break;

        // Handle side effects that stop execution
        if (result.sideEffect && ['exit', 'switchToGui', 'clear'].includes(result.sideEffect.type)) {
            break;
        }
    }

    return {
        results,
        finalCwd: currentContext.cwd,
        lastResult: results[results.length - 1]
    };
}

/**
 * Get list of command names (for tab completion)
 */
export function getCommandNames() {
    return Object.keys(COMMANDS).sort();
}

/**
 * Get all commands info
 */
export function getCommands() {
    return COMMANDS;
}

export default COMMANDS;
