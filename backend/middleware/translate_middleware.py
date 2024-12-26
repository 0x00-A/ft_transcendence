import json
from django.utils.deprecation import MiddlewareMixin
from accounts.utils import translate_text

class TranslateResponseMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        content_type = response.headers.get('Content-Type', '').lower()

        # print("--------- Middleware ------------")
        # print(response.data)
        # print("---------------------")
        if content_type == 'application/json':
            try:
                data = json.loads(response.content)
                print("--------- d a t a--------")
                # print(data)
                if 'message' in data:
                    if request.user.is_authenticated:
                        target_language = request.user.profile.preferred_language or 'en'
                    else:
                        target_language = 'en'
                    target_language = request.user.profile.preferred_language or 'en'
                    print("/*/*/*/*/*/*/*/*/*/*")
                    print(data)
                    print("lang: " + target_language)
                    print("/*/*/*/*/*/*/*/*/*/*")
                    data['message'] = translate_text(data['message'], target_language)
                elif 'error' in data:
                    target_language = request.user.profile.preferred_language or 'en'
                    data['message'] = translate_text(data['message'], target_language)
                response.content = json.dumps(data)
            except Exception as e:
                print(f"Translation Middleware Error: {e}")

        return response


