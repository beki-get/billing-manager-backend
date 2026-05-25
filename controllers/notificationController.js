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