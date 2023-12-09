# ix-log

## Description

ix-log is a lightweight logging library that runs almost anywhere. It provides detailed logging metadata, colorized output, easy customization, and a node-style variable output without relying on node.

## Installation

```sh
npm install ix-log
```

## Usage

```ts
import { defaultIxLogger as log } from 'ix-log';

log.info('Hello World!');
// 20:01:37.703 <YourProject:3>   [INFO] 'Hello World!'
```

## Contributing

Contributions are welcome, feel free to put in a pull request.

## License

ISC