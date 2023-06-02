import Joi from "joi";

export default {
  register: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().min(9).max(9).required(),
    location:Joi.string().required(),
    zipCode:Joi.string().required(),
    region:Joi.string().required(),

    // countryCode:Joi.string().min(2).max(2).required(),
    // password: Joi.string().required(),
    // otpCode :Joi.string().required(),
  }),
  updateUser: Joi.object().keys({
    firstName: [Joi.string().optional(), Joi.allow(null)],
    lastName: [Joi.string().optional(), Joi.allow(null)],

    email: Joi.string().email().optional(),
    phone: [Joi.string().optional(), Joi.allow(null)],
    postalAddress: [Joi.string().optional(), Joi.allow(null)],
    birthDate: Joi.date().optional(),
    zipCode: Joi.number().optional(),
    city: [Joi.string().optional(), Joi.allow(null)],
    // location:Joi.string().required(),
    kiffs: Joi.array().optional(),
    discordUserName: [Joi.string().optional(), Joi.allow(null)],
    meetLocation: [Joi.string().optional(), Joi.allow(null)],
    disabledWorker: Joi.boolean().optional(),
    relatedRevelateur: [Joi.string().optional(), Joi.allow(null)],
    registeredSPE: [Joi.string().optional(), Joi.allow(null)],
    needSupport: [Joi.string().optional(), Joi.allow(null)],
    futurGoal: [Joi.string().optional(), Joi.allow(null)],
    photo: [Joi.string().optional(), Joi.allow(null)],
    identityCard: [Joi.string().optional(), Joi.allow(null)],
    identityCardNumber: [Joi.string().optional(), Joi.allow(null)],
    professionalSituation: [Joi.string().optional(), Joi.allow(null)],
    degreeLevel: [Joi.string().optional(), Joi.allow(null)],
    gender: [Joi.string().optional(), Joi.allow(null)],
    
    progress:Joi.number().optional()
    // instagramUserName:Joi.string().required(),
    // snapChatUserName:Joi.string().required(),
    // recommentEvent:Joi.string().required(),
    // appointments:Joi.string().required(),
    // qrCodesForEvent:Joi.string().required(),
    // EventsApplied:Joi.string().required(),
    // comments:Joi.string().required(),

  })
}




// firstName: req.body.firstName,
// lastName: req.body.lastName,
// phone: req.body.phone,
// email: req.body.email,

// postalAddress: req.body.postalAddress,
// birthDate: req.body.birthDate,
// zipCode: req.body.zipCode,
// city: req.body.city,
// location: req.body.location,
// kiffs: req.body.kiffs,
// discordUserName: req.body.discordUserName,
// meetLocation: req.body.meetLocation,
// disabledWorker: req.body.disabledWorker,
// relatedRevelateur: req.body.relatedRevelateur,
// registeredSPE: req.body.registeredSPE,
// needSupport: req.body.needSupport,
// futurGoal: req.body.futurGoal,
// photo: req.body.photo,
// identityCard: req.body.identityCard,
// identityCardNumber: req.body.identityCardNumber,
// professionalSituation: req.body.professionalSituation,
// degreeLevel: req.body.degreeLevel,
// gender: req.body.gender,







// instagramUserName: string;
// snapChatUserName: string;
// recommentEvent: string;
// appointments: string;
// qrCodesForEvent: string;
// EventsApplied: string;
// comments: string;
// role:string;
