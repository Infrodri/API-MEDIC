import mongoose, { Schema } from "mongoose";
import { Administrativos } from "types/AdministrativosTypes";

const AdministrativosSchema: Schema = new Schema<Administrativos>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    apellido: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true,
    },
    cedula: {
      type: String,
      required: [true, "La cédula es obligatoria"],
      unique: true,
      trim: true,
      index: true,
    },
    profesion: {
      type: String,
      required: [true, "La profesión es obligatoria"],
      trim: true,
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "El usuario asociado es obligatorio"],
      index: true,
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

AdministrativosSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    nombre: this.nombre,
    apellido: this.apellido,
    cedula: this.cedula,
    profesion: this.profesion,
    estado: this.estado,
  };
};

export const AdministrativosModel = mongoose.model<Administrativos>("Administrativos", AdministrativosSchema);