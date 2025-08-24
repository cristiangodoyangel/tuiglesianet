# test_connection.py
# Guarda este archivo en la raíz de tu proyecto Django

import os
import sys
import django
from pathlib import Path

# Agregar el directorio del proyecto al path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tuiglesianet.settings')
django.setup()

from django.db import connection
from django.core.management.color import color_style

def test_database_connection():
    style = color_style()
    
    try:
        # Probar la conexión
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            
        print(style.SUCCESS("✅ ¡Conexión exitosa a la base de datos MySQL!"))
        print(f"   Database: {connection.settings_dict['NAME']}")
        print(f"   Host: {connection.settings_dict['HOST']}:{connection.settings_dict['PORT']}")
        print(f"   User: {connection.settings_dict['USER']}")
        
        # Probar las tablas existentes
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        print(f"\n📋 Tablas encontradas ({len(tables)}):")
        for table in tables:
            print(f"   - {table[0]}")
            
        # Contar registros en cada tabla
        print(f"\n📊 Registros por tabla:")
        for table in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table[0]}")
            count = cursor.fetchone()[0]
            print(f"   - {table[0]}: {count} registros")
            
        return True
        
    except Exception as e:
        print(style.ERROR(f"❌ Error de conexión: {str(e)}"))
        print(style.WARNING("Verifica:"))
        print("   1. MySQL esté corriendo")
        print("   2. Los datos de conexión en settings.py")
        print("   3. La base de datos 'tuiglesia' exista")
        return False

if __name__ == "__main__":
    print("🔌 Probando conexión a MySQL...")
    test_database_connection()