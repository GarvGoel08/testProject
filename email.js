const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'garvgoel2927@gmail.com',
        pass: 'yourpassword'
    }
})

function EmailSender(Email, Table, Date, Name) {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Booking Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
                border-radius: 10px;
                text-align: center;
            }
            .logo {
                max-width: 150px;
            }
            h1 {
                color: #333;
            }
            .booking-info {
                padding: 20px;
                background-color: #fff;
                border-radius: 10px;
                text-align: left;
            }
            .booking-info h2 {
                color: #333;
            }
            .booking-details {
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <img src="logo.png" alt="Company Logo" class="logo">
            <h1>Booking Confirmation</h1>
        </div>
        <div class="booking-info">
            <h2>Booking Details:</h2>
            <div class="booking-details">
                <p><strong>Name:</strong> ${Name}</p>
                <p><strong>Date:</strong> ${Date}</p>
                <p><strong>Email:</strong> ${Email}</p>
                <p><strong>Table No:</strong> ${Table}</p>
            </div>
        </div>
    </body>
    </html>
    
`;
    const mailOptions = {
        from: 'garvgoel2927@gmail.com',
        to: Email,
        subject: 'Table Confirmation',
        html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email: ' + error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
