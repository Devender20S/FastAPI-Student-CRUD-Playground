from pydantic import BaseModel


class STUDENT(BaseModel):
    # student_id:int
    first_name:str
    last_name:str
    gender:str
    course:str
    marks:int    