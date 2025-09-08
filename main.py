
""" 백엔드 서버 """
from fastapi import FastAPI, UploadFile, Form,Response  # ✅ 파일 업로드, 폼 데이터 처리를 위한 모듈

from fastapi.responses import JSONResponse    # ✅ JsON 응답을 위한 모듈
from fastapi.encoders import jsonable_encoder  # ✅ JSON 인코딩을 위한 모듈

from fastapi.staticfiles import StaticFiles
from typing_extensions import Annotated

from fastapi.responses import FileResponse  # ✅ 추가
from pathlib import Path        # ✅ 추가


app = FastAPI()


""" DB 연결 """

import sqlite3

con = sqlite3.connect('db.db', check_same_thread = False)
cur = con.cursor()  # 커서 : 데이터베이스 작업을 위한 객체 


# IF NOT EXISTS -> 테이블이 없을 경우에만 생성
cur.execute(f"""
            CREATE TABLE IF NOT EXISTS items (   
                id integer primary key, 
                title text not null,
                image blob, 
                price integer not null, 
                description text, 
                place text not null, 
                insertAt integer not null
            );
            """)



@app.post('/items') 
async def create_item(image:UploadFile, 
                title: Annotated[str, Form()], 
                price: Annotated[int,Form()], 
                description: Annotated[str, Form()], 
                place: Annotated[str, Form()], 
                insertAt:Annotated[int, Form()] 
                ): 

  
    """ 이미지 정보 리드할 시간 """    
    image_bytes = await image.read()  

    
    """ 이미지 정보 데이터베이스에 입력 """
    
    cur.execute (f"""
                INSERT INTO items (title, image, price, description, place, insertAt)
                VALUES(
                '{title}', '{image_bytes.hex()}',{price}, '{description}','{place}', '{insertAt}')
                """)    #파일 정보 입력 (price - int값), hex() - 16진수로 변환
    
    con.commit()
   
    return  '200' 


BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR / "frontend" 



@app.get("/")
def serve_clone_code():
    return FileResponse(FRONTEND_DIR / "cloneCode.html")


# 서브 요청 경로 
# -> 모든 경로 처리 
# 상단에 특정 경로를 지정하지 않으면 모든 경로에 대해 해당 디렉토리의 파일을 제공


#데이터베이스에서 모든 아이템을 가져오기 
@app.get("/items")
async def get_items():
    con.row_factory = sqlite3.Row  # ✅ Row 객체를 사용하여 컬럼명을 가져옴 rows = [['id':1, 'title':'...'], ...]
    cur = con.cursor()  # 커서 : 데이터 추출 메소드  
    rows = cur.execute(f"""
                       SELECT * FROM items
                       """).fetchall() # select * from > 컬럼 구분이 없는 모든 데이터 가져옴 > row_factory로 컬럼 구분

    # array 형태로 가져온 각각의 데이터를 객체로 변환 -> JSONResponse를 사용하여 JSON 형태로 응답
    # python 의 dictionary 문법 -> JSON 형태로 변환
    # rows = [['id':1, 'title':'...'], ...]
    
    return JSONResponse(jsonable_encoder(dict(row) for row in rows))  #jasonable_encoder로 데이터를 감쌈
    
    
#이미지 요청 시 응답 
@app.get('/images/{item_id}')
async def get_image(item_id: int):    #컬럼 정보 필요없음 -> id로 이미지 정보만 가져옴
    cur = con.cursor()
    image_bytes = cur.execute(f"""
                       SELECT image FROM items WHERE id={item_id}
                       """).fetchone()[0] # fetchone(): 하나의 행만 가져옴, [0] 0번째 인덱스 

    return Response(content=bytes.fromhex(image_bytes), media_type='image/*') #이미지 데이터 반환, fromhex() - 16진수 문자열을 바이트로 변환


@app.post('/signup')     #form 데이터 받기
def signup(id:Annotated[str, Form()], 
           password:Annotated[str, Form()], 
           name:Annotated[str, Form()], 
           email:Annotated[str, Form()]):
    
    #DB 저장
    cur.execute(f"""                
                INSERT INTO users (id, name, email, password)
                VALUES(
                '{id}', '{name}', '{email}', '{password}'); 
                """)
    
    con.commit()
    return {"result":"200"}


 # app.mount("/", StaticFiles(directory="frontend", html=True), name= "frontend") 

app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")



