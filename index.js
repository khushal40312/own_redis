const net = require('net')
const store = {}
function Parser(data) {
    const parsed = data.toString().trim().split(/\r?\n/)
    if (parsed[2] === 'set') {
        const filter = parsed.filter((key) => !key.startsWith('*') && !key.startsWith('$'))
        return filter
    } else if (parsed[2] === 'get') {
        const filter = parsed.filter((key) => !key.startsWith('*') && !key.startsWith('$'))
        return filter
    } else if (parsed[2] === 'del') {
        const filter = parsed.filter((key) => !key.startsWith('*') && !key.startsWith('$'))
        return filter
    }
}
const server = net.createServer(con => {
    console.log("client connected")
    con.on('data', data => {
        const result = Parser(data)
        if (!result) {
            con.write('-Error parsing command\r\n');
            return;
        }
        const command = result[0];
        switch (command) {
            case 'set': {
                if (result.length === 4) {
                    con.write("-SYNTAX invalid syntax\r\n")

                } else if(result.length === 3) {
                    const key = result[1];
                    const value = result[2];
                    store[key] = value;
                    con.write('+DONE BRO\r\n')
                }
            }
                break;
            case 'get': {
                const value = store[result[1]];
                if (!value) con.write('$-1\r\n');
                else {
                    con.write(`$${value.length}\r\n${value}\r\n`)
                }
            }
                break;
            case 'del': {
                // console.log(value)
                if (result[1].includes('[')) {
                    const forDel = result[1].slice(1, -1).split(",").map(key => key.trim());

                    forDel.forEach(key => delete store[key])
                    console.log(rs)
                    con.write(`:${forDel.length}\r\n`)

                } else {
                    // Delete single key
                    const key = result[1];
                    if (store[key] !== undefined) {
                        delete store[key];
                        con.write(`:1\r\n`);
                    } else {
                        con.write('$-1\r\n');
                    }
                }
                break;
            }
            default:
                break;
        }
        console.log("=>", result)
    })
})





server.listen(8000, () => console.log(`Custom Redis Server running on port 8000`))