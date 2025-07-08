import requests
import re
from fastapi import HTTPException

BASE_URL = "https://zadatak.konovo.rs"

def fetch_products_from_external_api(jwt_token: str):
    headers = {
        "Authorization": f"Bearer {jwt_token}"
    }
    response = requests.get(f"{BASE_URL}/products", headers=headers)

    if response.status_code == 401:
        raise Exception("Invalid or expired JWT token")

    response.raise_for_status()#ovo sam zapravo video na jednom sajtu dok sam istrazivao error hendlovanje da mogu da koristim za hvatanje 4xx i 5xx greske.
    return response.json()


def process_product(product: dict) -> dict:
    
    #print(product["categoryName"])

    if product.get("categoryName") and product.get("categoryName").lower() == "monitori":
        product["price"] = round(float(product["price"]) * 1.1, 2)# uvek mozemo i da ga zaokruzimo na integer ali zbog duha dinara ostavio sam dve decimale zbog "para" koji nisu vec dugi niz godina u upotrebi
    else:
        product["price"] = round(float(product["price"]), 2)# uvek mozemo i da ga zaokruzimo na integer ali zbog duha dinara ostavio sam dve decimale zbog "para" koji nisu vec dugi niz godina u upotrebi

    if product.get("opis"):
        opis = product.get("opis", "")
        product["opis"] = re.sub(r"(?i)\bbrzina\b", "performanse", opis)#pokusao sam sa replace() da odradim zamenu ali ne moze jer je iskljucivo case sensitive, sa re.sub() ako dodam ?i postaje case insensitive zamena

    if product.get("description"):
        description = product.get("description", "")
        product["description"] = re.sub(r"(?i)\bbrzina\b", "performanse", description)#pokusao sam sa replace() da odradim zamenu ali ne moze jer je iskljucivo case sensitive, sa re.sub() ako dodam ?i postaje case insensitive zamena


    return product


def fetch_and_process_products(token: str, kategorija: str = None, search: str = None):
    raw_products = fetch_products_from_external_api(token)
    processed = [process_product(p) for p in raw_products]

    if kategorija:
        processed = [
            p for p in processed if p.get("kategorija", "").lower() == kategorija.lower()
        ]

    if search:
        search = search.lower()
        processed = [
            p for p in processed
            if search in p.get("naziv", "").lower() or search in p.get("opis", "").lower()
        ]

    return processed


def get_product_by_id(sku: int, token: str):
    headers = {
        "Authorization": f"Bearer {token}"
    }

    print("hello I am services.py")
    print(f"{BASE_URL}/products/{sku}")
    print(token)

    try:
        response = requests.get(f"{BASE_URL}/products/{sku}", headers=headers)
        print(response)
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="Product not found")
        elif response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch product")

        return response.json()

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Request error: {str(e)}")