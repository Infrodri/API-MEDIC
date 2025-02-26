import mongoose, { Schema } from "mongoose";
import { RolesPermisos } from "types/RolesPermisosTypes";

const RolesPermisosSchema: Schema = new Schema<RolesPermisos>(
  {
    rol: {
      type: Schema.Types.ObjectId,
      ref: "Roles", // Relación con Roles
      required: [true, "El rol es obligatorio"],
    },
    permiso: {
      type: Schema.Types.ObjectId,
      ref: "Permisos", // Relación con Permisos
      required: [true, "El permiso es obligatorio"],
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

// Method to get basic roles-permisos info (for the list)
RolesPermisosSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id, // Usamos el _id generado por MongoDB
    rol: this.rol,
    permiso: this.permiso,
    estado: this.estado,
  };
};

export const RolesPermisosModel = mongoose.model<RolesPermisos>("RolesPermisos", RolesPermisosSchema);