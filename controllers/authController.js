import User from '../models/User.js';
import generateToken from '../utils/jwt.js';

// Register
const registerUser = async (req, res) => {
     const { name, email, password } = req.body;
try {
      const userExists = await User.findOne({ email });
      if(userExists) return res.status(400).json({ message: 'User already exists' });

      const user = await User.create({ 
        name, 
        email, 
        password, 
        
      });
      res.status(201).json({message: 'User registered successfully',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
            
        });
   

 } catch (err) {
   console.error(" INTERNAL CONTROLLER CRASH DIRECT TRACE:", err); 
    res.status(500).json({ message: 'Server error', debug: err.message });
 }      
  
};

// Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(user && await user.matchPassword(password)){
        res.json({message:"User loged in Successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }   
};

export default { registerUser, loginUser };
