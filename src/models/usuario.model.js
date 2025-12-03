// --- backend/src/models/usuario.model.js ---
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/database.js';
import bcrypt from 'bcrypt'; // 1. Traigo la librería bcrypt. Es  para encriptar contraseñas

// 2. Extiendo la clase Model de Sequelize y añado un método extra.
export class Usuario extends Model {
    // Este método es el que usamos en el controller de login.
    async validarPassword(password) {
        // Compara la contraseña que nos da el usuario (sin encriptar) con la contraseña
        // encriptada (el hash) que está guardada en la base de datos (this.password).
        // Retorna TRUE o FALSE.
        return await bcrypt.compare(password, this.password);
    }
}

// 3. Definición de la tabla:
Usuario.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, //  No pueden haber dos usuarios con el mismo email.
        validate: {
            isEmail: true, // Validación automática: Sequelize verifica que sea un formato de email válido.
        }
    },

    // La contraseña
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

}, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: false,

    // 4. Los HOOKS (Ganchos). Esto es código que se ejecuta en ciertos momentos del ciclo de vida del modelo.
    hooks: {
        // beforeCreate: Esto se ejecuta JUSTO antes de que Sequelize intente guardar el usuario en la DB.
        beforeCreate: async (usuario) => {
            // Genero la salt, que es texto aleatorio.
            const salt = await bcrypt.genSalt(10);
            // Encripto la contraseña que viene del formulario, usando  salt.
            usuario.password = await bcrypt.hash(usuario.password, salt);
            // Ahora lo que se guarda es el HASH, no la contraseña real
        },
    }
});