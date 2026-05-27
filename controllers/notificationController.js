import notificationService from '../services/notificationService.js';
import Notification from '../models/Notification.js';


const getNotifications = async (req, res) => {
   try{
    const {businessId}=req.params;
    if(!req.user.businesses.includes(businessId)){
        return res.status(403).json({message:'Unauthorized access'})
    }
    const notifications= await notificationService.getNotifications(businessId);
    res.json(notifications);
   } catch(error){
    console.error('Error fetching notifications:', error);
    res.status(500).json({message:'Internal server error'})
   }
}
const deleteNotifications=async(req,res)=>{
      try {
        const {id}=req.params
        const businessId=req.user.businesses ;
        if(!req.user.businesses.includes(businessId)){
          return res.status(403).json({message:'Unauthorized access'})
        } 
       const deleted=await notificationService.deleteNotifications(id, businessId);
         if(deleted.deletedCount===0){
            return res.status(404).json({message:'Notification not found'})
         }
    }catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({message:'Internal server error'})
      }
        
}
export default { getNotifications, deleteNotifications };