const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const pdfbu = require('./pdf_creater');
const port = 80;
app.use('/satic', express.static('static'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const { connectToDatabase, TableManager, FindTables, DeleteTable, ContactFormManager, FindContacts } = require('./db')

connectToDatabase();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'HomeBeta.html'));
});
app.get('/Home', (req, res) => {
  res.sendFile(path.join(__dirname, 'HomeBeta.html'));
});



function generateContactAdminPanelHTML(data) {
  const ContactcardsHTML = data.map((entry) => `
    <div class="col-sm-6 mb-3 my-2 mb-sm-0">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${entry.name}</h5>
          <p class="card-text">Email: ${entry.email}</p>
          <p class="card-text">Tel: ${entry.Tel}</p>
          <p class="card-text">Message.: ${entry.Mes}</p>
          <a href="/check-in-customer?id=${entry._id}" class="btn btn-primary">Check In Customer</a>
        </div>
      </div>
    </div>
  `).join('');

  const ContactadminPanelHTML = `
    <!doctype html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin Panel</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    </head>
    <body>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Admin Panel</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Bookings</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Contact Requests</a>
          </li>
        </ul>
        <form class="d-flex" role="search">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
      </div>
    </div>
  </nav>
      <div class="row">
        ${ContactcardsHTML}
      </div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    </body>
    </html>
  `;

  return ContactadminPanelHTML;
}

function generateAdminPanelHTML(data) {
  const cardsHTML = data.map((entry) => `
    <div class="col-sm-6 mb-3 my-2 mb-sm-0">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${entry.name}</h5>
          <p class="card-text">Email: ${entry.email}</p>
          <p class="card-text">Booking Date: ${entry.date}</p>
          <p class="card-text">Table No.: ${entry.table}</p>
          <a href="/check-in-customer?id=${entry._id}" class="btn btn-primary">Check In Customer</a>
        </div>
      </div>
    </div>
  `).join('');

  const adminPanelHTML = `
    <!doctype html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin Panel</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    </head>
    <body>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Admin Panel</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Bookings</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Contact Requests</a>
          </li>
        </ul>
        <form class="d-flex" role="search">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
      </div>
    </div>
  </nav>
      <div class="row">
        ${cardsHTML}
      </div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    </body>
    </html>
  `;

  return adminPanelHTML;
}

app.post('/book', async (req, res) => {
  const { myName, myEmail, myDate, myTime } = req.body;
  if (myName === "" || myDate === null || myEmail === "" || myTime === "") {
    res.send('<script>alert("Please Enter all Details"); window.location = "/";</script>');
  }
  else {
    const bookingDate = new Date(`${myDate}, ${myTime}`);
    const rsp = await TableManager(myName, myEmail, bookingDate);
    if (rsp == 'Booked') {
      // Append the alert message to the HomeBeta.html and send it
      const alertMessage = `
        <div class="alert alert-danger alert-dismissible fade show" style="margin:0;" role="alert">
          <strong>Sorry!</strong> We are fully booked on this date, please try some other dates
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
      const filePath = path.join(__dirname, 'HomeBeta.html');
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.send('An error occurred.');
        } else {
          // Inject the alert message into the HTML
          const updatedHtml = data.replace('<div id="alert-message"></div>', alertMessage);
          res.send(updatedHtml);
        }
      });
    }
    else if (rsp == 'Succesful') {
      // Append the alert message to the HomeBeta.html and send it
      const alertMessage = `
        <div class="alert alert-warning alert-dismissible fade show" style="margin:0;" role="alert">
          <strong>Thanks for choosing us!</strong> Your Booking has been confirmed
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
      const filePath = path.join(__dirname, 'HomeBeta.html');
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.send('An error occurred.');
        } else {
          // Inject the alert message into the HTML
          const updatedHtml = data.replace('<div id="alert-message"></div>', alertMessage);
          res.send(updatedHtml);
        }
      });
    }
  }

});

app.post('/Contact', async (req, res) => {
  const { myName1, myEmail1, myTel1, myMess1 } = req.body;
  if (myName1 === "" || myEmail1 === "" || myTel1 === "" || myMess1 === "") {
    res.send('<script>alert("Please Enter all Details"); window.location = "/";</script>');
  }
  else {
    const rsp = await ContactFormManager(myName1, myEmail1, myTel1, myMess1);
    if (rsp == 'Failed') {
      const alertMessage = `
        <div class="alert alert-danger alert-dismissible fade show" style="margin:0;" role="alert">
          <strong>Error!</strong> An error was observed while saving your info, Please try again.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
      const filePath = path.join(__dirname, 'HomeBeta.html');
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.send('An error occurred.');
        } else {
          // Inject the alert message into the HTML
          const updatedHtml = data.replace('<div id="alert-message"></div>', alertMessage);
          res.send(updatedHtml);
        }
      });
    }
    else if (rsp == 'Succesful') {
      // Append the alert message to the HomeBeta.html and send it
      const alertMessage = `
        <div class="alert alert-warning alert-dismissible fade show" style="margin:0;" role="alert">
          <strong>Submitted!</strong> Your will get a call from one of our customer specialists soon
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
      const filePath = path.join(__dirname, 'HomeBeta.html');
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.send('An error occurred.');
        } else {
          // Inject the alert message into the HTML
          const updatedHtml = data.replace('<div id="alert-message"></div>', alertMessage);
          res.send(updatedHtml);
        }
      });
    }
  }

});

app.get('/check-in-customer', async (req, res) => {
  const id = req.query.id;
  DeleteTable(id);
  res.redirect('/Admin');
});

app.get('/Admin', async (req, res) => {
  try {
    const data = await FindTables();
    const adminPanelHTML = generateAdminPanelHTML(data);
    res.send(adminPanelHTML);
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }

});

app.get('/AdminContacts', async (req, res) => {
  try {
    const data = await FindContacts();
    const adminPanelHTML = generateContactAdminPanelHTML(data);
    res.send(adminPanelHTML);
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }

});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});