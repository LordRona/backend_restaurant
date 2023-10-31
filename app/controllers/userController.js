const User = require("../models/user.model");
const userLocation = require("../models/user.model");
const { VerifyToken } = require("../middlewares/authJwt");

const Signin = require("../controllers/auth.controller");

const updateUserPassword = async (req, res) =>{
    const { oldPassword, newPassword } = req.body;

    if(!oldPassword || !newPassword ) {
        return res.status(500).send("Please provide both fields");
    }

    const user = await User.findOne({ _id: req.user.userId });

    const isPasswordCorrect = await user.comparePassword(oldPassword);

    if(!isPasswordCorrect) return res.status(404).send("Invalid credentials");

    user.password = newPassword;

    await user.save();
    res.status(StatusCode.OK).json({ msg: "Password changed successfully!" });
}

const showCurrentUser = async (req, res) =>{
    res.status(200).json({ user })
}

const updateUserNameAndPhone = async (req, res) =>{
    const { phone, username } = req.body;

    if(!phone || !username) return res.status(404).send("Please provide both fields! ");

    const user = await User.findOne({
         _id: req.user.userId 
    });

    user.phone = phone;
    user.username = username;

    await user.save();

    const tokenUser = VerifyToken.verifyToken(user);
    Signin.signin({ res, user: tokenUser });
}

const suspendAccount = async (req, res) =>{

        const { id } = req.params;
        User.findByIdAndUpdate(id, { suspended: true }, { new: true }).then((user) => {
            if(user){
                res.status(200).json({ user });
            }else{
                res.status(400).json({ message: "User not found!" });
            }
        }).catch (error => { res.status(404).json({ message: "Error occured while trying to Suspend User!"})
    });
};

const createUserLocation = async (req, res) =>{
    try{
        const { userId, latitude, longitude } = req.body;

        //Creating the location and stored in the database!
        const location = new userLocation({
            userId,
            latitude,
            longitude
        });

        await location.save();

        res.status(200).json({message: "Sent successfully!" });
    }catch(error){
        res.status(404).json({ message: "Error occured while creating location!" });
    }
};

// const getUserLocation = async (req, res) =>{
//     try{
//         const { userId } = req.params;

//         const userLocation = await User.findOne({ userId });

//         if(!userLocation){
//             res.status(404).json({ message: "User not found!" });
//         };

//          // Use the Google Maps API to place a pin on the map at the customer's location.
//         const googleMapsServices = new GoogleMapsServices({
//           key: 'YOUR_GOOGLE_MAPS_API_KEY',
//         });
//     }catch(error){
//         res.status(404).json({ message: "Error occured while getting user location!" });
//     }
// }


module.exports = {
    updateUserPassword,
    updateUserNameAndPhone,
    showCurrentUser,
    suspendAccount,
}