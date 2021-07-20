// MomentJs
var moment = require('moment');

// Moongose Setup
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creating Schema and Model
const bookSchema = new Schema({
    title: String,
    bookid: String,
    dateborrowed: { type: Date },
    // dateborrowed: { type: Date, default: moment().format() },
    // returndate: { type: Date },
    returndate: { type: Date, default: moment().add(7, 'd').format() },
    bookstats: String
});

const studentSchema = new Schema({
    name: String,
    studentid: String,
    libcardno: String,
    phoneno: Number,
    feestats: Boolean,
    books: [bookSchema],
    // booksborrowed: { type: String, default: JSON.stringify(bookSchema).length}
});

const Student = mongoose.model('student', studentSchema);
const Book = mongoose.model('book', bookSchema);

module.exports = Student;