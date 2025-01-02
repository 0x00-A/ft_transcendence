# import requests
# from django.conf import settings


# def translate_text(text, target_language):
#     api_key = settings.API_KEY
#     url = "https://api-free.deepl.com/v2/translate"
#     params = {
#         "auth_key": api_key,
#         "text": text,
#         "target_lang": target_language.upper()
#     }
#     response = requests.post(url, data=params)

#     # print("====== translate ======")
#     if response.status_code == 200:
#         return response.json()["translations"][0]["text"]
#     else:
#         raise Exception(f"Error: {response.status_code}, {response.text}")


from googletrans import Translator

def translate_text(text, target_language):
    translator = Translator()
    try:
        translated = translator.translate(text, dest=target_language)
        print("-------- google trans -------")
        print(translated.text)
        return translated.text
    except Exception as e:
        raise Exception(f"Error: {str(e)}")

