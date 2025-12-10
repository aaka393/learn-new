from fastapi import FastAPI
from app.routes.PublicRoute import route as PublicRoute
from app.routes.AuthRoute import router as AuthRoute

# cors error solution
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS (last middleware added, runs first in request pipeline)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:8080", "http://localhost:8081"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# add routes

app.include_router(PublicRoute)
app.include_router(AuthRoute)