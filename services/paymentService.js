//user clicks pay now                                                                                                       
//backend payment seession created
//webhook recieved from payment gateway
//data base updated

const CHAPA_BASE_URL=process.env.CHAPA_BASE_URL
const REQUEST_TIMEOUT_MS=Number(process.env.REQUEST_TIMEOUT_MS) || 10000

export const makeChapaRequest= async (endpoint,options={}) =>{
    
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