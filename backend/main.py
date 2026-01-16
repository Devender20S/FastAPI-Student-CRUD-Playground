from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
from models import STUDENT
from database import SessionLocal, engine
import database_models
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database_models.Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def greet():
    return "WELCOME"


@app.post("/student")
def add_student(student: STUDENT, db: Session = Depends(get_db)):

    db_student = database_models.STUDENT(**student.model_dump())

    db.add(db_student)
    db.commit()
    db.refresh(db_student)

    return db_student


@app.get("/student")
def get_students(db: Session = Depends(get_db)):
    return db.query(database_models.STUDENT).all()


@app.get("/student/{student_id}")
def get_student_by_id(student_id: int, db: Session = Depends(get_db)):
    student = (
        db.query(database_models.STUDENT)
        .filter(database_models.STUDENT.student_id == student_id)
        .first()
    )

    if not student:
        raise HTTPException(status_code=404, detail="STUDENT not found")

    return student


@app.put("/student/{student_id}")
def update_student(student_id: int, student: STUDENT, db: Session = Depends(get_db)):
    db_student = (
        db.query(database_models.STUDENT)
        .filter(database_models.STUDENT.student_id == student_id)
        .first()
    )

    if not db_student:
        raise HTTPException(status_code=404, detail="STUDENT not found")

    db_student.first_name = student.first_name
    db_student.last_name = student.last_name
    db_student.gender = student.gender
    db_student.course = student.course
    db_student.marks = student.marks

    db.commit()
    db.refresh(db_student)
    return db_student


@app.delete("/student/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    db_student = (
        db.query(database_models.STUDENT)
        .filter(database_models.STUDENT.student_id == student_id)
        .first()
    )

    if not db_student:
        raise HTTPException(status_code=404, detail="STUDENT not found")

    db.delete(db_student)
    db.commit()
    return {"message": "STUDENT deleted successfully"}
