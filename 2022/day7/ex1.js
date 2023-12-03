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
        toFind: new Set()
    }
    for (const row of output) {
        parseRow(state, row);
    }
    console.log([...state.toFind].reduce((prev, next )=> prev + next.size, 0));
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
        state.toFind.add(state.currentDir.dirs[name]);
        return;
    }
    const [ rawSize, name ] = row.split(' ');
    const size = Number(rawSize);
    state.currentDir.files[name] = { name, size: Number(size) };
    let currIter = state.currentDir;
    while (currIter !== undefined) {
        currIter.size += size;
        if (currIter && currIter.size > 100000) {
            state.toFind.delete(currIter)
        }
        currIter = currIter.parent;
    }
}