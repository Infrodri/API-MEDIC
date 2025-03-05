// src/models/Medicos.ts
import mongoose, { Schema } from "mongoose";
import { Medico } from "types/MedicoTypes";

const MedicoSchema: Schema = new Schema<Medico>(
  {
    cedula: {
      type: String,
      required: [true, "La cédula es obligatoria"],
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Formato de cédula inválido"],
    },
    primerNombre: {
      type: String,
      required: [true, "El primer nombre es obligatorio"],
      trim: true,
    },
    segundoNombre: {
      type: String,
      trim: true,
      default: "",
    },
    primerApellido: {
      type: String,
      required: [true, "El primer apellido es obligatorio"],
      trim: true,
    },
    segundoApellido: {
      type: String,
      trim: true,
      default: "",
    },
    fechaNacimiento: {
      type: Date,
      required: [true, "La fecha de nacimiento es obligatoria"],
      validate: {
        validator: function (value: Date) {
          return value <= new Date();
        },
        message: "La fecha de nacimiento no puede ser futura",
      },
    },
    lugarNacimiento: {
      type: String,
      required: [true, "El lugar de nacimiento es obligatorio"],
      trim: true,
    },
    nacionalidad: {
      type: String,
      required: [true, "La nacionalidad es obligatoria"],
      trim: true,
    },
    ciudadDondeVive: {
      type: String,
      required: [true, "La ciudad de residencia es obligatoria"],
      trim: true,
    },
    direccion: {
      type: String,
      required: [true, "La dirección es obligatoria"],
      trim: true,
    },
    telefono: {
      type: String,
      required: [true, "El teléfono es obligatorio"],
      trim: true,
      match: [/^\d{7,10}$/, "Formato de teléfono inválido"],
    },
    celular: {
      type: String,
      required: [true, "El celular es obligatorio"],
      trim: true,
      match: [/^\d{10}$/, "Formato de celular inválido"],
    },
    genero: {
      type: String,
      required: [true, "El género es obligatorio"],
      enum: ["Masculino", "Femenino", "Otro"],
      default: "Otro",
    },
    especialidades: [{
      type: Schema.Types.ObjectId,
      ref: "Especialidades",
      required: [true, "Al menos una especialidad es obligatoria"],
    }],
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El usuario asociado es obligatorio"],
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

MedicoSchema.methods.getBasicInfo = function () {
  return {
    _id: this._id,
    cedula: this.cedula,
    primerNombre: this.primerNombre,
    primerApellido: this.primerApellido,
    estado: this.estado,
    especialidades: this.especialidades,
    usuario: this.usuario,
  };
};

export const MedicoModel = mongoose.model<Medico>("Medico", MedicoSchema);