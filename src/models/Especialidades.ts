import mongoose, { Schema } from "mongoose";
import { Especialidades } from "types/EspecialidadesTypes";

const EspecialidadesSchema: Schema = new Schema<Especialidades>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre de la especialidad es obligatorio"],
      trim: true,
      unique: true,
      index: true,
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
    timestamps: true,
    versionKey: false,
  }
);

EspecialidadesSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    nombre: this.nombre,
    estado: this.estado,
  };
};

export const EspecialidadesModel = mongoose.model<Especialidades>("Especialidades", EspecialidadesSchema);