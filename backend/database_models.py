from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer,Float,String                                                                                    
Base=declarative_base()

class STUDENT(Base):
    __tablename__="STUDENT"
    student_id= Column(Integer,primary_key=True, index=True,autoincrement=True)
    first_name= Column(String(100))
    last_name= Column(String(255))
    gender= Column(String(50))
    course= Column(String(70))
    marks= Column (Float)
