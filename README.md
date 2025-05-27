# lab2-3whisperchain

## Instructions:
1. Register for an account
2. Download/save your private key for your account. You ALONE will have access to your messages and submitting this private key will be how we ensure that.
3. Login with your username and password, hashed and salted by mongodb
4. Access/Send Messages
    4a. ACCESS your messages: 
        - Click "Browse" and upload your private key
        - You will now be able to see the messages that an anonymous user has sent you during the current round (24 hrs)
    4b. SEND messages to your contacts:
        - Select the recepient amongst the list of possible rececients
        - Type your message and press send! That's it!



Users can send or recieve messages. They need their private key to load their inbox. 

Moderators will use their private key to decrypt the flagged message and can decide whether to ban or not. Their request will be sent to the admin.

Admins will see ban requests made by moderators and usernames, along with current roles and option to change the roles.

We have used JWTs to validate requests, implemented a Frontend that adapts to 
roles. 


## Set Up

Frontend (This is the UI)

``cd frontend``
``npm run dev``

Make sure to run in ```localhost:5173``` (which has been set by default)

Backend (Server)

```cd backend```
```npm start```

Make sure to run in ```localhost:9090``` (which has been set by default)


Normally, this isn't good practice but for easy grading, I have also added the ```.env.example``` file for the URI for MongoDB connection and JWT secret. Copy the contents of ```.env.example``` to generate your own ```.env```. This is really important as otherwise, the server won't work.

Keep good care of your private key, you will need it for decrypting messages.