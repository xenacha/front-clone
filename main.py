""" 백엔드 서버 """

from fastapi import FastAPI, UploadFile, Form
from fastapi.staticfiles import StaticFiles

from typing import Annotated  


""" DB 연결 """

import sqlite3

con = sqlite3.connect('db.db', check_same_thread = False)
cur = con.cursor()


app = FastAPI()

@app.post('/items') 
async def create_item(image:UploadFile, 
                title: Annotated[str, Form()], 
                price: Annotated[int,Form()], 
                description: Annotated[str, Form()], 
                place: Annotated[str, Form()]): 

    """ 이미지 정보 리드할 시간 """    
    image_bytes = await image.read()  

    
    """ 이미지 정보 데이터베이스에 입력 """
    
    cur.execute(f """
                INSERT INTO itmes (title, image, price, description, place)
                VALUES('{title}', '{image_bytes.hex()}',{price}, '{description}','{place}' ) 
                
                """) """ 파일 정보 입력 (price - int값)"""
    con.commit()
    return '200' 


app.mount("/", StaticFiles(directory="frontend", html=True), name= "frontend")


