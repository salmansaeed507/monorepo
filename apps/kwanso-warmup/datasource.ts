import { dataSourceOptions } from 'datasourceoptions';
import { DataSource } from 'typeorm';

export const connectionSource = new DataSource(dataSourceOptions);
