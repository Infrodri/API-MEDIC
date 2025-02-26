import mongoose, { Schema } from "mongoose";
import { UsuarioRoles } from "types/UsuarioRolesTypes";

const UsuarioRolesSchema: Schema = new Schema<UsuarioRoles>(
  {
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Users", // Relación con Users (ajusta el nombre según tu modelo)
      required: [true, "El usuario es obligatorio"],
    },
    rol: {
      type: Schema.Types.ObjectId,
      ref: "Roles", // Relación con Roles
      required: [true, "El rol es obligatorio"],
    },
    estado: {
      type: String,
      enum: ["Activo", "Inactivo"],
      default: "Activo",
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
    versionKey: false,
  }
);

// Method to get basic usuario-roles info (for the list)
UsuarioRolesSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id, // Usamos el _id generado por MongoDB
    usuario: this.usuario,
    rol: this.rol,
    estado: this.estado,
  };
};

export const UsuarioRolesModel = mongoose.model<UsuarioRoles>("UsuarioRoles", UsuarioRolesSchema);