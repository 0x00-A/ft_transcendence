import os


#############################
# AUTHENTICATION PARAMETERS #
#############################
"""
    the following parameter is used for the email verification link sent to the user (frontend)
"""
CLIENT_EMAIL_VERIFICATION_URL = os.getenv("CLIENT_EMAIL_VERIFICATION_URL", "http://localhost:3000/auth/verify-email")
CLIENT_RESET_PASSWORD_URL = os.getenv("CLIENT_RESET_PASSWORD_URL", "http://localhost:3000/auth/reset-password")

###############
# DISCORD ENV #
###############
DISCORD_AUTHORIZATION_URL = os.getenv('DISCORD_AUTHORIZATION_URL')
DISCORD_TOKEN_URL = os.getenv('DISCORD_TOKEN_URL')
DISCORD_CLIENT_ID = os.getenv('DISCORD_CLIENT_ID')
DISCORD_CLIENT_SECRET = os.getenv('DISCORD_CLIENT_SECRET')
DISCORD_USER_URL = os.getenv('DISCORD_USER_URL')
###############
#  INTRA ENV  #
###############
INTRA_CLIENT_ID = os.getenv('INTRA_CLIENT_ID')
INTRA_CLIENT_SECRET = os.getenv('INTRA_CLIENT_SECRET')
INTRA_AUTHORIZATION_URL = os.getenv('INTRA_AUTHORIZATION_URL')
INTRA_TOKEN_URL = os.getenv('INTRA_TOKEN_URL')
INTRA_USER_URL = os.getenv('INTRA_USER_URL')
################
#  GOOGLE ENV  #
################
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
GOOGLE_AUTHORIZATION_URL = os.getenv('GOOGLE_AUTHORIZATION_URL')
GOOGLE_TOKEN_URL = os.getenv('GOOGLE_TOKEN_URL')
GOOGLE_USER_URL = os.getenv('GOOGLE_USER_URL')

################
CLIENT_URL = os.getenv('CLIENT_URL')
API_CLIENT_OAUTH2_REDIRECT_URL = os.getenv('API_CLIENT_OAUTH2_REDIRECT_URL')
OAUTH2_REDIRECT_URI = os.getenv('OAUTH2_REDIRECT_URI')
