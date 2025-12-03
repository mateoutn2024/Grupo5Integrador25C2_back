import { Sequelize } from 'sequelize';
import environments from '../config/environments.js';

const { database } = environments;

export const sequelize = new Sequelize(database.name, database.user, database.password, {
    host: database.host,
    dialect: 'mysql', // Usamos MySQL
    port: 3306,       // CAMBIAR A 3307 SI TU XAMPP LO REQUIERE
    logging: false,
});