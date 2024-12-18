const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.API_KEY);
const User = require('../models/Users/user')
const tokenForUser = require('../utils/tokengenerator');


// Send email that contains a link for reset pwd
exports.send = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }) // find user
  if (user) { // if we fond the user
    const token = tokenForUser(user) // generates new token
    user.resettoken = token // affecting token to the user
    await user.save() // saving the user
    const link = `${req.protocol}://localhost:3000/resetpwd?token=${token}` // generating link
    await sgMail.send({
      to: req.body.email,
      from: 'mahmoudaziz.louati@supcom.tn',
      subject: 'Reset password',
      html:
        `<div>Click the link below to reset your password</div>
        <br/>
        <div>${link}</div>`
    }) // sending the email
      .then(data => res.send({ result: data }))
      .catch(err => res.send(err))
  }
  else { // user not found
    res.status(404).send({ message: 'User not found !' })
  }
}

exports.resetPassword = async (req, res) => {
  const { newPassword, token } = req.body
  const user = await User.findOne({ resettoken: token })
  if (user) {
    user.password = newPassword
    await user.save()
    return res.send({ message: "Password updated successfully !" })
  }
  res.status(404).send({ message: `User not found !` })
}