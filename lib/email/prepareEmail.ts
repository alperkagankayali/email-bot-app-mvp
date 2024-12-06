export function embedTrackingPixel(emailTemplate: string, emailId: string, userId: string): string {
    const trackingPixelUrl: string = `${process.env.DOMAIN}/api/email/open/aws?emailId=${emailId}&userId=${userId}`;
    const trackingPixel: string = `<img src="${trackingPixelUrl}" width="1" height="1" style="display:none;" />`;
  
    const closingTagRegex = /<\/([a-zA-Z]+)>$/;
    const match = emailTemplate.match(closingTagRegex);

    if (match) {
        const closingTag = match[0]; // e.g., "</body>", "</div>", etc.
        // Insert the tracking pixel right before the last closing tag
        return emailTemplate.replace(closingTag, `${trackingPixel}${closingTag}`);
    } else {
        // If no closing tag is found, append the tracking pixel to the end
        return `${emailTemplate}${trackingPixel}`;
    }
}