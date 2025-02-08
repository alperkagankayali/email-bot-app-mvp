export function embedTrackingPixel(emailTemplate: string, userId: string, campaignId: string): string {
    const trackingPixelUrl: string = `${process.env.DOMAIN}/api/campaign/tracking?campaignId=${campaignId}&userId=${userId}&recordedUserAction=opened`;
    const trackingPixel: string = `<img src="${trackingPixelUrl}" width="1" height="1" style="display:none;" />`;

    const updatedEmailTemplate = embedClickTracking(emailTemplate, userId, campaignId, "clicked");
    return updatedEmailTemplate + trackingPixel;
}

export function embedClickTracking(emailTemplate: string, userId: string, campaignId: string, recordedUserAction: string): string {
    const clickTrackingUrl: string = `${process.env.DOMAIN}/api/campaign/tracking?campaignId=${campaignId}&userId=${userId}&recordedUserAction=${recordedUserAction}`;
    
    const pattern = /<a\s+(?:[^>]*?\s+)?href="(http[s]?:\/\/.*?)"(.*?)>/gi;
    const updatedEmailTemplate = emailTemplate.replace(pattern, `<a href="${clickTrackingUrl}&redirect=$1"$2>`);
    return updatedEmailTemplate;
}