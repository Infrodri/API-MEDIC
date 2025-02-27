import mongoose, { Schema } from "mongoose";
import { Roles } from "types/RolesTypes";

const RolesSchema: Schema = new Schema<Roles>(
  {
    name: {
      type: String,
      required: [true, "El nombre del rol es obligatorio"],
      unique: true,
      trim: true,
      index: true, // Agregamos índice para búsquedas rápidas por nombre
    },
    // Eliminamos permissions; se manejará con RolesPermisos
    estado: {
      type: String,
      enum: ["Activo", "Inactivo"],
      default: "Activo",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

RolesSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    name: this.name,
    estado: this.estado,
  };
};

export const RolesModel = mongoose.model<Roles>("Roles", RolesSchema);