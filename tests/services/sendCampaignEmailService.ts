/**
 * THIS IS JUST A SIMPLE UNIT TEST WITH ACTUAL BUSINESS RELATED VALUES!! PLEASE MOCK THESE VALUES IN THE FUTURE!!!
 */

import { sendCampaignEmail, sendVerificationEmail } from "@/services/service/emailService";

(async () => {
    try {
      const userId = '67260cf44ed876e123dd34a9';
      const result = await sendCampaignEmail(userId, {},"6723dae38b94c4ac91f72216", "67acfe5aa892dca696beea3d");
      console.log('Email sent successfully:', result);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  })();