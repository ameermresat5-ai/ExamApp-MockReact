import dotenv from "dotenv";
import { jsonRepository } from "./JsonRepository.js";
import { postgresRepository } from "./PostgresRepository.js";

dotenv.config();

const supportedSources = ["json", "postgres"];

export function getDataSource() {
  const dataSource = (
    process.env.DATA_SOURCE || "json"
  ).toLowerCase();

  if (!supportedSources.includes(dataSource)) {
    throw new Error(
      `Invalid DATA_SOURCE "${dataSource}". Use "json" or "postgres".`
    );
  }

  return dataSource;
}

export function createRepository() {
  const dataSource = getDataSource();

  if (dataSource === "postgres") {
    return postgresRepository;
  }

  return jsonRepository;
}

export const activeDataSource = getDataSource();
export const repository = createRepository();
