const express = require('express')
const http = require('http');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');


const api_key = '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';
console.log('api_key:', process.env.SENDGRID_API_KEY);
process.env.SENDGRID_API_KEY = api_key;
console.log('api_key:', process.env.SENDGRID_API_KEY);

const sendGrid = require('@sendgrid/mail');

sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

const sg = require('sendgrid')(api_key);

const { Schema } = mongoose;


mongoose.Promise = global.Promise;
const port = process.env.PORT || 8000;
const Register = mongoose.model('Register', new Schema(
  {
    country: String,
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    salt: String,
    hash: String,
    address1: String,
    address2: String,
    city: String,
    region: String,
    zip_postal_code: String,
    tel: String,
    create_time: { type: Number, comment: 'create time', default: Date.now },
  },
  {
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.__v;
        delete ret._id;
        return ret;
      },
    },
  }
)
)

const app = express();
// set static resource 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// console print request method and url path;
app.use(function (req, res, next) {
  const { method, url } = req;
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization,token, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    MgDBHelper.log('method:', method.toLowerCase(), url);
    next();
  }
})

// sendGrid appKey    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

// heroku   yangyit@deakin.edu.au   Yyt19980414!

app.post('/api/register', async (request, response) => {
  try {
    const body = request.body;
    const {
      country, first_name, last_name, email, password, confirmPwd,
      address1, address2, city, region, zip_postal_code, tel
    } = body;
    if (!first_name) {
      throw Error('First name is not empty');
    }
    if (!last_name) {
      throw Error('Last name is not empty');
    }
    if (!email) {
      throw Error('Email is not empty');
    }
    if(! /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(email)) {
      throw Error('Email Incorrect format');
    }
    if (!password) {
      throw Error('Password is not empty');
    }
    if (!confirmPwd) {
      throw Error('Confirm password is not empty');
    }
    if (password != confirmPwd) {
      throw Error('Incorrect password input twice');
    }
    if (password.length < 8) {
      throw Error('The password must be at least 8 characters');
    }
    if (!(address1 || address2)) {
      throw Error('Address is not empty');
    }
    if (!city) {
      throw Error('city is not empty');
    }
    if (!region) {
      throw Error('region is not empty');
    }
    if (!zip_postal_code) {
      throw Error('ZIP/Postal code is not empty');
    }
    if (!tel) {
      throw Error('region is not empty');
    }
    if (!/^[0-9]*$/.test(tel)) {
      throw Error('Mobile phone number incorrect format');
    }

    const exists = await Register.findOne({ email });
    if (exists) {
      throw Error('Email is exists');
    }

    body.salt = bcrypt.genSaltSync(10);
    body.password = bcrypt.hashSync(body.password, body.salt);

    console.log(body);
    const html = ` Dear<strong> ${last_name} ${first_name}</strong> !
      <br/>
      Congratulations on your successful registration
    `;
    await EmailHelper.SendEmail(body.email, 'Sign Up Success', html);
    const info = await Register.create(body);
    response.json({ msg: 'ok', data: info });
  } catch (ex) {
    response.status(400).json({ msg: ex.message })
    MgDBHelper.log(ex);
  }
})

app.post('/api/user/signIn', async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email) {
      throw Error('Email is not empty');
    }
    if (!password) {
      throw Error('Password is not empty');
    }

    const ui = await Register.findOne({ email });
    if (!ui) {
      throw Error('Incorrect username or password');
    }
    // pwd
    console.log(ui);
    const result = bcrypt.compareSync(password, ui.password);
    if (!result) {
      throw Error('Incorrect username or password');
    }
    const newUI = JSON.parse(JSON.stringify(ui));
    delete newUI.salt;
    delete newUI.password;

    response.json({ code: 200, msg: 'sign in success', data: newUI });

  } catch (ex) {
    response.status(400).json({ code: 400, msg: ex.message || ex })
    MgDBHelper.log(ex);
  }
})

app.post('/api/sendemail', async (request, response) => {
  try {
    // yangyit@deakin.edu.au
    // const msg = {
    //   to: 'xiaotuni@163.com',
    //   from: 'xiaotuni@gmail.com',                                        // Use the email address or domain you verified above
    //   subject: 'Sending with Twilio SendGrid is Fun',                    // email title
    //   text: 'and easy to do anywhere, even with Node.js',                // email content
    //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    // }

    // const result = await sendGrid.send(msg);

    // const { email, title, content } = request.body;
    // const html = ` Dear<strong> ${email}</strong> !
    // <br/>
    // Congratulations on your successful registration
    // <br/>
    // ${content}
    // `;
    // const result = await EmailHelper.SendEmail(email, title, html);
    // response.json({ result });

  } catch (ex) {
    response.status(400).json({ code: 400, msg: ex.message || ex })
    MgDBHelper.log(ex);
  }
})


// Other visits go to index.html
app.use('/', (req, res, next) => {
  res.redirect('/index.html');
});
// set access port
app.set('port', port);
// create http web server
const server = http.createServer(app);
// listen http web server port
server.listen(port, (error) => {
  // connect mongodb 
  MgDBHelper.connect('mongodb+srv://tianer:980414@icrowdtaskdb.rkn8c.azure.mongodb.net/iCrowdTaskDB?retryWrites=true&w=majority');
 

  if (error) {
    MgDBHelper.log('Something went wrong', error)
  } else {
    MgDBHelper.log('Server is listening on port http://127.0.0.1:' + port);
  }
});

class MgDBHelper {

  /**
   * connect mongodb
   *
   * @static
   * @param {*} uri
   * @returns
   * @memberof MongoDbHelper
   */
  static async connect(uri) {
    this.log('mongodb url...', uri);
    return await new Promise((resolve, reject) => {
      mongoose.connection
        .on('error', error => reject(error))
        .on('close', () => this.log('Database connection closed.'))
        .once('open', () => {
          this.log('mongodb connection...');
          resolve(mongoose.connections[0])
        });
      mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    });
  }

  /**
   * disconnect mongodb
   *
   * @static
   * @returns
   * @memberof MongoDbHelper
   */
  static async close() {
    return await new Promise((resolve, reject) => {
      mongoose.disconnect((err) => {
        if (err) {
          this.log('close connection is error', err)
          return reject(err);
        }
        resolve();
      });
    });
  }

  /**
   * console output log
   *
   * @memberof MongoDbHelper
   */
  static log() {
    try {
      const _curDate = new Date();
      const info = `${_curDate.getFullYear()}-${_curDate.getMonth() + 1}-${_curDate.getDay()} ${_curDate.getHours()}:${_curDate.getMinutes()}:${_curDate.getSeconds()}.${_curDate.getMilliseconds()}`;
      console.log(`${info}-->`, ...arguments);
    } catch (ex) {
      console.log(ex);
      console.log(args);
    }
  }
}

class EmailHelper {
  static async SendEmail(to, title, content) {
    if (!to) {
      return Promise.reject('Please enter email address');
    }
    if (!title) {
      return Promise.reject('Email subject is not empty');
    }
    if (!content) {
      return Promise.reject('Email content is not empty');
    }
    try {
      MgDBHelper.log('send email:', to);
      // yangyit@deakin.edu.au
      const msg = {
        to,
        from: 'xiaotuni@gmail.com',                                        // Use the email address or domain you verified above
        subject: title,                                                    // email title
        html: content,                                                     // email content
        // html: `<strong>and easy to do anywhere, even with Node.js</strong>',
      }

      const result = await sendGrid.send(msg);
      return result;
    } catch (ex) {
      return Promise.reject(ex);
    }
  }
}
