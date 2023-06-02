import Mailjet from "node-mailjet";
import nodemailer from 'nodemailer'
import dotenv from "dotenv";
dotenv.config();

// process.env.apiKey,
// process.env.apiKey,
const mailjett = Mailjet.smsConnect("5d8dda6d23384db9a931413c7fd29eb2", {
  config: {
    version: "v4",
  },
});
const mailjet = Mailjet.apiConnect(
  // "566013fa8eaf6074918e1048ffc43b70",
  // "c6bbc10fd9f4abba8580f398e913c220",
  '733d7d8eeea78fd1e21429b5898ee8dc',
  '1b504a1fdd7631b7f164cdcad3137384',
  {
    config: {},
    options: {},
  }
);


const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.Gmail as string,
    pass: process.env.GmailPassword as string,
  },
});


export default interface Data {
  Text: string;
  To: string,
  From: string,
}
export const requestMobile = function name(phoneNumber: string, otp: string, name: string) {
  {

    console.log("name",name)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: object | any = {
      Text: `Code de vérification 

      Salut !
            
      Voici ton code de vérification pour la réinitialisation de ton mot de passe sur la plateforme ASKIP’ :  
      ${otp}
      
      Attention ce code est valable 20 mins.
      
      À bientôt !
      ASKIP’ | Fais entendre ta voie`,
      To: phoneNumber,
      From: "Askip",
      // HTMLPart: "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
    };

    const result = mailjett.post("sms-send", { version: "v4" }).request(data);

    return result;
  }
};


export const requestMobiePass = function name(phoneNumber: string, otp: string) {
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: object | any = {
      Text: `Mot de passe

      Salut !
            
      Voici ton code de vérification pour la création de ton compte ASKIP’ qui te sert également de mot de passe pour te connecter. 
      ${otp}
      N’oublie pas de le modifier dans ton profil pour plus de sécurité.  
      
      À bientôt !
      ASKIP’ | Fais entendre ta voie`,
      To: phoneNumber,
      From: "Askip",
      // HTMLPart: "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
    };

    const result = mailjett.post("sms-send", { version: "v4" }).request(data);

    return result;
  }
};

// eslint-disable-line @typescript-eslint/no-unused-vars

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendDataEmail = (email: string, body: any) => {
  
  console.log("Check", body);
  transport.sendMail({
    from: 'no-reply@askip-app.fr',
    to: email,
    subject: "Code de vérification",
    // html: `
    // <h1>Email Confirmation</h1>
    //    <h2>Salut ${name},</h2>
    //     <p>
    //     Voici ton code de vérification pour la réinitialisation de ton mot de passe sur la plateforme ASKIP’ :  
    //     ${confirmationCode} </p>
    //     <p>Attention ce code est valable <strong> 20 mins <strong/>
    //     À bientôt !
    //     ASKIP’
    //     Fais entendre ta voie </p>

    //     <a href=https://askip-app.fr> Click here</a>`,
    html: `

  // <h1><b><strong>Your Data</strong></b></h1>
    <table>
      <thead>
        <tr>
          <th>Keys</th>
          <th>Values</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>First Name</td>
          <td>${body.firstName}</td>
        </tr>
        <tr>
          <td>Last Name</td>
          <td>${body.lastName}</td>
        </tr>
        <tr>
          <td>Phone</td>
          <td>${body.phone}</td>
        </tr>
        <tr>
          <td>Email address</td>
          <td>${body.email}</td>
        </tr>
        <tr>
          <td>Date of birth</td>
          <td>${body.birthDate}</td>
        </tr>
        <tr>
          <td>Address</td>
          <td>${body.postalAddress}</td>
        </tr>
        <tr>
          <td>kiifs</td>
          <td>${body.kiffs}</td>
        </tr>
        <tr>
          <td>Discord Nickname</td>
          <td>${body.discordUserName}</td>
        </tr>
        <tr>
          <td>Where did we meet</td>
          <td>${body.meetLocation}</td>
        </tr>
        <tr>
          <td>Are you a disabled worker </td>
          <td>${body.disabledWorker}</td>
        </tr>
      
        <tr>
          <td>You are registered at the SPL</td>
          <td>${body.registeredSPE}</td>
        </tr>
        <tr>
          <td>your level of qualification</td>
          <td>${body.degreeLevel}</td>
        </tr>
        <tr>
          <td>Gender</td>
          <td>${body.gender}</td>
        </tr>
        <tr>
      
     
      </tbody>
    </table>
  `
  }).catch(err => console.log(err));
};



export const requestMail = function emailSend(email: string, otp: string) {
  const Messages = [
    {
      From: {
        Email: "no-reply@askip-app.fr",
        Name: "Askip",
      },
      To: [
        {
          Email: `${email}`,
          Name: `${email}`,
        },
      ],
      // To: "muheebkamali09@gmail.com",
      Subject: `Mot de passe oublié`,
      // TextPart: "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
      // HTMLPart: "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
      HTMLPart: `<h1>Email Confirmation</h1>
      <h2>Salut!</h2>
       <p>
       Voici ton code de vérification pour la réinitialisation de ton mot de passe sur la plateforme ASKIP’ :  
        </p>
        <h3>${otp}</h3>
       <p>Attention ce code est valable <strong> 20 mins. <strong/>
      
       À bientôt !
       ASKIP’
       Fais entendre ta voie </p>
      
       <a href=https://askip-app.fr>https://askip-app.fr</a>`,
    },
  ];
  const mailJetEmail = mailjet.post("send", { version: "v3.1" }).request({
    Messages
    // "Messages":[
    //   {
    //       "From": {
    //           "Email": "contact@epsilon-partners.com",
    //           "Name": "Mailjet Pilot"
    //       },
    //       "To": [
    //           {
    //               "Email": "farhan.ali@oip.com.pk",
    //               "Name": "passenger 1"
    //           }
    //       ],
    //       "Subject": "Your email flight plan!",
    //       "TextPart": "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
    //       "HTMLPart": "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
    //   }
    // ]
  });

  return mailJetEmail;
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const requestMailData = function emailSend(email: string, body: any) {
  const Messages = [
    {
      From: {
        Email: "no-reply@askip-app.fr",
        Name: "Askip",
      },
      To: [
        {
          Email: `${email}`,
          Name: `${email}`,
        },
      ],
      // To: "muheebkamali09@gmail.com",
      Subject: `Consult Data`,
      // TextPart: "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
      // HTMLPart: "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
      // HTMLPart: `<h1>Email Confirmation</h1>
      // <h2>Salut!</h2>
      //  <p>
      //  Voici ton code de vérification pour la réinitialisation de ton mot de passe sur la plateforme ASKIP’ :  
      //  ${otp} </p>
      //  <p>Attention ce code est valable <strong> 20 mins <strong/>
      //  À bientôt !
      //  ASKIP’
      //  Fais entendre ta voie </p>

      //  <a href=https://askip-app.fr> Click here</a>`,
      HTMLPart: `

      // <h1><b><strong>Your Data</strong></b></h1>
        <table>
          <thead>
            <tr>
              <th>Keys</th>
              <th>Values</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>First Name</td>
              <td>${body.firstName}</td>
            </tr>
            <tr>
              <td>Last Name</td>
              <td>${body.lastName}</td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>${body.phone}</td>
            </tr>
            <tr>
              <td>Email address</td>
              <td>${body.email}</td>
            </tr>
            <tr>
              <td>Date of birth</td>
              <td>${body.birthDate}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>${body.postalAddress}</td>
            </tr>
            <tr>
              <td>kiifs</td>
              <td>${body.kiffs}</td>
            </tr>
            <tr>
              <td>Discord Nickname</td>
              <td>${body.discordUserName}</td>
            </tr>
            <tr>
              <td>Where did we meet</td>
              <td>${body.meetLocation}</td>
            </tr>
            <tr>
              <td>Are you a disabled worker </td>
              <td>${body.disabledWorker}</td>
            </tr>
          
            <tr>
              <td>You are registered at the SPL</td>
              <td>${body.registeredSPE}</td>
            </tr>
            <tr>
              <td>your level of qualification</td>
              <td>${body.degreeLevel}</td>
            </tr>
            <tr>
              <td>Gender</td>
              <td>${body.gender}</td>
            </tr>
         
         
          </tbody>
        </table>
      `
    },
  ];
  const mailJetEmail = mailjet.post("send", { version: "v3.1" }).request({
    Messages
    // "Messages":[
    //   {
    //       "From": {
    //           "Email": "contact@epsilon-partners.com",
    //           "Name": "Mailjet Pilot"
    //       },
    //       "To": [
    //           {
    //               "Email": "farhan.ali@oip.com.pk",
    //               "Name": "passenger 1"
    //           }
    //       ],
    //       "Subject": "Your email flight plan!",
    //       "TextPart": "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
    //       "HTMLPart": "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
    //   }
    // ]
  });

  return mailJetEmail;
};



export const sendConfirmationEmail = (email: string, name: string, confirmationCode: string) => {
  console.log("Check");
  transport.sendMail({
    from: 'no-reply@askip-app.fr',
    to: email,
    subject: "Code de vérification",
    html: `<h1>Email Confirmation</h1>
     <h2>Salut ${name},</h2>
      <p>
      Voici ton code de vérification pour la réinitialisation de ton mot de passe sur la plateforme ASKIP’ :  
      ${confirmationCode} </p>
      <p>Attention ce code est valable <strong> 20 mins <strong/>
      À bientôt !
      ASKIP’
      Fais entendre ta voie </p>
     
      <a href=https://askip-app.fr> Click here</a>`,
  }).catch(err => console.log(err));
};







