import requests
import re
from fastapi import HTTPException
from globalState import globalProductsList
from dotenv import load_dotenv
import os

load_dotenv()

BASE_URL = os.getenv("BASE_URL")

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


def fetch_and_process_products(token: str):
    raw_products = fetch_products_from_external_api(token)
    processed = [process_product(p) for p in raw_products] # mozda je ovo neispravna primena zahteva za obradu podataka unutar jednog proizvoda ali posto sam odlucio da vam neopteretim server i podatke sa vaseg servera cuvam na mom backend-u, onda sam mislio da je efikasnije da odmah pri cuvanju proizvoda u globalni dict da ih odmah obradim sto se tice monitora i reci 'brzina'

    return processed
