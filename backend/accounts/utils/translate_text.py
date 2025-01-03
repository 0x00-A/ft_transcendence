from googletrans import Translator


def translate_text(text, target_language):
    translator = Translator()

    try:
        if not text:
            raise ValueError("Invalid input: Text is empty.")
        
        translated = translator.translate(text, dest=target_language)
        if  translated is None or  translated.text is None:
            raise ValueError("Translation result is empty or None.")
        # print(f"Raw response: {translated}")
        return translated.text
    except Exception as e:
        # print(f"Error during translation: {str(e)}")
        # print(f"Failed text: {text}")
        # print(f"Target language: {target_language}")
        return text


