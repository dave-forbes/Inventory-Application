#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Artist = require("./models/artist");
const Format = require("./models/format");
const Genre = require("./models/genre");
const Record = require("./models/record");
const RecordCopy = require("./models/recordCopy");

const artists = [];
const formats = [];
const genres = [];
const records = [];
const recordCopies = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createArtists();
  await createGenres();
  await createFormats();
  await createRecords();
  await createRecordCopies();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function genreCreate(index, name) {
  const genre = new Genre({ name: name });
  await genre.save();
  genres[index] = genre;
  console.log(`Added genre: ${name}`);
}

async function artistCreate(index, name) {
  const artist = new Artist({ name: name });
  await artist.save();
  artists[index] = artist;
  console.log(`Added artist: ${name}`);
}

async function formatCreate(index, name) {
  const format = new Format({ name: name });
  await format.save();
  formats[index] = format;
  console.log(`Added format: ${name}`);
}

async function recordCreate(
  index,
  title,
  artist,
  tracklist,
  genre,
  format,
  img,
  year
) {
  const recordDetail = {
    title: title,
    artist: artist,
    tracklist: tracklist,
    genre: genre,
    format: format,
    img: `/images/${img}`,
    year: year,
  };
  if (genre != false) recordDetail.genre = genre;

  const record = new Record(recordDetail);
  await record.save();
  records[index] = record;
  console.log(`Added record: ${title}`);
}

async function recordCopyCreate(index, record, catalogNum, condition, price) {
  const recordCopyDetail = {
    record: record,
    catalogNum: catalogNum,
    condition: condition,
    price: price,
  };

  const recordCopy = new RecordCopy(recordCopyDetail);
  await recordCopy.save();
  recordCopies[index] = recordCopy;
  console.log(`Added record copy: ${record} ${catalogNum}`);
}

async function createGenres() {
  console.log("Adding genres");
  await Promise.all([
    genreCreate(0, "Hip Hop"),
    genreCreate(1, "Folk"),
    genreCreate(2, "Jazz"),
    genreCreate(3, "Funk and Soul"),
    genreCreate(4, "Electronic"),
    genreCreate(5, "Rock"),
  ]);
}

async function createArtists() {
  console.log("Adding artists");
  await Promise.all([
    artistCreate(0, "Fugees"),
    artistCreate(1, "Wu-Tang Clan"),
    artistCreate(2, "A Tribe Called Quest"),
    artistCreate(3, "Cypress Hill"),
    artistCreate(4, "Snoop Dogg"),
    artistCreate(5, "Mobb Deep"),
    artistCreate(6, "Notorious B.I.G."),
    artistCreate(7, "Outkast"),
    artistCreate(8, "Lauryn Hill"),
    artistCreate(9, "Bob Dylan"),
    artistCreate(10, "Joni Mitchell"),
    artistCreate(11, "James Taylor"),
    artistCreate(12, "Simon & Garfunkel"),
    artistCreate(13, "Miles Davis"),
    artistCreate(14, "John Coltrane"),
    artistCreate(15, "Ella Fitzgerald"),
    artistCreate(16, "James Brown"),
    artistCreate(17, "Steve Wonder"),
    artistCreate(18, "Marvin Gaye"),
    artistCreate(19, "Aretha Franklin"),
    artistCreate(20, "Earth, Wind & Fire"),
    artistCreate(21, "Prince"),
    artistCreate(22, "Curtis Mayfield"),
    artistCreate(23, "Kraftwerk"),
    artistCreate(24, "Aphex Twin"),
    artistCreate(25, "Massive Attack"),
    artistCreate(26, "Depeche Mode"),
    artistCreate(27, "Portishead"),
    artistCreate(28, "Brian Eno"),
    artistCreate(29, "The Beatles"),
    artistCreate(30, "The Rolling Stones"),
    artistCreate(31, "Fleetwood Mac"),
    artistCreate(32, "Led Zeppelin"),
    artistCreate(33, "Jimi Hendrix"),
    artistCreate(34, "Queen"),
    artistCreate(35, "Cream"),
  ]);
}

async function createFormats() {
  console.log("Adding formats");
  await Promise.all([formatCreate(0, "Album"), formatCreate(1, "Single")]);
}

const recordData = require("./recordData");

async function createRecords() {
  console.log("Adding records");
  for (let i = 0; i < artists.length; i++) {
    await recordCreate(
      i,
      recordData[i][0],
      recordData[i][1],
      recordData[i][2],
      recordData[i][3],
      formats[0],
      recordData[i][4],
      recordData[i][5]
    );
  }
}

const prices = ["15.99", "16.99", "17.99", "18.99", "19.99", "20.99", "21.99"];
const conditions = ["Poor", "Fair", "Good", "New"];
const randomPrice = () => prices[Math.floor(Math.random() * prices.length)];
const randomCondition = () =>
  conditions[Math.floor(Math.random() * conditions.length)];
const randomCatalogNum = () => Math.floor(Math.random() * 100000);

async function createRecordCopies() {
  console.log("Adding record copies");
  for (let i = 0; i < artists.length; i++) {
    await recordCopyCreate(
      i,
      records[i],
      randomCatalogNum(),
      randomCondition(),
      randomPrice()
    );
  }
}
