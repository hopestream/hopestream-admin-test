var HopeStream = HopeStream || {};

// test
HopeStream.STATIC_URL = 'https://static.hopestream.com/';
HopeStream.S3_URL = 'https://hopestream-test.s3.amazonaws.com/';
HopeStream.PLAYER_URL = HopeStream.STATIC_URL + 'player.html?id=';

// prod
// HopeStream.STATIC_URL = 'https://static.hopestream.com/';
// HopeStream.S3_URL = 'https://hopestream.s3.amazonaws.com/';
// HopeStream.PLAYER_URL = HopeStream.STATIC_URL + 'player.html?id=';

// other constants
HopeStream.BYTES_PER_GIGABYTE = Math.pow(1024, 3);
