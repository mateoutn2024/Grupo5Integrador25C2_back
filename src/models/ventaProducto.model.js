// --- backend/src/models/ventaProducto.model.js ---
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/database.js';
// Importamos los modelos con los que se va a relacionar
import { Venta } from './venta.model.js';    // Necesito saber la Venta a la que se une.
import { Producto } from './producto.model.js'; // Necesito saber el Producto que se compró.

export class VentaProducto extends Model { } // Defino la clase para la tabla de relación.

// 1. DEFINICIÓN DE LA TABLA INTERMEDIA (VentaProducto)
VentaProducto.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // Si no se especifica, es 1 por defecto.
    },

    // Llave Foránea 1: El ID de la venta.
    ventaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Venta, // Hace referencia al modelo Venta.
            key: 'id',   // Y a la columna 'id' de ese modelo.
        }
    },

    // Llave Foránea 2: El ID del producto.
    productoId: {
        type: DataTypes.INTEGER,
        references: {
            model: Producto, // Hace referencia al modelo Producto.
            key: 'id',
        }
    }

}, {
    sequelize,
    modelName: 'VentaProducto',
    tableName: 'ventas_productos', // Nombre de la tabla en la DB.
    timestamps: false, // No necesito las marcas de tiempo en esta tabla de relación.
});


// 2. DEFINICIÓN DE LAS RELACIONES EN SEQUELIZE

// Le digo al modelo Venta: "Estás relacionado con Producto"
Venta.belongsToMany(Producto, {
    through: VentaProducto, // "a través de esta tabla intermedia."
    foreignKey: 'ventaId' // "La llave que te conecta es 'ventaId'."
});

// Le digo al modelo Producto: "Estás relacionado con Venta"
Producto.belongsToMany(Venta, {
    through: VentaProducto, // "a través de esta misma tabla intermedia."
    foreignKey: 'productoId' // "La llave que te conecta es 'productoId'."
});