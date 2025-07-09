from fastapi import FastAPI, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from services import fetch_and_process_products
from fastapi import FastAPI, Request
from pydantic import BaseModel
import requests
from globalState import globalProductsList, last_fetch_time, FETCH_COOLDOWN_SECONDS
from dotenv import load_dotenv
import os
import time

load_dotenv()

BASE_URL = os.getenv("BASE_URL")

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
    response = requests.post(f"{BASE_URL}/login", json=data.dict())
        
    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Neispravni podaci za prijavu.")

    return response.json()

@app.get("/startup")
def get_products(
    authorization: Optional[str] = Header(None),
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="JWT token missing or invalid")

    token = authorization.split(" ")[1]

    
    try:
        products = fetch_and_process_products(token)

        global globalProductsList
        globalProductsList = {product["sku"]: product for product in products}

        categories = {
        p.get("categoryName")
        for p in globalProductsList.values()
        if p.get("categoryName")
        }

        return sorted(list(categories))
         
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/search")
def get_by_search(
    authorization: Optional[str] = Header(None),
    kategorija: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="JWT token missing or invalid")

    global globalProductsList

    products = list(globalProductsList.values())

    if search:
        print("Search:", search)
        search_lower = search.lower()
        products = [
            p for p in products
            if p.get("naziv") and search_lower in p["naziv"].lower()
        ]

    if kategorija:
        print("Kategorija:", kategorija)
        category_lower = kategorija.lower()
        products = [
            p for p in products
            if p.get("categoryName") and category_lower == p["categoryName"].lower()
        ]

    return products




@app.get("/products/{sku}")
def get_product(sku: str, authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="JWT token missing or invalid")

    global globalProductsList

    product1 = globalProductsList.get(sku)

    if not product1:
        raise HTTPException(status_code=404, detail=f"Product with SKU '{sku}' not found")
    return product1