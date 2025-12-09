const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (username, password, done) => {
      try {
        // findOne 콜백 → await 방식으로 변경
        const user = await User.findOne({ email: username }).exec();

        if (!user) {
          return done(null, false, {
            message: 'Incorrect email.'
          });
        }

        // 비밀번호 검증
        if (!user.validPassword(password)) {
          return done(null, false, {
            message: 'Incorrect password.'
          });
        }

        // 로그인 성공
        return done(null, user);

      } catch (err) {
        // DB 오류 등
        return done(err);
      }
    }
  )
);
