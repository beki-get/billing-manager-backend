//middleware to verify chapa webhook signature
//Ensures the payload is not changed and originates from chapa

import crypto from 'crypto'

export const validateSignature=(req,res,next)=>{
  try{
    const chapaSignature=req.headers['x-chapa-singnature']
    const secretKey=process.env.CHAPA_SECRET_KEY

    if(!chapaSignature){
       console.error('Webhook rejected: Missing x-chapa-signature header')
       return res.status(400).json({
           error:{
               code:'UNAUTHORIZED-WEBHOOK',
               message:'Missing security signature header'
           }
       })
    }

   const hash=crypto
    .createHmac('sha256',secretKey)
    .update(JSON.stringify(req.body))
    .digest('hex');

    if(hash.length!==chapaSignature.length){
        console.error('Webhook rejected: Invalid signature length')
        return res.status(400).json({
            error:{
                code:'INVALID-SIGNATURE',
                message:'Signature verification failed'
            }
        })
    }

    const isSignatureValid=crypto.timingSafeEqual(
       Buffer.from(hash,'utf-8'),
       Buffer.from(chapaSignature,'utf-8')
    )

    if(!isSignatureValid){
         console.error('webhook rejected:')
         return res.status(401).json({
            error:{
                code:'INVALID-SIGNATURE',
                message:'Signature verification failed'
            }
         })
    }
    next();
   } catch (error){
      console.error('Webhook Signature Internal error',error)
        return res.status(500).json({
           error:{
                code:'SIGNATURE_VERIFICATION_ERROR',
                message:'An internal error occurred during request validation'
           }
        })
   }
}