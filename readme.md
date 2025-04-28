# Custom Redis Server

This project is a simple **Redis-like** server built with Node.js using the `net` module.  
It accepts basic Redis-style commands (`SET`, `GET`, `DEL`) over a TCP connection.

## Features

- **SET key value** – Store a value by key.
- **GET key** – Retrieve a value by key.
- **DEL key** – Delete a single key.
- **DEL [key1,key2,...]** – Delete multiple keys at once.

The server uses a simple JavaScript object as an in-memory key-value store.

## How to Run

1. Clone or download this project.
2. Install Node.js if you haven't already.
3. Run the server:

```bash
node server.js
```

You should see:

```
Custom Redis Server running on port 8000
```

## How It Works

- The server listens on port **8000** for TCP connections.
- It expects **RESP-like** (Redis Serialization Protocol) commands.
- Commands are parsed and processed:
  - `SET key value` stores a key-value pair.
  - `GET key` retrieves a value for the given key.
  - `DEL key` deletes a key.
  - `DEL [key1,key2,...]` deletes multiple keys.

### Example Commands

**SET a 10**

Client sends:

```
*3
$3
set
$1
a
$2
10
```

Server responds:

```
+DONE BRO
```

---

**GET a**

Client sends:

```
*2
$3
get
$1
a
```

Server responds:

```
$2
10
```

---

**DEL a**

Client sends:

```
*2
$3
del
$1
a
```

Server responds:

```
:1
```

---

**DEL [a,b,c]**

Client sends:

```
*2
$3
del
$7
[a,b,c]
```

Server responds:

```
:3
```

---

## Notes

- The server does **not** persist data — it is an in-memory store only.
- It uses basic command parsing; it is **not production-ready**.
- It is designed for educational/demo purposes to understand how Redis-like TCP servers work.

## Improvements to Consider

- Proper RESP protocol handling.
- Error handling for bad commands.
- Support for additional Redis-like commands (e.g., `EXPIRE`, `INCR`).
- Data persistence to disk.
- Connection pooling or authentication.

## License

This project is free to use for learning purposes.
