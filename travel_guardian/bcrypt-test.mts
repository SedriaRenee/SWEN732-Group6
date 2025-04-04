import bcrypt from 'bcryptjs';

const password = '1234';

// Generate a new hash for comparison
bcrypt.hash(password, 10).then(newHash => {
  console.log('Newly Generated Hash:', newHash);

  // Compare the new hash against itself (should return true)
  bcrypt.compare(password, newHash).then(match => {
    console.log('Comparison with Newly Generated Hash:', match);
  });
});
