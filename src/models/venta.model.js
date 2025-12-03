// --- backend/src/models/venta.model.js ---
import { DataTypes, Model } from 'sequelize'; // Herramientas de Sequelize.
import { sequelize } from '../database/database.js'; // La conexión a nuestra base de datos.

export class Venta extends Model { } // Defino la clase Venta.

// 1. Defino la estructura de la tabla 'ventas':
Venta.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Es la llave principal.
        autoIncrement: true, // Se genera automáticamente (1, 2, 3...).
    },

    nombreUsuario: {
        type: DataTypes.STRING,
        allowNull: false, // Necesitamos saber quién compró.
    },

    precioTotal: {
        type: DataTypes.FLOAT, // Usamos FLOAT para números con decimales (el precio total).
        allowNull: false,
    },

    fecha: {
        type: DataTypes.DATE, // Guarda la fecha y hora.
        defaultValue: DataTypes.NOW, // Si no se especifica, toma la fecha/hora actual de la base de datos.
    }

}, {
    sequelize,
    modelName: 'Venta',
    tableName: 'ventas', // El nombre real de la tabla en la DB.
    timestamps: true,
});