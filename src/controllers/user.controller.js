import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async(req, res) => {
    // get user details from frontend
    // validation- not empty
    // check if user already exists: username email
    // check for image, check for avatr
    //upload them to cloudinary , avatar
    // create user object- create enter in db
    // remove password and refersh token field 
    // check for user creation
    //return res 

    const { fullName, email, password } = req.body
    console.log("email", email);

    if (
        [fullName, email, username, password].some((field) => field.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "user name exitsts")
    }
    const avatarLocalPath = req.files.avater[0].path;
    const coverImagePath = req.files.coverImage[0].path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImagePath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
        rmail,
        password,
        username: username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Sometning went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registerd successfully")
    )
})

export { registerUser };