const PDFDocument = require('pdfkit');
const fs = require('fs');

function PDFBuild(name, date, Table, email, res) {
  const doc = new PDFDocument();
  doc.pipe(res);

  // Logo
  const logo = './static/imgs/Logo.jpg'; // Replace with the path to your logo image
  doc.image(logo, 50, 50, { width: 100 });

  // Title
  doc
    .fontSize(30)
    .fillColor('#FF5733') // Change the color to your preference
    .text('PizzaBest', 180, 70);

  // Introduction
  doc
    .fontSize(14)
    .fillColor('#333')
    .text('Thank you for choosing our restaurant. We look forward to serving you.', {
      align: 'center'
    });

  // Spacing
  doc.moveDown();

  // Booking Details
  doc
    .fontSize(18)
    .fillColor('#333')
    .text('Booking Details');

  // Spacing
  doc.moveDown();

  doc
    .fontSize(14)
    .fillColor('#333')
    .text(`Name: ${name}`);

  // Spacing
  doc.moveDown();

  doc
    .fontSize(14)
    .fillColor('#333')
    .text(`Email: ${email}`);

  // Spacing
  doc.moveDown();

  doc
    .fontSize(14)
    .fillColor('#333')
    .text(`Date: ${date.toDateString()}`);

  // Spacing
  doc.moveDown();

  doc
    .fontSize(14)
    .fillColor('#333')
    .text(`Table Number: ${Table}`);

  doc.end();
}

module.exports = PDFBuild;
