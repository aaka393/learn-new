from fastapi import APIRouter,HTTPException,status,Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.User import User as UserModel, LoginUser, UpdateUser
from app.config.db import db as MongoDB
import bcrypt
import bson
import os
from datetime import datetime
from dotenv import load_dotenv
import jwt

load_dotenv()

JWT_AUTH = os.getenv("JWT_AUTH", "")
security = HTTPBearer()

# berarer token
async def get_current_user(credentials:HTTPAuthorizationCredentials=Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_AUTH, algorithms=["HS256"])
        return payload['userId']
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="invalid token")


router = APIRouter(prefix="/api/v1/auth")

# collection
authCollection = MongoDB['users']

@router.post('/register')
async def registerUsere(data:UserModel):
    data = data.dict()

    # check existatnce of user
    check_exist = await authCollection.find_one({"email":data['email'].lower()})
    if check_exist:
        raise HTTPException(status.HTTP_400_BAD_REQUEST,"User Already Exist with this Email")
        return
    
    # set created_at
    from datetime import datetime
    data["create_at"] = datetime.utcnow()

    # ensure empty string instead of None
    data["address"] = data.get("address") or ""
    data["mobile"] = data.get("mobile") or ""

    salt = bcrypt.gensalt(12)
    data['password'] = bcrypt.hashpw(data['password'].encode(),salt).decode()

    # insert user
    result = await authCollection.insert_one(data)

    # fetch inserted document
    document = await authCollection.find_one({"_id":result.inserted_id},{
        "name":1,
        "email":1,
        "address":1,
        "mobile":1
    })

    # convert ObjectId → str
    document['_id'] = str(document['_id'])
    # print(doc)
    #token
    token = jwt.encode({"userId": document['_id']}, JWT_AUTH, algorithm="HS256")

    return {
        "msg":"User Registered Successfully",
        "token":token,
        "data":document,
    }


@router.post('/login')
async def loginUsere(data: LoginUser):
    data = data.dict()

    # get user WITH password
    user = await authCollection.find_one({"email": data["email"].lower()})
    if not user:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "User Does not Have Account")

    # verify password
    if not bcrypt.checkpw(data["password"].encode(), user["password"].encode()):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid Credentials")

    # fetch user WITHOUT password
    user_public = await authCollection.find_one(
        {"_id": user["_id"]},
        {"password": 0}   # exclude password
    )

    # convert ObjectId → string
    user_public["_id"] = str(user_public["_id"])
    token = jwt.encode({"userId": user_public['_id']}, JWT_AUTH, algorithm="HS256")

    return {
        "msg": "User Logged In Successfully",
        "data": user_public,
        "token": token
    }


@router.get("/profile")
async def userProfile(user_id: str = Depends(get_current_user)):
    user = await authCollection.find_one({"_id": bson.ObjectId(user_id)}, {
        "password": 0  # remove password field
    })

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user["_id"] = str(user["_id"])  # convert ObjectId to string
    return user

@router.put("/profile")
async def userProfile(data:UpdateUser,user:str = Depends(get_current_user)):
    await authCollection.find_one_and_update({"_id":bson.ObjectId(user)},{
        "$set":data.dict()
    })
    return {
        "msg":"Profile Updated !"
    }
    # user = await authCollection.find_one({"_id":bson.ObjectId(data)},{
    #     "password": 0
    # })
    # user['_id'] = str(user['_id'])
    # return data