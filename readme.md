# Mini-Redis Server

A lightweight Redis-like server built with Node.js. This project implements core Redis functionality using the native `net` module to handle TCP connections and Redis-style commands.

![Redis Server Banner](https://raw.githubusercontent.com/khushal40312/own_redis/master/banner.png)

## ✨ Features

- **Core Redis Commands**: Supports `SET`, `GET`, `DEL`, `EXPIRE`, and `TTL`
- **Key Expiration**: Automatic key expiration with `EXPIRE` or `SET key value EX seconds`
- **Bulk Operations**: Delete multiple keys at once with `DEL [key1,key2,...]`
- **RESP Protocol**: Simplified implementation of the Redis Serialization Protocol
- **Purely In-Memory**: Fast performance with no disk I/O
- **Lightweight**: Zero dependencies, just Node.js standard library

## 🚀 Quick Start

### Prerequisites

- Node.js (v12.0.0 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/khushal40312/own_redis.git

# Navigate to the project directory
cd own_redis

# Run the server
node server.js
```

When running properly, you should see:
```
Custom Redis Server running on port 8000
```

## 📝 Usage

You can interact with the server using any Redis client, or directly using `netcat` or `telnet`:

```bash
# Using netcat
nc localhost 8000
```

### Supported Commands

| Command | Description | Example | Response |
|---------|-------------|---------|----------|
| `SET key value` | Store a value | `SET name John` | `+DONE BRO` |
| `SET key value EX seconds` | Store with expiration | `SET token abc123 EX 60` | `+OK Bro` |
| `GET key` | Retrieve a value | `GET name` | `$4\r\nJohn\r\n` |
| `DEL key` | Delete a key | `DEL name` | `:1` |
| `DEL [key1,key2,...]` | Delete multiple keys | `DEL [name,age,city]` | `:3` |
| `EXPIRE key seconds` | Set expiration time | `EXPIRE session 300` | `:1` |
| `TTL key` | Get remaining time to live | `TTL session` | `:298` |

### Example Session

```
> SET user:1 "Alice"
+DONE BRO
> GET user:1
$5
Alice
> SET login:token abc123 EX 60
+OK Bro
> TTL login:token
:58
> DEL [user:1,unused:key]
:1
```

## 📊 Redis Protocol Implementation

This server implements a simplified version of the Redis Serialization Protocol (RESP). Clients should format commands as:

```
*<number-of-arguments>
$<bytes-of-argument-1>
<argument-1>
$<bytes-of-argument-2>
<argument-2>
...
```

Example of `SET name John` in RESP format:
```
*3
$3
SET
$4
name
$4
John
```

## ⚙️ Internal Architecture

The server uses two main in-memory data structures:
- `store`: Object storing all key-value pairs
- `expiryMap`: Object mapping keys to their expiration timestamps

When a key expires, it's automatically removed from both structures using JavaScript's `setTimeout`.

## 🧪 Running Tests

```bash
# Install test dependencies
npm install -D mocha chai

# Run tests
npm test
```

## 🛠️ Advanced Usage

### Custom Port

To run the server on a custom port:

```bash
# Set PORT environment variable
PORT=6380 node server.js
```

### Performance Tuning

For high-throughput scenarios:
- Increase Node.js heap size: `node --max-old-space-size=4096 server.js`
- Run multiple instances behind a load balancer

## 🚧 Limitations & Future Improvements

- **No Persistence**: Data exists only in memory
- **No Authentication**: No password protection or access control
- **Limited Command Set**: Only basic commands are implemented
- **Single-Threaded**: Uses Node.js event loop (no worker threads)

Planned improvements:
- Add support for data structures (Lists, Sets, Hashes)
- Implement basic persistence with RDB-like snapshots
- Add basic authentication
- Add pub/sub capabilities



## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Made with ❤️ by [Khushal Sharma]