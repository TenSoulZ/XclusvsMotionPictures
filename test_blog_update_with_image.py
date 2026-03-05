import requests

url = "https://xmp-backend.onrender.com/api/blog/why-video-marketing-matters/"
data = {
    "title": "Why Video Marketing Matters Updated",
    "content": "Updated content",
    "author_name": "Admin",
    "is_published": "true"
}

files = {
    'featured_image': ('test_image.jpg', b'fake image data', 'image/jpeg')
}

token_res = requests.post("https://xmp-backend.onrender.com/api/api-token-auth/", data={"username": "admin", "password": "admin123"})
if token_res.status_code == 200:
    token = token_res.json().get('token')
    headers = {"Authorization": f"Token {token}"}
    res = requests.patch(url, data=data, files=files, headers=headers)
    print("PATCH Status:", res.status_code)
    print("PATCH Response:", res.text)
else:
    print("Token failed:", token_res.status_code, token_res.text)
