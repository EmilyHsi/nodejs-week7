const express = require('express');
const router = express.Router();
const appError = require('../service/appError');
const handleErrorAsync = require('../service/handleErrorAsync');
const handleSuccess = require('../service/handleSuccess');
const sizeOf = require('image-size');
const upload = require('../service/image');
const { ImgurClient } = require('imgur');
const { isAuth, generateSendJWT } = require('../service/auth');

router.post('/', isAuth, upload, handleErrorAsync(async(req, res, next) => {
  if (!req.files.length) {
    appError('400', '尚未上傳檔案', next);
  }

  const client = new ImgurClient({
    clientId: process.env.IMGUR_CLIENTID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET,
    refreshToken: process.env.IMGUR_REFRESH_TOKEN
  });
  const response = await client.upload({
    image: req.files[0].buffer.toString('base64'),
    type: 'base64',
    album: process.env.IMGUR_ALBUM_ID
  });
  handleSuccess(res, {
    imgUrl: response.data.link
  });
}));

module.exports = router;
