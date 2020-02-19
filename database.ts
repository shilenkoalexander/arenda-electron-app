import db, { BetterSqlite3Helper } from 'better-sqlite3-helper';
import { SqliteError } from 'better-sqlite3';
import path from 'path';

const instance = db({
    path: './data/data.db', // this is the default
    memory: false, // create a db only in memory
    readonly: false, // read only
    fileMustExist: true, // throw error if database not exists
    WAL: true, // automatically enable 'PRAGMA journal_mode = WAL'
    migrate: {  // disable completely by setting `migrate: false`
        force: false, // set to 'last' to automatically reapply the last migration-file
        table: 'migration', // name of the database table that is used to keep track
        migrationsPath: path.resolve(__dirname, '../../../../../../migrations'), // path of the migration-files
    },
});

function init() {
    try {
        instance.query('select 1');
    } catch (e) {
        if (e instanceof SqliteError) {
            console.log('у ебать');
            return;
        }
        console.log(e);
    }
}

// The first call creates the global instance with your settings

init();
