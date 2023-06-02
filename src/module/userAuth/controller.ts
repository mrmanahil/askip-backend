/* eslint-disable @typescript-eslint/no-explicit-any */
import * as express from 'express';
import {
  serverErrorHandler,
  successHandler,
  badRequestHandler,
  notFoundHandler,
  //   usersLogger,
  //   hashPassword,
  //   createToken,
  //   RefreshToken,
} from '../../utils/responseHandler';

import { usersLogger } from '../../utils/loggeer';
import { hashPassword } from '../../utils/hashPassword';
import { requestMobile, requestMail, requestMobiePass, requestMailData } from '../../utils/sendOtp';
import { createToken } from '../../utils/createToken';
import { UserModel } from './model';
// import { generate } from 'generate-password'
import mongoose from 'mongoose';

export const registerUser = async (req: express.Request, res: express.Response): Promise<void> => {

  console.log('user', req.body);
  

  // console.log("findUser",findUser)
  try {
    usersLogger.info('info logger');
    const phone = `+33${req.body.phone}`;
    const findPhone = `33${req.body.phone}`;
    // const password = generate({
    //   length: 10,
    //   numbers: true
    // });
    const password = Math.floor(1000 + Math.random() * 9000).toString();
    const findUser = await UserModel.findOne({ phone: findPhone });
    if (!findUser) {
      console.log('After', findUser);
      const createUser = new UserModel();
      // const resultt = await requestMobile(phone, password,)
      // console.log("resultt",resultt)
      // const sendPassword=password
      // const otpGenerate = Math.floor(1000 + Math.random() * 9000).toString();
      (createUser.firstName = req.body.firstName),
        (createUser.lastName = req.body.lastName),
        // createUser.email = req.body.email,
        (createUser.phone = findPhone),
        (createUser.location =req.body.location),
        (createUser.password = hashPassword(password, '10'));
        (createUser.zipCode = req.body.zipCode),
        (createUser.region = req.body.region),
      // createUser.otpCode = otpGenerate
      (createUser.otpCodeExpires = new Date().getTime() + 300 * 1000),
        (createUser.forgetConfirmationCodeExpires = new Date().getTime() + 300 * 1000);
      // const phoneNumber = findPhone
      // console.log("phoneNumber", phone)

      await createUser.save();
      const token = createToken(findPhone);
      res.cookie('token', token, {
        secure: false,
        httpOnly: true,
      });
      // console.log("resultt", resultt)
      //mobile otp mailjet
      const mobile = await requestMobiePass(phone, password);
      console.log('mobile', mobile);
      return successHandler(
        res,
        { code: password, success: true },
        'User Registered Successfully.',
      );
    }

    if (findUser && findUser.isVerified === true) {
      return badRequestHandler(res, 'User Already Exist.');
    } else {
      const phoneNumber = `+${req.body.phone}`;
      // const otpGenerate = Math.floor(1000 + Math.random() * 9000).toString();
      await UserModel.findOneAndUpdate(
        { phone: findPhone },
        {
          $set: {
            password: hashPassword(password, '10'),
            firstName: req.body.firstName,
            //  lastName:req.body.lastName,
            // otpCode: otpGenerate,
            // otpCodeExpires: new Date().getTime() + 300 * 1000
          },
        },
      );
      // mailjet mobile otp
      const mobile = await requestMobile(phoneNumber, password, findUser.firstName);
      console.log('mobile', mobile);

      const token = createToken(req.body.email.toString());
      res.cookie('token', token, {
        secure: false,
        httpOnly: true,
      });
      return successHandler(res, { code: password, success: true }, 'code send to mobile');
    }
  } catch (err) {
    serverErrorHandler(res, err);
  }
};

export const loginUser = async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('user', req.body.email);
  try {
    // const phone =  `+33${req.body.phone}`
    const findPhone = `33${req.body.phone}`;
    const User = await UserModel.findOne({ phone: findPhone })
      .select([
        'firstName',
        'lastName',
        'phone',
        'email',
        'password',
        'otpCode',
        'isVerified',
        'otpCodeExpires',
        'forgetConfirmationCode',
        'forgetConfirmationCodeExpires',
        'postalAddress',
        'birthDate',
        'zipCode',
        'city',
        'location',
        'kiffs',
        'discordUserName',
        'meetLocation',
        'disabledWorker',
        'relatedRevelateur',
        'registeredSPE',
        'needSupport',
        'futurGoal',
        'photo',
        'identityCard',
        'identityCardNumber',
        'professionalSituation',
        'degreeLevel',
        'gender',
        'instagramUserName',
        'snapChatUserName',
        'recommentEvent',
        'appointments',
        'qrCodesForEvent',
        'EventsApplied',
        'comments',
        'role',
        'isApproved',
        'semiGender',
        'progress',
      ])
      .populate({
        path: 'relatedRevelateur',
        select: ['firstName', 'lastName', 'associationName'],
      });
    console.log('findUser', User);
    if (!User) {
      return badRequestHandler(res, 'phone does not found');
    }
    if (User) {
      const password = hashPassword(req.body.password, '10');
      if (password != User.password) {
        return badRequestHandler(res, "password doesn't match");
      } else {
        if (User.isVerified == true) {
          const token = createToken(req.body.email);
          // res.cookie("token", token, {
          //   secure: false,
          //   httpOnly: true,
          // });

          // const User = {
          //   firstName: findUser.firstName,
          //   lastName: findUser.lastName,
          //   email: findUser.email,
          //   phone: findUser.phone,
          //   _id: findUser._id,
          //   isApproved: findUser.isApproved

          // }
          // const data={
          //   firstName:User.firstName,
          //   lastName:User.lastName,
          //   phone:User.phone.substring(2),
          //   email:User.email,

          //   isVerified:User.isVerified,

          //   postalAddress:User.postalAddress,
          //   birthDate:User.birthDate,
          //   zipCode:User.zipCode,
          //   city:User.city,
          //   location:User.location,
          //   kiffs:User.kiffs,
          //   discordUserName:User.discordUserName,
          //   meetLocation:User.meetLocation,
          //   disabledWorker:User.disabledWorker,
          //   relatedRevelateur:User.relatedRevelateur,
          //   registeredSPE:User.registeredSPE,
          //   needSupport:User.needSupport,
          //   futurGoal:User.futurGoal,
          //   photo:User.photo,
          //   identityCard:User.identityCard,
          //   identityCardNumber:User.identityCardNumber,
          //   professionalSituation:User.professionalSituation,
          //   degreeLevel:User.degreeLevel,
          //   gender:User.gender,
          //   instagramUserName:User.instagramUserName,
          //   snapChatUserName:User.snapChatUserName,
          //   recommentEvent:User.recommentEvent,
          //   appointments:User.appointments,
          //   qrCodesForEvent:User.qrCodesForEvent,
          //   EventsApplied:User.EventsApplied,
          //   comments:User.comments,
          //   role:User.role,
          //   isApproved:User.isApproved,
          //   semiGender:User.semiGender
          // }

          return successHandler(
            res,
            { User, token: token, success: true },
            'User Login Successfully.',
          );
        } else {
          return badRequestHandler(res, 'isVerified false');
        }
      }
    }
  } catch (err) {
    serverErrorHandler(res, err);
  }
};

export const getUser = async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('user', req.body);
  console.log('user', req.body);

  const findUser = await UserModel.findById({ _id: req.params.id })
    .select([
      'firstName',
      'lastName',
      'email',
      'phone',
      'sVerified',
      'postalAddress',
      'birthDate',
      'zipCode',
      'location',
      'kiffs',
      'discordUserName',
      'meetLocation',
      'disabledWorker',
      'relatedRevelateur',
      'registeredSPE',
      'needSupport',
      'futurGoal',
      'photo',
      'identityCard',
      'identityCardNumber',
      'professionalSituation',
      'degreeLevel',
      'gender',
      'instagramUserName',
      'snapChatUserName',
      'recommentEvent',
      'qrCodesForEvent',
      'comments',
      'role',
      'semiGender',
      'isApproved',
      'progress',
    ])
    .populate({
      path: 'relatedRevelateur',
      select: ['firstName', 'lastName', 'associationName'],
    })
    .populate('kiffs');

  // firstName: string;
  // lastName: string;
  // phone: string;
  // email: string;
  // password: string;
  // otpCode: string;
  // isVerified: boolean;
  // otpCodeExpires: number;
  // forgetConfirmationCode: string;
  // forgetConfirmationCodeExpires: number;
  // postalAddress: string;
  // birthDate: Date;
  // zipCode: string;
  // city: string;
  // location: string;
  // kiffs: [];
  // discordUserName: string;
  // meetLocation: string;
  // disabledWorker: boolean;
  // relatedRevelateur: string;
  // registeredSPE: string;
  // needSupport: string;
  // futurGoal: string;
  // photo: string;
  // identityCard: string;
  // identityCardNumber: string;
  // professionalSituation: string;
  // degreeLevel: string;
  // gender: string;
  // instagramUserName: string;
  // snapChatUserName: string;
  // recommentEvent: string;
  // appointments: string;
  // qrCodesForEvent: string;
  // EventsApplied: string;
  // comments: string;
  // role: string;
  // semiGender:string;
  // isApproved: boolean;
  console.log('findUser', findUser);

  try {
    if (findUser) {
      return successHandler(res, { User: findUser }, 'User fetched successfully');
    } else {
      return badRequestHandler(res, 'User is not found with these credintials');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const getUsers = async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('user', req.body);
  console.log('user', req.body);

  try {
    const findUser = await UserModel.find()
      .select([])
      .populate({
        path: 'relatedRevelateur',
        select: ['firstName', 'lastName', 'associationName'],
      })
      .populate('kiffs');
    console.log('findUser', findUser);
    if (findUser) {
      return successHandler(res, { Users: findUser }, 'fetched user successfully');
    } else {
      return badRequestHandler(res, 'User is not found with these credintials');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const updateUser = async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('user', req.body);
  console.log('user', req.body);

  try {
    const findAdmin = await UserModel.findById(req.params.id);
    console.log('findAdminUpdate', findAdmin);
    if (findAdmin) {
      // if (findAdmin.email && findAdmin.phone) {
      //   const data = await UserModel.findByIdAndUpdate(
      //     { _id: req.params.id }
      //     ,
      //     {
      //       $set: {
      //         firstName: req.body.firstName,
      //         lastName: req.body.lastName,
      //         // phone: `33${req.body.phone}`,
      //         // email: req.body.email,
      //         postalAddress: req.body.postalAddress,
      //         birthDate: req.body.birthDate,
      //         zipCode: req.body.zipCode,
      //         city: req.body.city,
      //         location: req.body.location,
      //         kiffs: req.body.kiffs,
      //         discordUserName: req.body.discordUserName,
      //         meetLocation: req.body.meetLocation,
      //         disabledWorker: req.body.disabledWorker,
      //         relatedRevelateur: req.body.relatedRevelateur,
      //         registeredSPE: req.body.registeredSPE,
      //         needSupport: req.body.needSupport,
      //         futurGoal: req.body.futurGoal,
      //         photo: req.body.photo,
      //         identityCard: req.body.identityCard,
      //         identityCardNumber: req.body.identityCardNumber,
      //         professionalSituation: req.body.professionalSituation,
      //         degreeLevel: req.body.degreeLevel,
      //         gender: req.body.gender,
      //       }
      //     })
      //   return successHandler(res, data, "user profile updated successfully");

      // } else if(findAdmin.phone != req.body.phone){

      // }

      // findAdmin.firstName = req.body.firstName;
      // findAdmin.lastName= req.body.lastName;

      // findAdmin.email= req.body.email;
      // findAdmin.postalAddress= req.body.postalAddress;
      // findAdmin.birthDate= req.body.birthDate;
      // findAdmin.zipCode= req.body.zipCode;
      // findAdmin.city= req.body.city;
      // findAdmin.location= req.body.location;
      // findAdmin.kiffs= req.body.kiffs;
      // findAdmin.discordUserName= req.body.discordUserName;
      // findAdmin.meetLocation= req.body.meetLocation;
      // findAdmin.disabledWorker= req.body.disabledWorker;
      // findAdmin.relatedRevelateur= req.body.relatedRevelateur;
      // findAdmin.registeredSPE= req.body.registeredSPE;
      // findAdmin.needSupport= req.body.needSupport;
      // findAdmin.futurGoal= req.body.futurGoal;
      // findAdmin.photo= req.body.photo;
      // findAdmin.identityCard= req.body.identityCard;
      // findAdmin.identityCardNumber= req.body.identityCardNumber;
      // findAdmin.professionalSituation= req.body.professionalSituation;
      // findAdmin.degreeLevel= req.body.degreeLevel;
      // findAdmin.gender= req.body.gender;
      // if(req.body.phone){
      //   findAdmin.phone = `33${req.body.phone}`;
      // }
      // const user =await findAdmin.save()

      if (req.body.phone) {
        const user = await UserModel.findByIdAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              ...req.body,
              phone: `33${req.body.phone}`,
            },
          },
          { new: true },
        );
        return successHandler(
          res,
          { data: user, success: true },
          'user profile updated successfully',
        );
      } else {
        const user = await UserModel.findByIdAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              ...req.body,
            },
          },
          { new: true },
        );
        return successHandler(
          res,
          { data: user, success: true },
          'user profile updated successfully',
        );
      }

      // console.log("data",data)
      // const User = {
      //   firstName: req.body.firstName,
      //   lastName: req.body.lastName,
      //   phone: req.body.phone,
      //   email: req.body.email,
      //   postalAddress: req.body.postalAddress,
      //   birthDate: req.body.birthDate,
      //   zipCode: req.body.zipCode,
      //   city: req.body.city,
      //   location: req.body.location,
      //   kiffs: req.body.kiffs,
      //   discordUserName: req.body.discordUserName,
      //   meetLocation: req.body.meetLocation,
      //   disabledWorker: req.body.disabledWorker,
      //   relatedRevelateur: req.body.relatedRevelateur,
      //   registeredSPE: req.body.registeredSPE,
      //   needSupport: req.body.needSupport,
      //   futurGoal: req.body.futurGoal,
      //   photo: req.body.photo,
      //   identityCard: req.body.identityCard,
      //   identityCardNumber: req.body.identityCardNumber,
      //   professionalSituation: req.body.professionalSituation,
      //   degreeLevel: req.body.degreeLevel,
      //   gender: req.body.gender
      // }
    } else {
      return badRequestHandler(res, 'User is not found with these credintials');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const deleteUser = async (req: express.Request, res: express.Response): Promise<void> => {
  //  let createEvent = new EventModel()

  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const findUser = await UserModel.findOne({ _id: req.params.id });
      if (!findUser) {
        return notFoundHandler(res, 'User not found');
      } else {
        await UserModel.deleteOne({ _id: req.params.id });
        return successHandler(res, { success: true }, 'User is deleted sucesfuuly');
      }
    } else {
      return badRequestHandler(res, 'please provide a valid id');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

// export const verfiRegisterUserOtp = async (
//   req: express.Request,
//   res: express.Response) => {
//   console.log("req.params.confirmPassword", req.body)
//   console.log("req.body", req.body)
//   const findUser = await UserModel.findOne({
//     otpCode: req.body.otpCode
//   })
//   console.log("findUser", findUser)

//   // if(findUser)
//   // {
//   //   return badRequestHandler(res, "confirmation code error");
//   // }

//   try {
//     const currentTime = new Date().getTime()
//     if (!findUser) {
//       return badRequestHandler(res, "confirmation code error");
//     }
//     if (findUser) {

//       const data = findUser.otpCodeExpires - currentTime
//       console.log("data", data)
//       if (data < 0) {
//         return badRequestHandler(res, "Otp is expired");
//       }

//       const optCodeUpdate = await UserModel.findOneAndUpdate(

//         { otpCode: req.body.otpCode }
//         ,
//         {
//           $set: {
//             isVerified: true,
//           }
//         })

//       return successHandler(res, { user: optCodeUpdate }, "user verified true");

//     }

//   }
//   catch (err) {
//     return serverErrorHandler(res, err);
//   }

// }

// export const forgetPasOtp = async (
//   req: express.Request,
//   res: express.Response
// ): Promise<void> => {

//   console.log("user", req.body);

//   const mail = req.body.email;

//   // console.log("phone",phone);
//   console.log("mail", mail)
//   // const findUser = await UserModel.findOne({}) as User
//   // console.log("findUser",findUser)
//   try {
//     if (req.body.phone) {
//       const phone = `+${req.body.countryCode.concat(req.body.phone)}`
//       const findUser = await UserModel.findOne({ phone: req.body.phone, countryCode: req.body.countryCode })
//       console.log("phone", findUser)
//       if (!findUser) {
//         return badRequestHandler(res, "phone Number is not found");
//       }
//       if (findUser) {
//         const otpGenerate = Math.floor(1000 + Math.random() * 9000).toString()

//         // sendConfirmationEmail(
//         //   findUser.email,
//         //   findUser.fullName,
//         //   otpGenerate
//         //   )
//         await requestMobile(phone, otpGenerate)
//         await UserModel.updateOne(
//           { phone: req.body.phone, countryCode: req.body.countryCode },
//           {
//             $set: {
//               forgetConfirmationCode: otpGenerate,
//               forgetConfirmationCodeExpires: new Date().getTime() + 300 * 1000
//             }
//           })
//         //  return successHandler(res, { user: updateForgetConfirmation }, "confirmation code send to email ");
//         return successHandler(res, { user: findUser }, "confirmation code send to mobile ");
//       }
//     }
//     if (req.body.email) {
//       const findUser = await UserModel.findOne({ email: req.body.email })
//       console.log("phone", findUser)
//       if (!findUser) {
//         return badRequestHandler(res, "phone with this is not found");
//       }
//       if (findUser) {
//         const otpGenerate = Math.floor(1000 + Math.random() * 9000).toString()

//         // sendConfirmationEmail(
//         //   findUser.email,
//         //   findUser.fullName,
//         //   otpGenerate
//         //   )
//         const resultt = await requestMail(req.body.email, otpGenerate)
//         const updateForgetConfirmation = await UserModel.updateOne(
//           {
//             email: req.body.email
//           },
//           {
//             $set: {
//               forgetConfirmationCode: otpGenerate,
//               forgetConfirmationCodeExpires: new Date().getTime() + 300 * 1000
//             }
//           })
//         console.log("emailSendData", resultt.response.config.data)
//         return successHandler(res, { user: updateForgetConfirmation }, "confirmation code send to email ");

//         // return successHandler(res, { user: findUser }, "confirmation code send to mobile ");
//       }
//     }
//     return badRequestHandler(res, "phone number or email fields not found");
//   }
//   catch (err) {

//     serverErrorHandler(res, err);
//   }
// };

// export const forgetPasOtpConfir = async (
//   req: express.Request,
//   res: express.Response
// ): Promise<User | void> => {
//   console.log("req.params.confirmPassword", req.params.code)
//   console.log("req.body", req.body)
//   const findUser = await UserModel.findOne({ forgetConfirmationCode: req.params.code })
//   console.log("findUser", findUser)

//   // console.log("currentTime",await findUser.forgetConfirmationCodeExpires)
//   try {
//     const currentTime = new Date().getTime()
//     if (!findUser) {
//       return badRequestHandler(res, "confirmation code error");
//     }
//     if (findUser) {
//       if (req.body.newPassword != req.body.confirmPassword) {
//         return badRequestHandler(res, "password doesn't match");
//       }

//       const data = findUser.forgetConfirmationCodeExpires - currentTime
//       console.log("data", data)
//       if (data < 0) {
//         return badRequestHandler(res, "token is expired");
//       }

//       // if(req.body.newPassword ==req.body.confirmPassword && data < 0)
//       // {
//       const password = hashPassword(req.body.newPassword, "10")

//       const updateForgetConfirmation = await UserModel.findOneAndUpdate(

//         { forgetConfirmationCode: req.params.confirmPassword }
//         ,
//         {
//           $set: {
//             password: password,
//             forgetConfirmationCode: false,
//             resetPasswordToken: false,
//           }
//         })
//       // await updateForgetConfirmation.save()
//       return successHandler(res, { user: updateForgetConfirmation }, "confirmation code send to email ");
//       // }

//     }

//   }
//   catch (err) {
//     return serverErrorHandler(res, err);
//   }
// }

export const forgetPasOtp = async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('user', req.body);
  try {
    if (req.body.phone != null) {
      const phone = `+33${req.body.phone}`;
      const findPhone = `33${req.body.phone}`;
      console.log('phone', findPhone);
      const findAdmin = await UserModel.findOne({ phone: findPhone });
      console.log('phone', findAdmin);
      if (!findAdmin) {
        return badRequestHandler(res, 'phone Number is not found');
      }
      if (findAdmin) {
        const otpGenerate = Math.floor(1000 + Math.random() * 9000).toString();

        // sendConfirmationEmail(
        //   findAdmin.email,
        //   findAdmin.fullName,
        //   otpGenerate
        //   )
        //mobile mailjet otp
        const result = await requestMobile(phone, otpGenerate, findAdmin.firstName);
        console.log('result', result.body);
        //   console.log("Mobile",await requestMobile(phone, otpGenerate))
        await UserModel.updateOne(
          { phone: findPhone },
          {
            $set: {
              forgetConfirmationCode: otpGenerate,
              forgetConfirmationCodeExpires: new Date().getTime() + 300 * 1000,
            },
          },
          { new: true },
        );
        //  return successHandler(res, { user: updateForgetConfirmation }, "confirmation code send to email ");
        return successHandler(
          res,
          { otp: otpGenerate, success: true },
          'confirmation code send to mobile ',
        );
      }
    } else if (req.body.email != null) {
      const findAdmin = await UserModel.findOne({ email: req.body.email });
      console.log('phone', findAdmin);
      if (!findAdmin) {
        return badRequestHandler(res, 'email is not found');
      }
      if (findAdmin) {
        const otpGenerate = Math.floor(1000 + Math.random() * 9000).toString();
        console.log('otpGenerate', otpGenerate);

        // sendConfirmationEmail(
        //   findAdmin.email,
        //   findAdmin.fullName,
        //   otpGenerate
        //   )
        // mailjet email otp
        const resultt = await requestMail(req.body.email, otpGenerate);
        console.log('resultt', resultt);
        // sendConfirmationEmail(findAdmin.email, findAdmin.firstName, otpGenerate)
        await UserModel.findOneAndUpdate(
          {
            email: req.body.email,
          },
          {
            $set: {
              forgetConfirmationCode: otpGenerate,
              forgetConfirmationCodeExpires: new Date().getTime() + 300 * 1000,
            },
          },
          { new: true },
        );
        // console.log("emailbody", resultt.response)
        // console.log("nodemailer", resulttt)
        // return successHandler(res, { otp: otpGenerate }, "confirmation code send to email ");

        // return successHandler(res, { user: findAdmin }, "confirmation code send to mobile ");
        return successHandler(
          res,
          { otp: otpGenerate, success: true },
          'confirmation code send to email',
        );
      }
    } else {
      return badRequestHandler(res, 'phone number or email fields not found');
    }
    return badRequestHandler(res, 'phone number or email fields not found');
  } catch (err) {
    serverErrorHandler(res, err);
  }
};

// export const forgetPasOtpConfir = async (
//   req: express.Request,
//   res: express.Response
// ): Promise<void> => {
//   console.log("req.params.confirmPassword", req.body)
//   console.log("req.body", req.body)

//   try {

//     // console.log("findUser", findUser)
//     if (req.body.phone != null)
//     {
//       const phone=`33${req.body.phone}`
//       const findUser = await UserModel.findOne({ phone: phone })
//       // const currentTime = new Date().getTime()
//       if (!findUser) {
//         return badRequestHandler(res, "phone is not found");
//       }
//       if (findUser) {
//         if (req.body.newPassword != req.body.confirmPassword) {
//           return badRequestHandler(res, "password doesn't match");
//         }
//         else{
//           const password = hashPassword(req.body.newPassword, "10")
//          console.log("password",password)
//          console.log("phone",phone)
//           const updateForgetConfirmation = await UserModel.findOneAndUpdate(

//             { phone: phone}
//             ,
//             {
//               $set: {
//                 password: password,
//               }
//             })
//             return successHandler(res, { user: updateForgetConfirmation }, "password changed sucessfully");
//         }

//         // const data = findUser.forgetConfirmationCodeExpires - currentTime
//         // console.log("data", data)
//         // if (data < 0) {
//         //   return badRequestHandler(res, "token is expired");
//         // }

//         // if(req.body.newPassword ==req.body.confirmPassword && data < 0)
//         // {

//         // await updateForgetConfirmation.save()

//         // }

//       }
//     }
//     else{
//       const findUser = await UserModel.findOne({ email: req.body.email })
//       // const currentTime = new Date().getTime()
//       // console.log("finsUser",findUser)
//       if (!findUser) {
//         return badRequestHandler(res, "email is not found");
//       }
//       if (findUser) {
//         if (req.body.newPassword != req.body.confirmPassword) {
//           return badRequestHandler(res, "password doesn't match");
//         }
//         else{
//           const password = hashPassword(req.body.newPassword, "10")

//           const updateForgetConfirmation = await UserModel.findOneAndUpdate(

//             { email: req.body.email }
//             ,
//             {
//               $set: {
//                 password: password,

//               }
//             })
//             return successHandler(res, { user: updateForgetConfirmation }, "confirmation code send to email ");
//         }

//         // const data = findUser.forgetConfirmationCodeExpires - currentTime
//         // console.log("data", data)
//         // if (data < 0) {
//         //   return badRequestHandler(res, "token is expired");
//         // }

//         // if(req.body.newPassword ==req.body.confirmPassword && data < 0)
//         // {

//         // await updateForgetConfirmation.save()

//         // }

//       }
//     }
//     // else{
//     //   return badRequestHandler(res, "please enter email or phone number");
//     // }

//   }
//   catch (err) {
//     return serverErrorHandler(res, err);
//   }
// }

// firstName: string;
// lastName: string;
// phone: string;
// email: string;
// password: string;
// otpCode: string;
// // countryCode: string;
// isVerified: boolean;
// otpCodeExpires: number;
// forgetConfirmationCode: string;
// forgetConfirmationCodeExpires: number;
// postalAddress: string;
// birthDate: Date;
// zipCode: number;
// city: string;
// location:string;
// kiffs: string;
// discordUserName: string;
// meetLocation: string;
// disabledWorker: boolean;
// relatedRevelateur: string;
// registeredSPE: string;
// needSupport: string;
// futurGoal: string;
// photo: string;
// identityCard: string;
// identityCardNumber: string;
// professionalSituation: string;
// degreeLevel: string;
// gender: string;
// instagramUserName: string;
// snapChatUserName: string;
// recommentEvent: string;
// appointments: string;
// qrCodesForEvent: string;
// EventsApplied: string;
// comments: string;
// role:string;

export const verfiUserForgetOtp = async (req: express.Request, res: express.Response) => {
  // console.log("req.params.confirmPassword", req.body);
  // console.log("req.body", req.body);
  console.log('req.body', req.body.email);

  try {
    const phone = `33${req.body.phone}`;
    console.log('phone', phone);
    const currentTime = new Date().getTime();
    if (req.body.phone != null) {
      const findUser = await UserModel.findOne({
        phone: phone,
        forgetConfirmationCode: req.body.otpCode,
      });
      if (!findUser) {
        return badRequestHandler(res, 'confirmation code error or phone number is not correct');
      }
      if (findUser) {
        const data = findUser.forgetConfirmationCodeExpires - currentTime;
        console.log('data', data);
        if (data < 0) {
          return badRequestHandler(res, 'Otp is expired');
        }

        return successHandler(res, { user: findUser.phone, success: true }, 'user verified true');
      }
    } else if (req.body.email != null) {
      const findUser = await UserModel.findOne({
        email: req.body.email,
        forgetConfirmationCode: req.body.otpCode,
      });
      if (!findUser) {
        return badRequestHandler(res, 'confirmation code error email is not found');
      }
      if (findUser) {
        const data = findUser.forgetConfirmationCodeExpires - currentTime;
        console.log('data', data);
        if (data < 0) {
          return badRequestHandler(res, 'Otp is expired');
        }

        return successHandler(res, { user: findUser.email }, 'user verified true');
      }
    } else {
      return badRequestHandler(res, 'phone number or email fields not found');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const forgetPasOtpConfir = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  console.log('req.params.confirmPassword', req.body);
  console.log('req.body', req.body);

  try {
    // console.log("findUser", findUser)
    if (req.body.phone != null) {
      const phone = `33${req.body.phone}`;
      const findUser = await UserModel.findOne({ phone: phone });
      // const currentTime = new Date().getTime()
      if (!findUser) {
        return badRequestHandler(res, 'phone is not found');
      }
      if (findUser) {
        if (req.body.newPassword != req.body.confirmPassword) {
          return badRequestHandler(res, "password doesn't match");
        } else {
          const password = hashPassword(req.body.newPassword, '10');
          console.log('password', password);
          console.log('phone', phone);
          await UserModel.findOneAndUpdate(
            { phone: phone },
            {
              $set: {
                password: password,
              },
            },
          );
          return successHandler(res, { success: true }, 'password changed sucessfully');
        }

        // const data = findUser.forgetConfirmationCodeExpires - currentTime
        // console.log("data", data)
        // if (data < 0) {
        //   return badRequestHandler(res, "token is expired");
        // }

        // if(req.body.newPassword ==req.body.confirmPassword && data < 0)
        // {

        // await updateForgetConfirmation.save()

        // }
      }
    } else if (req.body.email != null) {
      const findUser = await UserModel.findOne({ email: req.body.email });
      // const currentTime = new Date().getTime()
      // console.log("finsUser",findUser)
      if (!findUser) {
        return badRequestHandler(res, 'email is not found');
      }
      if (findUser) {
        if (req.body.newPassword != req.body.confirmPassword) {
          return badRequestHandler(res, "password doesn't match");
        } else {
          const password = hashPassword(req.body.newPassword, '10');
          const data = await UserModel.findOneAndUpdate(
            { email: req.body.email },
            {
              $set: {
                password: password,
              },
            },
          );
          console.log(data);
          return successHandler(res, { success: true }, 'password changed sucessfully');
        }

        // const data = findUser.forgetConfirmationCodeExpires - currentTime
        // console.log("data", data)
        // if (data < 0) {
        //   return badRequestHandler(res, "token is expired");
        // }

        // if(req.body.newPassword ==req.body.confirmPassword && data < 0)
        // {

        // await updateForgetConfirmation.save()

        // }
      }
    } else {
      return badRequestHandler(res, 'phone number or email fields not found');
    }
    // else{
    //   return badRequestHandler(res, "please enter email or phone number");
    // }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const consultData = async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('user', req.body.email);
  try {
    const findUser = await UserModel.findOne({ email: req.body.email }).select([
      'password',
      'isVerified',
      'firstName',
      'lastName',
      'email',
      'phone',
      'gender',
      '_id',
    ]);
    console.log('findUser', findUser);
    if (!findUser) {
      return badRequestHandler(res, 'email does not found');
    }
    if (findUser) {
      const password = hashPassword(req.body.password, '10');
      if (password != findUser.password) {
        return badRequestHandler(res, "password doesn't match");
      } else {
        if (findUser.isVerified == true) {
          return successHandler(res, 'verfied user');
        } else {
          return badRequestHandler(res, 'email does not exits');
        }
      }
    }
  } catch (err) {
    serverErrorHandler(res, err);
  }
};

export const emailCheck = async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('user', req.body);

  try {
    const findUser = await UserModel.findOne({ email: req.body.checkingEmail }).select([
      'password',
      'isVerified',
      'firstName',
      'lastName',
      'email',
      'phone',
      'gender',
      '_id',
    ]);
    if (!findUser) {
      return successHandler(res, { success: true }, 'valid email');
    }
    // console.log("findUser", findUser)
    else if (findUser) {
      // return badRequestHandler(res, "email already exits");
      const userData = await UserModel.findOne({
        $and: [{ _id: req.body.id }, { email: req.body.email }],
      }).select([
        'password',
        'isVerified',
        'firstName',
        'lastName',
        'email',
        'phone',
        'gender',
        '_id',
      ]);

      console.log('userData', userData);
      if (userData?.email == null && req.body.checkingEmail == null) {
        return badRequestHandler(res, 'Enter your email');
      }

      if (userData?.email == null) {
        const findEmail = await UserModel.findOne({ email: req.body.checkingEmail }).select([
          'password',
          'isVerified',
          'firstName',
          'lastName',
          'email',
          'phone',
          'gender',
          '_id',
        ]);
        if (findEmail) {
          return badRequestHandler(res, 'email already used by another user');
        }
        if (!findEmail) {
          return successHandler(res, { success: true }, 'valid email');
        } else {
          return badRequestHandler(res, 'null error');
        }
      }

      if (userData?.email != null) {
        if (findUser.email == userData?.email) {
          return successHandler(res, { success: true }, 'valid email');
        } else {
          return badRequestHandler(res, 'email already used by another user');
        }
      } else {
        return badRequestHandler(res, 'duplicate emails not allowed');
      }
    } else {
      return badRequestHandler(res, 'duplicate emailis not allowed');
    }
  } catch (err) {
    serverErrorHandler(res, err);
  }
};

export const emailLinkSend = async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('user', req.body.phone);
  try {
    if (req.body.email != null) {
      const findAdmin = await UserModel.findOne({ email: req.body.email });
      console.log('phone', findAdmin);
      if (!findAdmin) {
        return badRequestHandler(res, 'email is not found');
      }
      if (findAdmin) {
        const otpGenerate = Math.floor(1000 + Math.random() * 9000).toString();
        //mailjet email otp
        await requestMailData(req.body.email, req.body.data);
        // const resulttt = sendDataEmail (findAdmin.email, req.body.data)
        // await UserModel.updateOne(
        //   {
        //     email: req.body.email
        //   },
        //   {
        //     $set: {
        //       forgetConfirmationCode: otpGenerate,
        //       forgetConfirmationCodeExpires: new Date().getTime() + 300 * 1000
        //     }
        //   })
        // console.log("mailjet", resultt.response)
        // console.log("nodemailer", resulttt)
        // return successHandler(res, { otp: otpGenerate }, "confirmation code send to email ");

        // return successHandler(res, { user: findAdmin }, "confirmation code send to mobile ");
        return successHandler(
          res,
          { link: otpGenerate, data: req.body.data, success: true },
          'link send to your email',
        );
      }
    } else {
      return badRequestHandler(res, 'phone number or email fields not found');
    }
  } catch (err) {
    serverErrorHandler(res, err);
  }
};

export const phoneCheck = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    console.log('user', req.body.phone);

    const phone = `33${req.body.phone}`;
    const findUser = await UserModel.findOne({ phone: phone }).select([
      'password',
      'isVerified',
      'firstName',
      'lastName',
      'email',
      'phone',
      'gender',
      '_id',
    ]);
    console.log('findUser', findUser);
    if (findUser) {
      return badRequestHandler(res, 'phone already exits');
    } else {
      return successHandler(res, { success: true }, 'phone is valid');
    }
  } catch (err) {
    serverErrorHandler(res, err);
  }
};

export const changePassword = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const userData = await UserModel.findById({ _id: req.params.id }).select('password');
    if (!userData) {
      return notFoundHandler(res, 'User not Found');
    }
    console.log('userData', userData);
    console.log('req.body.oldPassword', userData.password);
    // let oldPassword = hashPassword(req.body.oldPassword, "10")
    console.log('oldPassword', hashPassword(req.body.oldPassword, '10'));
    if (userData.password != hashPassword(req.body.oldPassword, '10')) {
      return badRequestHandler(res, 'old password does not match');
    }

    if (req.body.newPassword != req.body.confirmPassword) {
      return badRequestHandler(res, 'password does not match');
    }

    userData.password = hashPassword(req.body.newPassword, '10');
    userData.save();
    successHandler(res, 'password changed sucessfully');
    console.log('userData.password', userData.password);
  } catch (err) {
    serverErrorHandler(res, err);
  }
};

export const checkingSteps = async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('user', req.params.id);
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const userData = await UserModel.findById({ _id: req.params.id });
      if (!userData) {
        return badRequestHandler(res, 'user not found with this userId');
      } else {
        if (
          userData.firstName != null &&
          userData.email &&
          userData.kiffs.length > 0 &&
          userData.relatedRevelateur != null
        ) {
          return successHandler(res, '100 % profile complete');
        } else {
          return badRequestHandler(res, 'please update your profile');
        }
      }
    } else {
      return badRequestHandler(res, 'please provide valid id format');
    }
  } catch (err) {
    serverErrorHandler(res, err);
  }
};

export const checkingAge = async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('user', req.params.id);
  try {
    const milliSecondsInASecond = 1000;
    const hoursInADay = 24;
    const minutesInAnHour = 60;
    const SecondsInAMinute = 60;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const userData = await UserModel.findById({ _id: req.params.id });
      if (!userData) {
        return badRequestHandler(res, 'given user with that id is not found');
      } else {
        if (userData.birthDate == null) {
          return badRequestHandler(res, 'birth date is null');
        } else {
          const dateNow = new Date().getTime();
          const dateOfBirth = new Date(userData.birthDate).getTime();
          const timeRem = dateNow - dateOfBirth;
          const daysToDday = Math.floor(
            timeRem / (milliSecondsInASecond * minutesInAnHour * SecondsInAMinute * hoursInADay),
          );
          const age = Math.floor(daysToDday / 365);
          console.log('years', age);
          if (age >= 18) {
            return successHandler(
              res,
              { age: age, eighteenAbove: true },
              'fetched subsribe event with that id',
            );
          } else {
            return successHandler(
              res,
              { age: age, eighteenAbove: false },
              'fetched subsribe event with that id',
            );
          }
        }
      }
    } else {
      return badRequestHandler(res, 'please provide valid id format');
    }
  } catch (err) {
    serverErrorHandler(res, err);
  }
};

export const updateFcmToken = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  console.log('user', req.params.id);
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const findUser = await UserModel.findById({ _id: req.params.id });
      console.log('findUser', findUser);
      if (!findUser) {
        return badRequestHandler(res, 'user does not exits');
      } else {
        await UserModel.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              fcmToken: req.body.fcmToken,
            },
          },
        );
      }
      return successHandler(res, { success: true }, 'password changed sucessfully');
    } else {
      return badRequestHandler(res, 'please provide a valid id');
    }
  } catch (err) {
    serverErrorHandler(res, err);
  }
};

export const checkKiff = async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('user', req.params.id);
  try {
    const user = await UserModel.findById(req.params.id).populate('kiffs');
    if (user) {
      if (user) {
        const kiff = user.kiffs.filter((x:any) => {
          return x.name.toLowerCase() === 'e-sport';
        });
        if (kiff.length > 0) {
          return successHandler(res, { isKiff: true }, 'E-sport kiff available');
        } else {
          return successHandler(res, { isKiff: false }, 'E-sport kiff not available');

        }
      }
    } else {
      return badRequestHandler(res, 'User not found with this userId');
    }
  } catch (err) {
    serverErrorHandler(res, err);
  }
};
