import requests

url = "https://xmp-backend.onrender.com/api/blog/why-video-marketing-matters/"
data = {
    "title": "Why Video Marketing Matters Updated",
    "content": "Updated content",
    "author_name": "Admin",
    "is_published": "true"
}

# We need a token, but let's see if we can get one or if we can just test validation.
# Wait, contact messages allow creation without auth, blog requires auth for PUT/PATCH.
# Let's get the token for admin/admin123
token_res = requests.post("https://xmp-backend.onrender.com/api/api-token-auth/", data={"username": "admin", "password": "admin123"})
if token_res.status_code == 200:
    token = token_res.json().get('token')
    headers = {"Authorization": f"Token {token}"}
    res = requests.patch(url, data=data, headers=headers)
    print("PATCH Status:", res.status_code)
    print("PATCH Response:", res.text)
else:
    print("Token failed:", token_res.status_code, token_res.text)
