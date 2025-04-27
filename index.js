const net = require('net')
const store = {}
const server = net.createServer(con => {
    const Parser = require('redis-parser')
    console.log("client connected")
    con.on('data', data => {
        const parser = new Parser({
            returnReply: (reply) => {
                const command = reply[0];
                switch (command) {
                    case 'set': {

                        const key = reply[1];
                        const value = reply[2];
                        store[key] = value;
                        con.write('+DONE BRO\r\n')



                    }
                        break;
                    case 'get': {

                        const value = store[reply[1]];
                        if (!value) con.write('$-1\r\n');
                        else con.write(`$${value.length}\r\n${value}\r\n`)
                
                        console.log(value)
                       



                    }
                        break;
                    default:
                        break;
                }
                console.log("=>", reply)
            },
            returnError: (err) => {
                console.log("=>", err)
            }

        })
        // console.log("=>", data.toString())
        parser.execute(data);
        // con.write('+DONE BRO\r\n')
    })
})


server.listen(8000, () => console.log(`Custom Redis Server running on port 8000`))