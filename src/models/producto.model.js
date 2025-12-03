// --- backend/src/models/producto.model.js ---
import { DataTypes, Model } from 'sequelize'; // 1. Traigo las herramientas de Sequelize: DataTypes para definir los tipos (STRING, INTEGER, etc.) y Model para heredar.
import { sequelize } from '../database/database.js'; // 2. Traigo la conexión a la base de datos que configuramos al principio.

export class Producto extends Model {} // 3. Defino la clase Producto que hereda de Model. Esta es la clase que usaré en mis Controllers.

// 4. Defino la estructura de la tabla (mapping):
Producto.init({
  id: {
    type: DataTypes.INTEGER, // El tipo de dato es un número entero.
    primaryKey: true, //  Esta es la llave primaria de la tabla.
    autoIncrement: true, // Esto hace que el ID se genere solo (1, 2, 3...) cuando creo un producto.
  },

  nombre: {
    type: DataTypes.STRING, // Texto (una cadena de caracteres).
    allowNull: false, // No puede estar vacío. Es obligatorio al crear.
  },

  precio: {
    type: DataTypes.FLOAT, // Número decimal.
    allowNull: false,
    defaultValue: 0.0, // Si no lo especifico, por defecto es 0.0.
  },

  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  imagen: {
    type: DataTypes.STRING, // Aquí guardamos solo el nombre del archivo de la imagen (ej: "1678234567.jpg").
    allowNull: true, // Puede estar vacío si no suben imagen.
  },
  
  activo: {
    type: DataTypes.BOOLEAN, // Tipo Booleano (TRUE o FALSE).
    allowNull: false,
    defaultValue: true, // Por defecto, el producto está visible (activo).
  },

}, {
  sequelize, // 5. Le digo a este modelo qué conexión debe usar.
  modelName: 'Producto', // El nombre de este modelo en JavaScript.
  tableName: 'productos', // El nombre real de la tabla en la base de datos (generalmente en plural).
  timestamps: true, // Esto crea automáticamente los campos 'createdAt' y 'updatedAt'.
});