from fastapi import FastAPI
import requests

app = FastAPI()


@app.get("/")
def read_root():
    return {"hello": "world"}



@app.get("/search")
def query_codes(terms):
    params = {"sf": "code,name", "terms": terms}
    url = "https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search"
    response = requests.get(url, params)
    data = response.json()
    return data
