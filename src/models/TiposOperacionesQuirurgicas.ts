import mongoose, { Schema } from "mongoose";
import { TiposOperacionesQuirurgicas } from "types/TiposOperacionesQuirurgicasTypes";

const TiposOperacionesQuirurgicasSchema: Schema = new Schema<TiposOperacionesQuirurgicas>(
  {
    nombreOperacion: {
      type: String,
      required: [true, "El nombre de la operación es obligatorio"],
      trim: true,
      unique: true, // Para evitar duplicados en el nombre, si es necesario
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

// Method to get basic tipos de operaciones quirúrgicas info (for the list)
TiposOperacionesQuirurgicasSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id, // Usamos el _id generado por MongoDB
    nombreOperacion: this.nombreOperacion,
    estado: this.estado,
  };
};

export const TiposOperacionesQuirurgicasModel = mongoose.model<TiposOperacionesQuirurgicas>("TiposOperacionesQuirurgicas", TiposOperacionesQuirurgicasSchema);