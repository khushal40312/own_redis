const net = require('net')
const store = {};
const expiryMap = {};          // key -> expiration timestamp (in ms)


function Parser(data) {
    const parsed = data.toString().trim().split(/\r?\n/)
   
    if (parsed[2] === 'set' || parsed[2] === 'SET' || parsed[2] === 'get' || parsed[2] === 'GET' || parsed[2] === 'DEL' || parsed[2] === 'del' || parsed[2] === 'expire' || parsed[2] === 'EXPIRE' || parsed[2] === 'ttl' || parsed[2] === "TTL") {
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
        const command = result[0].toLowerCase();
        switch (command) {
            case 'set': {
                if (result.length>5) {
                    con.write("-SYNTAX invalid syntax\r\n")

                } else if (result.length === 3) {
                    const key = result[1];
                    const value = result[2];
                    store[key] = value;
                    con.write('+DONE BRO\r\n')
                } else if (result[3].toLowerCase() === 'ex') {

                    const isAlready = expiryMap[result[1]]
                    if (isAlready) {
                        con.write("-Already exist\r\n");

                    } else {
                        const key = result[1];
                        const value = result[2];
                        store[key] = value;

                        const expireTime = Number(result[4]) * 1000;

                        if (store[key] !== undefined) {
                            const expireAt = Date.now() + expireTime;
                            expiryMap[key] = expireAt;

                            setTimeout(() => {
                                delete store[key];
                                delete expiryMap[key];
                            }, expireTime);

                            con.write(`+OK Bro\r\n`);
                        } else {
                            con.write("-SYNTAX invalid syntax\r\n")
                        }

                    }


                }
            }
                break;
            case 'get': {
                if (result.length > 2) {
                    con.write("-SYNTAX invalid syntax\r\n")

                } else {
                    const value = store[result[1]];
                    if (!value) con.write('$-1\r\n');
                    else {
                        con.write(`$${value.length}\r\n${value}\r\n`)
                    }


                }

            }
                break;
            case 'del': {
                if (result.length > 2) {
                    con.write("-SYNTAX invalid syntax\r\n")

                } else {
                    if (result[1].includes('[')) {
                        const forDel = result[1].slice(1, -1).split(",").map(key => key.trim());

                        forDel.forEach(key => delete store[key])

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
                }
                break;
            }
            case 'expire': {
                if (result.length !== 3) {
                    con.write("-SYNTAX invalid syntax\r\n");
                    break;
                }

                const key = result[1];
                const isAlready = expiryMap[result[1]]
                if (isAlready) {
                    con.write("-Already exist\r\n");

                } else {

                    const expireTime = Number(result[2]) * 1000;

                    if (store[key] !== undefined) {
                        const expireAt = Date.now() + expireTime;
                        expiryMap[key] = expireAt;

                        setTimeout(() => {
                            delete store[key];
                            delete expiryMap[key];
                        }, expireTime);

                        con.write(`:1\r\n`);
                    } else {
                        con.write(`:0\r\n`);
                    }

                }

                break;
            }
            case 'ttl': {
                if (result.length !== 2) {
                    con.write("-SYNTAX invalid syntax\r\n");
                    break;
                }

                const key = result[1];

                if (store[key] === undefined) {
                    con.write(`-This key have no TTL\r\n`);
                } else if (!expiryMap[key]) {
                    con.write(`:-1\r\n`);
                } else {
                    const remaining = Math.floor((expiryMap[key] - Date.now()) / 1000);
                    con.write(`:${Math.max(remaining, 0)}\r\n`);
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