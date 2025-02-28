import mongoose, { Schema } from "mongoose";
import { Administrativos } from "types/AdministrativosTypes";

const AdministrativosSchema: Schema = new Schema<Administrativos>(
  {
    cedula: {
      type: String,
      required: [true, "La cédula es obligatoria"],
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Formato de cédula inválido"], // Example validation for ID (10 digits)
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
          return value <= new Date(); // Ensures date is not in the future
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
      match: [/^\d{7,10}$/, "Formato de teléfono inválido"], // Example validation for phone (7-10 digits)
    },
    celular: {
      type: String,
      required: [true, "El celular es obligatorio"],
      trim: true,
      match: [/^\d{10}$/, "Formato de celular inválido"], // Example validation for cell phone (10 digits)
    },
    genero: {
      type: String,
      required: [true, "El género es obligatorio"],
      enum: ["Masculino", "Femenino", "Otro"],
      default: "Otro",
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
    cedula: this.cedula,
    primerNombre: this.primerNombre,
    primerApellido: this.primerApellido,
    profesion: this.profesion,
    estado: this.estado,
  };
};

export const AdministrativosModel = mongoose.model<Administrativos>("Administrativos", AdministrativosSchema);