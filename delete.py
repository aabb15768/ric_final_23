import pymongo
import json
from collections import namedtuple
from bson import ObjectId

# ----------------connect mongodb------------------
myclient = pymongo.MongoClient("mongodb+srv://aabb15768:lf2csgod10@cluster0-aasc5.gcp.mongodb.net/test?retryWrites=true&w=majority")


# ----------------create/connect database------------------
mydb = myclient["mydatabase"]

# ----------------create/connect collections------------------
mycol = mydb["customers"]

# ----------------check if database exist------------------
dblist = myclient.list_database_names()
if "mydatabase" in dblist:
  print("connect to database.")

# ----------------check if collecgtion exist------------------
collist = mydb.list_collection_names()
if "customers" in collist:
  print("connect to collection.")

# import time
# print(time.strftime("%Y%m%d%H%M"))

# ----------------insert------------------
# mydict = { "_id": 1, "name": "John", "address": "Highway 37" }
# x = mycol.insert_one(mydict)
# mydict = { "_id": 2, "name": "steven", "address": "Taipei" }
# x = mycol.insert_one(mydict)

# # ----------------delete------------------
# myquery = { "address": "Taipei" }
# mycol.delete_one(myquery)

# ----------------delete all------------------
for x in mycol.find():
  mycol.delete_one(x)

# ----------------find all data in collection and print------------------
# for x in mycol.find():
#   print(x)
