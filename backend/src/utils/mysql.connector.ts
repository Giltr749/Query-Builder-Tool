import { createPool, Pool } from 'mysql';
import { DATA_SOURCES } from '../config/vars.config';
import Logger from '../middlewares/logger/winston';
const dataSource = DATA_SOURCES.mySqlDataSource;

let pool: Pool;

export const init = () => {
  try {
    pool = createPool({
      connectionLimit: dataSource.DB_CONNECTION_LIMIT,
      host: dataSource.DB_HOST,
      user: dataSource.DB_USER,
      password: dataSource.DB_PASSWORD,
      database: dataSource.DB_DATABASE,
    });

    pool.getConnection((err, connection) => {
      if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          Logger.error('Database connection was closed.');
        }
        if (err.code === 'ECONNREFUSED') {
          Logger.error('Database connection was refused.');
        }
      }
      if (connection) connection.release()
      return
    })

    Logger.debug('MySql Adapter Pool generated successfully');

  } catch (error) {
    Logger.error(error);
    throw new Error('failed to initialized pool');
  }
};


export const execute = <T>(query: string, params: string[] | Object): Promise<T> => {
  try {
    if (!pool) throw new Error('Pool was not created. Ensure pool is created when running the app.');

    if (!query || !params) {
      return;
    }

    return new Promise<T>((resolve, reject) => {
      pool.query(query, params, (error, results) => {
        if (error) reject(error);
        else {
          resolve(JSON.parse(JSON.stringify(results)));
        };
      });
    });

  } catch (error) {
    Logger.error(error);
    throw new Error('failed to execute MySQL query');
  }
}
