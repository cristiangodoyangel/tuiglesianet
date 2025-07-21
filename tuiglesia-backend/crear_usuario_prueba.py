import requests

url = "http://localhost:8000/register"
data = {
    "nombre": "Admin de Prueba",
    "email": "admin@tuiglesia.net",
    "password": "admin1234"
}

resp = requests.post(url, json=data)
print(resp.status_code, resp.json())
