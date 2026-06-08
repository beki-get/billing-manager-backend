//this service will handle all interactions with the Chapa payment gateway, 
//including initializing payment sessions and handling callbacks.

const CHAPA_BASE_URL=process.env.CHAPA_BASE_URL
const REQUEST_TIMEOUT_MS=Number(process.env.REQUEST_TIMEOUT_MS) || 10000

export const makeChapaRequest= async ( endpoint,options= {} ) =>{
    
    const url='${CHAPA_BASE_URL}${endpoint}'
    const controller=new AbortController()
    const timeoutId=setTimeout(()=>controller.abort,REQUEST_TIMEOUT_MS)
    
    const config={
        ...options,
        signal:controller.signal,
        headers:{
            'Authorization':'Bearer ${process.env.CHAPA_SECRET_KEY}',
            'Content-Type':'application/json'
        }
    }

    try{
        const response= await fetch(url,config)
        clearTimeout(timeoutId)
        const data= await response.json()

        if(!response.ok){
            const error= new Error(data.message ||'Chapa API error')
            error.statusCode=response.status;
            throw error;
        }
        return data  

    } catch(error){
       clearTimeout(timeoutId)
       if(error.name==='AbortError'){
           const timeoutError=new Error('Gateway request time out')
           timeoutError.statusCode=504
           throw timeoutError
       }
       throw error;
    }
}

export const initializePaymentSession= async (paymentData) =>{
    return await makeChapaRequest('/transaction/initialize',{
          method:POST,
          body:JSON.stringify({
             amount:paymentData.amount,
             currency:paymentData.currency,
             email:paymentData.email,
             first_name:paymentData.firstName,
             last_name:paymentData.lastName,
             tx_ref:paymentData.txRef,
             "customization[title]": "Invoice Payment",
             "customization[description]": `Payment for Invoice ${paymentData.invoiceNumber}`,
             callback_url:paymentData.callbackUrl,
          })
    })
}