import nodemailer from 'nodemailer';

const transporter=nodemailer.createTransport({
    host:process.env.MAILTRAP_HOST,
    port:process.env.MAILTRAP_PORT,
    secure:'true',
    auth:{
       user:process.env.MAILTRAP_USER,
       pass:process.env.MAILTRAP_PASS
    },
});

const sendMail= async ({to,subject,text,html})=>{
    try{
        return await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to,
            subject,
            text,
            html
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
export default { sendMail };