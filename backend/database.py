from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
db_url='mysql+mysqlconnector://root:DEVENDER%402012@localhost:3306/testdb'

engine=create_engine(db_url)
SessionLocal=sessionmaker(autocommit=False,autoflush=False, bind=engine)