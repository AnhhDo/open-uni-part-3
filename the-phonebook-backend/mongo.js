const mongoose = require("mongoose");

const password = process.argv[2];
const url = `mongodb+srv://vanhdo-user:${password}@cluster0.yrof5a2.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

const addNewPerson = () => {
  person.save().then((result) => {
    console.log(
      `added ${result.name} number ${result.number} to the phonebook`
    );
    mongoose.connection.close();
  });
};

const printAllData = () => {
  Person.find({}).then((result) => {
    result.forEach((element) => {
      console.log(element);
    });
    mongoose.connection.close();
  });
};

if (process.argv.length < 3) {
  console.log("Please enter password");
  process.exit(1);
} else if (process.argv.length == 3) {
  printAllData();
} else {
  addNewPerson();
}
