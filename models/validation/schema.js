const Joi = require("joi");

const doctorSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),

  profileImage: Joi.object().keys({
    url: Joi.string(),
    cloudinaryUrl: Joi.string().pattern(
      new RegExp(
        "/(http|https)://(w+:{0,1}w*@)?(S+)(:[0-9]+)?(/|/([w#!:.?+=&%@!-/]))?/"
      )
    ),
  }),
});

const patientSchema = Joi.object({
  name: Joi.string().required(),
  doctor: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required(),
});

const reportSchema = Joi.object({
  patient: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required(),
  doctor: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required(),
  status: Joi.string().required(),
});

module.exports = {
  doctorSchema,
  patientSchema,
  reportSchema,
};
