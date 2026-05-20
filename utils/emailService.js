import nodemailer from 'nodemailer';

const transporter=nodemailer.createTransport({
    host:"process.env.EMAIL_HOST",
    port:'465',
    secure:'true',
    auth:{
       user:process.env.EMAIL_USER,
       pass:process.env.EMAIL_PASS
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