import mongoose, { Schema } from "mongoose";
import { TiposObstetricosGinecologicos } from "types/TiposObstetricosGinecologicosTypes";

const TiposObstetricosGinecologicosSchema: Schema = new Schema<TiposObstetricosGinecologicos>(
  {
    nombreTipo: {
      type: String,
      required: [true, "El nombre del tipo es obligatorio"],
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

// Method to get basic tipos obstétricos/ginecológicos info (for the list)
TiposObstetricosGinecologicosSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id, // Usamos el _id generado por MongoDB
    nombreTipo: this.nombreTipo,
    estado: this.estado,
  };
};

export const TiposObstetricosGinecologicosModel = mongoose.model<TiposObstetricosGinecologicos>("TiposObstetricosGinecologicos", TiposObstetricosGinecologicosSchema);