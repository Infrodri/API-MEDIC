import mongoose, { Schema } from "mongoose";
import { TiposAdiccion } from "types/TiposAdiccionesTypes";

const TiposAdiccionesSchema: Schema = new Schema<TiposAdiccion>(
  {
    nombreAdiccion: {
      type: String,
      required: [true, "El nombre de la adicción es obligatorio"],
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

// Method to get basic tipos adiccion info (for the list)
TiposAdiccionesSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id, // Usamos el _id generado por MongoDB
    nombreAdiccion: this.nombreAdiccion,
    descripcion: this.descripcion,
    estado: this.estado,
  };
};

export const TiposAdiccionesModel = mongoose.model<TiposAdiccion>("TiposAdicciones", TiposAdiccionesSchema);