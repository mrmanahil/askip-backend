import {Router} from "express";
import * as InvitationController from "./controller";

export const invitationRoutes = Router();

invitationRoutes.post(
    "/sendInvitation",
    InvitationController.sendInvitation
  );


  invitationRoutes.put(
    "/updateStatus/:id",
    InvitationController.updateStatusInvitation
  );



  invitationRoutes.get(
    "/invitation/:id",
    InvitationController.getParticularInvitation
  );


  invitationRoutes.get(
    "/invitations",
    InvitationController.getAllInvitation
  );

  invitationRoutes.get(
    "/sendInvitations",
    InvitationController.sendNotifications
  );


  invitationRoutes.get(
    "/invitationUser/:id",
    InvitationController.getAllInvitationById
  );
  
  // invitationRoutes.get(
  //   "/invitationCount/:id",
  //   InvitationController.getAllInvitationCountById
  // );
  
  
  