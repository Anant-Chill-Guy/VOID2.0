


const h = (text) => `<h2 class="text-2xl font-semibold mt-8 mb-4 text-slate-100">${text}</h2>`;
const p = (text) => `<p class="mb-4 text-slate-300 leading-relaxed">${text}</p>`;
const ul = (items) =>
  `<ul class="list-disc list-inside space-y-2 mb-4 text-slate-300">${items
    .map((i) => `<li>${i}</li>`)
    .join('')}</ul>`;
const ol = (items) =>
  `<ol class="list-decimal list-inside space-y-2 mb-4 text-slate-300">${items
    .map((i) => `<li>${i}</li>`)
    .join('')}</ol>`;
const code = (text) =>
  `<div class="bg-slate-800/60 p-4 rounded-lg mb-4 font-mono text-sm text-green-300 overflow-x-auto"><pre class="whitespace-pre-wrap">${text}</pre></div>`;
const note = (title, text) =>
  `<div class="bg-blue-900/20 border-l-4 border-blue-400/70 text-blue-200 p-4 mt-6 rounded-r-lg">${p(
    `<strong>${title}</strong> ${text}`
  )}</div>`;

const article = ({ intro, sections = [], closing, tip }) =>
  p(intro) +
  sections
    .map((s) => h(s.heading) + (s.body || '') + (s.list ? ul(s.list) : '') + (s.ol ? ol(s.ol) : '') + (s.code ? code(s.code) : ''))
    .join('') +
  (closing ? p(closing) : '') +
  (tip ? note(tip[0], tip[1]) : '');


const raw = [
  ['The Five CTF Categories: A Beginner’s Guide', 'Every CTF is built from the same handful of disciplines. Learn what each category expects and how to start solving in it.', ['CTF', 'Methodology', 'Security'], 'Suryansh Deshwal', 'Mar 12, 2026', '10 min read'],
  ['Web Exploitation in CTFs: From SQLi to RCE', 'A tour of the web category — injection, broken auth, file uploads and the chain that turns a small bug into remote code execution.', ['Web', 'SQLi', 'RCE'], 'Abhishek Kumar', 'Mar 02, 2026', '12 min read'],
  ['Crypto Challenges: From Classical Ciphers to RSA', 'How to identify the cipher in front of you, then break it — Caesar, XOR, weak RSA and the maths behind each attack.', ['Crypto', 'RSA', 'CTF'], 'Keshav Agarwal', 'Feb 20, 2026', '11 min read'],
  ['Reverse Engineering with Ghidra', 'Load a stripped binary, read the decompiler, and find the check that decides success. Includes a worked key-check example.', ['Reverse Engineering', 'Ghidra', 'CTF'], 'Raj Ojha', 'Feb 10, 2026', '11 min read'],
  ['Binary Exploitation: Your First Buffer Overflow', 'The stack, saved return addresses, and a controlled overwrite — the pwn category explained from the ground up.', ['Pwn', 'Exploitation', 'ASM'], 'Ambar Chakravartty', 'Jan 30, 2026', '12 min read'],
  ['Forensics & Steganography for CTFs', 'Hidden data is everywhere: file metadata, appended archives, LSB pixels and memory dumps. Here is how to find it.', ['Forensics', 'Steganography', 'CTF'], 'Divya Pal', 'Jan 18, 2026', '9 min read'],
  ['OSINT: Recon Before You Attack', 'Real assessments and CTF recon challenges both start with public information. Search operators, metadata and where to stop.', ['OSINT', 'Recon', 'Ethics'], 'Kanishka', 'Jan 06, 2026', '8 min read'],
  ['Linux Privilege Escalation', 'From SUID binaries to writable cron jobs, the misconfigurations that hand over root and how to enumerate them first.', ['Linux', 'Privilege Escalation', 'Pentesting'], 'Vishal Prajapati', 'Dec 22, 2025', '11 min read'],
  ['Windows Privilege Escalation', 'Services, tokens and permissions — the paths from a low-privileged shell to SYSTEM, and the tools that reveal them.', ['Windows', 'Privilege Escalation', 'Pentesting'], 'Parkhi Sharma', 'Dec 10, 2025', '10 min read'],
  ['Networking for CTFs: Nmap & Wireshark', 'Scan a target, read the capture, and understand the traffic. The two tools that unlock almost every network challenge.', ['Networking', 'Nmap', 'Wireshark'], 'Krishna Kumar', 'Nov 28, 2025', '9 min read'],
  ['The OWASP Top 10, For CTF Players', 'The ten most critical web risks, mapped to the vulnerabilities that show up again and again in web challenges.', ['OWASP', 'Web', 'AppSec'], 'Yuvraj Patel', 'Nov 16, 2025', '10 min read'],
  ['From CTF to Bug Bounty', 'Turning puzzle practice into real-world findings: scoping, responsible disclosure, and writing a report triagers accept.', ['Bug Bounty', 'Career', 'Ethics'], 'Abhishek Kumar', 'Nov 04, 2025', '9 min read'],
];

const BODIES = {
  'The Five CTF Categories: A Beginner’s Guide': {
    intro: 'Capture The Flag competitions look chaotic from the outside, but almost every challenge belongs to one of five families. Recognising the family is the first step to solving it.',
    sections: [
      { heading: 'Web', body: p('The target is a running website. You look for the bug the developer shipped — injection, broken access control, weak authentication, or a server-side request. Start by mapping every input and every endpoint.') },
      { heading: 'Crypto', body: p('You are given ciphertext, a key exchange, or a flawed protocol and asked to recover the secret. Identify the scheme before you attack it; the shape of the data usually tells you.') },
      { heading: 'Reverse engineering', body: p('A compiled program hides its logic. You read the disassembly or decompiled output until the algorithm becomes obvious.') },
      { heading: 'Pwn (binary exploitation)', body: p('The program has a memory-safety bug. You craft input that redirects execution — the deepest and most rewarding category.') },
      { heading: 'Forensics & misc', body: p('Files, memory images, packet captures and the “everything else” bucket. Often the fastest points on the board.') },
      { heading: 'How to choose', list: ['New to CTFs? Start with forensics and web.', 'Comfortable with code? Try reverse engineering.', 'Enjoy maths? Crypto rewards patience.', 'Want the hardest challenges? Work towards pwn.'] },
    ],
    tip: ['Start here', 'picoCTF and the OWASP Juice Shop are free, legal, and built for beginners.'],
  },
  'Web Exploitation in CTFs: From SQLi to RCE': {
    intro: 'The web category is the most accessible and the most common in real life. Most challenges are a few small bugs chained into one big one.',
    sections: [
      { heading: 'Map the application', body: p('Before touching a payload, crawl every page, note every parameter, and read the response headers. The tech stack tells you where to look.') },
      { heading: 'Injection', body: p('When input reaches a query or command without separation, you change its meaning. Test with a single quote and watch the errors.'), code: `' OR 1=1 -- -` },
      { heading: 'Bypassing authentication', list: ['Weak or predictable session tokens', 'JWT with “none” algorithm or a guessable secret', 'SQL injection in the login form', 'Password-reset token leakage'] },
      { heading: 'File upload to RCE', ol: ['Upload a file the server will execute — a .php or .jsp web shell.', 'If extension filtering is naive, try .phtml, .php5, or a null byte.', 'Reach the uploaded file by URL and run commands through it.'] },
      { heading: 'Chaining it all', body: p('A single IDOR rarely wins a challenge. Chain a leaked secret into a forged token, then use the admin panel to reach the flag.') },
    ],
    tip: ['Golden rule', 'If you can control where the server writes or what it executes, you are one step from code execution.'],
  },
  'Crypto Challenges: From Classical Ciphers to RSA': {
    intro: 'Crypto challenges reward pattern recognition more than brute force. Work out what was used to produce the data, then attack the weakness.',
    sections: [
      { heading: 'Identify the scheme', list: ['Rotated alphabet? Caesar / ROT13.', 'Repeating patterns in blocks? Possibly ECB mode.', 'Huge integers and a modulus? RSA.', 'Random-looking but short? Brute-forceable XOR.'] },
      { heading: 'Classical ciphers', body: p('Frequency analysis still beats these. If letters are rotated, count them; if they are shuffled, look for common digraphs.'), code: `import codecs\nprint(codecs.decode(ct, 'rot_13'))` },
      { heading: 'XOR', body: p('Single-byte XOR is recoverable by scoring every key on how English-like the plaintext looks. Repeated-key XOR needs key-length detection first.'), code: `for k in range(256):\n    pt = bytes(b ^ k for b in ct)\n    print(k, pt)` },
      { heading: 'RSA weaknesses', list: ['Small e and small message (cube-root it)', 'Shared prime across two moduli (gcd them)', 'Small modulus (factor it with RsaCtfTool)', 'Common factor p == q (take the square root)'] },
      { heading: 'Tooling', body: p('Python and SageMath are your workbench; CyberChef and RsaCtfTool cover the routine cases so you can spend time on the maths.') },
    ],
  },
  'Reverse Engineering with Ghidra': {
    intro: 'Reverse engineering is reading someone else’s logic without the source. Ghidra gives you a decompiler that usually gets you 80% of the way.',
    sections: [
      { heading: 'Get the lay of the land', body: p('Run `file` and `strings` first. Identify the architecture, and look for hints such as flag format stubs or error messages.'), code: `file ./chall\nstrings -n 6 ./chall | head` },
      { heading: 'Load and auto-analyse', body: p('Import the binary, let auto-analysis finish, then read main(). Rename variables as you understand them — the act of renaming is how you make sense of the code.') },
      { heading: 'Find the check', body: p('Most challenges validate input character by character. Look for strcmp, a loop comparing bytes, or a series of arithmetic operations on your input.') },
      { heading: 'Worked example', body: p('A key check that XORs each byte of your input with a constant and compares to a stored string is trivially reversible: apply the same XOR to the stored bytes.'), code: `target = bytes.fromhex('...')\nprint(bytes(c ^ 0x2a for c in target))` },
      { heading: 'When the decompiler lies', body: p('It is an approximation. Cross-check against the disassembly whenever a result makes no sense.') },
    ],
  },
  'Binary Exploitation: Your First Buffer Overflow': {
    intro: 'Pwn challenges exploit the way a program manages memory. A buffer overflow is the classic entry point — and the foundation for everything that follows.',
    sections: [
      { heading: 'The stack, briefly', body: p('Each function call pushes a frame: locals, then a saved return address pointing back to the caller. If you can overwrite that address, you can redirect execution.') },
      { heading: 'Find the offset', body: p('Send a cyclic pattern, crash the program, and read the value in the instruction pointer to learn how many bytes you control before the return address.'), code: `gdb ./chall\nrun <<< "$(python3 -c 'import pwn; print(pwn.cyclic(200))')"` },
      { heading: 'Redirect execution', body: p('Overwrite the return address with the address of a `win()` function that prints the flag — the simplest possible exploit.') },
      { heading: 'Modern mitigations', list: ['NX — no executable stack; use return-oriented programming instead.', 'PIE/ASLR — addresses change; leak a pointer first.', 'Stack canaries — detect overflow; leak or bypass the cookie.', 'RELRO — hardens the GOT; check partial vs full.'] },
      { heading: 'Tooling', body: p('pwntools for exploit scripts, GDB with pwndbg or gef for debugging, and checksec for the mitigation summary.') },
    ],
    tip: ['Practice', 'Start with pwnable.kr and picoCTF’s binary challenges; both are forgiving and well documented.'],
  },
  'Forensics & Steganography for CTFs': {
    intro: 'Forensics challenges are about noticing what should not be there. The flag is usually hidden in plain sight, just one layer deeper than most people look.',
    sections: [
      { heading: 'Inspect the file', body: p('Never trust the extension. Run `file`, hash it, and search the raw bytes for the flag format.'), code: `file mystery\nstrings -n 6 mystery | grep -i flag\ngrep -a 'flag{' mystery` },
      { heading: 'Hidden in the structure', list: ['Data appended after the end-of-file marker', 'Multiple files merged into one (binwalk -e)', 'Archives inside images', 'Zip files with password hints'] },
      { heading: 'Images', body: p('Use exiftool for metadata, zsteg for LSB data in PNGs, and steghide (with a hint passphrase) for JPEGs.'), code: `exiftool image.png\nzsteg image.png\nbinwalk -e image.png` },
      { heading: 'Memory and disk images', body: p('Use Volatility to find running processes and scrape strings; Autopsy or Sleuth Kit for disk images. grep the raw image for the flag format as a first pass.') },
      { heading: 'Audio', body: p('Spectrograms hide text, and stereo channels can carry separate data. Open the file in Audacity and look at both.') },
    ],
  },
  'OSINT: Recon Before You Attack': {
    intro: 'Open-source intelligence is the discipline of building a picture from information that is already public. On assessments and CTFs alike, it starts before any packet is sent.',
    sections: [
      { heading: 'Search-engine operators', list: ['site:example.com — restrict to a domain', 'filetype:pdf — find documents', 'intitle:index.of — exposed directory listings', 'inurl:admin — guessable panels'] },
      { heading: 'People and infrastructure', body: p('Company pages, staff profiles and job adverts leak technology stacks and names. WHOIS and DNS records reveal ownership and mail providers.') },
      { heading: 'Metadata', body: p('Documents and photos often carry author names, GPS coordinates and software versions. exiftool extracts the lot.'), code: `exiftool -a -u suspect.pdf` },
      { heading: 'Stay on the right side', body: p('Only use genuinely public information, and never to harass, dox or access anything without permission. Recon stops where privacy begins.') },
    ],
    tip: ['Rule', 'If you wouldn’t be comfortable explaining the collection step to the target, you have gone too far.'],
  },
  'Linux Privilege Escalation': {
    intro: 'After landing a low-privileged shell, the goal is root. It is almost always a misconfiguration rather than an exotic kernel bug.',
    sections: [
      { heading: 'Enumerate automatically', body: p('Run linpeas or LinEnum to surface candidate vectors, then verify each one by hand — automated tools guess, you decide.'), code: `curl -L https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh | sh` },
      { heading: 'The usual suspects', list: ['SUID/SGID binaries (GTFOBins is your friend)', 'Sudo rules you can abuse', 'Writable systemd services or cron jobs', 'World-writable files in root paths', 'Credentials left in history or config files'] },
      { heading: 'SUID example', body: p('A SUID copy of a program that can run shell commands — like find or vim — lets you spawn a root shell with the -p flag.'), code: `find / -perm -4000 -type f 2>/dev/null\n/usr/bin/find . -exec /bin/sh -p \\; -quit` },
      { heading: 'Sudo example', body: p('If `sudo -l` shows a permitted binary, GTFOBins tells you how to break out of it.'), code: `sudo -l\nsudo vim -c ':!/bin/sh'` },
    ],
  },
  'Windows Privilege Escalation': {
    intro: 'Windows escalation is about services, tokens and permissions. The paths are different from Linux, but the enumerate-then-verify rhythm is the same.',
    sections: [
      { heading: 'What you already have', body: p('Check your privileges and group memberships first. A single powerful privilege can be enough.'), code: `whoami /priv\nwhoami /groups` },
      { heading: 'Service misconfigurations', list: ['Unquoted service paths (plant a binary earlier in the path)', 'Services whose binary you can overwrite', 'Weak permissions on service directories', 'AlwaysInstallElevated'] },
      { heading: 'Token abuse', body: p('With SeImpersonate or SeAssignPrimaryToken, tools like PrintSpoofer and GodPotato can impersonate SYSTEM.') },
      { heading: 'Credential hunting', list: ['Unattend.xml and sysprep files', 'PowerShell history', 'Saved credentials (cmdkey /list)', 'Config files and registry keys'] },
      { heading: 'Automate, then confirm', body: p('WinPEAS surfaces the likely paths. Always reproduce the escalation manually so you can explain it.') },
    ],
  },
  'Networking for CTFs: Nmap & Wireshark': {
    intro: 'Almost every CTF begins with a scan, and capture-the-traffic challenges ask you to reconstruct what happened on the wire.',
    sections: [
      { heading: 'Scanning with Nmap', body: p('Start broad, then drill into what is open. Service and version detection tells you the next move.'), code: `nmap -sV -sC -oA initial 10.10.10.0/24\nnmap -p- --min-rate 2000 10.10.10.5` },
      { heading: 'Reading a capture', body: p('Wireshark filters turn a firehose into a story. Follow a TCP stream to reassemble a whole conversation, including credentials sent in the clear.'), code: `http.request\nftp || telnet\nip.addr == 10.10.10.5 && tcp.port == 80` },
      { heading: 'Spotting the odd one out', list: ['Plaintext credentials in HTTP or FTP', 'Unexpected DNS queries (beaconing)', 'Keystrokes in a USB capture', 'Large transfers at odd hours'] },
      { heading: 'Export, don’t scroll', body: p('Use File → Export Objects to pull files straight out of a capture — flags are often sitting in an image or archive that was downloaded.') },
    ],
  },
  'The OWASP Top 10, For CTF Players': {
    intro: 'The OWASP Top 10 is a list of the most critical web risks. It is not a checklist to memorise; it is a map of where CTF web bugs live.',
    sections: [
      { heading: 'Broken access control', body: p('The most common real-world flaw. Look for IDOR — changing an id in the URL to reach another user’s data.') },
      { heading: 'Injection', body: p('SQL, command and template injection. Anywhere input reaches an interpreter without separation is a candidate.') },
      { heading: 'Cryptographic failures', body: p('Weak hashing, hard-coded keys, predictable tokens. If you can guess the secret, you can forge the session.') },
      { heading: 'Security misconfiguration', list: ['Directory listing left on', 'Default credentials', 'Verbose errors leaking paths', 'Debug endpoints reachable in production'] },
      { heading: 'Vulnerable components', body: p('An outdated library with a known CVE is a challenge waiting to happen — check versions in headers and comments.') },
    ],
    tip: ['How to use it', 'For each item, ask “could this happen in the app in front of me?” then write a test that proves the answer either way.'],
  },
  'From CTF to Bug Bounty': {
    intro: 'CTFs teach you to find bugs under time pressure; bug bounties pay you to find them in the wild. The leap is mostly about process and communication.',
    sections: [
      { heading: 'Pick the right program', list: ['Read the scope before anything else', 'Start on smaller programs with less competition', 'Look for wide scope and fast triage times', 'Avoid programs that pay only for criticals when you are new'] },
      { heading: 'Recon is half the work', body: p('Enumerate subdomains, catalogue endpoints, and diff old JavaScript for forgotten APIs. The bugs are usually where nobody has looked recently.') },
      { heading: 'Write a report triagers accept', ol: ['Title that states the bug and impact', 'Clear steps to reproduce', 'A minimal proof of concept', 'Honest impact, not exaggeration', 'A concrete remediation suggestion'] },
      { heading: 'Stay ethical', body: p('Only test in-scope assets. Report responsibly, never exfiltrate more than a screenshot proves, and respect the program’s disclosure rules.') },
    ],
    tip: ['Patience', 'Your first valid report may take weeks. The transferable skill — reading systems like an attacker — pays off for the rest of your career.'],
  },
};

export const blogPosts = raw.map(([title, snippet, tags, , date, readTime], i) => ({
  id: i + 1,
  title,
  snippet,
  tags,
  date,
  readTime,
  content: article(BODIES[title] || { intro: snippet, sections: [] }),
}));

export default blogPosts;
