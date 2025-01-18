import User from "../models/user.model.js";

export async function userLoggedInMiddleWare(req, res, next) {
  try {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    const loggedInUser = await User.findOne({ refreshToken }).select("-password");

    if (!loggedInUser) throw new HTTPCustomError(404, "You are not logged In, Please Log In!");

    req.user = loggedInUser;
    next();
  } catch (error) {
    return httpErrorHandler(error, res);
  }
}