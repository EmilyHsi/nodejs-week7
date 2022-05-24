const appError = require('../service/appError');
const handleSuccess = require('../service/handleSuccess');
const handleErrorAsync = require('../service/handleErrorAsync');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const mongoose = require('mongoose');
const User = require('../model/user');
const { isAuth, generateSendJWT } = require('../service/auth');

const users = {
  // 註冊
  signUp: handleErrorAsync(async (req, res) => {
    let { email, password, confirmPassword, name } = req.body;

    // 內容不可為空
    if (!email || !password || !confirmPassword || !name) {
      appError('400', '欄位未填寫正確', next);
    }

    // 密碼正確
    if (password !== confirmPassword) {
      return next(appError('400', '密碼不一致', next));
    }
    
    // 密碼 8 碼以上
    if (!validator.isLength(password, { min: 8 })) {
      appError('400', '密碼字數低於 8 碼', next);
    }
    
    // 是否為 Email
    if (!validator.isEmail(email)) {
      appError('400', 'Email 格式不正確', next);
    }
    
    // 加密密碼
    password = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email,
      password,
      name
    });
    generateSendJWT(newUser, 200, res);
  }),

  // 登入
  signIn: handleErrorAsync(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      appError(400, '帳號密碼不得為空', next);
    }

    const user = await User.findOne({ email }).select('+password');
    const auth = await bcrypt.compare(password, user.password);
    
    if (!auth) {
      appError(400, '您的密碼不正確', next);
    }

    generateSendJWT(user, 200, res);
  }),

  // 更新密碼
  updatePassword: handleErrorAsync(async (req, res) => {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      appError('400', '密碼不一致', next);
    }
    newPassword = await bcrypt.hash(password, 12);
    const user = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword
    });
    generateSendJWT(user, 200, res);
  }),

  // 取得個人資料
  getProfile: handleErrorAsync(async (req, res) => {
    let id = req.user.id;
    const user = await User.findById(id);
    console.log(user);
    handleSuccess(res, user);
  }),

  // 修改個人資料
  updateProfile: handleErrorAsync(async (req, res) => {
    if (req.user.id !== req.params.id) {
      appError('400', '你沒有權限', next);
    } else {
      const { name } = req.body;
      if (!name) {
        appError('400', '姓名不得為空', next);
      }
      const editData = await User.findByIdAndUpdate(
        req.user.id,
        { name },
        { new: true }
      )
      if (!editData) {
        appError('400', '更新失敗', next);
      } else {
        handleSuccess(res, editData);
      }
    }
  })
}

module.exports = users;