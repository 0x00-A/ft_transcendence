import requests
from django.conf import settings

def translate_text(text, target_language):
    api_key = settings.API_KEY
    url = "https://api-free.deepl.com/v2/translate"
    params = {
        "auth_key": api_key,
        "text": text,
        "target_lang": target_language.upper() 
    }
    response = requests.post(url, data=params)
    
    if response.status_code == 200:
        print("=========================================================")
        print("response=" + response.json()["translations"][0]["text"])
        return response.json()["translations"][0]["text"]
    else:
        raise Exception(f"Error: {response.status_code}, {response.text}")

