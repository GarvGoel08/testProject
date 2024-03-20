const mongoose = require('mongoose');

//Data Base Connection Code
async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/admin', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to the database');
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

//Booking Handling Code

const bookingS = new mongoose.Schema({
    name: String,
    date: Date,
    email: String,
    table: Number
});
const Booking = mongoose.model('Booking', bookingS);

const Contactsss = new mongoose.Schema({
    name: String,
    Tel: String,
    email: String,
    Mes: String
});
const Contact = mongoose.model('Conact', Contactsss);

async function FindTables() {
    const booking = await Booking.find({});
    return booking;
}

async function FindContacts() {
    const booking = await Contact.find({});
    return booking;
}

async function ContactFormManager(myName1, email1, myTel1, myMess1) {
    // Save booking details in MongoDB
    try{
        const newContactReq = new Contact({
            name: myName1,
            email: email1,
            Tel: myTel1,
            Mes: myMess1,
        });
        console.log('Reached');
        await newContactReq.save();
        return 'Succesful';
    }
    catch{
        return 'Failed';
    }
}

async function TableManager(myName, myEmail, bookingDate) {
    myTable = 0;
    try {
        const booking = await Booking.find({ date: bookingDate })
            .sort({ _id: -1 })
            .limit(1)
            .exec();

        if (booking.length > 0) {
            if (booking[0].table == 10) {
                return 'Booked';
            }
            else {
                myTable = booking[0].table + 1;
                {
                    // Save booking details in MongoDB
                    const newBooking = new Booking({
                        name: myName,
                        email: myEmail,
                        date: bookingDate,
                        table: myTable,
                    });
                    await newBooking.save();
                    return 'Succesful';
                }
            }
        } else {
            myTable = 1;
            {
                // Save booking details in MongoDB
                const newBooking = new Booking({
                    name: myName,
                    email: myEmail,
                    date: bookingDate,
                    table: myTable,
                });
                await newBooking.save();
                return 'Succesful';
                //res.setHeader('Content-Type', 'application/pdf');
                //res.setHeader('Content-Disposition', `attachment; filename=booking_details.pdf`);
                //pdfbu(myName, bookingDate, myTable, myEmail, res); //PDF Builder
            }
        }

    } catch (err) {
        console.error(err);
    }
}

async function DeleteTable(ID) {
    try {
        await Booking.findByIdAndDelete(ID);
        console.log("DELETED");
    }
    catch (error) {
        console.log("Error Deleting: ", error);
    }
}
async function DeleteContact(ID) {
    try {
        await Contact.findByIdAndDelete(ID);
        console.log("DELETED");
    }
    catch (error) {
        console.log("Error Deleting: ", error);
    }
}

module.exports = { connectToDatabase, TableManager, FindTables, DeleteTable, ContactFormManager, FindContacts };
