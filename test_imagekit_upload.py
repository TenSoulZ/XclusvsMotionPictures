import requests

url = "https://upload.imagekit.io/api/v1/files/upload"
private_key = "test_key"
files = {'file': ('test.jpg', b'fake image data')}
data = {'fileName': 'test.jpg'}

res = requests.post(url, auth=(private_key, ''), files=files, data=data)
print(res.status_code, res.text)
