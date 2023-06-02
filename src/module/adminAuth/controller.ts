import * as express from 'express';
import {
  serverErrorHandler,
  successHandler,
  badRequestHandler,
  notFoundHandler,
} from '../../utils/responseHandler';
import { hashPassword } from '../../utils/hashPassword';
import { requestMail, requestMailData, requestMobile } from '../../utils/sendOtp';
import { createToken } from '../../utils/createToken';
import { AdminModel } from './model';

import * as fs from 'fs';
// import  XLSX from 'xlsx'
import mongoose from 'mongoose';



// const XLSX = require('xlsx');

export const registerAdmin = async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('req.user', req.user);
  console.log('user', req.body);
  const findAdmin = await AdminModel.findOne({ email: req.body.email });

  try {
    if (!findAdmin) {
      const createAdmin = new AdminModel(req.body);

      const otpGenerate = Math.floor(1000 + Math.random() * 9000).toString();

      (createAdmin.email = req.body.email),
        (createAdmin.firstName = req.body.firstName),
        (createAdmin.lastName = req.body.lastName),
        (createAdmin.phone = req.body.phone),
        (createAdmin.password = hashPassword(req.body.password, '10'));
      createAdmin.otpCode = otpGenerate;
      createAdmin.otpCodeExpires = new Date().getTime() + 300 * 1000;
      // const resultt = await requestMobile("+33600000000", otpGenerate);
      await createAdmin.save();
      const token = createToken(req.body.email.toString());
      res.cookie('token', token, {
        secure: false,
        httpOnly: true,
      });
      // console.log("resultt", resultt.body);
      return successHandler(res, { admin: createAdmin }, 'Admin Registered Successfully.');
    }
    if (findAdmin && findAdmin.isVerified == true) {
      return badRequestHandler(res, 'Admin Already Exist.');
    }
    if (findAdmin && findAdmin.isVerified == false) {
      const otpGenerate = Math.floor(1000 + Math.random() * 9000).toString();
      await AdminModel.findOneAndUpdate(
        { email: req.body.email },
        {
          $set: {
            password: hashPassword(req.body.password, '10'),
            fullName: req.body.fullName,
            otpCode: otpGenerate,
            otpCodeExpires: new Date().getTime() + 300 * 1000,
          },
        },
      );
      // await requestMobile("+33600000000", otpGenerate);
      const token = createToken(req.body.email.toString());
      res.cookie('token', token, {
        secure: false,
        httpOnly: true,
      });
      return successHandler(res, { code: otpGenerate }, 'code send to mobile');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const loginAdmin = async (req: express.Request, res: express.Response): Promise<void> => {
  // console.log("user", req.body);
  const findAdmin = await AdminModel.findOne({ email: req.body.email })
    .select([
      '_id',
      'password',
      'isVerified',
      'firstName',
      'phone',
      'role',
      'lastName',
      'email',
      'associationName',
      'kiffs',
      'photo',
    ])
    .populate('kiffs');

  try {
    console.log('findAdmin', findAdmin);

    if (!findAdmin) {
      return badRequestHandler(res, 'email does not found');
    }
    if (findAdmin) {
      const password = hashPassword(req.body.password, '10');
      if (password != findAdmin.password) {
        return badRequestHandler(res, "password doesn't match");
      } else {
        if (findAdmin.isVerified == true) {
          const token = createToken(req.body.email.toString());
          // res.cookie("token", token, {
          //   secure: false,
          //   httpOnly: true,
          // });

          //   "findAdmin": {
          //     "_id": "634ea7c575b1d6ff560b4e31",
          //     "fullName": "fullName",
          //     "phone": "5345345",
          //     "password": "c4d21cd678d42c0848b46f4693c8d4217242668fc77cd25da1932c04f4f80852",
          //     "isVerified": true
          // }
          return successHandler(
            res,
            {
              admin: {
                firstName: findAdmin.firstName,
                phone: findAdmin.phone,
                _id: findAdmin._id,
                isVerified: findAdmin.isVerified,
                role: findAdmin.role,
                lastName: findAdmin.lastName,
                email: findAdmin.email,
                associationName: findAdmin.associationName,
                kiffs: findAdmin.kiffs,
                photo: findAdmin.photo,
              },
              token: token,
            },
            'Admin Login Successfully.',
          );
        } else {
          return badRequestHandler(res, 'isVerified false');
        }
        // if(findAdmin.isVerified == false)
        // {
        //   const token = createToken(req.body.email.toString());
        //   res.cookie("token", token, {
        //     secure: false,
        //     httpOnly: true,
        //   });
        //   return  badRequestHandler(res, "please verified user with otp");

        // }
      }
      //  if(password == findAdmin.password)
      //  {

      //  }

      //  if(password == findAdmin.password)
      //  {

      //  }
      //  successHandler(res, { admin: findAdmin }, "Admin Login Successfully.");
    }

    //  if(findAdmin)
    //  {

    //  }
  } catch (err) {
    serverErrorHandler(res, err);
  }
};

export const verfiAdminForgetOtp = async (req: express.Request, res: express.Response) => {
  console.log('req.params.confirmPassword', req.body);
  console.log('req.body', req.body);

  try {
    const phone = `33${req.body.phone}`;
    console.log('phone', phone);
    const currentTime = new Date().getTime();
    console.log('phoneeee', req.body);

    if (req.body.phone != null) {
      console.log('nuunot');

      const findUser = await AdminModel.findOne({
        phone: req.body.phone,
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
      const findUser = await AdminModel.findOne({
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

export const deleteAdmin = async (req: express.Request, res: express.Response): Promise<void> => {
  //  let createEvent = new EventModel()

  console.log('delete', req.params);
  // const AdminObj = req.user as Admin
  // const AdminObj = req.user as Admin
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const Admin = await AdminModel.findOne({ _id: req.params.id });
      console.log('Admin', Admin);
      if (!Admin) {
        return badRequestHandler(res, 'Admin not found');
      } else {
        console.log('deleteOneAdmin');
        // const password = hashPassword(req.body.password, '10');
        console.log('deleteOneAdmin');
        const deleteOneAdmin = await AdminModel.findOneAndDelete({
          _id: req.params.id,
        });
        console.log('deleteOneAdmin');
        if (!deleteOneAdmin) {
          return badRequestHandler(res, "password deoesn't match");
        } else {
          console.log('deleteOneAdmin', deleteOneAdmin);
          return successHandler(res, deleteOneAdmin, 'Admin is deleted sucesfuuly');
        }
      }
    } else {
      return badRequestHandler(res, 'please provid valid id format');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const updateAdmin = async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('user', req.user);
  console.log('user', req.body);
  console.log('req');
  // const AdminObj=req.user as Admin
  const AdminObj = req.params.id;
  console.log('findAdmin', mongoose.Types.ObjectId.isValid(req.params.id));

  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const findAdmin = await AdminModel.findById(AdminObj).select([
        '_id',
        'email',
        'firstName',
        'lastName',
        'phone',
        'associationName',
        'kiffs',
        'photo',
      ]);

      console.log('findAdmin', findAdmin);

      if (findAdmin) {
        // const password = hashPassword(req.body.password, "10");
        const admin = await AdminModel.findByIdAndUpdate(
          { _id: AdminObj },
          {
            $set: {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              phone: req.body.phone,
              associationName: req.body.associationName,
              kiffs: req.body.kiffs,
              photo: req.body.photo,
              affiliatedRevelateurs: req.body.affiliatedRevelateurs,
              eventsCreated: req.body.eventsCreated,
              talents: req.body.talents,
              appointments: req.body.appointments,

              comments: req.body.comments,
              reports: req.body.reports,
              status: req.body.status,
            },
          },
          { new: true },
        ).populate('kiffs');

        return successHandler(res, { admin: admin }, 'update profile email ');
      } else {
        return badRequestHandler(res, 'Admin is not found with these credintials');
      }
    } else {
      return badRequestHandler(res, 'please provide the correct id');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const getAdmin = async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('user', req.user);
  console.log('user', req.body);
  // const AdminObj=req.user as Admin
  const AdminObj = req.params.id;

  try {
    const findAdmin = await AdminModel.findById(AdminObj)
      .select([
        'firstName',
        'lastName',
        'phone',
        'email',
        'kiffs',
        'photo',
        'affiliatedRevelateurs',
        'talents',
        'appointments',
        'comments',
        'reports',
        'kiffs',
      ])
      .populate('kiffs');

    console.log('findAdmin', findAdmin);
    if (findAdmin) {
      return successHandler(res, { Admin: findAdmin }, 'update profile email ');
    } else {
      return badRequestHandler(res, 'Admin is not found with these credintials');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const getAllAdmin = async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('user', req.user);
  console.log('user', req.body);
  // const AdminObj=req.user as Admin
  try {
    const findAdmins = await AdminModel.find()
      .select([
        'firstName',
        'lastName',
        'phone',
        'email',
        'kiffs',
        'photo',
        'affiliatedRevelateurs',
        'talents',
        'appointments',
        'comments',
        'reports',
        'kiffs',
      ])
      .populate('kiffs');

    console.log('findAdmin', findAdmins);
    if (findAdmins) {
      return successHandler(res, { Admins: findAdmins }, 'admins lists');
    } else {
      return badRequestHandler(res, 'admins lists error');
    }
  } catch (err) {
    return serverErrorHandler(res, err);
  }
};

export const forgetPasOtp = async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('user', req.body.phone);
  try {
    if (req.body.phone != null) {
      const phone = `+33${req.body.phone}`;
      const findAdmin = await AdminModel.findOne({ phone: req.body.phone });
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
        await AdminModel.updateOne(
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
      const findAdmin = await AdminModel.findOne({ email: req.body.email });
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
        await AdminModel.updateOne(
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
      const findUser = await AdminModel.findOne({ phone: req.body.phone });
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
          const updateForgetConfirmation = await AdminModel.findOneAndUpdate(
            { phone: req.body.phone },
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
      const findUser = await AdminModel.findOne({ email: req.body.email });
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

          const updateForgetConfirmation = await AdminModel.findOneAndUpdate(
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

export const uploadSingleImage = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  console.log('path');
  try {
    const files = [req.file];
    if (files == undefined || files.length == 0) {
      notFoundHandler(res, 'Image is required');
    } else {
      console.log(req.file?.path);
      const filePath = req.file?.path.replace(/\\/g, '/').substring('src'.length);
      console.log(filePath);
      const concatFilePath = `${filePath}`;
      return successHandler(res, concatFilePath, 'image upload sucessfully');
    }
  } catch (err) {
    return badRequestHandler(res, 'file is not upload');
  }
};

export const deleteImage = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    console.log(req.query, req.params);
    fs.unlink('src/upload' + '/' + req.query.folder + '/' + req.params.path, (err) => {
      if (err) {
        return res.status(404).send('Folder Not Found');
      } else {
        return res.send('Image deleted Successfully');
      }
    });
  } catch (err) {}
};

export const changePassword = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const userObj = req.params.id;
    console.log('userObj Data', userObj);
    const userData = await AdminModel.findById({ _id: userObj }).select('password');
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
    const findUser = await AdminModel.findOne({ email: req.body.email }).select([
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
      const findAdmin = await AdminModel.findOne({ email: req.body.email });
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
