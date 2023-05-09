const fs = require('node:fs');

(async () => {
  console.time("writeMany");
  fs.open('test.txt', 'w', (err, fd) => {
    // don't create the buffer every time in the for loop to save time
    const buff = Buffer.from( ` a `, 'utf-8');
    for(let i = 0; i < 1000000; i++) {
      // fs.write pushes a lot of events to the event loop
      fs.writeSync(fd, buff);
    }
    console.timeEnd('writeMany')
  })
})();