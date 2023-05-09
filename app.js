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

  const deleteFile = async (path) => {
    try {
      // either unlink or rm
      const deleteFileHandle = await fs.unlink(path);
      console.log(`deleting ${path}...`);
      deleteFileHandle.close();
    } catch (e) {
      console.log(`the file ${path} doesn't exist`)
    }
  }

  const renameFile = async (oldPath, newPath) => {
    try {
       await fs.rename(oldPath, newPath);
      console.log('file successfully renamed')
    } catch (e) {
      if(e.code === "ENOENT") {
        console.log('we dont have a file, nothing to rename')
      } else {
        console.log(`An error occured while removing the file: ${e}`);
      }
    }
  }

  let addedContent;
  const addToFile = async (path, content) => {
    // prevent double add
    if(addedContent = content) return;
    try {
      // w flag overwrites the file
      // can also use appendFile method
      const fileHandle = await fs.open(path, 'a');
      fileHandle.write(content)
      addedContent = content;
      fileHandle.close();
      console.log('the content was added sucessfully')
    } catch (e) {
      if(e.code === 'EONENT') {
        console.log(`an error occured writing the the file: ${e}`);
      }

    }
  }

  // commands
  const CREATE_FILE = 'create a file';
  const DELETE_FILE = 'delete a file';
  const RENAME_FILE = 'rename the file';
  const ADD_TO_FILE = 'add to the file';

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

        const command = buff.toString('utf-8');
        console.log('current change:')
        console.log(buff.toString('utf8'));
        // create a file
        // create a file <path>
        if (command.includes(CREATE_FILE)) {
          // .substring() method looks at a string, until it comes to a space
          const filePath = command.substring(CREATE_FILE.length + 1);
          createFile(filePath);
        }

        if (command.includes(DELETE_FILE)) {
          const filePath = command.substring(DELETE_FILE.length + 1);
          deleteFile(filePath);
        }

        if(command.includes(RENAME_FILE)) {
          const idx = command.indexOf(' to ')
          const oldFilePath = command.substring(RENAME_FILE.length + 1, idx);
          const newFilePath = command.substring(idx + 4)
          renameFile(oldFilePath, newFilePath)
        }

        if(command.includes(ADD_TO_FILE)) {
          const idx = command.indexOf(' content: ')
          const filePath = command.substring(ADD_TO_FILE.length + 1, idx);
          const content = command.substring(idx + 10)
          addToFile(filePath, content);
        }
  })

  const watcher = fs.watch('./command.txt');

  for await (const event of watcher) {
    if (event.eventType === 'change') {
      commandFileHandler.emit('change')
    }
  }
})();

