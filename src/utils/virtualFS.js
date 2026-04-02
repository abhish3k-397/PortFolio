/**
 * Virtual Filesystem for NETRUNNER TERMINAL
 * Tree-structured filesystem with /home/guest/ as root
 */

const FS = {
    '/': {
        type: 'dir',
        children: ['home']
    },
    '/home': {
        type: 'dir',
        children: ['guest']
    },
    '/home/guest': {
        type: 'dir',
        children: ['about', 'projects', 'experience', 'contact', '.secrets', '.bashrc', 'readme.txt', 'config.json']
    },
    '/home/guest/readme.txt': {
        type: 'file',
        content: `
╔══════════════════════════════════════════════════════════════╗
║                  WELCOME TO THE SYSTEM                       ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  You've accessed Abhishek Krishna's portfolio terminal.      ║
║  This is a virtual filesystem — explore it like a real       ║
║  shell. Use 'ls', 'cd', 'cat', and other commands to        ║
║  navigate.                                                   ║
║                                                              ║
║  Try 'neofetch' for system info.                             ║
║  Try 'cat .secrets/easter_egg.txt' if you're curious.        ║
║  Type 'help' for all available commands.                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`
    },
    '/home/guest/config.json': {
        type: 'file',
        content: `{
    "portfolio": {
        "owner": "Abhishek Krishna",
        "version": "2.0.0",
        "theme": "cyberpunk",
        "uptime": "∞",
        "status": "building_cool_stuff"
    }
}`
    },
    '/home/guest/.bashrc': {
        type: 'file',
        hidden: true,
        content: `# ~/.bashrc — Terminal configuration
export USER="guest"
export HOME="/home/guest"
export SHELL="/bin/netrunner"
export TERM="xterm-256color"
export PORTFOLIO_THEME="cyberpunk"
export EDITOR="vim"
export BROWSER="firefox"

# Custom prompt
PS1='\\[\\033[36m\\]\\u@\\h:\\[\\033[33m\\]\\w\\[\\033[0m\\]$ '

# Aliases
alias ll='ls -la'
alias ..='cd ..'
alias cls='clear'`
    },
    '/home/guest/about': {
        type: 'dir',
        children: ['bio.txt', 'philosophy.txt', 'resume.pdf', 'skills.txt']
    },
    '/home/guest/about/bio.txt': {
        type: 'file',
        content: `ABHISHEK KRISHNA
Software Developer & Creative Technologist

I build things at the intersection of engineering and design.
My work lives where performance meets aesthetics — pixel-perfect
interfaces backed by solid architecture.

Currently exploring the bleeding edge of web technologies:
WebGL, Three.js, shader programming, creative coding, and
the art of making browsers do things they weren't meant to do.

When I'm not writing code, I'm probably:
  - Breaking someone else's code (ethically)
  - Designing systems that feel alive
  - Learning something that has no practical application (yet)`
    },
    '/home/guest/about/philosophy.txt': {
        type: 'file',
        content: `ON BUILDING SOFTWARE
═══════════════════

"Good software is like a good joke — if you have to explain it,
it's not good enough."

I believe in:
  → Code that reads like prose
  → Interfaces that feel inevitable, not designed
  → Performance as a feature, not an afterthought
  → The terminal as an art form
  → Shipping > perfection (but never ship garbage)

The best technology is invisible. The user should feel powerful,
not confused. Every pixel should earn its place.

— A.K.`
    },
    '/home/guest/about/resume.pdf': {
        type: 'file',
        content: '[BINARY FILE — Use "download resume" to download]',
        binary: true
    },
    '/home/guest/about/skills.txt': {
        type: 'file',
        content: `TECHNICAL SKILLS
════════════════

LANGUAGES
  JavaScript ████████████████████ Expert
  TypeScript ████████████████░░░░ Advanced
  Python     ██████████████░░░░░░ Advanced
  C++        ████████████░░░░░░░░ Proficient
  Rust       ████████░░░░░░░░░░░░ Learning

FRONTEND
  React/Next.js  ████████████████████ Expert
  Three.js/WebGL ████████████████░░░░ Advanced
  GSAP/Framer    ████████████████░░░░ Advanced
  Tailwind CSS   ████████████████████ Expert
  Canvas/SVG     ██████████████░░░░░░ Advanced

BACKEND
  Node.js     ████████████████░░░░ Advanced
  Express     ████████████████░░░░ Advanced
  PostgreSQL  ██████████████░░░░░░ Proficient
  MongoDB     ██████████████░░░░░░ Proficient
  Redis       ████████████░░░░░░░░ Proficient

TOOLS & INFRA
  Git         ████████████████████ Expert
  Docker      ██████████████░░░░░░ Proficient
  Linux       ████████████████░░░░ Advanced
  AWS/Vercel  ██████████████░░░░░░ Proficient
  Webpack/Vite████████████████████ Expert`
    },
    '/home/guest/projects': {
        type: 'dir',
        children: ['blackhole', 'breach-protocol', 'portfolio', 'index.txt']
    },
    '/home/guest/projects/index.txt': {
        type: 'file',
        content: `PROJECTS INDEX
══════════════

Navigate into each project directory for details:

  cd blackhole        — WebGL gravitational lensing simulation
  cd breach-protocol  — Arrow-key hacking minigame
  cd portfolio        — This very portfolio (meta, right?)

Use 'cat readme.txt' inside each directory to learn more.`
    },
    '/home/guest/projects/blackhole': {
        type: 'dir',
        children: ['readme.txt', 'tech.txt']
    },
    '/home/guest/projects/blackhole/readme.txt': {
        type: 'file',
        content: `BLACK HOLE — WebGL Gravitational Lensing Simulation
═══════════════════════════════════════════════════

A real-time gravitational lensing effect rendered entirely
in the browser using Three.js and custom GLSL shaders.

The simulation models how light bends around a massive
object, creating the iconic accretion disk and photon
sphere effects seen in the first real black hole image.

KEY FEATURES:
  → Real-time ray marching through curved spacetime
  → Doppler beaming for relativistic effects
  → Procedural accretion disk with turbulence
  → Interactive camera controls
  → Runs at 60fps on modern hardware

STATUS: Active — continuously improving shaders`
    },
    '/home/guest/projects/blackhole/tech.txt': {
        type: 'file',
        content: `BLACK HOLE — Technical Details
═══════════════════════════════

STACK:
  Three.js (r160)
  @react-three/fiber
  @react-three/drei
  Custom GLSL Shaders (vertex + fragment)
  React 18

SHADER TECHNIQUES:
  → Ray marching (sphere tracing)
  → Gravitational redshift calculation
  → Event horizon culling
  → Accretion disk noise (Perlin + Curl)
  → Bloom post-processing

PERFORMANCE:
  Target: 60fps @ 1080p
  GPU: Integrated (Intel UHD) minimum
  Memory: ~45MB VRAM`
    },
    '/home/guest/projects/breach-protocol': {
        type: 'dir',
        children: ['readme.txt']
    },
    '/home/guest/projects/breach-protocol/readme.txt': {
        type: 'file',
        content: `BREACH PROTOCOL — Hacking Minigame
═══════════════════════════════════

An arrow-key sequence-matching minigame inspired by
Cyberpunk 2077's Breach Protocol hacking mechanic.

GAMEPLAY:
  → A grid of hex codes scrolls across the screen
  → Match sequences using arrow keys within a timer
  → Difficulty scales: easy → medium → hard
  → Hard mode completion unlocks a secret achievement

TECH:
  Pure React state management
  CSS animations for the scrolling grid
  Web Audio API for sound effects
  Achievement system integration`
    },
    '/home/guest/projects/portfolio': {
        type: 'dir',
        children: ['readme.txt']
    },
    '/home/guest/projects/portfolio/readme.txt': {
        type: 'file',
        content: `PORTFOLIO — The Site You're Looking At Right Now
═══════════════════════════════════════════════

Yes, this is meta. You're reading files in a virtual
filesystem inside a terminal inside a portfolio.

FEATURES:
  → Dual theme: Cyberpunk + Ink & Paper
  → WebGL black hole background
  → Hacking minigames (you're in one)
  → Achievement system with easter eggs
  → This terminal (inception level: ∞)
  → Smooth scroll with Lenis
  → Custom cursor with magnetic interactions
  → GSAP scroll-triggered animations

STACK:
  React 18 + Vite
  Three.js + React Three Fiber
  TailwindCSS + Custom CSS
  GSAP + Framer Motion
  Express.js (contact API)
  Web Audio API (sound design)`
    },
    '/home/guest/experience': {
        type: 'dir',
        children: ['timeline.txt', 'skills.txt']
    },
    '/home/guest/experience/timeline.txt': {
        type: 'file',
        content: `EXPERIENCE TIMELINE
═══════════════════

┌─────────────────────────────────────────────┐
│  2024-Present  │  Software Developer        │
│                │  Building web experiences   │
│                │  that push boundaries       │
├─────────────────────────────────────────────┤
│  2023-2024     │  Freelance Developer        │
│                │  Full-stack applications    │
│                │  for various clients        │
├─────────────────────────────────────────────┤
│  2022-2023     │  Open Source Contributor    │
│                │  React ecosystem, WebGL     │
│                │  tools, creative coding     │
├─────────────────────────────────────────────┤
│  2020-2022     │  CS Student                 │
│                │  Data structures, algos,    │
│                │  and building things that   │
│                │  professors didn't assign   │
└─────────────────────────────────────────────┘

For detailed experience, visit the Experience
section or download the resume.`
    },
    '/home/guest/experience/skills.txt': {
        type: 'file',
        content: `SOFT SKILLS & SUPERPOWERS
═════════════════════════

→ Translating designer dreams into working code
→ Debugging at 3am without losing sanity (mostly)
→ Explaining technical concepts to non-technical humans
→ Finding the one line that breaks everything
→ Writing code that future-me won't hate
→ Turning "that's impossible" into "done, what's next?"
→ Making browsers do things they weren't designed for
→ Terminal aesthetics (you're looking at the proof)`
    },
    '/home/guest/contact': {
        type: 'dir',
        children: ['email.txt', 'github.txt', 'linkedin.txt']
    },
    '/home/guest/contact/email.txt': {
        type: 'file',
        content: `EMAIL
═════

Preferred method for professional inquiries.

  → abhishek@abhishekcodes.tech

Response time: Usually within 24 hours.
For urgent matters, ping on LinkedIn.`
    },
    '/home/guest/contact/github.txt': {
        type: 'file',
        content: `GITHUB
══════

Where the code lives. Star something if you like it.

  → github.com/abhish3k-397

Most active repos:
  → BlackHole (WebGL simulation)
  → Portfolio (this site)
  → Various open source contributions`
    },
    '/home/guest/contact/linkedin.txt': {
        type: 'file',
        content: `LINKEDIN
════════

Professional network. Let's connect.

  → linkedin.com/in/abhi-sh3k

Open to:
  → Full-time opportunities
  → Interesting collaborations
  → Technical discussions
  → Cool project ideas`
    },
    '/home/guest/.secrets': {
        type: 'dir',
        hidden: true,
        children: ['easter_egg.txt', 'matrix.txt', 'hack.txt']
    },
    '/home/guest/.secrets/easter_egg.txt': {
        type: 'file',
        hidden: true,
        content: `
 ██████╗ ██████╗ ███╗   ██╗ ██████╗ ██████╗  █████╗ ████████╗███████╗██╗
██╔════╝██╔═══██╗████╗  ██║██╔════╝ ██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██║
██║     ██║   ██║██╔██╗ ██║██║  ███╗██████╔╝███████║   ██║   ███████╗██║
██║     ██║   ██║██║╚██╗██║██║   ██║██╔══██╗██╔══██║   ██║   ╚════██║╚═╝
╚██████╗╚██████╔╝██║ ╚████║╚██████╔╝██║  ██║██║  ██║   ██║   ███████║██╗
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝

You found the secret! Here's a cookie: 🍪

Fun facts:
  → This terminal has 30+ commands
  → The virtual filesystem has 20+ files
  → You can chain commands with &&
  → Try 'cowsay I am a hacker'
  → Try 'fortune' for a random quote
  → The Konami code works on the main page (↑↑↓↓←→←→BA)

Achievement unlocked... or is it? Check your achievements.`
    },
    '/home/guest/.secrets/matrix.txt': {
        type: 'file',
        hidden: true,
        content: `The Matrix has you.

Follow the white rabbit.

Knock knock, ${'${USER}.'}`
    },
    '/home/guest/.secrets/hack.txt': {
        type: 'file',
        hidden: true,
        content: `ACCESS LOG — CLASSIFIED
═══════════════════════

[2024-01-15 03:42:17] guest logged in
[2024-01-15 03:42:18] explored filesystem
[2024-01-15 03:42:19] found .secrets
[2024-01-15 03:42:20] read this file
[2024-01-15 03:42:21] realized they're being watched
[2024-01-15 03:42:22] too late to turn back

Just kidding. Or am I?

The real easter egg was the friends we made along the way.`
    }
};

/**
 * Normalize a path, resolving . and .. and relative paths
 */
export function resolvePath(cwd, target) {
    if (!target) return cwd;

    // Handle ~ expansion
    if (target === '~' || target === '~/') return '/home/guest';
    if (target.startsWith('~/')) target = '/home/guest/' + target.slice(2);

    // Absolute path
    if (target.startsWith('/')) {
        return normalizePath(target);
    }

    // Relative path
    const base = cwd === '/' ? '' : cwd;
    return normalizePath(base + '/' + target);
}

function normalizePath(path) {
    const parts = path.split('/').filter(Boolean);
    const resolved = [];
    for (const part of parts) {
        if (part === '.') continue;
        if (part === '..') {
            resolved.pop();
            continue;
        }
        resolved.push(part);
    }
    return '/' + resolved.join('/');
}

/**
 * Get a node from the filesystem
 */
export function getNode(path) {
    const normalized = normalizePath(path);
    return FS[normalized] || null;
}

/**
 * Check if a path exists
 */
export function exists(path) {
    return getNode(path) !== null;
}

/**
 * List directory contents
 */
export function listDir(path, showHidden = false) {
    const node = getNode(path);
    if (!node || node.type !== 'dir') return null;

    let entries = node.children || [];

    if (!showHidden) {
        entries = entries.filter(name => {
            const childPath = path === '/' ? '/' + name : path + '/' + name;
            const childNode = getNode(childPath);
            return !childNode?.hidden;
        });
    }

    return entries.map(name => {
        const childPath = path === '/' ? '/' + name : path + '/' + name;
        const childNode = getNode(childPath);
        return {
            name,
            type: childNode?.type || 'unknown',
            hidden: childNode?.hidden || false
        };
    });
}

/**
 * List directory with -l format (long listing)
 */
export function listDirLong(path, showHidden = false) {
    const entries = listDir(path, showHidden);
    if (!entries) return null;

    return entries.map(entry => {
        const prefix = entry.type === 'dir' ? 'd' : '-';
        const perms = entry.type === 'dir' ? 'rwxr-xr-x' : 'rw-r--r--';
        const size = entry.type === 'dir' ? '4096' : '1024';
        const date = 'Jan 15 03:42';
        const name = entry.type === 'dir' ? `${entry.name}/` : entry.name;
        return `${prefix}${perms}  1 guest guest  ${size}  ${date}  ${name}`;
    });
}

/**
 * Read a file's content
 */
export function readFile(path) {
    const node = getNode(path);
    if (!node) return { error: `cat: ${path}: No such file or directory` };
    if (node.type === 'dir') return { error: `cat: ${path}: Is a directory` };
    return { content: node.content };
}

/**
 * Generate tree view of a directory
 */
export function tree(path, prefix = '', isLast = true, showHidden = false) {
    const node = getNode(path);
    if (!node || node.type !== 'dir') return [];

    const lines = [];
    let entries = node.children || [];

    if (!showHidden) {
        entries = entries.filter(name => {
            const childPath = path === '/' ? '/' + name : path + '/' + name;
            const childNode = getNode(childPath);
            return !childNode?.hidden;
        });
    }

    entries.forEach((name, index) => {
        const isLastChild = index === entries.length - 1;
        const connector = isLastChild ? '└── ' : '├── ';
        const childPath = path === '/' ? '/' + name : path + '/' + name;
        const childNode = getNode(childPath);

        const displayName = childNode?.hidden ? `.${name}` : name;
        const suffix = childNode?.type === 'dir' ? '/' : '';
        lines.push(prefix + connector + displayName + suffix);

        if (childNode?.type === 'dir') {
            const extension = isLastChild ? '    ' : '│   ';
            const subtree = tree(childPath, prefix + extension, isLastChild, showHidden);
            lines.push(...subtree);
        }
    });

    return lines;
}

/**
 * Find files matching a pattern
 */
export function find(startPath, pattern) {
    const results = [];

    function search(path) {
        const node = getNode(path);
        if (!node) return;

        const name = path.split('/').pop() || '/';
        if (name.includes(pattern)) {
            results.push(path);
        }

        if (node.type === 'dir' && node.children) {
            for (const child of node.children) {
                const childPath = path === '/' ? '/' + child : path + '/' + child;
                search(childPath);
            }
        }
    }

    search(startPath);
    return results;
}

/**
 * Get completions for tab completion
 */
export function getCompletions(cwd, partial) {
    if (!partial) {
        // List current directory
        const entries = listDir(cwd, true);
        return entries ? entries.map(e => e.type === 'dir' ? e.name + '/' : e.name) : [];
    }

    // If partial contains a path separator, complete the path
    const lastSlash = partial.lastIndexOf('/');
    let dirPath, prefix;

    if (lastSlash >= 0) {
        const dirPart = partial.slice(0, lastSlash) || '/';
        prefix = partial.slice(lastSlash + 1);
        dirPath = resolvePath(cwd, dirPart);
    } else {
        prefix = partial;
        dirPath = cwd;
    }

    const entries = listDir(dirPath, true);
    if (!entries) return [];

    return entries
        .filter(e => e.name.startsWith(prefix) || (e.hidden && ('.' + e.name).startsWith(prefix)))
        .map(e => {
            const name = e.hidden ? '.' + e.name : e.name;
            const suffix = e.type === 'dir' ? '/' : '';
            if (lastSlash >= 0) {
                return partial.slice(0, lastSlash + 1) + name + suffix;
            }
            return name + suffix;
        });
}

/**
 * Get all file paths (for grep, etc.)
 */
export function getAllFiles() {
    return Object.keys(FS).filter(key => FS[key].type === 'file');
}

export default FS;
