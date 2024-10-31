"use client";
import React, { useState } from "react";
import JoditEditor from "jodit-react";

type ImageHandlerProps = {
  onUpload?: (file: File) => Promise<string>;
};

const config: any = {
  uploader: {
    insertImageAsBase64URI: false,
    imagesExtensions: ["jpg", "png", "jpeg", "gif"],
    withCredentials: false,
    format: "json",
    method: "POST",
    url: "http://localhost:3000/files",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    prepareData: function (data: any) {
      data.append("file", data);
      return data;
    },
    isSuccess: function (resp: any) {
      return !resp.error;
    },
    getMsg: function (resp: any) {
      return resp.msg.join !== undefined ? resp.msg.join(" ") : resp.msg;
    },
    process: function (resp: any) {
      return {
        files: [resp.data],
        path: "",
        baseurl: "",
        error: resp.error ? 1 : 0,
        msg: resp.msg,
      };
    },
    defaultHandlerSuccess: function (data: any, resp: any) {
      const files = data.files || [];
      console.log("default", files);
    },
    defaultHandlerError: function (resp: any) {
      console.log("default", resp);
    },
  },
};
const RinchTextEditor: React.FC<ImageHandlerProps> = () => {
  const uploadToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("File upload failed");
    }

    const data = await response.json();
    return data.imageUrl; // Sunucudan dönen görüntü URL'si
  };

  const [editor, setEditor] = useState(`<!DOCTYPE html>
<html
    lang="en"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:v="urn:schemas-microsoft-com:vml"
    style="box-sizing: border-box;border: none !important;"
>
    <head style="box-sizing: border-box;border: none !important;">
        <title style="box-sizing: border-box;border: none !important;"></title>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" style="box-sizing: border-box;border: none !important;">
        <meta content="width=device-width, initial-scale=1.0" name="viewport" style="box-sizing: border-box;border: none !important;">
        <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
        <!--[if !mso]><!-->
        <!--<![endif]-->
        <!--[if mso ]><style>sup, sub { font-size: 100% !important; } sup { mso-text-raise:10% } sub { mso-text-raise:-10% }</style> <![endif]-->
    </head>
    <body class="body" style="background-color: #F6F5FF;margin: 0;padding: 0;-webkit-text-size-adjust: none;text-size-adjust: none;box-sizing: border-box;border: none !important;">
        <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            class="nl-container"
            role="presentation"
            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;background-color: #F6F5FF;box-sizing: border-box;border: none !important;"
            width="100%"
        >
            <tbody style="box-sizing: border-box;border: none !important;">
                <tr style="box-sizing: border-box;border: none !important;">
                    <td style="box-sizing: border-box;border: none !important;">
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row row-1"
                            role="presentation"
                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                            width="100%"
                        >
                            <tbody style="box-sizing: border-box;border: none !important;">
                                <tr style="box-sizing: border-box;border: none !important;">
                                    <td style="box-sizing: border-box;border: none !important;">
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;background-color: #ffffff;border-radius: 0;color: #000000;width: 650px;margin: 0 auto;box-sizing: border-box;border: none !important;"
                                            width="650"
                                        >
                                            <tbody style="box-sizing: border-box;border: none !important;">
                                                <tr style="box-sizing: border-box;border: none !important;">
                                                    <td class="column column-1" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;font-weight: 400;text-align: left;padding-bottom: 5px;padding-top: 5px;vertical-align: top;border-top: 0px;border-right: 0px;border-bottom: 0px;border-left: 0px;box-sizing: border-box;border: none !important;" width="33.333333333333336%">
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="image_block block-1"
                                                            role="presentation"
                                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                                                            width="100%"
                                                        >
                                                            <tr style="box-sizing: border-box;border: none !important;">
                                                                <td class="pad" style="padding-left: 30px;width: 100%;box-sizing: border-box;border: none !important;">
                                                                    <div align="left" class="alignment" style="line-height: 10px;box-sizing: border-box;border: none !important;">
                                                                        <div style="max-width: 101px;box-sizing: border-box;border: none !important;">
                                                                            <img
                                                                                height="auto"
                                                                                src="/images/unnamed_1.png"
                                                                                style="display: block;height: auto;border: 0;width: 100%;box-sizing: border-box;border: none !important;"
                                                                                width="101"
                                                                            >
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td class="column column-2" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;font-weight: 400;text-align: left;padding-bottom: 5px;padding-top: 5px;vertical-align: top;border-top: 0px;border-right: 0px;border-bottom: 0px;border-left: 0px;box-sizing: border-box;border: none !important;" width="33.333333333333336%">
                                                        <div class="spacer_block block-1" style="height: 40px;line-height: 40px;font-size: 1px;box-sizing: border-box;border: none !important;"></div>
                                                    </td>
                                                    <td class="column column-3" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;font-weight: 400;text-align: left;padding-bottom: 5px;padding-top: 5px;vertical-align: top;border-top: 0px;border-right: 0px;border-bottom: 0px;border-left: 0px;box-sizing: border-box;border: none !important;" width="33.333333333333336%">
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="image_block block-1"
                                                            role="presentation"
                                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                                                            width="100%"
                                                        >
                                                            <tr style="box-sizing: border-box;border: none !important;">
                                                                <td class="pad" style="padding-right: 30px;width: 100%;padding-left: 0px;box-sizing: border-box;border: none !important;">
                                                                    <div align="right" class="alignment" style="line-height: 10px;box-sizing: border-box;border: none !important;">
                                                                        <div style="max-width: 43px;box-sizing: border-box;border: none !important;">
                                                                            <img
                                                                                height="auto"
                                                                                src="/images/unnamed.jpg"
                                                                                style="display: block;height: auto;border: 0;width: 100%;border-radius: 50px 50px 50px 50px;box-sizing: border-box;border: none !important;"
                                                                                width="43"
                                                                            >
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row row-2"
                            role="presentation"
                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                            width="100%"
                        >
                            <tbody style="box-sizing: border-box;border: none !important;">
                                <tr style="box-sizing: border-box;border: none !important;">
                                    <td style="box-sizing: border-box;border: none !important;">
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;background-color: #FFFFFF;color: #000000;width: 650px;margin: 0 auto;box-sizing: border-box;border: none !important;"
                                            width="650"
                                        >
                                            <tbody style="box-sizing: border-box;border: none !important;">
                                                <tr style="box-sizing: border-box;border: none !important;">
                                                    <td class="column column-1" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;font-weight: 400;text-align: left;padding-bottom: 30px;padding-left: 30px;padding-right: 30px;padding-top: 25px;vertical-align: top;border-top: 0px;border-right: 0px;border-bottom: 0px;border-left: 0px;box-sizing: border-box;border: none !important;" width="100%">
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="paragraph_block block-1"
                                                            role="presentation"
                                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;word-break: break-word;box-sizing: border-box;border: none !important;"
                                                            width="100%"
                                                        >
                                                            <tr style="box-sizing: border-box;border: none !important;">
                                                                <td class="pad" style="padding-bottom: 5px;padding-left: 5px;padding-right: 5px;box-sizing: border-box;border: none !important;">
                                                                    <div style="color: #454562;font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 38px;font-weight: 400;line-height: 120%;text-align: center;mso-line-height-alt: 45.6px;box-sizing: border-box;border: none !important;">
                                                                        <p style="margin: 0;word-break: break-word;box-sizing: border-box;border: none !important;line-height: inherit;">
                                                                            <span style="word-break: break-word;box-sizing: border-box;border: none !important;">
                                                                                <strong style="box-sizing: border-box;border: none !important;">1 yeni</strong>davetiniz var
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <div class="spacer_block block-2" style="height: 15px;line-height: 15px;font-size: 1px;box-sizing: border-box;border: none !important;"></div>
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="image_block block-3"
                                                            role="presentation"
                                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                                                            width="100%"
                                                        >
                                                            <tr style="box-sizing: border-box;border: none !important;">
                                                                <td class="pad" style="width: 100%;padding-right: 0px;padding-left: 0px;box-sizing: border-box;border: none !important;">
                                                                    <div align="center" class="alignment" style="line-height: 10px;box-sizing: border-box;border: none !important;">
                                                                        <div style="max-width: 89px;box-sizing: border-box;border: none !important;">
                                                                            <img
                                                                                height="auto"
                                                                                src="/images/unnamed.png"
                                                                                style="display: block;height: auto;border: 0;width: 100%;box-sizing: border-box;border: none !important;"
                                                                                width="89"
                                                                            >
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <div class="spacer_block block-4" style="height: 15px;line-height: 15px;font-size: 1px;box-sizing: border-box;border: none !important;"></div>
                                                        <table
                                                            border="0"
                                                            cellpadding="10"
                                                            cellspacing="0"
                                                            class="button_block block-5"
                                                            role="presentation"
                                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                                                            width="100%"
                                                        >
                                                            <tr style="box-sizing: border-box;border: none !important;">
                                                                <td class="pad" style="box-sizing: border-box;border: none !important;">
                                                                    <div align="center" class="alignment" style="box-sizing: border-box;border: none !important;">
                                                                        <!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.linkedin.com/comm/mynetwork/?lipi=urn%3Ali%3Apage%3Aemail_email_notification_digest_01%3BjO3WI0w0QDy5tiSxOdreNQ%3D%3D&midToken=AQG5GC2GRcEVLw&midSig=14P8gxvMvxFbs1&trk=eml-email_notification_digest_01-hero_notification_cta-0-MY_NETWORK&trkEmail=eml-email_notification_digest_01-hero_notification_cta-0-MY_NETWORK-null-9bbst7~m26dl1b1~ha-null-null&eid=9bbst7-m26dl1b1-ha&otpToken=MTcwMzFkZTIxMDJmYzBjNWIxMjQwNGVkNDQxNmUwYjE4ZmM2ZDI0MjlhYTg4ODYxNzhjNTA1NmQ0OTVmNWVmNmY0ZDNkZjgyNzRmM2ZlZDU3MmFjYzM4OWQ4ZDhlMDEzYjMxZTQ3NGE0N2RiOWZkMWVjOTI1NywxLDE%3D" style="height:42px;width:307px;v-text-anchor:middle;" arcsize="120%" stroke="false" fillcolor="#0a66c2">
<w:anchorlock/>
<v:textbox inset="0px,0px,0px,0px">
<center dir="false" style="color:#ffffff;font-family:Arial, sans-serif;font-size:16px">
<![endif]-->
                                                                        <a href="https://www.linkedin.com/comm/mynetwork/?lipi=urn%3Ali%3Apage%3Aemail_email_notification_digest_01%3BjO3WI0w0QDy5tiSxOdreNQ%3D%3D&midToken=AQG5GC2GRcEVLw&midSig=14P8gxvMvxFbs1&trk=eml-email_notification_digest_01-hero_notification_cta-0-MY_NETWORK&trkEmail=eml-email_notification_digest_01-hero_notification_cta-0-MY_NETWORK-null-9bbst7~m26dl1b1~ha-null-null&eid=9bbst7-m26dl1b1-ha&otpToken=MTcwMzFkZTIxMDJmYzBjNWIxMjQwNGVkNDQxNmUwYjE4ZmM2ZDI0MjlhYTg4ODYxNzhjNTA1NmQ0OTVmNWVmNmY0ZDNkZjgyNzRmM2ZlZDU3MmFjYzM4OWQ4ZDhlMDEzYjMxZTQ3NGE0N2RiOWZkMWVjOTI1NywxLDE%3D" style="background-color: #0a66c2;border-bottom: 0px solid transparent;border-left: 0px solid transparent;border-radius: 50px;border-right: 0px solid transparent;border-top: 0px solid transparent;color: #ffffff;display: inline-block;font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;font-weight: undefined;mso-border-alt: none;padding-bottom: 5px;padding-top: 5px;text-align: center;text-decoration: none;width: auto;word-break: keep-all;box-sizing: border-box;border: none !important;" target="_blank">
                                                                            <span style="word-break: break-word;padding-left: 50px;padding-right: 50px;font-size: 16px;display: inline-block;letter-spacing: normal;box-sizing: border-box;border: none !important;">
                                                                                <span style="word-break: break-word;line-height: 32px;box-sizing: border-box;border: none !important;">
                                                                                    <strong style="box-sizing: border-box;border: none !important;">Davetiyeleri Görüntüleyin</strong>
                                                                                </span>
                                                                            </span>
                                                                        </a>
                                                                        <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <div class="spacer_block block-6" style="height: 30px;line-height: 30px;font-size: 1px;box-sizing: border-box;border: none !important;"></div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row row-3"
                            role="presentation"
                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                            width="100%"
                        >
                            <tbody style="box-sizing: border-box;border: none !important;">
                                <tr style="box-sizing: border-box;border: none !important;">
                                    <td style="box-sizing: border-box;border: none !important;">
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;background-color: #ffffff;border-radius: 0;color: #000000;width: 650px;margin: 0 auto;box-sizing: border-box;border: none !important;"
                                            width="650"
                                        >
                                            <tbody style="box-sizing: border-box;border: none !important;">
                                                <tr style="box-sizing: border-box;border: none !important;">
                                                    <td class="column column-1" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;font-weight: 400;text-align: left;background-color: #ffffff;padding-bottom: 5px;padding-top: 5px;vertical-align: top;border-top: 0px;border-right: 0px;border-bottom: 0px;border-left: 0px;box-sizing: border-box;border: none !important;" width="25%">
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="image_block block-1"
                                                            role="presentation"
                                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                                                            width="100%"
                                                        >
                                                            <tr style="box-sizing: border-box;border: none !important;">
                                                                <td class="pad" style="width: 100%;padding-right: 0px;padding-left: 0px;box-sizing: border-box;border: none !important;">
                                                                    <div align="center" class="alignment" style="line-height: 10px;box-sizing: border-box;border: none !important;">
                                                                        <div style="max-width: 65px;box-sizing: border-box;border: none !important;">
                                                                            <img
                                                                                height="auto"
                                                                                src="/images/unnamed_2.jpg"
                                                                                style="display: block;height: auto;border: 0;width: 100%;border-radius: 50px 50px 50px 50px;box-sizing: border-box;border: none !important;"
                                                                                width="65"
                                                                            >
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td class="column column-2" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;font-weight: 400;text-align: left;padding-bottom: 5px;padding-top: 5px;vertical-align: top;border-top: 0px;border-right: 0px;border-bottom: 0px;border-left: 0px;box-sizing: border-box;border: none !important;" width="75%">
                                                        <table
                                                            border="0"
                                                            cellpadding="10"
                                                            cellspacing="0"
                                                            class="heading_block block-1"
                                                            role="presentation"
                                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                                                            width="100%"
                                                        >
                                                            <tr style="box-sizing: border-box;border: none !important;">
                                                                <td class="pad" style="box-sizing: border-box;border: none !important;">
                                                                    <h1 style="margin: 0;color: #000000;direction: ltr;font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 15px;font-weight: 700;letter-spacing: normal;line-height: 120%;text-align: left;margin-top: 0;margin-bottom: 0;mso-line-height-alt: 18px;box-sizing: border-box;border: none !important;">
                                                                        <strong style="box-sizing: border-box;border: none !important;">
                                                                            <a
                                                                                href="https://tr.linkedin.com/comm/in/metehankara?lipi=urn%3Ali%3Apage%3Aemail_email_notification_digest_01%3BjO3WI0w0QDy5tiSxOdreNQ%3D%3D&midToken=AQG5GC2GRcEVLw&midSig=14P8gxvMvxFbs1&trk=eml-email_notification_digest_01-JOB_CHANGE_PROP-0-profile_name&trkEmail=eml-email_notification_digest_01-JOB_CHANGE_PROP-0-profile_name-null-9bbst7~m26dl1b1~ha-null-null&eid=9bbst7-m26dl1b1-ha&otpToken=MTcwMzFkZTIxMDJmYzBjNWIxMjQwNGVkNDQxNmUwYjE4ZmM2ZDI0MjlhYTg4ODYxNzhjNTA1NmQ0OTVmNWVmNmY0ZDNkZjgyNzRmM2ZlZDU3MmFjYzM4OWQ4ZDhlMDEzYjMxZTQ3NGE0N2RiOWZkMWVjOTI1NywxLDE%3D"
                                                                                rel="noopener"
                                                                                style="text-decoration: underline;color: #000000;box-sizing: border-box;border: none !important;"
                                                                                target="_blank"
                                                                            >Metehan Kara</a>
                                                                        </strong> adlı kullanıcıyı
                                                                        <strong style="box-sizing: border-box;border: none !important;">SG Veteris şirketinde yeni Senior Software Development Engineer</strong> pozisyonunda çalışmaya başladığı için kutlayın
                                                                    </h1>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table
                                                            border="0"
                                                            cellpadding="10"
                                                            cellspacing="0"
                                                            class="button_block block-2"
                                                            role="presentation"
                                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                                                            width="100%"
                                                        >
                                                            <tr style="box-sizing: border-box;border: none !important;">
                                                                <td class="pad" style="box-sizing: border-box;border: none !important;">
                                                                    <div align="left" class="alignment" style="box-sizing: border-box;border: none !important;">
                                                                        <!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.linkedin.com/comm/feed/update/activity:7249845722735403008?highlightedUpdateUrn=urn%3Ali%3Aactivity%3A7249845722735403008&showCommentBox=true&commentUrn=urn%3Ali%3Acomment%3A%28urn%3Ali%3AugcPost%3A7249845722001379328%2C7250063918948040706%29&dashCommentUrn=urn%3Ali%3Afsd_comment%3A%287249845722001379328%2C7250063918948040706%29%2C7249845722001379328%29&origin=COMMENTS_BY_YOUR_NETWORK&lipi=urn%3Ali%3Apage%3Aemail_email_notification_digest_01%3BjO3WI0w0QDy5tiSxOdreNQ%3D%3D&midToken=AQG5GC2GRcEVLw&midSig=14P8gxvMvxFbs1&trk=eml-email_notification_digest_01-notification_card_COMMENTS_BY_YOUR_NETWORK_cta-0-COMMENTS_BY_YOUR_NETWORK&trkEmail=eml-email_notification_digest_01-notification_card_COMMENTS_BY_YOUR_NETWORK_cta-0-COMMENTS_BY_YOUR_NETWORK-null-9bbst7~m26dl1b1~ha-null-null&eid=9bbst7-m26dl1b1-ha&otpToken=MTcwMzFkZTIxMDJmYzBjNWIxMjQwNGVkNDQxNmUwYjE4ZmM2ZDI0MjlhYTg4ODYxNzhjNTA1NmQ0OTVmNWVmNmY0ZDNkZjgyNzRmM2ZlZDU3MmFjYzM4OWQ4ZDhlMDEzYjMxZTQ3NGE0N2RiOWZkMWVjOTI1NywxLDE%3D" style="height:36px;width:124px;v-text-anchor:middle;" arcsize="78%" strokeweight="0.75pt" strokecolor="#000000" fillcolor="#ffffff">
<w:anchorlock/>
<v:textbox inset="0px,0px,0px,0px">
<center dir="false" style="color:#353535;font-family:Arial, sans-serif;font-size:12px">
<![endif]-->
                                                                        <a href="https://www.linkedin.com/comm/feed/update/activity:7249845722735403008?highlightedUpdateUrn=urn%3Ali%3Aactivity%3A7249845722735403008&showCommentBox=true&commentUrn=urn%3Ali%3Acomment%3A%28urn%3Ali%3AugcPost%3A7249845722001379328%2C7250063918948040706%29&dashCommentUrn=urn%3Ali%3Afsd_comment%3A%287249845722001379328%2C7250063918948040706%29%2C7249845722001379328%29&origin=COMMENTS_BY_YOUR_NETWORK&lipi=urn%3Ali%3Apage%3Aemail_email_notification_digest_01%3BjO3WI0w0QDy5tiSxOdreNQ%3D%3D&midToken=AQG5GC2GRcEVLw&midSig=14P8gxvMvxFbs1&trk=eml-email_notification_digest_01-notification_card_COMMENTS_BY_YOUR_NETWORK_cta-0-COMMENTS_BY_YOUR_NETWORK&trkEmail=eml-email_notification_digest_01-notification_card_COMMENTS_BY_YOUR_NETWORK_cta-0-COMMENTS_BY_YOUR_NETWORK-null-9bbst7~m26dl1b1~ha-null-null&eid=9bbst7-m26dl1b1-ha&otpToken=MTcwMzFkZTIxMDJmYzBjNWIxMjQwNGVkNDQxNmUwYjE4ZmM2ZDI0MjlhYTg4ODYxNzhjNTA1NmQ0OTVmNWVmNmY0ZDNkZjgyNzRmM2ZlZDU3MmFjYzM4OWQ4ZDhlMDEzYjMxZTQ3NGE0N2RiOWZkMWVjOTI1NywxLDE%3D" style="background-color: #ffffff;border-bottom: 1px solid #000000;border-left: 1px solid #000000;border-radius: 28px;border-right: 1px solid #000000;border-top: 1px solid #000000;color: #353535;display: inline-block;font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;font-weight: 700;mso-border-alt: none;padding-bottom: 5px;padding-top: 5px;text-align: center;text-decoration: none;width: auto;word-break: keep-all;box-sizing: border-box;border: none !important;" target="_blank">
                                                                            <span style="word-break: break-word;padding-left: 20px;padding-right: 20px;font-size: 12px;display: inline-block;letter-spacing: normal;box-sizing: border-box;border: none !important;">
                                                                                <span style="word-break: break-word;line-height: 24px;box-sizing: border-box;border: none !important;">Gönderiyi Gör</span>
                                                                            </span>
                                                                        </a>
                                                                        <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <div class="spacer_block block-3" style="height: 25px;line-height: 25px;font-size: 1px;box-sizing: border-box;border: none !important;"></div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row row-4"
                            role="presentation"
                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                            width="100%"
                        >
                            <tbody style="box-sizing: border-box;border: none !important;">
                                <tr style="box-sizing: border-box;border: none !important;">
                                    <td style="box-sizing: border-box;border: none !important;">
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;background-color: #ffffff;border-radius: 0;color: #000000;width: 650px;margin: 0 auto;box-sizing: border-box;border: none !important;"
                                            width="650"
                                        >
                                            <tbody style="box-sizing: border-box;border: none !important;">
                                                <tr style="box-sizing: border-box;border: none !important;">
                                                    <td class="column column-1" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;font-weight: 400;text-align: left;background-color: #ffffff;padding-bottom: 5px;padding-top: 5px;vertical-align: top;border-top: 0px;border-right: 0px;border-bottom: 0px;border-left: 0px;box-sizing: border-box;border: none !important;" width="25%">
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="image_block block-1"
                                                            role="presentation"
                                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                                                            width="100%"
                                                        >
                                                            <tr style="box-sizing: border-box;border: none !important;">
                                                                <td class="pad" style="width: 100%;padding-right: 0px;padding-left: 0px;box-sizing: border-box;border: none !important;">
                                                                    <div align="center" class="alignment" style="line-height: 10px;box-sizing: border-box;border: none !important;">
                                                                        <div style="max-width: 65px;box-sizing: border-box;border: none !important;">
                                                                            <img
                                                                                height="auto"
                                                                                src="/images/unnamed_1.jpg"
                                                                                style="display: block;height: auto;border: 0;width: 100%;border-radius: 50px 50px 50px 50px;box-sizing: border-box;border: none !important;"
                                                                                width="65"
                                                                            >
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td class="column column-2" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;font-weight: 400;text-align: left;padding-bottom: 5px;padding-top: 5px;vertical-align: top;border-top: 0px;border-right: 0px;border-bottom: 0px;border-left: 0px;box-sizing: border-box;border: none !important;" width="75%">
                                                        <table
                                                            border="0"
                                                            cellpadding="10"
                                                            cellspacing="0"
                                                            class="heading_block block-1"
                                                            role="presentation"
                                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                                                            width="100%"
                                                        >
                                                            <tr style="box-sizing: border-box;border: none !important;">
                                                                <td class="pad" style="box-sizing: border-box;border: none !important;">
                                                                    <h1 style="margin: 0;color: #000000;direction: ltr;font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 15px;font-weight: 700;letter-spacing: normal;line-height: 120%;text-align: left;margin-top: 0;margin-bottom: 0;mso-line-height-alt: 18px;box-sizing: border-box;border: none !important;">
                                                                        <strong style="box-sizing: border-box;border: none !important;">Ekin Korkmaz</strong>,
                                                                        <strong style="box-sizing: border-box;border: none !important;">Zeynep Kantav</strong> adlı kullanıcının gönderisine yorum yaptı: Amazing event Zeynep!
                                                                    </h1>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table
                                                            border="0"
                                                            cellpadding="10"
                                                            cellspacing="0"
                                                            class="button_block block-2"
                                                            role="presentation"
                                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                                                            width="100%"
                                                        >
                                                            <tr style="box-sizing: border-box;border: none !important;">
                                                                <td class="pad" style="box-sizing: border-box;border: none !important;">
                                                                    <div align="left" class="alignment" style="box-sizing: border-box;border: none !important;">
                                                                        <!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.linkedin.com/comm/messaging/compose/metehankara/body/Yeni%20i%C5%9Finiz%20i%C3%A7in%20tebrikler!?propUrn=urn%3Ali%3Aprop%3A%28JOB_CHANGE%2C_01c-8kMyeq_frDEClFC0SwRbwet8OipsZsulrWBZjP_yM%3D%29&lipi=urn%3Ali%3Apage%3Aemail_email_notification_digest_01%3BjO3WI0w0QDy5tiSxOdreNQ%3D%3D&midToken=AQG5GC2GRcEVLw&midSig=14P8gxvMvxFbs1&trk=eml-email_notification_digest_01-notification_card_JOB_CHANGE_PROP_cta-0-JOB_CHANGE_PROP&trkEmail=eml-email_notification_digest_01-notification_card_JOB_CHANGE_PROP_cta-0-JOB_CHANGE_PROP-null-9bbst7~m26dl1b1~ha-null-null&eid=9bbst7-m26dl1b1-ha&otpToken=MTcwMzFkZTIxMDJmYzBjNWIxMjQwNGVkNDQxNmUwYjE4ZmM2ZDI0MjlhYTg4ODYxNzhjNTA1NmQ0OTVmNWVmNmY0ZDNkZjgyNzRmM2ZlZDU3MmFjYzM4OWQ4ZDhlMDEzYjMxZTQ3NGE0N2RiOWZkMWVjOTI1NywxLDE%3D" style="height:36px;width:95px;v-text-anchor:middle;" arcsize="78%" strokeweight="0.75pt" strokecolor="#000000" fillcolor="#ffffff">
<w:anchorlock/>
<v:textbox inset="0px,0px,0px,0px">
<center dir="false" style="color:#353535;font-family:Arial, sans-serif;font-size:12px">
<![endif]-->
                                                                        <a href="https://www.linkedin.com/comm/messaging/compose/metehankara/body/Yeni%20i%C5%9Finiz%20i%C3%A7in%20tebrikler!?propUrn=urn%3Ali%3Aprop%3A%28JOB_CHANGE%2C_01c-8kMyeq_frDEClFC0SwRbwet8OipsZsulrWBZjP_yM%3D%29&lipi=urn%3Ali%3Apage%3Aemail_email_notification_digest_01%3BjO3WI0w0QDy5tiSxOdreNQ%3D%3D&midToken=AQG5GC2GRcEVLw&midSig=14P8gxvMvxFbs1&trk=eml-email_notification_digest_01-notification_card_JOB_CHANGE_PROP_cta-0-JOB_CHANGE_PROP&trkEmail=eml-email_notification_digest_01-notification_card_JOB_CHANGE_PROP_cta-0-JOB_CHANGE_PROP-null-9bbst7~m26dl1b1~ha-null-null&eid=9bbst7-m26dl1b1-ha&otpToken=MTcwMzFkZTIxMDJmYzBjNWIxMjQwNGVkNDQxNmUwYjE4ZmM2ZDI0MjlhYTg4ODYxNzhjNTA1NmQ0OTVmNWVmNmY0ZDNkZjgyNzRmM2ZlZDU3MmFjYzM4OWQ4ZDhlMDEzYjMxZTQ3NGE0N2RiOWZkMWVjOTI1NywxLDE%3D" style="background-color: #ffffff;border-bottom: 1px solid #000000;border-left: 1px solid #000000;border-radius: 28px;border-right: 1px solid #000000;border-top: 1px solid #000000;color: #353535;display: inline-block;font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;font-weight: 700;mso-border-alt: none;padding-bottom: 5px;padding-top: 5px;text-align: center;text-decoration: none;width: auto;word-break: keep-all;box-sizing: border-box;border: none !important;" target="_blank">
                                                                            <span style="word-break: break-word;padding-left: 20px;padding-right: 20px;font-size: 12px;display: inline-block;letter-spacing: normal;box-sizing: border-box;border: none !important;">
                                                                                <span style="word-break: break-word;line-height: 24px;box-sizing: border-box;border: none !important;">Tebrik et</span>
                                                                            </span>
                                                                        </a>
                                                                        <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row row-5"
                            role="presentation"
                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                            width="100%"
                        >
                            <tbody style="box-sizing: border-box;border: none !important;">
                                <tr style="box-sizing: border-box;border: none !important;">
                                    <td style="box-sizing: border-box;border: none !important;">
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;background-color: #ffffff;border-radius: 0;color: #000000;width: 650px;margin: 0 auto;box-sizing: border-box;border: none !important;"
                                            width="650"
                                        >
                                            <tbody style="box-sizing: border-box;border: none !important;">
                                                <tr style="box-sizing: border-box;border: none !important;">
                                                    <td class="column column-1" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;font-weight: 400;text-align: left;background-color: #ffffff;padding-bottom: 5px;padding-top: 5px;vertical-align: top;border-top: 0px;border-right: 0px;border-bottom: 0px;border-left: 0px;box-sizing: border-box;border: none !important;" width="25%">
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="image_block block-1"
                                                            role="presentation"
                                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                                                            width="100%"
                                                        >
                                                            <tr style="box-sizing: border-box;border: none !important;">
                                                                <td class="pad" style="width: 100%;padding-right: 0px;padding-left: 0px;box-sizing: border-box;border: none !important;">
                                                                    <div align="center" class="alignment" style="line-height: 10px;box-sizing: border-box;border: none !important;">
                                                                        <div style="max-width: 65px;box-sizing: border-box;border: none !important;">
                                                                            <img
                                                                                height="auto"
                                                                                src="/images/unnamed_3.jpg"
                                                                                style="display: block;height: auto;border: 0;width: 100%;border-radius: 50px 50px 50px 50px;box-sizing: border-box;border: none !important;"
                                                                                width="65"
                                                                            >
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td class="column column-2" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;font-weight: 400;text-align: left;padding-bottom: 5px;padding-top: 5px;vertical-align: top;border-top: 0px;border-right: 0px;border-bottom: 0px;border-left: 0px;box-sizing: border-box;border: none !important;" width="75%">
                                                        <table
                                                            border="0"
                                                            cellpadding="10"
                                                            cellspacing="0"
                                                            class="heading_block block-1"
                                                            role="presentation"
                                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                                                            width="100%"
                                                        >
                                                            <tr style="box-sizing: border-box;border: none !important;">
                                                                <td class="pad" style="box-sizing: border-box;border: none !important;">
                                                                    <h1 style="margin: 0;color: #000000;direction: ltr;font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 15px;font-weight: 700;letter-spacing: normal;line-height: 120%;text-align: left;margin-top: 0;margin-bottom: 0;mso-line-height-alt: 18px;box-sizing: border-box;border: none !important;">
                                                                        <strong style="box-sizing: border-box;border: none !important;">Doğa Topalak</strong> bir gönderi paylaştı: I had the opportunity to attend the TEGEP Training and Development Summit…
                                                                    </h1>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table
                                                            border="0"
                                                            cellpadding="10"
                                                            cellspacing="0"
                                                            class="button_block block-2"
                                                            role="presentation"
                                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                                                            width="100%"
                                                        >
                                                            <tr style="box-sizing: border-box;border: none !important;">
                                                                <td class="pad" style="box-sizing: border-box;border: none !important;">
                                                                    <div align="left" class="alignment" style="box-sizing: border-box;border: none !important;">
                                                                        <!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.linkedin.com/comm/feed/update/activity:7250802597857574912?highlightedUpdateUrn=urn%3Ali%3Aactivity%3A7250802597857574912&showCommentBox=true&lipi=urn%3Ali%3Apage%3Aemail_email_notification_digest_01%3BjO3WI0w0QDy5tiSxOdreNQ%3D%3D&midToken=AQG5GC2GRcEVLw&midSig=14P8gxvMvxFbs1&trk=eml-email_notification_digest_01-notification_card_SHARED_BY_YOUR_NETWORK_cta-0-SHARED_BY_YOUR_NETWORK&trkEmail=eml-email_notification_digest_01-notification_card_SHARED_BY_YOUR_NETWORK_cta-0-SHARED_BY_YOUR_NETWORK-null-9bbst7~m26dl1b1~ha-null-null&eid=9bbst7-m26dl1b1-ha&otpToken=MTcwMzFkZTIxMDJmYzBjNWIxMjQwNGVkNDQxNmUwYjE4ZmM2ZDI0MjlhYTg4ODYxNzhjNTA1NmQ0OTVmNWVmNmY0ZDNkZjgyNzRmM2ZlZDU3MmFjYzM4OWQ4ZDhlMDEzYjMxZTQ3NGE0N2RiOWZkMWVjOTI1NywxLDE%3D" style="height:36px;width:107px;v-text-anchor:middle;" arcsize="78%" strokeweight="0.75pt" strokecolor="#000000" fillcolor="#ffffff">
<w:anchorlock/>
<v:textbox inset="0px,0px,0px,0px">
<center dir="false" style="color:#353535;font-family:Arial, sans-serif;font-size:12px">
<![endif]-->
                                                                        <a href="https://www.linkedin.com/comm/feed/update/activity:7250802597857574912?highlightedUpdateUrn=urn%3Ali%3Aactivity%3A7250802597857574912&showCommentBox=true&lipi=urn%3Ali%3Apage%3Aemail_email_notification_digest_01%3BjO3WI0w0QDy5tiSxOdreNQ%3D%3D&midToken=AQG5GC2GRcEVLw&midSig=14P8gxvMvxFbs1&trk=eml-email_notification_digest_01-notification_card_SHARED_BY_YOUR_NETWORK_cta-0-SHARED_BY_YOUR_NETWORK&trkEmail=eml-email_notification_digest_01-notification_card_SHARED_BY_YOUR_NETWORK_cta-0-SHARED_BY_YOUR_NETWORK-null-9bbst7~m26dl1b1~ha-null-null&eid=9bbst7-m26dl1b1-ha&otpToken=MTcwMzFkZTIxMDJmYzBjNWIxMjQwNGVkNDQxNmUwYjE4ZmM2ZDI0MjlhYTg4ODYxNzhjNTA1NmQ0OTVmNWVmNmY0ZDNkZjgyNzRmM2ZlZDU3MmFjYzM4OWQ4ZDhlMDEzYjMxZTQ3NGE0N2RiOWZkMWVjOTI1NywxLDE%3D" style="background-color: #ffffff;border-bottom: 1px solid #000000;border-left: 1px solid #000000;border-radius: 28px;border-right: 1px solid #000000;border-top: 1px solid #000000;color: #353535;display: inline-block;font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;font-weight: 700;mso-border-alt: none;padding-bottom: 5px;padding-top: 5px;text-align: center;text-decoration: none;width: auto;word-break: keep-all;box-sizing: border-box;border: none !important;" target="_blank">
                                                                            <span style="word-break: break-word;padding-left: 20px;padding-right: 20px;font-size: 12px;display: inline-block;letter-spacing: normal;box-sizing: border-box;border: none !important;">
                                                                                <span style="word-break: break-word;line-height: 24px;box-sizing: border-box;border: none !important;">Yorum Yap</span>
                                                                            </span>
                                                                        </a>
                                                                        <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row row-6"
                            role="presentation"
                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                            width="100%"
                        >
                            <tbody style="box-sizing: border-box;border: none !important;">
                                <tr style="box-sizing: border-box;border: none !important;">
                                    <td style="box-sizing: border-box;border: none !important;">
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;color: #000000;width: 650px;margin: 0 auto;box-sizing: border-box;border: none !important;"
                                            width="650"
                                        >
                                            <tbody style="box-sizing: border-box;border: none !important;">
                                                <tr style="box-sizing: border-box;border: none !important;">
                                                    <td class="column column-1" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;font-weight: 400;text-align: left;vertical-align: top;border-top: 0px;border-right: 0px;border-bottom: 0px;border-left: 0px;box-sizing: border-box;border: none !important;" width="100%">
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="image_block block-1"
                                                            role="presentation"
                                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                                                            width="100%"
                                                        >
                                                            <tr style="box-sizing: border-box;border: none !important;">
                                                                <td class="pad" style="width: 100%;box-sizing: border-box;border: none !important;">
                                                                    <div align="center" class="alignment" style="line-height: 10px;box-sizing: border-box;border: none !important;">
                                                                        <div style="max-width: 650px;box-sizing: border-box;border: none !important;">
                                                                            <img
                                                                                alt="Image"
                                                                                height="auto"
                                                                                src="/images/Btm.png"
                                                                                style="display: block;height: auto;border: 0;width: 100%;box-sizing: border-box;border: none !important;"
                                                                                title="Image"
                                                                                width="650"
                                                                            >
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row row-7"
                            role="presentation"
                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;box-sizing: border-box;border: none !important;"
                            width="100%"
                        >
                            <tbody style="box-sizing: border-box;border: none !important;">
                                <tr style="box-sizing: border-box;border: none !important;">
                                    <td style="box-sizing: border-box;border: none !important;">
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;color: #000000;width: 650px;margin: 0 auto;box-sizing: border-box;border: none !important;"
                                            width="650"
                                        >
                                            <tbody style="box-sizing: border-box;border: none !important;">
                                                <tr style="box-sizing: border-box;border: none !important;">
                                                    <td class="column column-1" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;font-weight: 400;text-align: left;padding-bottom: 5px;padding-top: 5px;vertical-align: top;border-top: 0px;border-right: 0px;border-bottom: 0px;border-left: 0px;box-sizing: border-box;border: none !important;" width="100%">
                                                        <div class="spacer_block block-1" style="height: 20px;line-height: 20px;font-size: 1px;box-sizing: border-box;border: none !important;"></div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- End -->
    </body>
</html>
`);

  return (
    <div>
      <JoditEditor
        value={editor}
        config={config}
        onChange={(newContent) => setEditor(newContent)}
      />
    </div>
  );
};

export default RinchTextEditor;
