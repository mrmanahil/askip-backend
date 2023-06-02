import * as express from 'express';
import mongoose from 'mongoose';

import {
  serverErrorHandler,
  successHandler,
  badRequestHandler,
  notFoundHandler,
} from '../../utils/responseHandler';

import { hashPassword } from '../../utils/hashPassword';
import { createToken } from '../../utils/createToken';
import { requestMail, requestMailData, requestMobile } from '../../utils/sendOtp';
import { RevelateurModel } from './model';
// import { RevelateurModel } from "./model";
// import { createToken } from "../../utils/createToken";

// export const registerRevelateur = async (
//   req: express.Request,
//   res: express.Response
// ): Promise<void> => {
//   console.log("user", req.body);
//   try {
//     const findRevelateur = await RevelateurModel.findOne({
//       email: req.body.email,
//     });

//     console.log("findRevelateur",findRevelateur)

//     if(!findRevelateur){
//     const createRevelateur = new RevelateurModel()
//     createRevelateur.lastName= req.body.lastName,
//     createRevelateur.firstName=req.body.firstName,
//     createRevelateur.email=req.body.email,
//     createRevelateur.phoneNumber=req.body.phoneNumber,
//     createRevelateur.registeredEvents=req.body.registeredEvents,
//     createRevelateur.associationName=req.body.associationName,
//     createRevelateur.kiffs=req.body.kiffs,
//     createRevelateur.photo=req.body.photo,
//     createRevelateur.talents=req.body.talents,
//     createRevelateur.appointments=req.body.appointments
//     createRevelateur.comments=req.body.comments
//     createRevelateur.reports=req.body.reports
//     createRevelateur.status=req.body.status
//     await createRevelateur.save()

//     return successHandler(res,createRevelateur , "Revelatur sucesfully created");

//     // comments:string;
//     // reports:string;
//     // status:string;

//     }
//     else{
//       return badRequestHandler(res, "Revelatur alredy exits");
//     }

//   } catch (err) {
//     return serverErrorHandler(res, err);
//   }
// };

export const registerRevelateur = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  console.log('req.user', req.user);
  console.log('user', req.body);

  try {
    const findRevelateur = await RevelateurModel.findOne({ email: req.body.email });
    if (!findRevelateur) {
      console.log('HELLLLLO', hashPassword(req.body.password, '10'));
      const createReveleature = new RevelateurModel();
      (createReveleature.email = req.body.email),
        (createReveleature.phoneNumber = req.body.phoneNumber),
        (createReveleature.firstName = req.body.firstName),
        (createReveleature.lastName = req.body.lastName),
        // (createReveleature.associationName = req.body.associationName),
        (createReveleature.password = hashPassword(req.body.password, '10'));
      await createReveleature.save();
      const token = createToken(req.body.email.toString());
      res.cookie('token', token, {
        secure: false,
        httpOnly: true,
      });

      return successHandler(
        res,
        { reveleature: createReveleature },
        'findRevelateur  Registered Successfully.',
      );
    } else {
      return badRequestHandler(res, 'Revelatur alredy exits');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const loginRevelateur = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  console.log('user', req.body);
  const findRevelateur = await RevelateurModel.findOne({ email: req.body.email })
    .select([
      '_id',
      'password',
      'isVerified',
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'role',
      'registeredEvents',
      'associationName',
      'kiffs',
      'photo',
      'talents',
      'appointments',
      'comments',
      'reports',
      'status',
      'isVerified',
    ])
    .populate('kiffs');

  // lastName: string;//required
  // firstName: string;//required
  // email: string;//required
  // phoneNumber: number;//required
  // registeredEvents: string;
  // associationName: string; //required
  // kiffs: string;
  // photo: string;
  // talents: string;
  // appointments: string;
  // comments: string;
  // reports: string;
  // status: string;
  // password: string;
  // isVerified: boolean
  // forgetConfirmationCode: string;
  // forgetConfirmationCodeExpires: number;
  // role: string;

  console.log('findRevelateur', findRevelateur);

  try {
    if (!findRevelateur) {
      return badRequestHandler(res, 'email does not found');
    }
    if (findRevelateur) {
      const password = hashPassword(req.body.password, '10');
      if (password != findRevelateur.password) {
        return badRequestHandler(res, "password doesn't match");
      } else {
        return successHandler(
          res,
          {
            revelateur: {
              _id: findRevelateur._id,

              isVerified: findRevelateur.isVerified,
              firstName: findRevelateur.firstName,
              lastName: findRevelateur.lastName,
              email: findRevelateur.email,
              phoneNumber: findRevelateur.phoneNumber,
              role: findRevelateur.role,
              registeredEvents: findRevelateur.registeredEvents,
              associationName: findRevelateur.associationName,
              kiffs: findRevelateur.kiffs,
              photo: findRevelateur.photo,
              talents: findRevelateur.talents,
              appointments: findRevelateur.appointments,
              comments: findRevelateur.comments,
              reports: findRevelateur.reports,
              status: findRevelateur.status,
            },
          },
          'Revelateur Login Successfully.',
        );

        // if (findRevelateur.isVerified == true) {
        //   const token = createToken(req.body.email.toString());
        //   res.cookie("token", token, {
        //     secure: false,
        //     httpOnly: true,
        //   });

        // //   "findRevelateur": {
        // //     "_id": "634ea7c575b1d6ff560b4e31",
        // //     "fullName": "fullName",
        // //     "phone": "5345345",
        // //     "password": "c4d21cd678d42c0848b46f4693c8d4217242668fc77cd25da1932c04f4f80852",
        // //     "isVerified": true
        // // }
        //   return successHandler(
        //     res,
        //     { admin:{
        //       firstName:findRevelateur.firstName,
        //       phone:findRevelateur.phoneNumber,
        //       _id:findRevelateur._id,
        //       isVerified:findRevelateur.isVerified
        //     } },
        //     "Revelateur Login Successfully."
        //   );
        // } else {
        //   return badRequestHandler(res, "isVerified false");
        // }
        // if(findRevelateur.isVerified == false)
        // {
        //   const token = createToken(req.body.email.toString());
        //   res.cookie("token", token, {
        //     secure: false,
        //     httpOnly: true,
        //   });
        //   return  badRequestHandler(res, "please verified user with otp");

        // }
      }
      //  if(password == findRevelateur.password)
      //  {

      //  }

      //  if(password == findRevelateur.password)
      //  {

      //  }
      //  successHandler(res, { admin: findRevelateur }, "Admin Login Successfully.");
    }

    //  if(findRevelateur)
    //  {

    //  }
  } catch (err) {
    serverErrorHandler(res, err);
  }
};

export const createRevelateur = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  console.log('user', req.body);
  try {
    const findRevelateur = await RevelateurModel.findOne({
      email: req.body.email,
    });

    console.log('findRevelateur', findRevelateur);

    if (!findRevelateur) {
      const createRevelateur = new RevelateurModel();
      (createRevelateur.lastName = req.body.lastName),
        (createRevelateur.firstName = req.body.firstName),
        (createRevelateur.email = req.body.email),
        (createRevelateur.phoneNumber = req.body.phoneNumber),
        (createRevelateur.registeredEvents = req.body.registeredEvents),
        (createRevelateur.associationName = req.body.associationName),
        (createRevelateur.password = req.body.password),
        (createRevelateur.kiffs = req.body.kiffs),
        (createRevelateur.photo = req.body.photo),
        (createRevelateur.talents = req.body.talents),
        (createRevelateur.appointments = req.body.appointments);
      createRevelateur.comments = req.body.comments;
      createRevelateur.reports = req.body.reports;
      createRevelateur.status = req.body.status;
      await createRevelateur.save();

      return successHandler(res, createRevelateur, 'Revelatur sucesfully created');

      // comments:string;
      // reports:string;
      // status:string;
    } else {
      return badRequestHandler(res, 'Revelatur alredy exits');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const getRevelateurById = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const findCreateRevelateurById = await RevelateurModel.findById(req.params.id).select([
        'firstName',
        'lastName',
      ]);
      if (!findCreateRevelateurById) {
        return badRequestHandler(res, 'Revelatur id not exits');
      } else {
        return successHandler(res, findCreateRevelateurById, 'Revelatur sucessfully fetched by id');
      }
    } else {
      return badRequestHandler(res, 'id format is not supported');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const getRevelateur = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const findRevelateur = await RevelateurModel.find().select(['firstName', 'lastName']);
    if (findRevelateur) {
      return successHandler(
        res,
        { findRevelateur, success: true },
        'Revelatur list sucessfully fetched',
      );
    } else {
      return badRequestHandler(res, "Revelatur doesn't exits");
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const updateRevelateurById = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  console.log('mongoose.Types.ObjectId.isValid(req.params.id)', req.body.phone);
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const findCreateRevelateurById = await RevelateurModel.findById(req.params.id);
      if (!findCreateRevelateurById) {
        return badRequestHandler(res, 'Revelatur doesnot exits');
      } else {
        const revelature = await RevelateurModel.findByIdAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              lastName: req.body.lastName,
              firstName: req.body.firstName,
              email: req.body.email,
              phoneNumber: req.body.phone,
              registeredEvents: req.body.registeredEvents,
              associationName: req.body.associationName,
              kiffs: req.body.kiffs,
              photo: req.body.photo,
              talents: req.body.talents,
              appointments: req.body.appointments,
              comments: req.body.comments,
              reports: req.body.reports,
              status: req.body.status,
            },
          },
          { new: true },
        ).populate('kiffs');
        // console.log("revelature?.kiffs",revelature)
        const revelatureObject = {
          _id: revelature?._id,
          lastName: revelature?.lastName,
          firstName: revelature?.firstName,
          email: revelature?.email,
          phone: revelature?.phoneNumber,
          registeredEvents: revelature?.registeredEvents,
          associationName: revelature?.associationName,
          kiffs: revelature?.kiffs,
          photo: revelature?.photo,
          talents: revelature?.talents,
          appointments: revelature?.appointments,
          comments: revelature?.comments,
          reports: revelature?.reports,
          status: revelature?.status,
        };
        return successHandler(res, revelatureObject, 'Revelatur sucesfully fetched by id');
      }
    } else {
      return badRequestHandler(res, 'id type errror');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const deleteRevelateurById = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const findCreateRevelateurById = await RevelateurModel.findById(req.params.id);
      if (!findCreateRevelateurById) {
        return badRequestHandler(res, 'Revelatur doesnot exits');
      } else {
        // const password = hashPassword(req.body.password, "10")
        const revelateurDlete = await RevelateurModel.findByIdAndDelete({ _id: req.params.id });
        if (!revelateurDlete) {
          return badRequestHandler(res, "password deoesn't match");
        }
        else {
          console.log("deleteOneAdmin", revelateurDlete)
          return successHandler(res, revelateurDlete, "Revelatur is deleted sucesfuuly");
        }
        // return successHandler(res, revelateurDlete, "Revelatur is deleted sucesfuuly");
      }
    } else {
      return badRequestHandler(res, 'id format is not supported');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

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
//       const findUser = await RevelateurModel.findOne({ phone: req.body.phone, countryCode: req.body.countryCode })
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
//         await RevelateurModel.updateOne(
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
//       const findUser = await RevelateurModel.findOne({ email: req.body.email })
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
//         const updateForgetConfirmation = await RevelateurModel.updateOne(
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

export const forgetPasOtp = async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('user', req.body.phone);
  try {
    if (req.body.phone != null) {
      const phone = `+33${req.body.phone}`;
      const findAdmin = await RevelateurModel.findOne({ phone: req.body.phone });
      console.log('phone', findAdmin);
      if (!findAdmin) {
        return badRequestHandler(res, 'phone Number is not found');
      }
      if (findAdmin) {
        // sendConfirmationEmail(
        //   findAdmin.email,
        //   findAdmin.fullName,
        //   otpGenerate
        //   )
        const otpGenerate = Math.floor(1000 + Math.random() * 9000).toString();
        console.log('otpGenerate', otpGenerate);
        const result = await requestMobile(phone, otpGenerate, findAdmin.firstName);
        console.log('result', result.body);
        // console.log("Mobile",await requestMobile(phone, otpGenerate))
        await RevelateurModel.updateOne(
          { phone: req.body.phone },
          {
            $set: {
              forgetConfirmationCode: otpGenerate,
              forgetConfirmationCodeExpires: new Date().getTime() + 300 * 1000,
            },
          },
        );
        //  return successHandler(res, { user: updateForgetConfirmation }, "confirmation code send to email ");
        return successHandler(res, { otp: otpGenerate }, 'confirmation code send to mobile ');
      }
    } else if (req.body.email != null) {
      const findAdmin = await RevelateurModel.findOne({ email: req.body.email });
      console.log('phone', findAdmin);
      if (!findAdmin) {
        return badRequestHandler(res, 'email with this is not found');
      }
      if (findAdmin) {
        const otpGenerate = Math.floor(1000 + Math.random() * 9000).toString();

        // sendConfirmationEmail(
        //   findAdmin.email,
        //   findAdmin.fullName,
        //   otpGenerate
        //   )
        // sendConfirmationEmail
        await requestMail(req.body.email, otpGenerate);
        // sendConfirmationEmail(findAdmin.email, findAdmin.firstName, otpGenerate)
        await RevelateurModel.updateOne(
          {
            email: req.body.email,
          },
          {
            $set: {
              forgetConfirmationCode: otpGenerate,
              forgetConfirmationCodeExpires: new Date().getTime() + 300 * 1000,
            },
          },
        );
        // console.log("emailbody", resulttt)
        return successHandler(res, { otp: otpGenerate }, 'confirmation code send to email ');

        // return successHandler(res, { user: findAdmin }, "confirmation code send to mobile ");
        // return successHandler(res, resultt.response.data, "confirmation code send to mobile ");
      }
    } else {
      return badRequestHandler(res, 'phone number or email fields not found');
    }
    return badRequestHandler(res, 'phone number or email fields not found');
  } catch (err) {
    serverErrorHandler(res, err);
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
      const findUser = await RevelateurModel.findOne({ phoneNumber: req.body.phone });
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
          const updateForgetConfirmation = await RevelateurModel.findOneAndUpdate(
            { phoneNumber: req.body.phone },
            {
              $set: {
                password: password,
              },
            },
          );
          return successHandler(
            res,
            { user: updateForgetConfirmation },
            'password changed sucessfully',
          );
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
      const findUser = await RevelateurModel.findOne({ email: req.body.email });
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

          const updateForgetConfirmation = await RevelateurModel.findOneAndUpdate(
            { email: req.body.email },
            {
              $set: {
                password: password,
              },
            },
          );
          return successHandler(
            res,
            { user: updateForgetConfirmation },
            'confirmation code send to email ',
          );
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
    }
    // else{
    //   return badRequestHandler(res, "please enter email or phone number");
    // }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const verfiRevelaturForgetOtp = async (req: express.Request, res: express.Response) => {
  console.log('req.params.confirmPassword', req.body);
  console.log('req.body', req.body);

  try {
    const phone = `33${req.body.phone}`;
    console.log('phone', phone);
    const currentTime = new Date().getTime();
    console.log('phoneeee', req.body);

    if (req.body.phone != null) {
      console.log('nuunot');

      const findUser = await RevelateurModel.findOne({
        phoneNumber: req.body.phone,
        forgetConfirmationCode: req.body.otpCode,
      });
      console.log('findUser', findUser);
      if (!findUser) {
        return badRequestHandler(res, 'confirmation code error or phone number is not correct');
      }
      if (findUser) {
        const data = findUser.forgetConfirmationCodeExpires - currentTime;
        console.log('data', data);
        if (data < 0) {
          return badRequestHandler(res, 'Otp is expired');
        }

        return successHandler(res, { user: findUser.email }, 'admin verified true');
      }
    } else {
      const findUser = await RevelateurModel.findOne({
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

        return successHandler(res, { user: findUser.email }, 'admin verified true');
      }
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const changePassword = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const userObj = req.params.id;
    console.log('userObj Data', userObj);
    const userData = await RevelateurModel.findById({ _id: userObj }).select('password');
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

export const consultData = async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('user', req.body.email);
  try {
    const findUser = await RevelateurModel.findOne({ email: req.body.email }).select([
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
      return badRequestHandler(res, 'email does not found');
    }
    if (findUser) {
      const password = hashPassword(req.body.password, '10');
      if (password != findUser.password) {
        return badRequestHandler(res, "password doesn't match");
      } else {
        if (findUser.isVerified === true) {
          return successHandler(res, {}, 'verfied user');
        } else {
          return badRequestHandler(res, 'email does not exits');
        }
      }
    }
  } catch (err) {
    serverErrorHandler(res, 'image error');
  }
};

export const emailLinkSend = async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('user', req.body.phone);
  try {
    if (req.body.email != null) {
      const findAdmin = await RevelateurModel.findOne({ email: req.body.email });
      console.log('phone', findAdmin);
      if (!findAdmin) {
        return badRequestHandler(res, 'email is not found');
      }
      if (findAdmin) {
        const otpGenerate = Math.floor(1000 + Math.random() * 9000).toString();
        //mailjet email otp
        await requestMailData(req.body.email, req.body.data);
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
