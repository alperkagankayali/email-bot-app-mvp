/**
 * THIS IS JUST A SIMPLE UNIT TEST WITH ACTUAL BUSINESS RELATED VALUES!! PLEASE MOCK THESE VALUES IN THE FUTURE!!!
 */

import { sendVerificationEmail } from "@/services/service/emailService";

(async () => {
    try {
      const userId = '67260cf44ed876e123dd34a9';
      const result = await sendVerificationEmail(userId, {},"");
      console.log('Email sent successfully:', result);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  })();