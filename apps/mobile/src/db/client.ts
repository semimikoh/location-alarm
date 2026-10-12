import { drizzle } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import * as SQLite from 'expo-sqlite';
import migrations from '../../drizzle/migrations';

const DATABASE_NAME = 'location-alarm.db';

type SqliteConnection = Awaited<ReturnType<typeof SQLite.openDatabaseAsync>>;

let connectionPromise: Promise<SqliteConnection> | undefined;
let migrationPromise: Promise<void> | undefined;
let ormDatabase: ReturnType<typeof drizzle> | undefined;

function openConnection() {
  if (!connectionPromise) {
    connectionPromise = SQLite.openDatabaseAsync(DATABASE_NAME)
      .then(async (connection) => {
        await connection.execAsync(
          'PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;',
        );
        return connection;
      })
      .catch((error: unknown) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  return connectionPromise;
}

export function initializeDatabase() {
  if (!migrationPromise) {
    migrationPromise = openConnection()
      .then(async (connection) => {
        ormDatabase = drizzle(connection);
        await migrate(ormDatabase, migrations);
      })
      .catch((error: unknown) => {
        migrationPromise = undefined;
        throw error;
      });
  }

  return migrationPromise;
}

export async function getDatabase() {
  await initializeDatabase();

  if (!ormDatabase) {
    throw new Error('Database initialization completed without a connection.');
  }

  return ormDatabase;
}
