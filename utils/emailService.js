import nodemailer from 'nodemailer';

const transporter=nodemailer.createTransport({
    host:process.env.MAILTRAP_HOST,
    port:parseInt(process.env.MAILTRAP_PORT),
    secure:false,
    auth:{
       user:process.env.MAILTRAP_USER,
       pass:process.env.MAILTRAP_PASS
    },
});

const sendMail= async ({from,to,subject,text,html})=>{
    try{
        return await transporter.sendMail({
            from,
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