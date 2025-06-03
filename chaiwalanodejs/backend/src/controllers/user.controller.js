

//controller/user.controller.js
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from "../models/user.model.js"
import { upload } from "../middlewares/multer.middleware.js"
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';

export const generateAccessAndRefreshTokens = async (userId) => {
    try {
        if (!userId) {
            throw new Error("userId is undefined or null");
        }

        console.log("Generating tokens for:", userId);

        const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15m',
        });

        const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '7d',
        });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Token generation error:", error.message);
        throw new Error("something went wrong while generating tokens");
    }
};



const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;

    if (
        [fullName, email, username, password].some((field) =>
            field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedsUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedsUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // console.log(req.files)

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }

    const user = await User.create({
        fullName,
        email,
        username: username.toLowerCase(),
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong, while creating user"
        );
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username, or email
    // find the user
    // password check
    // access and refresh token generate
    // send cookies
    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or password is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken");

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken,
                },
                "User logged in successfully"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, {
        $set: {
            refreshToken: undefined
        }
    },
        {
            new: true,

        }
    )

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newrefreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(
                new ApiResponse(
                    { accessToken, refreshToken: newrefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message ||
            "Invalid refresh token"
        )
    }
})

const changeCurrentPassword = asyncHandler(async(req, res) =>{
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
       throw new ApiError(400, "Invalid old password")
    }
    
    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(200, req.user, "current user fetched successfully")
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if(!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

   const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiError (200, user, "Account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
         throw new ApiError(400, "Error while uploading on avatar")
    }

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")
})

const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

   const coverImage = uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url){
         throw new ApiError(400, "Error while uploading on cover")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res.status(200)
    .json(
        new ApiResponse(200, user)
    )
})

export { 
    registerUser, 
    loginUser, 
    logoutUser,
    refreshAccessToken, 
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar
 };
