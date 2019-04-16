const gulp = require('gulp');
const fs = require('fs-extra');


gulp.task('build:lib', (cb) => {
  const exec = require('child_process').exec;
  exec('ng build ngx-list', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('build:demo', (cb) => {
  const exec = require('child_process').exec;
  exec('ng build ngx-list-demo --aot --prod --base-href /ngx-list/', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('build:copy', (cb) => {
  const exec = require('child_process').exec;
  exec('cp LICENSE README.md dist/ngx-list/', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});



gulp.task('demodata', (cb) => {
  const md5 = require('md5');
  const firstNames = [
    'Bob', 'George', 'Timmy', 'Loki', 'Hedda', 'Charles', 'Tom', 'Nate', 'Roger', 'Eric', 'Vanity', 'Prudence',
    'Patty', 'Ratty', 'Matty', 'Tatty', 'Catty', 'Kimmy', 'Zippy', 'Zappy', 'Foo', 'Franklin', 'Gerard', 'Howard',
    'Pippy', 'Pip', 'Pappy', 'Happy', 'Peter', 'Priscilla',
    'Siggy', 'Sandra', 'Anna', 'Yogi', 'Milo', 'Portia',
    'Xanthippe', 'Yorkie', 'Betty', 'Humphrey', 'Candide', 'Ross',
    'Atticus', 'Athena', 'Hera', 'Herod', 'Knute', 'Ursula', 'Indra',
    'Ichabod', 'Theo', 'Tammy', 'Tatiana', 'Osgard', 'Kipper', 'Nipper', 'Tipper',
    'Sunny', 'Cher', 'Eve', 'Adam', 'Solomon', 'Lettuce',
    `Addbjörg`, 'Addlaug', `Addú`, `Addý`, `Adela`, `Agða`, 'Alfreðsína',
    'Ásmundur'
  ];
  const lastNames = [
    'Sockems', 'Soxy', 'Socko',
    'Yarny', 'Plaid', 'Polka-Dot', 'Stripey', 'Lambswool', 'Cotton',
    'Zebra', 'Xu', 'Pokey', 'Andrews', 'Martin', 'Milk', 'Jewel', 'Rabbit',
    'Babbit', 'Nabob', 'Bull', 'Maxwell', 'Wellington', 'Norbart',
    'Wombley', 'Gormless', 'Chandler', 'Chipperson', 'Angle', 'Glube',
    'Roswell', 'Jamison', 'Finch', 'Venn', 'Oglethorpe', 'Harpy', 'Wren',
    'Bluejay', 'Jamon', 'Yeats', 'Keats', 'Lloyd', 'Landers', 'Pumpkin',
    'Parterre', 'Monfdrian', 'Milquetoast', 'Mouse', 'Hound', 'Arugala', 'Parsnip',
    'Turnip', 'Vogel', 'Fassbinder', 'Fender-Bender'
  ];

  const moment = require('moment');
  const now = moment().valueOf();
  const decadeAgo = moment().subtract(10, 'years').valueOf();
  const recs = [];
  const colors = ['black', 'white', 'gray', 'red', 'blue', 'turquoise', 'white', 'orange', 'red', 'violet', 'pink', 'brown', 'green'];
  const missing = [
    null, null, null, null, null, null, null, null, null, null,
    'left', 'right', null, null, null, null, null, null, null, null, null, null];

  const randInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  const randEl = (items) => {
    return items[Math.floor(Math.random() * items.length)];
  }
  const randNum = (min, max) => {
    return Math.random() * (max - min) + min;
  }
  let rec;
  for (let n = 0; n < 88; n++) {
    rec = {
      firstName: randEl(firstNames),
      lastName:  randEl(lastNames),
      purchased: {
        date: randInt(decadeAgo, now),
        price: randNum(1.55, 96.25)
      },
      color: randEl(colors),
      missing: randEl(missing)

    };
    rec.lastWorn = randInt(rec.purchased.date, now);
    rec.currentValue = randNum(0, 100);
    rec.id = 232 + n;
    recs.push(rec);
  }

  fs.outputJSON('./projects/ngx-list-demo/src/assets/d.json', recs, {spaces: `\t`})
    .then(cb);
})
