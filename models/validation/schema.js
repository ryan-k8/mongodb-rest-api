const Joi = require("joi");

const doctorSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(20).required(),

  profileImage: Joi.object().keys({
    url: Joi.string(),
    cloudinaryUrl: Joi.string().pattern(
      new RegExp(
        "/(http|https)://(w+:{0,1}w*@)?(S+)(:[0-9]+)?(/|/([w#!:.?+=&%@!-/]))?/"
      )
    ),
  }),
}).unknown();

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const patientSchema = Joi.object({
  name: Joi.string().required(),
  doctor: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required(),
});

const reportSchema = Joi.object({
  patient: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required(),
  doctor: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required(),
  status: Joi.string()
    .valid(
      ...[
        "negative",
        "travelled-quarantine",
        "symptoms-quarantine",
        "positive-admit",
      ]
    )
    .required(),
});

const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

const passwordSchema = Joi.object({
  password: Joi.string().min(8).max(20).required(),
});

const objectIdSchema = Joi.string()
  .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
  .message("invalid id type")
  .required();

module.exports = {
  doctorSchema,
  patientSchema,
  reportSchema,
  loginSchema,
  emailSchema,
  passwordSchema,
  objectIdSchema,
};
