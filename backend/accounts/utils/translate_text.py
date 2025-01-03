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
