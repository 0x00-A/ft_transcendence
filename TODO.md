# TODO List

- [ ] Refactor tournament logic
- [ ] Implement leaderboard
- [ ] Optimize database queries
- [ ] Tournament Form styling
- [ ] Tournament end page

## 🚧 In Progress

- [ ] GAME invite to self

## ✅ Completed

- [x] Set up project environment

## MAHDI

- [X] continue implementing of oauth2_authentication view
- [X] setting user name if already exist in oauth2
- [ ] delete cookies if there are in cookie
- [ ] find out why when set permission to AllowAny in a view still check the authenticate
- [ ] 2 factor authentication
- [ ] if the user activate the 2fac in discord or google or intra
- [ ] default avatar picture handling in backend
- [ ] is_password_set true or false
MAHDI:
 - [ ] find out why when set permission to AllowAny in a view still check the authenticate
 - [X] if the user activate the 2fac in discord or google or intra
 - [ ] default avatar picture handling in backend
 - [ ] set a time for email validation and password reset requests?
 - [ ] Tournament game shistory
 - [X] if a user is verified return that user is already verified
 - [ ] Oauth2AuthBackend wach khdemti biha
 - [X] if username of the intra or google or discord not valid access to setusername
 - [X] username max length and min (in serializer)
 - [ ] editprofile in security 2fa edit the text
 - [ ] send notification if the player unlock new level or if unlock new bage
 - [ ] do the tournament games and solo games
 - [ ] email verification in edit profile
 - [ ] You don't play any games yet
 - [ ] friends dashboard and offline
 - [ ] delete signals log

 - [ ] 500 internal server error

 - [ ] email LOGO
 - [X] exclude inactive users
 - [ ] reset password
 - [ ] large avatar
 - [ ] bad request when trying change password
 <!-- - [ ] change avatar and get back to change it -->

MAHDI NOTES:
   - if a user sign up with an email and not verify his email, and next he is sign up using google (oauth2) with same email
      i mark the account as verified because google has already verified the email, and user can login with oauth2 or with his username and password
   - if a user sign up with an email and verify his account, and next login with oauth2
      users can log in using either their password or oauth2 provider

CHAT:
 - [ ] if i user forgot the password
 - [ ]

- [ ] date in block list you must trans
