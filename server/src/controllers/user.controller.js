import { HTTPCustomError, httpErrorHandler } from "../config/error.js";
import { generateHoroscope, generateKundali } from "../config/kundali.js";
import User from "../models/user.model.js";
// import AstronomyEngine from "astronomy-engine";

export async function userRegisterController(req, res) {
  try {
    const { name, email, phone, password, fcm_token } = req.body;

    if (!name || !email || !phone || !password) {
      throw new HTTPCustomError(400, "Enter all the required fields to register!");
    }

    if (phone.length !== 10) {
      throw new HTTPCustomError(400, "Phone Number should be 10 digits in length!");
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      throw new HTTPCustomError(
        400,
        `Provided credentials must be unique, account with this ${existingUser.email === email ? "Email" : "Phone Number"} already exists!`);
    }

    const lastUser = await User.findOne().sort({ user_id: -1 }).exec();
    const user_id = lastUser ? lastUser.user_id + 1 : 1;

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      user_id,
      name,
      email,
      phone,
      password: passwordHash,
      bookings: [],
      wallet_balance: 0,
      referral_code: '',
      fcm_token
    });

    await newUser.save();

    const refreshToken = assignJwtToken({ user_id: newUser.user_id });
    res.cookie('token', refreshToken, { maxAge: process.env.JWT_EXPIRATION });

    newUser.refreshToken = refreshToken
    await newUser.save();

    return res.status(200).json({
      status_code: 200,
      authToken: refreshToken,
      message: 'User registered successfully!',
      user_id: newUser.user_id
    });
  } catch (error) {
    return httpErrorHandler(error, res);
  }
}

export async function userLoginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new HTTPCustomError(400, "Email and password are required!");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new HTTPCustomError(400, "No user account with this email found!");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new HTTPCustomError(400, "Incorrect password!");
    }

    const refreshToken = assignJwtToken({ user_id: user.user_id });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('token', refreshToken, { maxAge: 24 * 60 * 60 * 1000 });
    user.password = undefined;

    return res.status(200).json({
      status_code: 200,
      authToken: refreshToken,
      message: 'User logged in successfully!',
      user
    });
  } catch (error) {
    return httpErrorHandler(error, res)
  }
}

export async function userLogoutController(req, res) {
  try {
    res.cookie('token', '', { expires: new Date(0) });

    const user = req.user;
    user.refreshToken = "";
    await User.save();

    return res.status(200).json({
      status_code: 200,
      message: "Logged out successfully!"
    })
  } catch (error) {
    return httpErrorHandler(error, res);
  }
}

export async function userProfileController(req, res) {
  try {
    if (!req.user) throw new HTTPCustomError(404, "Please Log In as user to access the content!");

    return res.status(200).json({
      status_code: 200,
      data: req.user
    })
  } catch (error) {
    return httpErrorHandler(error, res);
  }
}

export async function userGetKundaliController(req, res) {
  try {
    const dateOfBirth = "2003/05/20"; // YYYY-MM-DD
    const timeOfBirth = "07:30"; // HH:MM (24-hour format)
    const latitude = 19.5761; // Latitude of Pune, India
    const longitude = 74.2070;

    // const { dateOfBirth, timeOfBirth, latitude, longitude } = req.body;

    try {
      const kundali = await generateKundali({ dateOfBirth, timeOfBirth, latitude, longitude });
      console.log(kundali)
      const horoscope = generateHoroscope(kundali.planetsInHouses);
      console.log(horoscope)
      return res.status(200).json({
        kundali
        // horoscope: horoscope
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    console.error(error)
    return httpErrorHandler(error, res);
  }
}