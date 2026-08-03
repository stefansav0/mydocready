export function getDatabaseName() {
  const databaseName = process.env.MONGODB_DB;

  if (!databaseName) {
    throw new Error("MONGODB_DB must be configured.");
  }

  return databaseName;
}
