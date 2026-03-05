import requests
import json
import base64
import os

url = "https://xmp-backend.onrender.com/api/blog/why-video-marketing-matters/"

# Get admin token
token_res = requests.post("https://xmp-backend.onrender.com/api/api-token-auth/", data={"username": "admin", "password": "admin123"})
if token_res.status_code == 200:
    token = token_res.json().get('token')
    headers = {"Authorization": f"Token {token}"}
    
    # 1. Test partial patch without image
    data1 = {"title": "Updated Title No Image", "content": "Test"}
    res1 = requests.patch(url, data=data1, headers=headers)
    print("PATCH NO IMAGE:", res1.status_code, res1.text)
    
    # 2. Test with invalid image
    files = {'featured_image': ('test.jpg', b'bad data', 'image/jpeg')}
    res2 = requests.patch(url, data=data1, files=files, headers=headers)
    print("PATCH BAD IMAGE:", res2.status_code, res2.text)
    
    # 3. Test with valid image but empty content (simulating file pointer at end)
    # We can't simulate this from client side because the client sends the full file.
    
else:
    print("Token failed")
