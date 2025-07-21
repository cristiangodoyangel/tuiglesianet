from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user_schema import UserCreate
from app.models import user as user_model
from app.database import SessionLocal
from passlib.hash import bcrypt

router = APIRouter()

@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    email = data.get("email")
    password = data.get("password")
    user = db.query(user_model.Usuario).filter_by(email=email).first()
    if not user or not bcrypt.verify(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    return {"msg": "Login exitoso", "user": {"email": user.email, "nombre": user.nombre}}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(user_model.Usuario).filter_by(email=user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Usuario ya existe")
    hashed = bcrypt.hash(user.password)
    nuevo = user_model.Usuario(email=user.email, password_hash=hashed, nombre=user.nombre)
    db.add(nuevo)
    db.commit()
    return {"msg": "Usuario registrado"}
