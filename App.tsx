import { SQLiteProvider } from "expo-sqlite/next";
import { SqliteScreen } from "./SqliteScreen";

const schema = `CREATE TABLE IF NOT EXISTS "todo" (_id TEXT PRIMARY KEY, text TEXT, completed INTEGER DEFAULT 0);`;

export default function App() {
  return (
    <SQLiteProvider
      databaseName="test.db"
      onInit={async (db) => {
        return await db.execAsync(schema);
      }}
      options={{ enableChangeListener: true }}
    >
      <SqliteScreen />
    </SQLiteProvider>
  );
}
