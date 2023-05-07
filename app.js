const fs = require('fs/promises');

(async () => {
  const createFile = async (path) => {
    try {
      const existingFileHandle = await fs.open(path, 'r')
      existingFileHandle.close();
      // we have that file

      return console.log(`the file ${path} already exists`)
    } catch (e) {
      // we don't have the file, let's create it
      const newFileHandle = await fs.open(path, 'w');
      console.log('a new file has been created');
      newFileHandle.close();
    }

  }

  // commands
  const CREATE_FILE = 'create a file'

  // reads open file
  const commandFileHandler = await fs.open('./command.txt', 'r');

  commandFileHandler.on('change', async () => {
        //get the size of our file
        const fileSize = (await commandFileHandler.stat()).size;
        // allocate our buffer with the size of the file
        const buff = Buffer.alloc(fileSize)
        // location to start filling our buffer
        const offset = 0;
        // how many bytes to read
        const length = buff.byteLength;
        // position that we want to start reading the file from
        const position = 0;
  
        // always want to reaad the whole contents beginning to end
        await commandFileHandler.read(buff, offset, length, position);

        const command = buff.toString('utf-8')
        console.log(buff.toString('utf8'));
        // create a file
        // create a file <path>
        if (command.includes(CREATE_FILE)) {
          // .substring() method looks at a string, until it comes to a space
          const filePath = command.substring(CREATE_FILE.length + 1);
          createFile(filePath);
        }
  })

  const watcher = fs.watch('./command.txt');

  for await (const event of watcher) {
    if (event.eventType === 'change') {
      commandFileHandler.emit('change')
    }
  }
})();

