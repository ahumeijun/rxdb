//var RxDB = require('../../'); // TODO use this
require('babel-polyfill');
const RxDB = require('rxdb');
RxDB.plugin(require('pouchdb-adapter-websql'));
RxDB.plugin(require('pouchdb-adapter-http'));
RxDB.plugin(require('pouchdb-replication'));

const listBox = document.querySelector('#list-box');
const insertBox = document.querySelector('#insert-box');
const heroesList = document.querySelector('#heroes-list');

const heroSchema = {
    title: 'hero schema',
    description: 'describes a simple hero',
    version: 0,
    type: 'object',
    properties: {
        name: {
            type: 'string',
            primary: true
        },
        color: {
            type: 'string'
        }
    },
    required: ['color']
};

const heroSchemaV1 = {
    title: 'hero schema',
    description: 'describes a simple hero',
    version: 1,
    type: 'object',
    properties: {
        name: {
            type: 'string',
            primary: true
        },
        color: {
            type: 'string'
        },
        level: {
            type: 'string'
        }
    },
    required: ['color']
};

console.log('hostname: ' + window.location.hostname);
const syncURL = 'http://' + window.location.hostname + ':10102/';

let database;

RxDB
    .create({
        name: 'heroesdb',
        adapter: 'websql',
        password: 'myLongAndStupidPassword'
    })
    .then(function(db) {
        console.log('creating hero-collection..');
        database = db;
        //use this version first time
        return db.collection({
            name: 'heroes',
            schema: heroSchema
        });
        //user v1 version next time, migration strategies function will be infinite
        // return db.collection({
        //     name: 'heroes',
        //     schema: heroSchemaV1,
        //     migrationStrategies: {
        //         1: (oldDoc) => {
        //             console.log('migrate from 0 to 1...' + oldDoc.name)
        //             oldDoc.level = 'ss'
        //             return oldDoc
        //         }
        //     }
        // });
    })
    .then(function(col) {
        col.insert({
            name: 'Niven',
            color: 'black'
        })
        console.log('insert niven')
    });

addHero = function() {
    const name = document.querySelector('input[name="name"]').value;
    const color = document.querySelector('input[name="color"]').value;
    const obj = {
        name: name,
        color: color
    };
    console.log('inserting hero:');
    console.dir(obj);
    database.heroes.insert(obj);
};
