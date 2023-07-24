// const sgMail = require("@sendgrid/mail");

import sgMail from "@sendgrid/mail";
import dayjs from "dayjs";

sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY);
// let sendEmail;

export const sendEmail = async (req: any, res: any) => {
	//

	type DataType = {
		name: string;
		email: string;
		type: string;
		message: string;
		date: string;
	};

	const data: DataType = req.body;

	const sendMessageTxt = `
    ${process.env.NEXT_PUBLIC_STUDIO_NAME}へのお問い合わせありがとうございました。

    以下の内容でお問い合わせを受け付けいたしました。
    お問合せの内容を確認後、
    折返しメールにてご連絡いたします。
    
    ※本メールは自動送信されています。このメールに返信いただいても回答できませんので、あらかじめご了承ください。
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    お名前：${data.name}
    E-Mail：${data.email}
    
    お問い合せ日時：${data.date}
    お問い合わの種類：${data.type}
    お問い合わせ内容：${data.message}
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

	const mailTitle = `【自動返信メール】 ${process.env.NEXT_PUBLIC_STUDIO_NAME}へのお問い合わせありがとうございました。`;

	const msg = {
		to: data.email,
		from: process.env.NEXT_PUBLIC_STUDIO_EMAIL,
		subject: mailTitle,
		text: sendMessageTxt,
	};

	const msgForself = {
		to: process.env.NEXT_PUBLIC_STUDIO_EMAIL,
		from: process.env.NEXT_PUBLIC_STUDIO_EMAIL,
		subject: "お問い合わせメール受信",
		text: sendMessageTxt,
	};

	let status;

	try {
		status = await sgMail.send(msg);
		const resSelf = await sgMail.send(msgForself);
	} catch (error) {
		console.log(error);
	}

	res.send(status);
};

export default sendEmail;
