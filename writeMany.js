// With Streams
const fs = require('fs/promises');

/**
 * Execution Time: 
 * CPU Usage: 
 * Memory Usage:
 */
(async () => {
  console.time('writeMany');
  const fileHandle = await fs.open('test.txt', 'w');

  const stream = fileHandle.createWriteStream();

  console.log(stream.writableBuffer)
  console.log(stream.writableHighWaterMark)

  const buff = buffer.from('string');
  
  stream.write(buff)

  console.log(stream.writableLength)

  for (let i = 0; i < 1000000; i++) {
    const buff = Buffer.from (` ${i} `, 'utf-8');

    console.log(stream.writableBuffer)
    console.log(stream.writableHighWaterMark)
    stream.write(buff);
  }
  console.timeEnd('writeMany');
})();


/**
 * DON'T DO IT THIS WAY
 * Execution Time: 242ms
 * CPU Usage: 100% (one core)
 * Memory Usage: 200MB
 */
// (async () => {
//   console.time('writeMany');
//   const fileHandle = await fs.open('test.txt', 'w');

//   const stream = fileHandle.createWriteStream();

//   for (let i = 0; i < 1000000; i++) {
//     const buff = Buffer.from (` ${i} `, 'utf-8');
//     stream.write(buff);
//   }
//   console.timeEnd('writeMany');
// })();




// Without Streams

// const fs = require('node:fs');

// Execution Time: 1.8s
// CPU Usage: 100%
// (async () => {
//   console.time("writeMany");
//   fs.open('test.txt', 'w', (err, fd) => {
//     // don't create the buffer every time in the for loop to save time
//     const buff = Buffer.from( ` a `, 'utf-8');
//     for(let i = 0; i < 1000000; i++) {
//       // fs.write pushes a lot of events to the event loop

//       // string to a buffer, and then writing it
//       fs.writeSync(fd, buff);
//     }
//     console.timeEnd('writeMany')
//   })
// })();

