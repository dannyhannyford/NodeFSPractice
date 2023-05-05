const fs = require('fs/promises');

(async () => {
  try {
    await fs.copyFile('text.txt', 'copied-promise.txt');
  } catch (error) {
    console.log(error)
  }
})();

