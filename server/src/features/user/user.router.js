require("dotenv").config();

const { Router } = require("express");
const UserModel = require("./user.model");
const app = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_TOKEN = process.env.SECRET_TOKEN;

const nodemailer = require("nodemailer");
const CartModel = require("../cart/cart.model");
const OTP = require("./otpModel");
const transporter = nodemailer.createTransport({
  service:"gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

app.get("/", async (req, res) => {

  try {
    let data = await UserModel.find();
    return res.status(200).send(data);
  } catch (er) {
    return res.status(404).send(er.message);
  }
});

app.get("/:email", async (req, res) => {

  console.log(req.params.email)
  if(req.params.email){
    let data = await UserModel.findOne({email:req.params.email});
    return res.status(200).send(data);
  }

  return res.send("404")

});



// Login Route
app.post("/login", async (req, res) => {

  const { email, password } = req.body;

 console.log(email,password)

  if (!email || !password) {
    return res.status(403).send("Enter Credianteials");
  }
  const User = await UserModel.findOne({ email });
 
  if (!User) return res.status(404).send("User Not Found");

  try {
    const match = bcrypt.compare(password, User.password);
    if (match) {
      const token = await jwt.sign(
        {
          _id: User.id,
          name: User.username,
          role: User.role,
          email:User.email,
          password: User.password,
        },
        process.env.SECRET_TOKEN,
        {
          expiresIn: "7 days",
        }
      );

      const mailOptions = {
        from: {
            name:"Ashutosh Kumar",
            address:process.env.USER_EMAIL
        },
        to: email, // list of receivers
        subject: "Login Successful", // Subject line              
        html: "<b>Account Login Successfully</b>", // html body
    }

    const sendMail = async(transporter,mailOptions) => {
      try{
          await transporter.sendMail(mailOptions);
          console.log("message sent successfilly");
      }
      catch(error){
          console.log(error);
      }
  }

    sendMail(transporter,mailOptions);

      return res
        .status(200)
        .send({ message: "Login success", token, refresh_token, email });
    } else {
      return res.status(401).send({ message: "Authentication Failed" });
    }
  } catch {
    return res.status(401).send({ message: "Authentication Failed" });
  }
});

// Signup Route
app.post("/signup", async (req, res) => {
  const {
    email,
    firstName, lastName,
    password,
    weight,
    height,
    age,
    role,
    gender,
    bodyType,
  } = req.body;

  console.log(req.body)
  
  let username = firstName + " "+ lastName

  if (!email || !password || !username) {
    return res.status(403).send("Enter Credentails");
  }

  try {
    const exist = await UserModel.findOne({ email });
    if (exist)
      return res
        .status(403)
        .send({ message: "User Already Created Try Logging in" });

      const hash = await bcrypt.hash(password,10);

      const user = await UserModel({
        email,
        username,
        password: hash,
        weight,
        height,
        age,
        role,
        gender,
        bodyType,
      });

      const X = await CartModel.create(
        { email: email, cart: [], purchase:[] }
      )
      await user.save();
      
    
      const mailOptions = {
        from: {
            name:"Ashutosh Kumar",
            address:process.env.USER_EMAIL
        },
        to: email, // list of receivers
        subject: "Account Created", // Subject line
        text: "Your Account has been created successfully", // plain text body                
        html: "<b>Account Created Successfully</b>", // html body
    }

    const sendMail = async(transporter,mailOptions) => {
      try{
          await transporter.sendMail(mailOptions);
          console.log("message sent successfilly");
      }
      catch(error){
          console.log(error);
      }
  }

  sendMail(transporter,mailOptions);

  }
  catch (er) {
    return res.status(404).send(er.message);
  }
});


app.post("/reset-password/getOtp", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(403).send("Enter Valid Email");
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(403).send("Account with this email Not Found");
  }

  const otpexists = await OTP.findOne({ email });
  if(otpexists){
    return res.status(403).send("OTP already sent");
  }

  try {
    let otp = Math.floor(100000 + Math.random() * 900000);
    otp = otp.toString();

    await OTP.create({ email,otp });

     const mailOptions = {
            from: {
                name:"Ashutosh Kumar",
                address:process.env.USER_EMAIL
            },
            to: email, // list of receivers
            subject: "Password Reset OTP", // Subject line               
            html: `<h1>OTP is ${otp}</h1>`, // html body
    }

    const sendMail = async(transporter,mailOptions) => {
      try{
          await transporter.sendMail(mailOptions);
          console.log("message sent successfilly");
      }
      catch(error){
          console.log(error);
      }
  }

  sendMail(transporter,mailOptions);

  return res.status(200).json({
    message:"otp sent successfully",
    success:true
});

  } catch (er) {
    return res.status(404).send(er.message);
  }
});

app.post("/reset-password/verifyOtp", async (req, res) => {
  const { email,otp } = req.body;
  if (!otp) {
    return res.status(404).send("Enter Otp");
  }

  try {
    const otpexists = await OTP.findOne({ email });
        if(!otpexists){
            return res.status(403).send("otp expires");
        }

        const match = otp.toString() === otpexists.otp;
        if(!match){
            return res.status(403).send("enter valid otp");
        }

        await OTP.findOneAndUpdate({email},{flag:true});

        return res.status(200).json({
            message:"otp verified successfully",
            success:true
        });
  } catch (er) {
    return res.status(404).send(er.message);
  }
});

app.post("/reset-password/reset", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(403).send("Enter credentails");
  }
 
  try {
    const otp = await OTP.findOne({email});
        if(!otp){
            return res.status(403).send("session expired!");
        }

        if(!otp.flag){
            return res.status(403).send("un-authorized");
        }

        await OTP.findOneAndDelete({email});

        const hash = await bcrypt.hash(password, 10);
        const data = await User.findOneAndUpdate(
            { email },
            { password: hash }
        );

        const mailOptions = {
          from: {
              name:"Ashutosh Kumar",
              address:process.env.USER_EMAIL
          },
          to: email, // list of receivers
          subject: "Password Updated Successfully", // Subject line               
          html: `<h1>Your Passwrod Updated Successfully</h1>`, // html body
      }

      const sendMail = async(transporter,mailOptions) => {
        try{
            await transporter.sendMail(mailOptions);
            console.log("message sent successfilly");
        }
        catch(error){
            console.log(error);
        }
    }

    sendMail(transporter,mailOptions);

    return res.status(201).send(data);
  } catch (e) {
    return res.status(502).send("otp cannot be send");
  }
});

app.post("/verify", async (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).send("UnAuthorized , no user logged in");
  }

  try {

    const decoded = jwt.decode(token);
    let TimeNow_10DIGIT = new Date().getTime().toString();
    TimeNow_10DIGIT = TimeNow_10DIGIT.split("").slice(0, 10).join("");

      const verify = jwt.verify(token,process.env.SECRET_TOKEN);
      if (verify) {
        const Newtoken = jwt.sign(
          {
            id: verify._id,
            name: verify.name,
            age: verify.age,
            role: verify.role,
          }, //data
          process.env.SECRET_TOKEN,
          { expiresIn: "5 mins" }
        );
        return res
          .status(200)
          .send({ message: `New Token Created`, Newtoken, refreshtoken });
      }
      return res.status(404).send("token is expired and added to blacklist");
    } 
  catch (e) {
    return res.status(502).send("kuch to gadbad he daya");
  }
});




module.exports = app;
