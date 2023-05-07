const fs = require('fs/promises');

(async () => {
  // reads open file
  const commandFileHandler = await fs.open('./command.txt', 'r')

  const watcher = fs.watch('./command.txt');

  for await (const event of watcher) {
    if (event.eventType === 'change') {
      console.log('thie file was changed');
      // read the content

      //get the size of our file
      const fileSize = (await commandFileHandler.stat()).size;
      const buff = Buffer.alloc(fileSize)
      //position in the buffer
      const offset = 0;
      const length = buff.byteLength;
      // position in the file
      const position = 0;

      console.log(await commandFileHandler.stat());
      const content = await commandFileHandler.read(buff, offset, length, position);
      console.log(content);
      console.log(content.buffer.toString('utf8'));
    }
  }
})();

