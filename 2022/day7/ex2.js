const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const output = data.toString().trim().split('\n');
    const root =  {
        name: '/',
        dirs: {},
        files: {},
        size: 0,
    }
    const state = {
        currentDir: root,
        root,
        all: new Set()
    }
    for (const row of output) {
        parseRow(state, row);
    }
    const totalSpace = 70000000;
    const freeSpace = totalSpace - state.root.size;
    const needed = 30000000;
    const needToFree = needed - freeSpace;
    const wanted = [...state.all].sort((a, b) => a.size - b.size).find(x=> x.size >= needToFree);
    console.log(wanted.size);
});

function parseRow(state, row) {
    if (row.startsWith('$ cd')) {
        if (row === '$ cd /') {
            state.currentDir = state.root;
            return;
        }
        if (row === '$ cd ..') {
            state.currentDir = state.currentDir.parent;
            return;
        }
        const nextDir = row.split(' ')[2];
        state.currentDir = state.currentDir.dirs[nextDir];
        return;
    }
    if (row === '$ ls') return;
    if (row.startsWith('dir')) {
        const name = row.split(' ')[1];
        state.currentDir.dirs[name] = {
            name,
            dirs: {},
            files: {},
            parent: state.currentDir,
            size: 0,
        };
        state.all.add(state.currentDir.dirs[name]);
        return;
    }
    const [ rawSize, name ] = row.split(' ');
    const size = Number(rawSize);
    state.currentDir.files[name] = { name, size: Number(size) };
    let currIter = state.currentDir;
    while (currIter !== undefined) {
        currIter.size += size;
        currIter = currIter.parent;
    }
}