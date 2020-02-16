import db from 'better-sqlite3-helper';
// The first call creates the global instance with your settings
const instance = db({
    path: './data/data.db', // this is the default
    memory: false, // create a db only in memory
    readonly: false, // read only
    fileMustExist: true, // throw error if database not exists
    WAL: true, // automatically enable 'PRAGMA journal_mode = WAL'
    migrate: {  // disable completely by setting `migrate: false`
        force: false, // set to 'last' to automatically reapply the last migration-file
        table: 'migration', // name of the database table that is used to keep track
        migrationsPath: '../migrations', // path of the migration-files
    },
});

export default instance;
