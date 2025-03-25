const bcrypt = require('bcrypt');

bcrypt.hash('admin123', 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log(hash);
});