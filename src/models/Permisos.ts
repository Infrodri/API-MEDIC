import mongoose, { Schema } from "mongoose";
import { Permisos } from "types/PermisosTypes";

const PermisosSchema: Schema = new Schema<Permisos>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del permiso es obligatorio"],
      trim: true,
      unique: true, // Para evitar duplicados
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
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

// Method to get basic permisos info (for the list)
PermisosSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id, // Usamos el _id generado por MongoDB
    nombre: this.nombre,
    estado: this.estado,
  };
};

export const PermisosModel = mongoose.model<Permisos>("Permisos", PermisosSchema);