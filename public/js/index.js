var baseUrl = '';// 'http://127.0.0.1:3098';

var countryList = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei',
  'Bulgaria', 'Burkina Faso', 'Burundi', 'Côte d\' Ivoire', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo(Congo-Brazzaville)', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czechia (Czech Republic)', 'Democratic Republic of the Congo', 'Denmark',
  'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini("Swaziland")', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany',
  'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Holy See', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica',
  'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia',
  'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar (formerly Burma)', 'Namibia', 'Nauru', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine State', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru',
  'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia',
  'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Tajikistan',
  'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States of America', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela',
  'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe']

function initSelect() {

  var a = document.getElementsByName('country')[0]
  if (!a) {
    return;
  }
  console.log(a);
  var html = '';
  for (var i = 0; i < countryList.length; i += 1) {
    var name = countryList[i];
    html += `
    <option value="${name}">${name}</option>
    `;
  }
  a.innerHTML = html;
}

initSelect();



function createAccount() {

  var fieldMap = {
    country: document.getElementsByName('country')[0].value,
  };

  document.querySelectorAll('input').forEach(function (ele) {
    fieldMap[ele.name] = ele.value;
  });

  console.log(fieldMap);
  // var baseUrl = ''; // 'http://127.0.0.1:3098';

  var url = baseUrl + '/api/register';

  jQuery.ajax({
    type: 'post',
    url: url,
    data: fieldMap,
    dataType: 'json',
    success: function (data) {
      alert('Create an iCrowdTsak account success');
      location.href = "login.html";
    },
    error: function (err) {
      console.log(err);
      var jsonBody = (err || {}).responseJSON;
      var msg = (jsonBody || {}).msg;
      if (msg) {
        alert(msg);
      }
    }
  })
}

function judgeLogin() {

  var uiStr = sessionStorage.getItem('userInfo');
  if (!uiStr) {
    location.href = 'login.html';
    return;
  }

  var element = document.getElementById('userName');
  if (!element) {
    return;
  }
  var ui = JSON.parse(uiStr);
  element.innerHTML = `
    <h1>Welcom ${ui.last_name} ${ui.first_name}</h1>
  
  `;

}


function login() {
  var data = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
  }

  console.log(data);


  jQuery.ajax({
    type: 'post',
    url: baseUrl + '/api/user/signin',
    data: data,
    dataType: 'json',
    success: function (body) {
      console.log(data);
      sessionStorage.setItem('userInfo', JSON.stringify(body.data));
      alert('Login success');
      location.href = "index.html";
    },
    error: function (err) {
      console.log(err);
      var jsonBody = (err || {}).responseJSON;
      var msg = (jsonBody || {}).msg;
      if (msg) {
        alert(msg);
      }
    }
  })
}