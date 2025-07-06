from fastapi import FastAPI, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from services import fetch_and_process_products, get_product_by_id
from fastapi import FastAPI, Request
from pydantic import BaseModel
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "FastAPI running"}

class LoginData(BaseModel):
    username: str
    password: str

@app.post("/login")
def proxy_login(data: LoginData):
    response = requests.post("https://zadatak.konovo.rs/login", json=data.dict())
        
    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Neispravni podaci za prijavu.")

    return response.json()


@app.get("/products")
def get_products(
    authorization: Optional[str] = Header(None),
    kategorija: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="JWT token missing or invalid")

    token = authorization.split(" ")[1]
    try:
        products = fetch_and_process_products(token, kategorija, search)
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/products/{product_id}")
def get_product(product_id: int, authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="JWT token missing or invalid")

    token = authorization.split(" ")[1]
    product = get_product_by_id(product_id, token)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product